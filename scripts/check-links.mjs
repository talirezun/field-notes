/**
 * Every source URL in every chapter has to resolve.
 *
 * The site's whole claim is that it is traceable, so a citation pointing at a
 * dead page is a real defect and not a cosmetic one. This runs in CI after the
 * build and fails it.
 *
 * Medium is the exception. It returns 403 to anything without a browser
 * fingerprint, so a 403 from medium.com says nothing about whether the article
 * is there. Those are reported and not failed on.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CHAPTERS = join(process.cwd(), 'content', 'chapters');
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0 Safari/537.36';
const TIMEOUT_MS = 20_000;

/** Hosts that block non-browser clients. A 403 from these is not a dead link. */
const BOT_BLOCKERS = ['medium.com'];

function collectUrls() {
  const urls = new Map(); // url -> Set of files citing it
  for (const file of readdirSync(CHAPTERS).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(join(CHAPTERS, file), 'utf8');
    for (const match of text.matchAll(/^\s*url:\s*"([^"]+)"/gm)) {
      const url = match[1];
      if (!urls.has(url)) urls.set(url, new Set());
      urls.get(url).add(file);
    }
  }
  return urls;
}

async function check(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
      signal: controller.signal,
    });
    return { status: response.status };
  } catch (error) {
    return { status: 0, error: String(error?.message ?? error) };
  } finally {
    clearTimeout(timer);
  }
}

const urls = collectUrls();
console.log(`Checking ${urls.size} source URLs from ${readdirSync(CHAPTERS).length} chapters.`);

const results = await Promise.all(
  [...urls.keys()].map(async (url) => ({ url, ...(await check(url)) })),
);

const tolerated = [];
const broken = [];

for (const result of results.sort((a, b) => a.url.localeCompare(b.url))) {
  const host = new URL(result.url).hostname.replace(/^www\./, '');
  const blocksBots = BOT_BLOCKERS.some((h) => host === h || host.endsWith(`.${h}`));

  if (result.status >= 200 && result.status < 400) continue;
  if (blocksBots && result.status === 403) {
    tolerated.push(result);
    continue;
  }
  broken.push(result);
}

for (const result of tolerated) {
  console.log(`  tolerated ${result.status}  ${result.url}  (host blocks non-browser clients)`);
}

if (broken.length === 0) {
  console.log(`All source URLs resolve. ${tolerated.length} tolerated.`);
  process.exit(0);
}

console.error(`\n${broken.length} source URL(s) did not resolve:\n`);
for (const result of broken) {
  const citedBy = [...urls.get(result.url)].join(', ');
  console.error(`  ${result.status || 'ERR'}  ${result.url}`);
  console.error(`        cited by ${citedBy}${result.error ? `  (${result.error})` : ''}`);
}
console.error('\nFix the citation or remove it. A dead source is a defect on this site.');
process.exit(1);
