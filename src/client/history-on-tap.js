/*
 * Back in Chrome and Edge on an iPhone (withastro/astro#11919).
 *
 * WebKit hides from Back any history entry a page adds without a recent
 * tap, so a site cannot trap the reader. In Chrome and Edge on an iPhone a
 * tap counts only while its event is being handled. Astro's router adds the
 * new page's entry after it has fetched the page, by when the tap no longer
 * counts, so every page of a visit was hidden and Back left the site.
 * Safari and desktop browsers keep a tap for seconds, so they never showed
 * it.
 *
 * So, when the router starts a navigation during a tap, this adds the entry
 * there and then, as a copy of the current one, and the router's own push,
 * when the page arrives, fills that entry in rather than adding another.
 * Links to files, which the router always loads in full, are left alone.
 * If it gives up on a page and loads it in full (a failed fetch), the entry
 * takes that address first, and the load replaces it, as a load of the
 * current address does. Back or Forward meanwhile leaves the entry be,
 * since the navigation it was for has been abandoned.
 *
 * Inlined before the router by BaseLayout.astro: it wraps pushState before
 * the router reads it.
 */
(() => {
  const activation = navigator.userActivation;
  if (!activation) return;

  const push = history.pushState;
  const replace = history.replaceState;
  // True while an entry made at a tap waits for the router's push.
  let waiting = false;

  history.pushState = function (state, unused, url) {
    if (!waiting) return push.apply(this, arguments);
    waiting = false;
    return replace.call(this, state, unused, url);
  };

  addEventListener('popstate', () => (waiting = false), true);

  document.addEventListener('astro:before-preparation', (event) => {
    if (event.navigationType !== 'push' || event.formData || !activation.isActive) return;
    // A file (llms.txt, a Markdown twin, rss.xml) is always loaded in full: left as it was.
    if (/\.\w+$/.test(event.to.pathname)) return;
    // The router already moved the address itself (as a fix in Astro might).
    if (location.href === event.to.href) return;
    if (!waiting) {
      push.call(history, history.state, '', location.href);
      waiting = true;
    }
    const load = event.loader;
    event.loader = async () => {
      await load();
      // The router will now load the address in full, from this entry.
      if (event.defaultPrevented && waiting && !event.signal.aborted) {
        waiting = false;
        replace.call(history, history.state, '', event.to.href);
      }
    };
  });
})();
