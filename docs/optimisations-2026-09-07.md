# Optimisation audit, 7 September 2026

**Status:** Applied, 7 September 2026, on Julius's instruction to work through every item. Each section below keeps its finding and gains a **Done** line saying what was done; the four things left for Julius are under *Parked* at the end. `CHANGELOG.md` has the same work as a release note.
**Scope:** everything the design deviations ledger does not already cover. The
ledger records where the site departs from `@contentious/ui` and why; this
records what is wrong, wasteful or unused in the site's own setup, what Astro 7
offers that the config leaves on the table, where the CSS repeats itself, and
what the next Astro consumer of the design system should get for free. The last
section collects the package asks so ROAD-1368 can carry them in one go.

Where a claim is about rendered size it was measured, not read off the
cascade: `astro preview` on the current build, Chrome headless via
`playwright-core`, viewports 1440 and 2192 wide at 1× (ADR-COM-0005).

---

## 1. Bugs, in the order to fix them

### 1.1 The homepage's canonical URL is `/index`

**Done.** `src/lib/urls.ts` maps `/index` to `/`; `BaseLayout` and the header both use it. The validator now checks every canonical's value and that `og:url` matches it. Verified in `dist/index.html`.

`dist/index.html` carries `<link rel="canonical" href="https://contentoperatingmodel.com/index">`
and the same value in `og:url`. `BaseLayout` strips `.html` from
`/index.html` and stops. Every share and every crawl of the front door points
at a URL the site does not serve without a redirect. contentious.ltd has the
same code and the same latent bug.

Fix: in `BaseLayout`, map `/index` to `/` after stripping. Then teach
`scripts/postbuild-validate.mjs` to check the canonical's *value* against the
route it is on, not only that a canonical exists. The validator passed this
build.

### 1.2 Two body sizes on the framework page, and one of them is 17.6px

**Done.** `.c-marketing-section { font-size: var(--t-body) }` plus unlayered restatements of `.prose`, `.prose p`, `.prose li` and `.prose .c-eyebrow`, because the package's `.prose` is unlayered and sets the unscaled base on the block. Measured after: `.prose p`, `dd`, `td`, `li` and the layer copy all 18 / 22 / 24px at 400 / 1440 / 2192; the layer `h3` on `--t-row` (18.9 / 23.1 / 25.2px); every prose h3 on `--t-section`. Ledger item 26; the package ask is §7.1.

The largest thing not in the ledger. Measured:

| Element, `/framework` | 1440 wide | 2192 wide |
| --- | --- | --- |
| Prose paragraph (`.prose p`) | 22px | 24px |
| Paragraph in a data section (the three layers intro) | 17.6px | 17.6px |
| Question `dd`, table `td`, vocabulary `dd` | 17.6px | 17.6px |
| Layer `h3` in the stack | 17.6px | 17.6px |
| Layer `p` in the stack | 13.6px | 14.9px |
| Prose `h2` (`--t-title`) | 52.8px | 57.6px |
| Data-section `h2` (`.type-h2`) | 54.2px | 59.1px |

Every list item and paragraph on `/toolkit` is also 17.6px. The header nav and
footer, which the ledger put on roles, are 19.4 / 21.1px.

Cause: the package's `base.css` sets `body { font-size: 1.1rem }`, which is
17.6px of the browser's 16px and ignores `--base-font-size` and
`--text-multiplier` entirely. The `.prose` class re-anchors its own text to
`--base-font-size`, so the two sections on the framework page that carry
`.prose` are right and the five that do not are at the reset's size. The
layer's `h3` is the same size as body copy, so the stack has no heading
hierarchy at all. Every "17.6px" in the ledger (items 9, 10, 17) is this one
cause seen from different places.

Fix here: put marketing text on a role. One rule,
`.c-marketing-section { font-size: var(--t-body) }`, and the framework page's
data sections, the toolkit and the changelog take the density the hero and
prose already have. Then decide whether `.prose` still needs its own anchor.
Fix in the system: `body` should derive from `--u`, which is what
`type-roles.css` is for. See §7.

