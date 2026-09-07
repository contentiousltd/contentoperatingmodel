// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import smartypants from 'remark-smartypants';
import { loadEnv } from 'vite';
import { lastmodForPath } from './scripts/sitemap-lastmod.mjs';

// Dev only. Vite refuses requests whose Host it does not know, so previewing
// the dev server over Tailscale needs the machine's MagicDNS name allowed.
// That name is personal to the machine and lives in .env (gitignored) as
// DEV_ALLOWED_HOSTS, comma-separated; see .env.example.
const { DEV_ALLOWED_HOSTS = '' } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const devAllowedHosts = DEV_ALLOWED_HOSTS.split(',').map((h) => h.trim()).filter(Boolean);

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

  vite: {
    server: {
      allowedHosts: devAllowedHosts,
    },
    plugins: [
      {
        // Dev only. Vite serves font files with Cache-Control: no-cache, so
        // Chrome revalidates them whenever a breakpoint re-resolves a face
        // and, with font-display: swap, flashes the fallback meanwhile. The
        // build hashes the files and Netlify serves them immutable; this
        // gives the dev server the same behaviour for fonts alone.
        name: 'com-cache-fonts-in-dev',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (/\.woff2?(\?|$)/.test(req.url ?? '')) {
              const setHeader = res.setHeader.bind(res);
              res.setHeader = (name, value) =>
                setHeader(name, /cache-control/i.test(name) ? 'public, max-age=31536000, immutable' : value);
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }
            next();
          });
        },
      },
    ],
  },

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
