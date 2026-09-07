/**
 * <lastmod> from git, not from the build clock. A build touches every file, so
 * a filesystem mtime would tell a crawler the whole site changed on every
 * deploy — which is worse than no lastmod at all, because it trains crawlers to
 * ignore the field. Ported from contentious-astro.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const cache = new Map();

/** Candidate source files for a route, most specific first. */
function candidates(pathname) {
  const clean = pathname.replace(/\/$/, '') || '/';
  const slug = clean === '/' ? 'index' : clean.slice(1);
  return [
    `src/pages/${slug}.astro`,
    `src/pages/${slug}/index.astro`,
    `src/content/pages/${slug}.md`,
    `src/content/pages/${slug}.mdx`,
    `src/content/framework/${slug}.md`,
  ];
}

export function lastmodForPath(pathname) {
  if (cache.has(pathname)) return cache.get(pathname);

  let iso;
  for (const file of candidates(pathname)) {
    if (!existsSync(file)) continue;
    try {
      const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
        encoding: 'utf8',
      }).trim();
      if (out) {
        iso = out;
        break;
      }
    } catch {
      // No git history (a fresh clone in CI with depth 1, or an uncommitted
      // file). Omitting lastmod is correct here: a wrong date is worse.
    }
  }

  cache.set(pathname, iso);
  return iso;
}