### 1.3 The hero image `sizes` attribute predates the breakout

**Done.** `image.layout: 'constrained'` with `width={800}` on the hero: Astro writes `srcset` (640 to 1280w) and `sizes` itself; at 1× Chrome now picks the 800w rendition for the 649 to 682px slot. The ledger's cap corrected to 0.2 × column to match the CSS.

The uncommitted breakout in `site.css` lets the art grow past the column.
Measured rendered width of the hero `img`: 649px at 1440, 682px at 2192. The
`sizes` attribute still says `575px`, so at 1× Chrome picks the 600w rendition
and stretches it. At 2× it happens to pick 1200w, the largest, and looks fine.

Also: the ledger's item 24 says the breakout is capped at `0.25 ×
--container-max-width` (270px); the CSS comment and the formula say `0.2`
(216px). One of them is wrong.

Fix: with `image.layout: 'constrained'` (§3.1) Astro writes `sizes` itself and
this class of bug goes away. Until then, `sizes` needs the breakout's upper
bound in it.

### 1.4 The prose image on the homepage is the full 1200px rendition

**Done.** `home.md` became `home.mdx` and the figure is `<Image width={605} class="prose-figure">`: a 605 to 1080w `srcset`, and the figure takes the breakout (measured 389 → 520 / 605px at 1440 / 2192).

`![](../../assets/com-apparatus.png)` in `home.md` renders as one 1200×1200
WebP (128KB) with no `srcset`, in a slot measured at 520 to 605px. Astro's
markdown pipeline optimises the format but does not generate widths unless
told to. The same 128KB file is also the header mark's fallback `src` (see
1.6). §3.1 fixes both.

### 1.5 The intro in `home.md` has just acquired a link that cannot render

**Done.** The intro is Markdown (`[crud](…)`) rendered inline through the site's processor (`src/lib/inline-markdown.ts`), so the link works and the twin carries the Markdown. "we deliver build" → "we build".

The frontmatter `intro` now reads `…slop and <a href="…">crud,/a>.` Two
problems. The closing tag is mistyped (`,/a>` for `</a>`), so the raw text
would show. And `index.astro` renders `{intro}` as an escaped expression, so
even a correct tag prints as literal angle brackets rather than a link. The
Markdown twin would carry the raw HTML as well.

Fix: either keep frontmatter fields as plain text and move the link into the
body, or render `intro` through the markdown processor.
`@astrojs/markdown-remark` is already a dependency and currently unused, so
`createMarkdownProcessor` is the free option. Same file, line 66: "we deliver
build a holistic" has one verb too many.

### 1.6 The marks carry 1200×1200 intrinsic dimensions

**Done.** `layout="fixed"` with `width` and `height` on both marks; the header mark imports from `@contentious/ui/brand/content-operating-model/logo@2x.png`. Both `width: auto` patches deleted; the footer mark sized on both axes so a lazy image holds its box (it measured 0px wide before load).

Header and footer use `<Image widths={[40, 80, 120]}>` and `widths={[120, 240,
360]}`. That produces a good `srcset` but leaves `src` on the full-size
rendition and `width="1200" height="1200"` on the element, which is why
`site.css` needs `.c-topbar__brand img { width: auto }` and `.footer-brand img
{ width: auto }`. The idiom for a fixed-size mark is `width={40}
densities={[1, 2, 3]}`: the fallback becomes the 40px file, the intrinsic
attributes become 40×40, and both CSS patches can go.

### 1.7 Netlify serves hashed assets with `max-age=0`

**Done.** `[[headers]]` for `/_astro/*` (immutable, one year) and the four baseline security headers; ADR-COM-0002 amended with the row and its Express equivalent.

Ledger item 7 says the build hashes the fonts "and Netlify serves them
immutable". Netlify's default is `Cache-Control: public, max-age=0,
must-revalidate` for every file; it relies on ETags, so every navigation
revalidates the CSS, the fonts and every image with a round trip each.
`netlify.toml` has no `[[headers]]` block. One for `/_astro/*` with
`public, max-age=31536000, immutable` is the single biggest repeat-visit win
available, and it moves to Express as one `res.set` when the Railway move
happens. Add it to ADR-COM-0002's named list. While there: `X-Content-Type-
Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` and a
`Permissions-Policy` cost nothing.

### 1.8 Smaller things in the same pass

**Done**, all but one: edge function exclusions updated; `site.webmanifest` with a new 192px icon (cut from the 512 with `sips`) and the page ground as its colour; the version line's date comes from the latest release; `.site-main` deleted; aliases reduced to `@/` and used everywhere; `zod` and `remark-smartypants` removed (`astro/zod` and the processor's own smartypants). **Not done:** deleting the three unreferenced PNGs, which are Julius's untracked uploads; parked below.

- `netlify/edge-functions/strip-trailing-slash.js` excludes `/fonts/*`, a
  directory that no longer exists. `*.md`, `*.txt` and `*.xml` are the paths
  worth excluding now.
- `public/images/icon-512.png` (340KB) is referenced by nothing; there is no
  web manifest. Add a `site.webmanifest` or remove the file.
- `src/assets/` holds 2.5MB of PNG; `apparatus.png`, `com-3.png` and
  `com-mark.png` (1.4MB) are referenced by nothing. Three of the six are
  uncommitted. Decide which stay, and whether the header mark should come from
  the package's `brand/content-operating-model/logo.png` (exported as
  `@contentious/ui/brand/*`; 160 and 320px cuts, enough for a 40px mark at 3×)
  so the repo stops carrying its own copy of a brand asset.
- The framework page hard-codes "September 2026" beside the version. The
  latest release in `src/content/releases/` has that date; derive it.
- `.site-main { display: block }` is a no-op; `main` is block by default.
- `tsconfig.json` declares `@/*`, `@components/*`, `@layouts/*` and `@data/*`
  and nothing uses them; every import is `../`. Use them or delete them.
- `zod` is a direct dependency and unused (`astro:content` re-exports `z`).
  `@astrojs/mdx` is installed with no `.mdx` files; keep only if §2.1 goes
  the MDX route.

---

## 2. The machine door: where the twin is not the page

ADR-COM-0004 §1: "The twin is the page, not a summary." Today it is a summary
in three places.

### 2.1 Framework prose that exists only in the `.astro`

**Done, the cleaner way.** `framework.mdx` is the whole page in one register: prose, `<Band>` sections and the four data components. The twin is `mdxToMarkdown()` over the same source (`src/lib/mdx-to-markdown.ts`), with `src/lib/framework-markdown.ts` as each component's Markdown twin. The validator compares the page's h2s to the twin's.

`framework.astro` carries paragraphs of specification prose in the component:
the introduction to the three layers ("Content is the only layer the audience
sees…"), the two paragraphs on rule and call, the cells sentence and the whole
versioning section. None of it is in `framework.md`, so none of it reaches
`/framework.md`, `llms-full.txt` or the postbuild version check. `CLAUDE.md`'s
rule is that prose lives in `src/content/`, and this breaks it on the one page
that matters most.

Two ways to close it:

- **Smaller.** Move the paragraphs into `framework.md` under the same
  headings and let the `.astro` render only the data-driven blocks between
  them. Needs the page to interleave markdown sections with components, which
  is awkward with one `<Content />`.
- **Cleaner.** Make `framework.md` an MDX file that imports `<Layers />`,
  `<Questions />`, `<RuleAndCall />` and `<Vocabulary />` from
  `src/components/framework/`, each rendering from `src/data/framework.ts`.
  The page is then one document in one register. The twin generator runs the
  same MDX through a remark pass that replaces each component node with the
  Markdown table `frameworkTables()` already builds for it. One source, two
  renderings, and drift is impossible by construction. This is the reason
  `@astrojs/mdx` was installed.

### 2.2 Hand-typed twins for the toolkit and the changelog

**Done.** `src/content/pages/toolkit.mdx` is the page and the twin; the changelog page and twin read `PAGES.changelog` in `src/config/site.ts` and the releases collection, including each release's body.

`markdown-twins.ts` writes the toolkit twin as a hand-typed sentence and a
description that differs from the page's own (`"Building a content operating
model."` against the page's full description). The toolkit page's four bullets
are not in the twin. The changelog twin hard-codes its description while the
page composes one from `FRAMEWORK_VERSION`. Both should render from the same
source as the page: move the toolkit copy into `src/content/pages/toolkit.md`
(the collection exists for it) and derive the changelog twin from the same
data the page uses.

### 2.3 Anchors are generated, not hand-set

**Done.** `src/lib/remark-heading-ids.mjs` reads `\{#id\}` (escaped in MDX); `ANCHORS` in `framework.ts` lists the promised set; the validator asserts each id is in `framework.html`.

ADR-COM-0004 §5 promises hand-set stable anchors. The data-driven headings
have them (`#the-three-layers`, `#rule-and-call`, `#vocabulary`, the question
and layer ids). The prose headings from `framework.md` get Astro's generated
slugs, so rewording "A way of doing content isn't an operating model" breaks
every deep link into it. Fix: explicit ids on the markdown headings (a remark
plugin that reads `{#id}` syntax, or ids supplied from an `ANCHORS` export in
`framework.ts`), and a validator step that asserts every anchor in that list
exists in `framework.html`.

### 2.4 Promised structured data that is not there

**Done.** `Article` on every page with `datePublished` (first commit) and `dateModified` (last commit touching the route's sources) from `src/lib/lastmod.mjs`, which now carries a dependency map so `/framework` moves when `framework.ts` does and `/changelog` when a release lands. `FAQPage` not added: the framework has no question-and-answer section, and the seven questions are not FAQs.

The setup plan (D3) promised `Article` on prose pages with `datePublished` and
`dateModified`, and `FAQPage` on the framework. Only `Organization`,
`WebSite` and the `DefinedTermSet` ship. `scripts/sitemap-lastmod.mjs` already
computes a git date per route; the same function can feed `dateModified`.
Also: its candidate list does not include `src/data/framework.ts` or the
releases folder, so a change to the framework data or a new release leaves
`/framework` and `/changelog` with stale `lastmod`.

### 2.5 One site config

**Done.** `src/config/site.ts` (URL, name, publisher, `NAV`, `FAMILY`, `PAGES`), `src/lib/urls.ts`, `import.meta.env.SITE` in the twin route, `sameAs` on the Organization.

The literal `'https://contentoperatingmodel.com'` appears as a fallback in
five files, and `[...twin].md.ts` hard-codes it rather than reading
`import.meta.env.SITE`. The three nav links are typed in `Header.astro` and
again in `Footer.astro`. The four sibling-product links are typed in
`Footer.astro` and again in `llms.txt.ts`. `Header.astro` re-derives the
canonical path that `BaseLayout` already computes. One `src/config/site.ts`
(name, URL, nav, family links) and one `canonicalPath()` helper in `src/lib/`,
as contentious.ltd does, removes all of it. The family links could then also
feed `sameAs` on the Organization node.

### 2.6 Validator hardening

**Done.** All five checks, plus the twin's front matter naming the right canonical and the manifest existing. It imports `framework.ts` directly (Node 22.18+ type stripping; `engines` bumped).

`postbuild-validate.mjs` checks presence, not correctness, which is how 1.1
got through. Worth adding: canonical equals the expected URL; `og:image`
resolves to a file in `dist/` (item 23 in the ledger was a 404 for a while);
every twin is listed in `llms.txt` and every `llms.txt` entry has a twin; the
required anchors exist; and the twin's `h2` set matches the page's `h2` set,
which is the mechanical check for 2.1 and 2.2.

---

## 3. Astro 7 features the config does not use

### 3.1 Responsive images: `image.layout: 'constrained'`

**Done**, with `responsiveStyles`. No `widths` or `sizes` remain in the components.

Stable since Astro 5.10. One config line makes every `<Image>` and every
markdown image emit `srcset` and `sizes` derived from its rendered layout,
plus `responsiveStyles` for the `max-width: 100%; height: auto` rule that
`site.css` writes by hand. It fixes 1.3 and 1.4, removes the hand-written
`widths` and `sizes` from three components, and is the setting the next Astro
consumer should start with.

### 3.2 The Fonts API

**Not done, blocked on the package** (§7.5): adopting it here would declare the faces twice. The preloads stay on the `?url` imports.

Astro 7 ships `fonts` in config with `fontProviders.local()`. It generates the
`@font-face` rules, the preload links `BaseLayout` currently builds from
`?url` imports, and fallback font metrics (`size-adjust`, `ascent-override`)
so the swap from the fallback serif to Bely does not move the page. The
blocker is that `@contentious/ui`'s `base.css` declares `@font-face` itself,
so adopting the API here would declare the faces twice. This is a package
ask (§7.5): ship the fonts as files plus a documented Astro recipe, or split
`fonts.css` out of `base.css` so a consumer can choose one or the other.
While it is open: the package's `@font-face` also lists `.woff` fallbacks,
and four `.woff` files (about 340KB) land in `dist/` that no browser released
since 2016 will request.

### 3.3 Prefetch

**Done**, `defaultStrategy: 'hover'`. Verified the prefetch script ships.

contentious.ltd sets `prefetch: { defaultStrategy: 'hover' }`. On a four-page
site it makes every navigation feel instant for one small script. Worth the
same here; `viewport` strategy for the three nav links would prefetch the
whole site on load, which at these page weights (2 to 6KB gzipped) is
reasonable.

### 3.4 Small config items

**Done.** Dev toolbar off; `InferGetStaticPropsType` and `import.meta.env.SITE`; `twins()` memoised per build. Also: Astro 7 deprecates `markdown.remarkPlugins` in favour of `markdown.processor`, so the config uses `unified({ remarkPlugins, smartypants: true })` from `@astrojs/markdown-remark`.

- `devToolbar: { enabled: false }`, the ledger's "seen, not changed".
- `[...twin].md.ts` can type its props with `InferGetStaticPropsType` and
  read the site from `import.meta.env.SITE`.
- `twins()` is computed three times per build (the twin route, `llms.txt`,
  `llms-full.txt`). Trivial today; memoise when the toolkit pages land.

---

## 4. CSS: DRY, structure and one scale

### 4.1 Two type scales on one site

**Done.** No `type-*` class or `display-heading` on a heading remains; `.page-title`, `.page-lede`, `.meta` on the roles (ledger 27). Measured: every h1 67.8 / 73.9px at 1440 / 2192, every prose h2 52.8 / 57.6px.

The package ships two: the em-based `type-h1/h2/h3/intro/sm` and
`--font-size-h*`, anchored to whatever the element inherits (17.6px, per 1.2);
and the role scale `--u`/`--t-*`, anchored to `--base-font-size`. The site
uses both. The framework `h1` is `.type-h1` (measured 67.8 / 73.9px), the
hero title is `3.08u` (measured 67.8 / 73.9px, and equal only because 3.08 was
chosen to match). On the framework page the prose `h2` is `--t-title` and the
data-section `h2` is `.type-h2`, 52.8px against 54.2px at 1440. Pick the role
scale everywhere: it is the one that follows density, it is what the skill's
components use, and it is what ledger item 8 changed. Then `type-h1`,
`type-h2`, `type-intro` and `type-sm` leave the markup. Package ask in §7.2.

### 4.2 Range syntax instead of `.99rem`

**Done**, every media query in both files.

`47.99rem` and `51.99rem` appear eight times to avoid a one-pixel overlap
with `48rem` and `52rem`. Media query range syntax (`@media (width < 48rem)`)
has been in every browser since 2023 and removes the hack and the arithmetic.

### 4.3 Repeated literals

**Done.** `--gutter`, `--column`, `--underline` (per context; one hover rule), `.site-control` for the two 44px controls, `--z-sticky` on the skip link, the hero band on `3.33u` rather than `5rem`.

- The gutter `calc(var(--u) * 2.22)` three times, including inside the
  `--breakout` formula. Declare `--gutter` once beside `--breakout`.
- The 44px control (`.c-topbar__menu` and `.site-menu__x`) is one rule
  written twice, both mirroring `.c-msheet__x`; the `svg` sizing likewise.
  One shared class, and a package ask for an icon-button class and a
  tap-target token (§7.7).
- The link hover is three near-identical blocks. Set an `--underline-colour`
  per context (`--sapling-500` on the page, `--accent-link` in the footer)
  and write the hover rule once.
- `z-index: 100` on the skip link while `--z-sticky` and `--z-modal` exist.
- `padding-block: 5rem` on the hero band is the only spacing on the site not
  in `--u`.

### 4.4 Split the file so the ledger and the CSS cannot drift

**Done.** `site.css` (the site's own) then `overrides.css` (ledger-tagged, imported last so it wins ties). `scripts/check-ledger.mjs` runs in `npm run lint` and CI; it reports 19 items implemented in CSS and 8 that are markup-only or informational.

`site.css` is 550 lines and mixes two kinds of rule: overrides that go when
the system answers (the ledger) and the site's own CSS that stays (skip link,
mobile menu, footer brand block, hero band, breakout). Split them into
`overrides.css` and `site.css`, tag every override block with its ledger
number (`/* ledger 12 */`), and a ten-line script can report which ledger
items still have CSS and which CSS has no ledger item. That makes "delete when
the system answers" a mechanical step rather than an archaeology exercise, and
it is the shape the next product should copy.

### 4.5 What the package ships versus what the site uses

**Recorded** as §7.3 and §7.6; not fixable here.

The built stylesheet is 89KB (16.6KB gzipped) and defines 348 classes; the
five pages use 40. Not a performance emergency, and purging is the wrong fix
(ADR-0011 says consume the package whole), but it is the clearest argument for
a marketing-only entry point in the package (§7.3) rather than every front
door shipping the gauge, the sheet, the history plot and the account menu.

The package also carries two hero vocabularies: `.c-hero__heading`,
`.c-hero__image`, `.c-hero__eyebrow` with entrance animations and hyphenation
in `src/styles/components.css`, and `.c-hero__title`, `.c-hero__art` in the
skill. The site uses the skill's names and re-implements the hyphenation the
other set already has. §7.6.

---

## 5. UX and accessibility

**Done:** the menu is a native `<dialog>` (tested headless: focus trapped through six Tabs, Escape closes, focus returns to the trigger, page scroll locked); the mobile nav is labelled "Site"; the layer stack has its hierarchy (§1.2); link hover shortened under `prefers-reduced-motion`. **Parked:** the homepage title length (copy).

- **The mobile menu has no focus trap.** Tab leaves the dialog into the page
  behind it, and both navs are labelled "Main", which is a duplicate landmark
  for a screen reader. The modern fix is smaller than the current one: a
  `<dialog>` element opened with `showModal()` gives the focus trap, Escape,
  the top layer and backdrop for free, and most of the script goes; or keep
  the `div` and set `inert` on `header`, `main` and `footer` while it is open.
  Rename the mobile nav's label.
- **The layer stack has no heading hierarchy** (1.2): `h3` at 17.6px beside
  body text at 17.6px and captions at 13.6px.
- **The homepage `<title>` is 104 characters.** Search results and browser
  tabs show about 60. Editorial call, but the `metaTitle` field is where the
  short form would go.
- **The 1.6s link hover** is not reduced under `prefers-reduced-motion`. It
  animates colour and thickness rather than position, so it is defensible;
  noting it because the mobile menu does honour the preference.
- **Framework page copy** at 17.6px in the data sections is also the
  accessibility point: the specification tables are the smallest text on the
  site.

---

## 6. Developer experience

**Done:** the Bash matcher in the design gate (tested: `sed -i` and a heredoc into `src/` denied, `cat` allowed); `scripts/measure.mjs` and `npm run measure`; `scripts/lib/walk.mjs`; the hex regex ignores anchors; `npm run lint` runs the ledger and staleness checks; `NODE_VERSION` removed from `netlify.toml`. The package's promised token detector is still not shipped (its `check:utilities` is a Tailwind 4 check), so `check-tokens.mjs` stays.

- **The design gate has a hole.** `.claude/settings.json` matches
  `Edit|Write|MultiEdit`. In auto mode the harness prefers Bash for file
  edits, so `sed -i` or a heredoc into `src/styles/site.css` never meets the
  hook. A second matcher on `Bash` that denies when the command string
  targets `src/**/*.{astro,css,tsx,jsx}` and the skill has not been invoked
  is imperfect but closes the obvious route.
- **Ship the measurement harness.** ADR-COM-0005 says layout claims are
  checked by measurement. The repo has nothing to measure with. The script
  used for this audit (`playwright-core` driving the system's Google Chrome
  through `executablePath`, no browser download) is about forty lines and
  belongs in `scripts/measure.mjs` with a `npm run measure` entry, so the next
  ledger item comes with numbers by default.
- **`npm ci` installs 324MB** for a site that uses 9MB of CSS and fonts.
  `@contentious/ui` lists React, 45 Radix packages, TanStack Query,
  react-hook-form and lucide as hard `dependencies`, so every CSS-only
  consumer pays for them in CI minutes and cold installs. §7.4.
- **The token-copy detector the package promised** (ADR-0011 §5) has still
  not shipped; the package's `check:utilities` is a Tailwind 4 check and
  `check:signatures` is for the package itself. `scripts/check-tokens.mjs`
  stays, and its hex regex would false-positive on a markdown anchor such as
  `#face` or `#bad`. Anchor the pattern to CSS and attribute contexts, or
  exclude `.md`.
