// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import smartypants from 'remark-smartypants';
import { lastmodForPath } from './scripts/sitemap-lastmod.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://contentoperatingmodel.com',

  // Slash-free canonical URLs (/framework, not /framework/), matching
  // contentious.ltd. 'file' format emits framework.html; Netlify serves it at
  // /framework, and the edge function 301s the slashed form. See
  // netlify/edge-functions/strip-trailing-slash.js and CLAUDE.md.
  trailingSlash: 'never',
  build: { format: 'file' },

  server: { host: true, port: 4321 },

  integrations: [
    mdx(),
    sitemap({
      // The .md twins are the machine door, not pages: they are already
      // reachable from llms.txt and each page's alternate link, and listing
      // them would advertise two canonical URLs for one document.
      filter: (page) => !new URL(page).pathname.endsWith('.md'),
      serialize(item) {
        const lastmod = lastmodForPath(new URL(item.url).pathname);
        if (lastmod) item.lastmod = lastmod;
        return item;
      },
    }),
  ],

  markdown: {
    // smartypants is a retext plugin used here as a remark plugin; its
    // transformer is typed against a generic Node, not mdast's Root, so it
    // fails Astro's RemarkPlugin type check even though it works at runtime.
    remarkPlugins: [/** @type {any} */ (smartypants)],
  },
});
