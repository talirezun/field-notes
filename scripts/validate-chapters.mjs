#!/usr/bin/env node
/**
 * Chapter validator. Dependency-free, runs in about a second.
 *
 * `npm run build` is the real gate, but it needs a working install and it fails
 * on the first error it hits. This checks every chapter, reports everything at
 * once, and runs anywhere. Use it while editing. Use the build before you push.
 *
 * It enforces every rule in content/config.ts, plus two the build cannot:
 *
 *   1. The anchor contract across time. content/anchors.lock.json records every
 *      anchor that has ever been published. If one disappears without an alias
 *      taking its place, this fails. The build only checks that a file is
 *      internally consistent, so it cannot catch a rename.
 *   2. The house style rules from CLAUDE.md: no em dashes, no "signal" as a
 *      label, four to seven sections per chapter.
 *
 * Usage:
 *   node scripts/validate-chapters.mjs
 *   node scripts/validate-chapters.mjs --update-lock   after adding anchors
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHAPTERS = join(ROOT, 'content', 'chapters');
const LOCK = join(ROOT, 'content', 'anchors.lock.json');
const UPDATE_LOCK = process.argv.includes('--update-lock');

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`${file}: ${msg}`);

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;
const unquote = (s) => {
  const t = s.trim();
  if (t.length > 1 && ((t[0] === '"' && t.at(-1) === '"') || (t[0] === "'" && t.at(-1) === "'"))) {
    return t.slice(1, -1);
  }
  return t;
};
const inlineArray = (s) => {
  const t = s.trim();
  if (!t.startsWith('[')) return null;
  const inner = t.slice(1, t.lastIndexOf(']'));
  if (!inner.trim()) return [];
  return inner.split(',').map(unquote).filter(Boolean);
};

/**
 * Minimal frontmatter parser. Handles exactly the shapes this repo uses:
 * scalars, folded scalars, inline arrays, and lists of objects. It is not a
 * general YAML parser and should not become one. If a chapter needs a shape
 * this cannot read, the shape is probably wrong.
 */
function parseFrontmatter(raw, file) {
  if (!raw.startsWith('---\n')) {
    err(file, 'no frontmatter block');
    return [null, ''];
  }
  const end = raw.indexOf('\n---', 4);
  if (end === -1) {
    err(file, 'frontmatter block is not closed');
    return [null, ''];
  }
  const lines = raw.slice(4, end).split('\n');
  const body = raw.slice(end + 4);
  const fm = {};
  let key = null;
  let mode = null;
  let buffer = [];

  const flush = () => {
    if (mode === 'folded' && key) fm[key] = buffer.join(' ').trim();
    buffer = [];
  };

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    if (mode === 'folded') {
      if (/^\s{2,}\S/.test(line)) { buffer.push(line.trim()); continue; }
      flush(); mode = null; key = null;
    }

    if (mode === 'objects' && /^\s{2,}/.test(line)) {
      const t = line.trim();
      if (t.startsWith('- ')) {
        const obj = {};
        fm[key].push(obj);
        const [k, ...rest] = t.slice(2).split(':');
        const v = rest.join(':');
        const arr = inlineArray(v);
        obj[k.trim()] = arr ?? unquote(v);
      } else {
        const obj = fm[key].at(-1);
        if (!obj) { err(file, `stray line in ${key}: ${t}`); continue; }
        const [k, ...rest] = t.split(':');
        const v = rest.join(':');
        const arr = inlineArray(v);
        obj[k.trim()] = arr ?? unquote(v);
      }
      continue;
    }
    if (mode === 'objects') { mode = null; key = null; }

    const m = line.match(/^([A-Za-z][A-Za-z0-9_]*):(.*)$/);
    if (!m) continue;
    const [, k, rawValue] = m;
    const value = rawValue.trim();

    if (value === '>' || value === '|') { key = k; mode = 'folded'; buffer = []; continue; }
    if (value === '') { key = k; mode = 'objects'; fm[k] = []; continue; }

    const arr = inlineArray(value);
    fm[k] = arr ?? unquote(value);
  }
  flush();
  return [fm, body];
}

const files = readdirSync(CHAPTERS).filter((f) => f.endsWith('.md')).sort();
if (!files.length) {
  console.error('No chapters found in content/chapters/');
  process.exit(1);
}

const parsed = [];
const slugs = new Set();