- **`lint-prose.mjs` and `check-tokens.mjs`** each carry their own `walk()`.
  One `scripts/lib/walk.mjs`.
- **`npm run lint` does not run `check:ui-current`**; CI does. A local run
  can pass and CI fail on staleness alone.
- **`.nvmrc` and `NODE_VERSION`** say the same thing twice; Netlify reads
  `.nvmrc`.
- **The `Footer` year** is computed at build time. Fine while deploys are
  frequent; the site will say the old year until the first January deploy.

---

## 7. For the design system: the blueprint list

**Done:** appended to `contentious-ui/GAPS.md` under Open (uncommitted in that working copy), a note on ROAD-1368's page, and a Roadmap row for the package-side work.

Everything below is a package or skill ask that the ledger does not already
carry. Each is phrased as the decision needed, per `GAPS.md`'s rule.

1. **Body text must follow density.** `base.css` sets `body { font-size:
   1.1rem }`, which is 17.6px whatever `--base-font-size` says. Every
   consumer that is not inside `.prose` or a sized component renders at
   17.6px. The site measured 17.6px against 24px on one page (1.2). Decision:
   `body { font-size: var(--t-body) }` in `base.css`, or the equivalent in
   `type-roles.css`, and `.prose` stops needing its own anchor.
2. **One type scale.** `type-h1/h2/h3/intro/sm` and `--font-size-h*` are
   em-based and anchored to the inherited size; `--u`/`--t-*` are anchored to
   density. Both ship, both are documented, and a consumer using both gets two
   sizes for one role (4.1). Decision: retire the `type-*` classes or
   redefine them in terms of `--t-*`.
