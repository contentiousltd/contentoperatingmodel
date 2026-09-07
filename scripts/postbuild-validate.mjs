#!/usr/bin/env node
/**
 * Assert the machine door exists, on every build.
 *
 * The risk on a publication is not a logic bug, it is a silent regression: a
 * page shipping without a description, a framework page whose version has
 * drifted from the data, a Markdown twin that was never generated. None of that
 * is caught by a type-check, and all of it is what the site is FOR
 * (ADR-COM-0004).
 *
 * Per HTML page:
 *   1. a non-empty <meta name="description">
 *   2. a <link rel="canonical">
 *   3. JSON-LD present
 *   4. no internal trailing-slash links (the slash-free URL convention)
 *   5. no em dashes in the rendered output
 *   6. a .md twin at the same path, unless the page is noindex
 *
 * Plus, once: llms.txt, llms-full.txt, sitemap.xml, robots.txt and rss.xml all
 * exist, and the framework page's stated version matches src/data/framework.ts.
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const failures = [];
const fail = (message) => failures.push(message);

async function listHtml(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await listHtml(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const pages = await listHtml(DIST);
if (pages.length === 0) fail('no HTML in dist/ — did the build run?');

for (const page of pages) {
  const route = '/' + relative(DIST, page).split(sep).join('/').replace(/\.html$/, '');
  const html = await readFile(page, 'utf8');
  const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);

  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) {
    fail(`${route}: no meta description`);
  }
  if (!/<link[^>]+rel=["']canonical["']/i.test(html)) {
    fail(`${route}: no canonical link`);
  }
  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(html)) {
    fail(`${route}: no JSON-LD`);
  }
  for (const match of html.matchAll(/href=["'](\/[^"'#?]*\/)["']/g)) {
    fail(`${route}: internal link with a trailing slash — ${match[1]}`);
  }
  if (html.includes('—')) {
    fail(`${route}: em dash in the rendered page`);
  }

  // The Markdown twin. 404 has nothing to say to a machine, and a noindex page
  // is not part of the published corpus.
  if (!noindex && route !== '/404') {
    const twin = route === '/index' ? join(DIST, 'index.md') : join(DIST, `${route.slice(1)}.md`);
    if (!(await exists(twin))) fail(`${route}: no Markdown twin at ${route === '/index' ? '/index.md' : `${route}.md`}`);
  }
}

for (const required of ['llms.txt', 'llms-full.txt', 'sitemap-index.xml', 'robots.txt', 'rss.xml']) {
  if (!(await exists(join(DIST, required)))) fail(`missing ${required}`);
}

// The framework page states its version in prose. If that drifts from the data
// every other surface renders from, the canonical page is lying about itself.
const frameworkPage = join(DIST, 'framework.html');
if (await exists(frameworkPage)) {
  const source = await readFile('src/data/framework.ts', 'utf8');
  const version = source.match(/FRAMEWORK_VERSION\s*=\s*'([^']+)'/)?.[1];
  const html = await readFile(frameworkPage, 'utf8');
  if (version && !html.includes(`Version ${version}`)) {
    fail(`/framework: page does not state "Version ${version}" from src/data/framework.ts`);
  }
}

if (failures.length) {
  console.error('postbuild validation failed\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`✓ postbuild — ${pages.length} page(s), machine door intact`);