for (const file of files) {
  const raw = readFileSync(join(CHAPTERS, file), 'utf8');
  const [fm, body] = parseFrontmatter(raw, file);
  if (!fm) continue;

  // Anchors, read from the pinned {#id} on every h2. The build reads ids out of
  // rendered HTML; this reads the pin. They agree because every heading pins.
  const anchors = [];
  for (const line of body.split('\n')) {
    const h = line.match(/^##\s+(.+?)\s*(?:\{#([a-z0-9-]+)\})?\s*$/);
    if (!h) continue;
    if (!h[2]) { err(file, `heading has no pinned anchor: "${h[1].slice(0, 60)}"`); continue; }
    if (anchors.includes(h[2])) err(file, `duplicate anchor: #${h[2]}`);
    anchors.push(h[2]);
  }

  parsed.push({ file, fm, body, anchors });
  if (fm.slug) slugs.add(fm.slug);
}

for (const { file, fm, body, anchors } of parsed) {
  // Schema, mirroring content/config.ts.
  if (!fm.title || fm.title.length < 3) err(file, 'title missing or under 3 characters');
  if (!/^\d+$/.test(String(fm.number)) || Number(fm.number) < 1) err(file, 'number must be a positive integer');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fm.slug ?? '')) err(file, 'slug must be lowercase kebab-case');
  if (!['published', 'scaffold'].includes(fm.status ?? 'published')) err(file, 'status must be published or scaffold');

  if (!fm.question) err(file, 'question missing');
  else {
    if (!fm.question.trim().endsWith('?')) err(file, 'question must end with a question mark');
    if (words(fm.question) < 4) err(file, 'question must read as a real question, not a label');
  }

  if (!fm.summary) err(file, 'summary missing');
  else {
    const n = words(fm.summary);
    if (n < 25 || n > 50) err(file, `summary must be 25 to 50 words, found ${n}`);
  }

  if (!fm.updated || Number.isNaN(Date.parse(fm.updated))) err(file, 'updated missing or not a date');
  if (!Array.isArray(fm.tags) || !fm.tags.length) err(file, 'at least one tag required');

  for (const rel of fm.related ?? []) {
    if (!slugs.has(rel)) err(file, `related slug does not exist: ${rel}`);
    if (rel === fm.slug) err(file, 'chapter lists itself as related');
  }

  const sources = Array.isArray(fm.sources) ? fm.sources : [];
  if (!sources.length) err(file, 'every chapter must cite at least one published source');
  for (const s of sources) {
    if (!s.title || s.title.length < 3) err(file, 'source title missing or under 3 characters');
    if (!/^https?:\/\/\S+$/.test(s.url ?? '')) err(file, `source url invalid: ${s.title ?? '(untitled)'}`);
    if (String(s.placeholder) === 'true') warn(file, `PLACEHOLDER source: ${s.title}`);
    for (const sec of s.sections ?? []) {
      if (!anchors.includes(sec)) err(file, `source "${s.title}" cites #${sec}, which is not a section here`);
    }
  }

  for (const a of fm.anchorAliases ?? []) {
    if (!a.to || !anchors.includes(a.to)) err(file, `anchorAlias points at #${a.to}, which does not exist`);
    if (anchors.includes(a.from)) err(file, `anchorAlias "${a.from}" collides with a live anchor`);
  }

  // House style, from CLAUDE.md. Body only: a source title may legitimately
  // carry an em dash if the publisher used one.
  if (body.includes('—')) err(file, 'contains an em dash in the body');
  if (/^#{2,3}\s.*\bsignals?\b/im.test(body)) warn(file, '"signal" used in a heading. It belongs to a different site');

  if (fm.status !== 'scaffold') {
    if (anchors.length < 4) err(file, `only ${anchors.length} sections. Four is the floor`);
    if (anchors.length > 7) err(file, `${anchors.length} sections. Seven is the ceiling: split the chapter`);
  }
}

// The anchor contract. Every anchor ever published stays reachable, either as
// itself or via an alias. This is the rule the build cannot enforce on its own.
const live = {};
for (const { fm, anchors } of parsed) {
  if (!fm.slug) continue;
  live[fm.slug] = {
    anchors,
    aliases: (fm.anchorAliases ?? []).map((a) => a.from).filter(Boolean),
  };
}

if (UPDATE_LOCK) {
  const lock = {};
  for (const [slug, { anchors, aliases }] of Object.entries(live)) {
    lock[slug] = [...new Set([...anchors, ...aliases])].sort();
  }
  writeFileSync(LOCK, JSON.stringify(lock, null, 2) + '\n');
  console.log(`Lock updated: ${Object.keys(lock).length} chapters, ${Object.values(lock).flat().length} anchors.`);
} else if (existsSync(LOCK)) {
  const lock = JSON.parse(readFileSync(LOCK, 'utf8'));
  for (const [slug, locked] of Object.entries(lock)) {
    const current = live[slug];
    if (!current) {
      errors.push(`ANCHOR CONTRACT: chapter /${slug} was published and is now gone. Add a redirect, do not delete.`);
      continue;
    }
    const reachable = new Set([...current.anchors, ...current.aliases]);
    for (const anchor of locked) {
      if (!reachable.has(anchor)) {
        errors.push(
          `ANCHOR CONTRACT: /${slug}#${anchor} was published and no longer resolves. ` +
            `Restore it, or add anchorAliases: [{ from: "${anchor}", to: "<current>" }].`,
        );
      }
    }
  }
} else {
  warnings.push('no content/anchors.lock.json. Run with --update-lock to create it.');
}

for (const { file, fm, anchors } of parsed) {
  const n = String(fm.number ?? '?').padStart(2, '0');
  console.log(
    `${n} ${(fm.slug ?? file).padEnd(36)} ${String(fm.status ?? 'published').padEnd(10)} ` +
      `sections=${anchors.length} sources=${(fm.sources ?? []).length}`,
  );
}

if (warnings.length) {
  console.log('\nWarnings');
  for (const w of warnings) console.log(`  ${w}`);
}
if (errors.length) {
  console.log('\nErrors');
  for (const e of errors) console.log(`  ${e}`);
  console.log(`\n${errors.length} error(s). Fix them, do not work around them.`);
  process.exit(1);
}
console.log('\nAll chapters valid.');
