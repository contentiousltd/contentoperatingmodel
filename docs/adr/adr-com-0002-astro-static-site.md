# ADR-COM-0002: Astro static site on Netlify, with the move to Railway sized in advance

**Status:** Accepted
**Date:** 2026-09-07
**Related:** meta-repo ADR-0012 (CSS strategy), ADR-0014 (design-package distribution); Content Maturity ADR-CM-0007 (build-time prerendering); Voice Tone & Style ADR-VTS-0005 (token-first CSS); [docs/plans/project-setup.md](../plans/project-setup.md)

## Context

Every other product in the family with a public site is a Vite React single-page app with an Express server on Railway (Content Maturity, Content Health Check, Voice Tone & Style), or a static Astro site on Netlify (contentious.ltd, the Maturity Tool pitch page). COM has to pick one, and the pick is load-bearing because the product's entire near-term value is being read, cited and crawled.

The SPA shape has a documented cost for that job. ADR-CM-0007 records it: a React SPA serves an empty shell, so crawlers that do not run JavaScript get nothing, and the fix is build-time prerendering with headless Chromium. Its own consequences section lists a 150 MB browser in the build, soft 404s where unknown URLs return the home shell with a 200, a visible flash as `createRoot` re-renders over the snapshot, and hand-refreshed data snapshots for pages that fetch. `llms.txt` "stays hand-authored". The pipeline works and has been ported twice, which is why `porting-seo-to-sibling-sites.md` exists.

Against that, the app is coming. The hosted library (ROAD-1347), the generator (ROAD-1348) and organisations are decided, if unscheduled. A choice that is cheap now and expensive to change later would be a bad trade.

## Decision

**1. Astro, static, content as MDX collections.** Real HTML at build time with no browser in the pipeline, per-page metadata and structured data in the raw response, Markdown as the authoring format, and a build a person can run in seconds. contentious.ltd already proves the shape in this family, so this is the second Astro site rather than a new stack.

**2. Astro 7.** Checked against the registry on 2026-09-07: `astro@7.3.1`, Node `>=22.12`. contentious.ltd runs 5.17.1, so its config and scripts are ported by reading them against the 7.x documentation, never copied wholesale. Integrations take caret ranges; only `@contentious/ui` is pinned exact, per suite ADR-0014 §2.

**3. The reference CSS dialect, not Tailwind.** Suite ADR-0012 makes token-first `c-*` the reference and Tailwind 4 an optional generated view for the two utility-heavy products that already had it. A new product starting on Tailwind would be a third legacy consumer. The marketing kit COM is built from is `c-*` CSS.

**4. Netlify, one host.** Matching contentious.ltd. Railway was seriously considered and would save a later move at no marginal cost, since it is already paid for. It lost on simplicity: two hosts for one product is more to hold in the head than a one-person shop wants, and Netlify is genuinely the better host for a site with no server. The move is made cheap instead of pre-empted.

**5. Everything Netlify-specific is a named list, and it stays short.**

| Thing | Replacement on Railway |
| --- | --- |
| `netlify.toml` build config and docs-only skip | `railway.json` and watch paths |
| `netlify/edge-functions/strip-trailing-slash.js` | Ten lines of Express middleware |
| Deploy previews | Railway PR environments |

**No Netlify Functions and no Netlify Forms.** Forms in particular: the free plan's submission allowance is small and shared across every site on the account, and the toolkit download is the feature most likely to exceed it. Email capture posts to MailerLite, where the rest of the lists live, so the move never touches it.

**6. The move is sized and triggered, not deferred.** About a day: add `@astrojs/node` in middleware mode and a small Express entry copying Content Maturity's Railway setup, convert the two items above, re-point DNS, re-run the verification. **No page, layout, content file, stylesheet, CI check or URL changes**, because content pages stay prerendered. Triggers, either one: the first signed-in screen is scheduled, or Netlify usage on the account crosses into the paid tier while Railway's marginal cost is still zero.

**7. App UI is React islands from the first interactive screen.** Never Astro templates with scripts attached. This is what keeps the worst case cheap: if the app outgrows the content site, moving it to its own service is a lift and shift of components rather than a rewrite.

## Consequences

**Positive**

- The machine door is a build output rather than a pipeline: Markdown twins, `llms.txt` and structured data all come from the same source as the pages.
- No Chromium in the build, no soft 404s, no snapshot refreshing, no hydration flash.
- Authors edit Markdown, which is what the next year of this product is.
- The site is on the same infrastructure and conventions as contentious.ltd, so the third text-first product in the family has a template to cut from (ADR-0002's extraction trigger).

**Negative**

- A second stack in the family for a person who already maintains the React one. Mitigated by contentious.ltd being the same stack and by the two sharing conventions.
- Netlify's conveniences are borrowed, not owned. When the move happens they are paid back in a day.
- Astro 7 while contentious.ltd is on 5 means its scripts are ported by reading rather than copying, and the two sites will differ until it upgrades.

## Alternatives considered

- **The React SPA shape from day one (Content Maturity's).** Rejected. Its costs fall on every public page for the life of the product, while the auth seam it avoids is paid once. It would also make the machine door harder, not easier: the source would be React components, so the Markdown renderings become a second artefact to keep in sync rather than a rendering of the source.
- **Railway from day one.** Genuinely close, and no worse on the machine door, since Astro's prerendered output is identical either way. Rejected on simplicity for now, with the move sized above so the decision stays cheap to revisit. If the Netlify account needs a paid plan anyway, this becomes the better answer and the trigger in §6 fires.
- **Netlify for the pages plus a Railway app on a subdomain.** The family's existing pattern and the likely end state. Rejected as a starting point: two deploy targets for one product before there is an app to deploy.
