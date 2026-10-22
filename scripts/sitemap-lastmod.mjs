/**
 * <lastmod> from git, not from the build clock. A build touches every file, so
 * a filesystem mtime would tell a crawler the whole site changed on every
 * deploy – which is worse than no lastmod at all, because it trains crawlers to
 * ignore the field. Ported from contentious-astro.
 *
 * A page's date is the newest commit touching any file it renders from: its
 * template, its prose, and the framework data or releases it reads. Taking the
 * template alone would leave /framework's date standing still while the
 * framework itself changed.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const cache = new Map();

/** What a page renders from besides its own template and prose. */
const DATA = 'src/data/framework.ts';
const READS = {
  '/': ['src/content/pages/home.md'],
  '/framework': [DATA],
  '/changelog': [DATA, 'src/content/releases'],
  '/toolkit': [DATA],
};

/** Every source file for a route. */
function sources(route) {
  const slug = route === '/' ? 'index' : route.slice(1);
  return [
    `src/pages/${slug}.astro`,
    `src/pages/${slug}/index.astro`,
    `src/content/pages/${slug}.md`,
    `src/content/pages/${slug}.mdx`,
    `src/content/framework/${slug}.md`,
    ...(READS[route] ?? []),
  ];
}

export function lastmodForPath(pathname) {
  const route = pathname.replace(/\/$/, '') || '/';
  if (cache.has(route)) return cache.get(route);

  let iso;
  const existing = sources(route).filter((p) => existsSync(p));
  if (existing.length) {
    try {
      iso = execFileSync('git', ['log', '-1', '--format=%cI', '--', ...existing], {
        encoding: 'utf8',
      }).trim() || undefined;
    } catch {
      // No git history (a fresh clone in CI with depth 1, or an uncommitted
      // file). Omitting lastmod is correct here: a wrong date is worse.
    }
  }

  cache.set(route, iso);
  return iso;
}