3. **A marketing-only entry point.** `styles/marketing.css` importing layers,
   tokens, base, theme door, semantic, products, typography and only the
   marketing kit, so a front door ships 40 classes it uses rather than 348
   (4.5). The app kit stays where it is.
4. **JavaScript dependencies as optional peers.** A CSS consumer installs
   React, Radix, TanStack and lucide today (324MB, §6). ADR-0014's own note
   already separates "assets ship as source" from "JavaScript ships compiled";
   the dependency list should follow the same split.
5. **Fonts.** Split `fonts.css` out of `base.css` so an Astro consumer can use
   the Fonts API for preloads and fallback metrics (3.2); drop the `.woff`
   fallbacks; add font smoothing to `base.css` (ledger 16); document which
   faces a front door preloads.
6. **Two hero vocabularies.** `.c-hero__heading/__image/__eyebrow` in the
   package's `components.css` and `.c-hero__title/__art` in the skill.
   Decision: one set, and the hyphenation rule moves to it.
7. **Controls and breakpoints.** The only 44px control is `.c-msheet__x`;
   consumers copy it (4.3). Decision: an icon-button class and a tap-target
   token. The "chrome breakpoint" has no published value; consumers write
   `48rem` and `52rem` from reading the CSS. Decision: name the breakpoints
   in `spacing.css` as documented rem values, and say range syntax is the
   convention.
