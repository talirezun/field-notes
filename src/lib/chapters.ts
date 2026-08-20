import { getCollection, type CollectionEntry } from 'astro:content';
import type { Source } from '../../content/config';

export type Chapter = CollectionEntry<'chapters'>;

export type ChapterSection = {
  /** Stable anchor. Permanent contract, never renamed. */
  id: string;
  title: string;
  /** Rendered HTML for this section, heading included. */
  html: string;
  /** Sources that specifically back this section. */
  sources: Source[];
};

export type ChapterBody = {
  /** Anything rendered before the first `##`. Usually empty by convention. */
  intro: string;
  sections: ChapterSection[];
  /** Sources that inform the whole chapter rather than one section. */
  generalSources: Source[];
};

const H2 = /<h2\b[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;

export function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** The self-contained answer that opens a section (§6.1). Used for FAQPage. */
export function leadAnswer(section: ChapterSection): string | null {
  const match = section.html.match(/<p>([\s\S]*?)<\/p>/);
  return match ? stripTags(match[1]!) : null;
}

/** All published chapters, in chapter-number order. */
export async function getChapters(): Promise<Chapter[]> {
  const chapters = await getCollection('chapters', ({ data }) => !data.draft);
  chapters.sort((a, b) => a.data.number - b.data.number);

  const seen = new Map<string, string>();
  for (const chapter of chapters) {
    const clash = seen.get(chapter.data.slug);
    if (clash) {
      throw new Error(
        `Duplicate chapter slug "${chapter.data.slug}" in ${chapter.id} and ${clash}.`,
      );
    }
    seen.set(chapter.data.slug, chapter.id);
  }

  return chapters;
}

export async function getChapterBySlug(slug: string): Promise<Chapter | undefined> {
  return (await getChapters()).find((chapter) => chapter.data.slug === slug);
}

/**
 * Split a chapter's rendered HTML into sections and bind each source to the
 * sections it backs. This is what makes the provenance rail possible without
 * measuring anything in the browser: a section and its sources are siblings in
 * the same grid row, so they line up by construction.
 *
 * Throws if a source cites a section anchor that does not exist. A silent
 * mis-binding here would quietly break the one claim the site makes about
 * itself, so it fails the build instead.
 */
export function splitChapter(chapter: Chapter): ChapterBody {
  const html = chapter.rendered?.html;
  if (typeof html !== 'string') {
    throw new Error(`Chapter ${chapter.id} has no rendered HTML.`);
  }

  const matches = [...html.matchAll(H2)];
  const intro = html.slice(0, matches[0]?.index ?? html.length).trim();

  const sections: ChapterSection[] = matches.map((match, index) => {
    const start = match.index!;
    const end = matches[index + 1]?.index ?? html.length;
    return {
      id: match[1]!,
      title: stripTags(match[2]!),
      html: html.slice(start, end).trim(),
      sources: [],
    };
  });

  const byId = new Map(sections.map((section) => [section.id, section]));
  const generalSources: Source[] = [];

  for (const source of chapter.data.sources) {
    if (!source.sections?.length) {
      generalSources.push(source);
      continue;
    }
    for (const anchor of source.sections) {
      const section = byId.get(anchor);
      if (!section) {
        throw new Error(
          `${chapter.id}: source "${source.title}" cites section "#${anchor}", ` +
            `which does not exist. Known sections: ${[...byId.keys()].join(', ') || 'none'}.`,
        );
      }
      section.sources.push(source);
    }
  }

  return { intro, sections, generalSources };
}

/** Chapters listed in `related`, resolved and ordered. Unknown slugs throw. */
export async function getRelated(chapter: Chapter): Promise<Chapter[]> {
  const all = await getChapters();
  return chapter.data.related.map((slug) => {
    const found = all.find((candidate) => candidate.data.slug === slug);
    if (!found) {
      throw new Error(`${chapter.id}: related chapter "${slug}" does not exist.`);
    }
    return found;
  });
}
