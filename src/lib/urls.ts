/**
 * Canonical paths for a 'file' build.
 *
 * build.format: 'file' puts the emitted filename in Astro.url.pathname
 * (/framework.html, /index.html), and dev serves the slashed form. The
 * canonical URL is slash-free and extension-free, and the homepage is "/",
 * never "/index": that last case shipped as the homepage's canonical once,
 * which is why this lives in one place with a test in the postbuild validator.
 */
export function canonicalPath(pathname: string): string {
  let path = pathname;
  if (path.endsWith('.html')) path = path.slice(0, -'.html'.length);
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  if (path === '/index' || path === '') path = '/';
  return path;
}

/** Absolute canonical URL for a page, from Astro.url and Astro.site. */
export function canonicalUrl(pathname: string, site: URL | undefined, fallback: string): string {
  return new URL(canonicalPath(pathname), site ?? fallback).href;
}