8. **Brand assets sized for use.** `brand/content-operating-model/logo.png`
   is 160px; the site carries its own 1200px cut and a pale cut the package
   does not have. Decision: which is canonical, and whether the brand folder
   should ship the pale variant and a hero-size cut, with a note on the
   `astro:assets` idiom (`width` plus `densities` for marks, `layout:
   constrained` for art).
9. **A skip link.** None exists in the system; every consumer writes one.
10. **The Astro starter.** The setup plan (§7.5) says extract at the third
    Astro site. The pieces that should be cut from this repo when that
    happens, once §1 to §3 are applied: `BaseLayout`'s head with the canonical
    fixed, the twin generator, `llms.txt` and `llms-full.txt`, the validator
    with the correctness checks, `sitemap-lastmod`, the token and prose
    checks, the design gate with the Bash matcher, the measurement script,
    `netlify.toml` with headers, and the `image`/`prefetch`/`fonts` config.

---

## Parked for Julius

Four things this pass did not decide.

1. **Three unreferenced PNGs in `src/assets/`**: `apparatus.png`, `com-3.png` and `com-mark.png` (1.4MB). Two are untracked uploads from today and one is the favicon's source. Delete, or commit `com-mark.png` as the favicon source and drop the other two.
2. **The homepage `<title>`** is 104 characters; results and tabs show about 60. `metaTitle` in `home.mdx` is where a shorter form goes. Brand copy, so not written here.
3. **The Fonts API** (§3.2) waits on the package splitting `fonts.css` out of `base.css`.
4. **The framework page's tinted bands** were kept as they were (alternating `<Band tint>`), which needed no decision; if the reference page's single body section is preferred, remove the `tint` attributes.

## Order followed

1. §1.1 to §1.7, the bugs. Two hours, including the validator check for the
   canonical and the `[[headers]]` block. Commit the `home.md` fix with them.
2. §3.1 and §3.3, `image.layout` and `prefetch`, then delete the hand-written
   `widths`, `sizes` and `width: auto` rules they make redundant.
3. §2, the twin and anchor work, with the validator additions in §2.6. Half a
   day; the MDX route in §2.1 is the part worth a decision first.
4. §4, the CSS split, range syntax and the DRY pass. Two to three hours, and
   the split is what makes the ledger closeable item by item.
5. §7 into `contentious-ui`'s `GAPS.md` and `docs/design-system-sync.md`, and
   a Roadmap row per ask, or one row pointing here.
