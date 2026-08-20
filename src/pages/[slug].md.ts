import type { APIRoute, GetStaticPaths } from 'astro';
import { loadChapterFiles, renderChapterMarkdown } from '../lib/corpus';

/**
 * Raw markdown for every chapter at /<slug>.md, linked from the HTML page with
 * rel="alternate". A model or an agent fetching this gets clean source with no
 * markup noise, and it is the same bytes as the file inside the zip.
 */
export const getStaticPaths: GetStaticPaths = () => {
  const builtOn = new Date().toISOString().slice(0, 10);
  return loadChapterFiles().map((chapter) => ({
    params: { slug: chapter.slug },
    props: { markdown: renderChapterMarkdown(chapter, builtOn) },
  }));
};

export const GET: APIRoute = ({ props }) =>
  new Response((props as { markdown: string }).markdown, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
