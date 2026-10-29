// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import anchorIds from './src/lib/satteri-anchor-ids.mjs';
import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';

export const SITE = 'https://fieldnotes.talirezun.com';

// Each chapter's editorial `updated` date, so the sitemap tells search engines
// which chapters actually changed. The date is bumped by hand on a real edit,
// which is the only kind of lastmod Google says it trusts.
const chapterUpdated = new Map(
  readdirSync('content/chapters')
    .filter((file) => file.endsWith('.md'))
    .map((file) => matter(readFileSync(`content/chapters/${file}`, 'utf8')).data)
    .filter((data) => !data.draft)
    .map((data) => [`${SITE}/${data.slug}`, new Date(data.updated).toISOString()]),
);

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      // Derived artefacts are for agents, not for search indexes. The /read
      // source views repeat a chapter's text and point their canonical at it.
      filter: (page) => !page.includes('/downloads/') && !page.includes('/read/'),
      serialize: (item) => {
        const lastmod = chapterUpdated.get(item.url.replace(/\/$/, ''));
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  markdown: {
    // Heading ids come from github-slugger unless a heading pins its own with
    // {#anchor}. Anchors are a permanent contract, see CLAUDE.md.
    processor: satteri({ hastPlugins: [anchorIds] }),
    shikiConfig: {
      theme: 'vitesse-dark',
      wrap: true,
    },
  },
  devToolbar: { enabled: false },
});
