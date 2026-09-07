// Enforce the site's slash-free canonical URLs (/about, not /about/).
//
// Astro emits /about.html (trailingSlash:'never' + build.format:'file'), which
// Netlify serves at BOTH /about and /about/ as 200 — a duplicate-URL situation
// the canonical tag papers over but doesn't remove. Netlify has no native
// trailing-slash *strip* (its "Pretty URLs" setting only ADDS slashes, and is
// deliberately disabled — see netlify.toml), so we do the strip here, in one
// place, for every route.
//
// Why this can't loop: it only ever redirects a slashed path to its no-slash
// form, and the no-slash form has no trailing slash to strip, so the function
// no-ops on the redirect target. Nothing else in the stack adds a trailing
// slash, so there is no opposing redirect to cycle against.
export default (request) => {
  const url = new URL(request.url);
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
    return Response.redirect(url.toString(), 301);
  }
  // No trailing slash: fall through to normal static serving / redirects.
};

export const config = {
  path: '/*',
  // Static assets never carry a trailing slash; skip them so the function
  // isn't invoked on every hashed asset, font, and image request.
  excludedPath: ['/_astro/*', '/fonts/*', '/images/*'],
};
