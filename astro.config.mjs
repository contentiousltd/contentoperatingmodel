// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { loadEnv } from 'vite';
import { lastmodForPath } from './src/lib/lastmod.mjs';
import remarkHeadingIds from './src/lib/remark-heading-ids.mjs';

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

  // Responsive images by default: every <Image> and every markdown image gets
  // a srcset and a sizes attribute derived from its layout, and the
  // max-width: 100%; height: auto rule ships as a stylesheet rather than being
  // written by hand per component. Fixed-size marks (header, footer) opt out
  // with layout="fixed" plus densities. docs/optimisations-2026-09-07.md §3.1.
  image: {
    layout: 'constrained',
    responsiveStyles: true,
    // AVIF rather than Astro's default WebP, through the same wrapped sharp
    // service as contentious.ltd (src/lib/image-service.ts, copied from
    // contentious-astro, where its reasoning and measurements live): Astro
    // has no top-level format or quality option, so the service fills in the
    // defaults. Quality 65 by default; QUALITY.illustration (50) is opted in
    // per call site for the hero and the apparatus figure, which hold up at
    // it. The map keeps 65: it is finely drawn, and at 50 it lost 2 dB
    // against WebP. Measured on 11 November 2026: see CHANGELOG.md.
    service: {
      entrypoint: './src/lib/image-service.ts',
    },
  },

  // Four pages, each 2 to 6KB gzipped: prefetch the one under the pointer so
  // navigation is instant, as contentious.ltd does. One small client script.
  prefetch: { defaultStrategy: 'hover' },

  // The dark pill at the foot of every dev page. The site has no islands for
  // it to inspect and its audit overlay reports the design system's markup,
  // not this repo's.
  devToolbar: { enabled: false },

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
        // build hashes the files and netlify.toml serves /_astro/* immutable;
        // this gives the dev server the same behaviour for fonts alone.
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
    // Astro 7 configures Markdown through a processor. The remark pipeline,
    // because the framework page is MDX and the heading-anchor plugin is a
    // remark plugin; smartypants (curly quotes, the en dash for --) is the
    // processor's own and needs no separate dependency.
    processor: unified({
      // Hand-set anchors: `## Heading {#id}`. ADR-COM-0004 §5.
      remarkPlugins: [remarkHeadingIds],
      smartypants: true,
    }),
  },
});
