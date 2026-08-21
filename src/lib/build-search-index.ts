/**
 * The client-side search index for /search.
 *
 * The corpus is roughly 25,000 words across nine chapters and about 56
 * sections, small enough that a search library would be overkill. This
 * module builds one static JSON file at build time; the browser does the
 * matching, in src/pages/search.astro's inline script, with no server and no
 * dependency.
 *
 * Indexed at section granularity, because that is the unit a result links to
 * (/<slug>#<anchor>) and the unit the provenance rail already treats as the
 * atom of the corpus. Body text is kept in full rather than trimmed: the
 * corpus is small enough that the whole thing costs well under 200 KB, and a
 * trimmed section would break the "snippet centred on the match" requirement
 * for a match that lands past whatever cutoff was chosen.
 */
import { loadChapterFiles, type ChapterFile } from './corpus';

export type SearchSection = {
  /** Permanent anchor. Never regenerate this client-side. */
  id: string;
  title: string;
  /** Plain text, markdown syntax stripped. */
  text: string;
};

export type SearchChapter = {
  slug: string;
  title: string;
  question: string;
  number: number;
  tags: string[];
  sections: SearchSection[];
};

export type SearchIndex = {
  builtOn: string;
  chapters: SearchChapter[];
};

/**
 * A pinned heading, e.g.
 *   ## How do you structure the first phase of a build? {#three-phase-build}
 * Mirrors the PINNED pattern in src/lib/satteri-anchor-ids.mjs, because that
 * is the same contract: every "##" in a published chapter carries one of
 * these, and the anchor is what a result must link to.
 */
const HEADING = /^##[ \t]+(.+?)[ \t]*\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}[ \t]*$/gm;

/**
 * Reduces a section's markdown to plain text for indexing and snippeting.
 * Keeps the words, drops the syntax: fenced and inline code keep their
 * content, links and emphasis keep their text, list/quote/heading markers are
 * dropped, whitespace collapses to single spaces.
 */
export function markdownToText(markdown: string): string {
  return markdown
    .replace(/```[^\n]*\n([\s\S]*?)```/g, (_m, inner: string) => inner)
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/^>[ \t]?/gm, '')
    .replace(/^[ \t]*[-*+][ \t]+/gm, '')
    .replace(/^[ \t]*\d+\.[ \t]+/gm, '')
    .replace(/^#{1,6}[ \t]+/gm, '')
    .replace(/^-{3,}[ \t]*$/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Splits a chapter body at each pinned "##" heading. */
export function splitIntoSections(body: string): SearchSection[] {
  const matches = [...body.matchAll(HEADING)];
  return matches.map((match, index) => {
    const start = match.index! + match[0].length;
    const end = matches[index + 1]?.index ?? body.length;
    return {
      id: match[2]!,
      title: match[1]!.trim(),
      text: markdownToText(body.slice(start, end)),
    };
  });
}

function toSearchChapter(chapter: ChapterFile): SearchChapter {
  return {
    slug: chapter.slug,
    title: chapter.title,
    question: chapter.question,
    number: chapter.number,
    tags: chapter.tags,
    sections: splitIntoSections(chapter.body),
  };
}

export function buildSearchIndexData(builtOn: string, chapters?: ChapterFile[]): SearchIndex {
  const source = chapters ?? loadChapterFiles();
  return {
    builtOn,
    chapters: source.map(toSearchChapter),
  };
}
