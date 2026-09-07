/**
 * Dates from git, not from the build clock.
 *
 * A build touches every file, so a filesystem mtime would tell a crawler the
 * whole site changed on every deploy, which is worse than no date at all
 * because it trains crawlers to ignore the field. Two readers: the sitemap's
 * <lastmod> (astro.config.mjs) and each page's Article dateModified /
 * datePublished (BaseLayout, via the pages). One source, so they agree.
 *
 * A route's date is the newest commit touching any of its sources: the page
 * file AND the data it renders from. /framework moves when framework.ts
 * moves; /changelog moves when a release lands. Ported from contentious-astro
 * and extended with the dependency map.
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const cache = new Map();

/** Sources beyond the page file itself that a route renders from. */
const DEPENDENCIES = {
  '/': ['src/content/pages/home.mdx'],
  '/framework': ['src/content/framework/framework.mdx', 'src/data/framework.ts', 'src/components/framework'],
  '/changelog': ['src/content/releases', 'src/data/framework.ts'],
  '/toolkit': ['src/content/pages/toolkit.md', 'src/data/framework.ts'],
};

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
    `src/content/framework/${slug}.mdx`,
    ...(DEPENDENCIES[clean] ?? []),
  ];
}

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim() || undefined;
  } catch {
    // No git history (a depth-1 clone, or an uncommitted file). Omitting the
    // date is correct here: a wrong date is worse.
    return undefined;
  }
}

/** ISO date of the last commit touching any of the paths, or undefined. */
export function lastCommit(paths) {
  const existing = paths.filter((p) => existsSync(p));
  if (!existing.length) return undefined;
  return git(['log', '-1', '--format=%cI', '--', ...existing]);
}

/** ISO date of the first commit that added the first path that exists. */
export function firstCommit(paths) {
  const existing = paths.filter((p) => existsSync(p));
  for (const p of existing) {
    const out = git(['log', '--diff-filter=A', '--follow', '--format=%cI', '--', p]);
    if (out) return out.split('\n').at(-1);
  }
  return undefined;
}

/** <lastmod> for a route. */
export function lastmodForPath(pathname) {
  if (cache.has(pathname)) return cache.get(pathname);
  const iso = lastCommit(candidates(pathname));
  cache.set(pathname, iso);
  return iso;
}

/** datePublished / dateModified for a route, for Article structured data. */
export function datesForPath(pathname) {
  const files = candidates(pathname);
  return { published: firstCommit(files), modified: lastCommit(files) };
}
