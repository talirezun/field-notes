/**
 * Corpus assembly.
 *
 * These functions read the chapter files straight off disk rather than through
 * astro:content, because scripts/prebuild.ts runs before Astro exists. The
 * markdown routes import the same functions, so what an agent downloads and
 * what it fetches from /<slug>.md are byte-identical by construction.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { SITE_URL, AUTHOR, LICENSES, SITE } from './site';

export const CHAPTERS_DIR = join(process.cwd(), 'content', 'chapters');

export type ChapterFile = {
  /** File name, e.g. "01-context-engineering.md". */
  file: string;
  slug: string;
  number: number;
  title: string;
  question: string;
  summary: string;
  updated: string;
  draft: boolean;
  sourceCount: number;
  placeholderSources: number;
  /** The complete file, frontmatter included. */
  raw: string;
  /** Markdown body only. */
  body: string;
};

function asIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

/** Every chapter on disk, in chapter-number order. Drafts excluded. */
export function loadChapterFiles(): ChapterFile[] {
  const files = readdirSync(CHAPTERS_DIR).filter((name) => name.endsWith('.md'));

  const chapters = files.map((file) => {
    const raw = readFileSync(join(CHAPTERS_DIR, file), 'utf8');
    const parsed = matter(raw);
    const data = parsed.data as Record<string, any>;
    const sources: Array<Record<string, unknown>> = data.sources ?? [];

    return {
      file,
      slug: String(data.slug),
      number: Number(data.number),
      title: String(data.title),
      question: String(data.question),
      summary: String(data.summary ?? '').trim().replace(/\s+/g, ' '),
      updated: asIsoDate(data.updated),
      draft: Boolean(data.draft),
      sourceCount: sources.length,
      placeholderSources: sources.filter((s) => s.placeholder === true).length,
      raw: raw.trimEnd() + '\n',
      body: parsed.content.trim() + '\n',
    } satisfies ChapterFile;
  });

  return chapters.filter((chapter) => !chapter.draft).sort((a, b) => a.number - b.number);
}

/**
 * The provenance header carried by every bundle. Anyone who ingests a file
 * from here can see where it came from and under what licence, without having
 * to remember.
 */
export function provenanceHeader(builtOn: string, corpusLine: string): string {
  return [
    '<!--',
    `${SITE.name}, ${AUTHOR.name} (From Lab to Life)`,
    `Source: ${SITE_URL}`,
    `License: ${LICENSES.content.name}`,
    `Built: ${builtOn}`,
    `Corpus: ${corpusLine}`,
    '-->',
  ].join('\n');
}

/** One chapter as a standalone markdown file, frontmatter intact. */
export function renderChapterMarkdown(chapter: ChapterFile, builtOn: string): string {
  return [
    provenanceHeader(
      builtOn,
      `chapter ${chapter.number}, "${chapter.title}", from ${SITE_URL}/${chapter.slug}`,
    ),
    '',
    chapter.raw,
  ].join('\n');
}

/** The whole corpus in one file, chapters in order, rule-separated. */
export function renderCompleteCorpus(chapters: ChapterFile[], builtOn: string): string {
  const parts = [
    provenanceHeader(
      builtOn,
      `${chapters.length} chapters, distilled from published articles and build logs`,
    ),
    '',
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}`,
    '',
    SITE.description,
    '',
    `Author: ${AUTHOR.name}, ${AUTHOR.jobTitle}, ${AUTHOR.affiliation}.`,
    `Canonical: ${SITE_URL}`,
    `Licence: ${LICENSES.content.name}`,
    '',
    '## Contents',
    '',
    ...chapters.map(
      (chapter) =>
        `${chapter.number}. [${chapter.title}](${SITE_URL}/${chapter.slug}): ${chapter.question}`,
    ),
    '',
  ];

  for (const chapter of chapters) {
    parts.push('---', '', chapter.raw.trimEnd(), '');
  }

  return parts.join('\n');
}

/**
 * /llms.txt, the emerging convention for handing a model a structured map of
 * a site instead of making it crawl and guess.
 */
export function renderLlmsTxt(chapters: ChapterFile[]): string {
  const lines = [
    `# ${SITE.name}, ${AUTHOR.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${AUTHOR.name}: ${AUTHOR.jobTitle}, ${AUTHOR.affiliation}.`,
    '',
    'This site is the edited, topical surface of a personal knowledge graph built',
    'with The Curator. It is not a blog: the narrative essays live on Substack and',
    'Medium, and nothing here republishes them. Each chapter answers one question,',
    'opens with the answer, and cites the published work it was distilled from.',
    `Everything here is ${LICENSES.content.name}: reuse it with attribution.`,
    '',
    '## Chapters',
    '',
  ];

  for (const chapter of chapters) {
    lines.push(`- [${chapter.title}](${SITE_URL}/${chapter.slug}): ${chapter.question}`);
    lines.push(`  Markdown: ${SITE_URL}/${chapter.slug}.md`);
  }

  lines.push(
    '',
    '## Full corpus',
    '',
    `- [Complete corpus as markdown](${SITE_URL}/downloads/field-notes-complete.md): every chapter in one file.`,
    `- [Chapters as a zip](${SITE_URL}/downloads/field-notes-chapters.zip): one markdown file per chapter, for per-document ingestion.`,
    `- [Download manifest](${SITE_URL}/downloads/manifest.json): file sizes and build date.`,
    '',
    '## Pages',
    '',
    `- [The Curator](${SITE_URL}/the-curator): the open-source second brain this corpus was built with, and how to ingest the corpus into your own copy.`,
    `- [About](${SITE_URL}/about): who wrote this and why it exists.`,
    `- [Work with me](${SITE_URL}/work-with-me): teaching, advisory and what I have shipped.`,
    '',
    '## Optional',
    '',
    `- [Source repository](https://github.com/talirezun/field-notes): the markdown behind this site.`,
    `- [talirezun.com](${AUTHOR.homepage}): the author's main site.`,
    '',
  );

  return lines.join('\n');
}
