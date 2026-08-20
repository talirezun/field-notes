// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import anchorIds from './src/lib/satteri-anchor-ids.mjs';

export const SITE = 'https://fieldnotes.talirezun.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      // Derived artefacts are for agents, not for search indexes.
      filter: (page) => !page.includes('/downloads/'),
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
