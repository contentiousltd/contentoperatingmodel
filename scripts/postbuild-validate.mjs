#!/usr/bin/env node
/**
 * Assert the machine door exists, on every build.
 *
 * The risk on a publication is not a logic bug, it is a silent regression: a
 * page shipping without a description, a canonical pointing at /index, a
 * framework page whose version has drifted from the data, a Markdown twin
 * that says something different from the page. None of that is caught by a
 * type-check, and all of it is what the site is FOR (ADR-COM-0004).
 *
 * Per HTML page:
 *   1. a non-empty <meta name="description">
 *   2. a <link rel="canonical"> whose value is the page's own slash-free URL
 *      ("/" for the homepage, never "/index")
 *   3. JSON-LD present
 *   4. no internal trailing-slash links (the slash-free URL convention)
 *   5. no em dashes in the rendered output
 *   6. a .md twin at the same path, unless the page is noindex, whose h2s are
 *      the page's h2s (the twin is the page, not a summary)
 *   7. every og:image resolves to a file in dist/
 *
 * Plus, once: llms.txt, llms-full.txt, sitemap, robots.txt and rss.xml exist;
 * llms.txt lists every twin and nothing else; the framework page states the
 * version from src/data/framework.ts and carries every anchor in ANCHORS.
 */
import { readdir, readFile, access } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const failures = [];
const fail = (message) => failures.push(message);

const config = await readFile('astro.config.mjs', 'utf8');
const SITE = config.match(/site:\s*'([^']+)'/)?.[1]?.replace(/\/$/, '');
if (!SITE) fail('astro.config.mjs: could not read `site`');

// Node 22.18+ strips types on import, so the data module is read directly
// rather than re-parsed with a regex.
const { FRAMEWORK_VERSION, ANCHORS } = await import('../src/data/framework.ts');

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

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

/** h2 texts of an HTML page, without any inline <span> (a date, a subtitle). */
const htmlH2s = (html) =>
  [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => decode(m[1].replace(/<span\b[^>]*>[\s\S]*?<\/span>/g, '')));

/** h2 texts of a Markdown twin. */
const mdH2s = (md) => [...md.matchAll(/^## (.+)$/gm)].map((m) => decode(m[1]));

const pages = await listHtml(DIST);
if (pages.length === 0) fail('no HTML in dist/ — did the build run?');

const twinsFound = [];

for (const page of pages) {
  const file = relative(DIST, page).split(sep).join('/').replace(/\.html$/, '');
  const route = file === 'index' ? '/' : `/${file}`;
  const html = await readFile(page, 'utf8');
  const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);

  if (!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) {
    fail(`${route}: no meta description`);
  }

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1];
  if (!canonical) fail(`${route}: no canonical link`);
  else if (!noindex && canonical !== `${SITE}${route}`) {
    fail(`${route}: canonical is ${canonical}, expected ${SITE}${route}`);
  }
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)?.[1];
  if (ogUrl && canonical && ogUrl !== canonical) fail(`${route}: og:url ${ogUrl} differs from the canonical`);

  if (!/<script[^>]+type=["']application\/ld\+json["']/i.test(html)) {
    fail(`${route}: no JSON-LD`);
  }
  for (const match of html.matchAll(/href=["'](\/[^"'#?]*\/)["']/g)) {
    fail(`${route}: internal link with a trailing slash — ${match[1]}`);
  }
  if (html.includes('—')) {
    fail(`${route}: em dash in the rendered page`);
  }

  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1];
  if (ogImage) {
    const path = ogImage.startsWith(SITE) ? ogImage.slice(SITE.length) : ogImage;
    if (path.startsWith('/') && !(await exists(join(DIST, path)))) fail(`${route}: og:image ${path} is not in dist/`);
  }

  // The Markdown twin. 404 has nothing to say to a machine, and a noindex page
  // is not part of the published corpus.
  if (!noindex && file !== '404') {
    const twinPath = `${file}.md`;
    const twinFile = join(DIST, twinPath);
    if (!(await exists(twinFile))) {
      fail(`${route}: no Markdown twin at /${twinPath}`);
    } else {
      twinsFound.push(twinPath);
      const twin = await readFile(twinFile, 'utf8');
      const a = htmlH2s(html);
      const b = mdH2s(twin);
      if (a.join('\n') !== b.join('\n')) {
        fail(`${route}: the twin's h2s differ from the page's\n      page: ${JSON.stringify(a)}\n      twin: ${JSON.stringify(b)}`);
      }
      if (!twin.includes(`canonical: "${SITE}${route}"`)) fail(`/${twinPath}: front matter does not name ${SITE}${route} as canonical`);
    }
  }
}

for (const required of ['llms.txt', 'llms-full.txt', 'sitemap-index.xml', 'robots.txt', 'rss.xml', 'site.webmanifest']) {
  if (!(await exists(join(DIST, required)))) fail(`missing ${required}`);
}

// llms.txt lists exactly the twins that exist.
if (await exists(join(DIST, 'llms.txt'))) {
  const llms = await readFile(join(DIST, 'llms.txt'), 'utf8');
  const listed = [...llms.matchAll(new RegExp(`\\]\\(${SITE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/([^)]+\\.md)\\)`, 'g'))].map((m) => m[1]);
  for (const twin of twinsFound) if (!listed.includes(twin)) fail(`llms.txt does not list /${twin}`);
  for (const twin of listed) if (!twinsFound.includes(twin)) fail(`llms.txt lists /${twin}, which has no page`);
}

// The framework page states its version in prose and carries its anchors.
const frameworkPage = join(DIST, 'framework.html');
if (await exists(frameworkPage)) {
  const html = await readFile(frameworkPage, 'utf8');
  if (!html.includes(`Version ${FRAMEWORK_VERSION}`)) {
    fail(`/framework: page does not state "Version ${FRAMEWORK_VERSION}" from src/data/framework.ts`);
  }
  for (const id of ANCHORS) {
    if (!new RegExp(`\\sid="${id}"`).test(html)) fail(`/framework: anchor #${id} is missing (ADR-COM-0004 §5)`);
  }
}

if (failures.length) {
  console.error('postbuild validation failed\n');
  for (const failure of failures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log(`✓ postbuild — ${pages.length} page(s), ${twinsFound.length} twin(s), machine door intact`);
