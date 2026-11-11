#!/usr/bin/env node
/**
 * Measure, don't eyeball (ADR-COM-0005).
 *
 * Drives the installed Google Chrome through playwright-core (no browser
 * download) against a running server and prints computed sizes for a set of
 * selectors at a set of viewport widths. Use it to put numbers on a layout or
 * type claim before it goes in the ledger.
 *
 *   npm run preview            # in one terminal, port 4321
 *   npm run measure            # defaults: the routes and probes below
 *   node scripts/measure.mjs --url http://localhost:4321 --widths 400,1440,2192 \
 *        --route /framework --probe ".prose p" --probe "dl dd"
 *
 * Probes are CSS selectors; each prints font-size, and width for images.
 * Also reports whether the document scrolls sideways at that width.
 */
import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const all = (name) => args.flatMap((a, i) => (a === `--${name}` ? [args[i + 1]] : []));

const url = opt('url', 'http://localhost:4321');
const widths = opt('widths', '400,1440,2192').split(',').map(Number);
const routes = all('route').length ? all('route') : ['/', '/framework', '/toolkit', '/changelog'];
const probes = all('probe').length
  ? all('probe')
  : ['body', 'h1', 'h2', 'h3', '.c-hero__title', '.c-hero__intro', '.prose p', 'dl dd', 'table td', '.c-topbar__right a', '.c-footer p', '.c-hero__art img', '.prose img'];

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
try {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    for (const route of routes) {
      await page.goto(new URL(route, url).href, { waitUntil: 'networkidle' });
      const rows = await page.evaluate((selectors) => {
        const out = {};
        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (!el) continue;
          const cs = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          out[sel] = el.tagName === 'IMG'
            ? `${Math.round(rect.width)}px wide, ${el.currentSrc.split('/').pop()}`
            : `${cs.fontSize} / ${cs.fontFamily.split(',')[0]}`;
        }
        out['scrolls sideways'] = String(document.documentElement.scrollWidth > innerWidth);
        return out;
      }, probes);
      console.log(`\n${route} @ ${width}px`);
      for (const [k, v] of Object.entries(rows)) console.log(`  ${k.padEnd(24)} ${v}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
}
