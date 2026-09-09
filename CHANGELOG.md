# Changelog

Developer-facing changes to this site. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**This is not the framework's changelog.** The framework is versioned separately as content, authored in `src/content/releases/` and published at `/changelog`. A CSS fix here does not touch the framework's version, and a framework release is not a release of this site.

---

## [Unreleased]

Ships as 0.2.0: new pages, features and checks (MINOR). Two pieces of work, both on 7 September 2026.

### The navigation, 9 September

Ledger items 30 to 33 in [docs/design-deviations-2026-09-07.md](docs/design-deviations-2026-09-07.md) carry the reasoning and the measurements; this is the summary.

#### Added

- **Client-side navigation** with Astro's `<ClientRouter />` in `BaseLayout.astro`: the router fetches the next page, swaps the document and animates the change with the View Transitions API, on top of the hover prefetch already in place. The header's script looks its elements up per page and wires them on `astro:page-load`, since a bundled script runs once per session under the router while the header is replaced on every navigation; `astro:after-swap` restores `--dpx`, which the swap drops with the root element's attributes.
- **The mobile nav ported from contentious.ltd, value for value** (ledger 30): one fixed burger outside the sticky header (a stacking context nothing inside it can rise above), morphing into the close; the overlay at 97% of the accent with the page cream on it; links at `--t-metric` fading to 0.8 on hover; the fade in and out on a class toggled a frame after `show()`, since `@starting-style` never parsed as a rule in this dialog's cascade. Opacity 0.7 on the control, and its placement (centred in the bar, the box 32px from the edge) set by eye.
- **The burger drawn on the device-pixel grid.** Chrome snaps every CSS box to whole CSS pixels before scaling, so three identical 2.5px spans rendered 6, 4 and 4 device rows at 2x and read as three thicknesses at any zoom; SVG rects at fractional coordinates anti-alias unevenly too. The icon is an inline SVG whose coordinate unit is one device pixel, with the rects on integer coordinates, sized by the script from `devicePixelRatio` (again on zoom): identical at 1, 1.6, 2, 2.2 and 3.2x. 25 x 2.5px lines 5.5px apart, a tenth under ltd's.
- **The menu fades out over the destination.** A tap on a link keeps the dialog through the page swap (`transition:persist`) and closes it once the view transition's `finished` promise resolves, so the overlay hides the crossfade and dissolves to reveal the new page; `astro:page-load` fires before the crossfade, so it is not the cue. Focus returns to the burger only after a keyboard close, because Safari draws its ring on any focus set by script; keyboard focus on the burger and the links takes the system's ring.
- **The larger bar** (ledger 32): `1u` padding, a `2.5u` mark (ltd's 60px monogram at the marketing base) with half a unit of right margin, the wordmark at `--t-lede` from 48rem; `scroll-padding-top` keeps anchor targets clear of it. A bar that shrank on scroll, as ltd's does, with an eased landing after a page transition, was built and dropped the same day; the code and every measurement are in [docs/plans/shrinking-nav-2026-09-09.md](docs/plans/shrinking-nav-2026-09-09.md) for reinstating.
- **The current page marked with the underline, hover in colour** (ledger 33), as ltd: the sapling underline the text links share sits under the current page's link; hover and focus fade the text to sapling-650. The nav persists across pages and the script marks the new page's link at the swap and clears the old page's once the view transition has finished (the crossfade would hide that fade), so the underline fades from one link to the next, the new one rising at once over `--motion-overlay` and the old one fading in full view over `--duration-slow`. A step in tone was tried first and read too quiet.

#### Changed

- **The navigation is Introduction, Framework, Toolkit** (`NAV` in `src/config/site.ts`); Changelog moves to the footer's "Here" group, which renders `FOOTER_NAV`, and the footer's `llms.txt` link goes.
- The header mark is requested at 64px so the 2x source covers the larger mark (ledger 31 corrects the package's one-axis sizing that cropped it).

### The optimisation audit, later the same day

Everything in [docs/optimisations-2026-09-07.md](docs/optimisations-2026-09-07.md), applied; section numbers below refer to it. Sizes were measured before and after with `npm run measure` (ADR-COM-0005).

#### Added

- **The apparatus in its sapling colourway** (8 September) for the header mark, the homepage figure and, as a pale cut, the footer mark: `src/assets/apparatus-sapling.png` and `apparatus-sapling-pale.png`, transparent 1558px cuts. The header mark no longer imports from the package's `brand/` folder, which still carries the earlier colourway (audit §7.8).
- An eyebrow followed by a heading no longer opens the prose rhythm's 1.5em gap (measured 86px → 7px on the framework page). Alternating bands and eyebrows were tried on the homepage and taken out again on Julius's call.
- **A guard against stale content files.** The validator fails if two files in one content directory share a stem (`home.md` left beside `home.mdx` by an editor buffer), since the collection would carry two entries with one id and whichever loads last would win.
- **Twins from the page's own source.** Every content file is MDX; the framework page is one file, `src/content/framework/framework.mdx`, with the data-driven blocks placed as components (`src/components/framework/`) and the sections wrapped in `<Band>`. The Markdown twin is a remark transform of that file (`src/lib/mdx-to-markdown.ts`) that swaps each component for its Markdown rendering, unwraps layout, substitutes expressions and drops decorative images, so the twin is the page by construction (§2.1, §2.2). The toolkit's copy moved into `src/content/pages/toolkit.mdx` and the changelog twin renders from the same data as the page.
- **Hand-set anchors.** `## Heading \{#id\}` via `src/lib/remark-heading-ids.mjs`; the promised set is `ANCHORS` in `src/data/framework.ts` and the validator asserts each one (§2.3).
- **Article structured data** on every page, with `datePublished` and `dateModified` from git (`src/lib/lastmod.mjs`, which also feeds the sitemap and now knows a route's data dependencies), `sameAs` on the Organization, `og:site_name` (§2.4).
- **`src/config/site.ts`**: URL, name, navigation and family links, read by the header, footer, `llms.txt` and the structured data (§2.5). `src/lib/urls.ts` computes the canonical path once.
- **Validator checks** (§2.6): the canonical's value, `og:url` matching it, `og:image` existing, the twin's h2s matching the page's, the twin's front matter naming the right canonical, `llms.txt` listing exactly the twins, every anchor present, `site.webmanifest` present.
- **Responsive images by default**: `image.layout: 'constrained'` and `responsiveStyles` (§3.1). **Prefetch on hover** (§3.3). **Dev toolbar off** (§3.4).
- **Netlify headers**: `/_astro/*` immutable for a year, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` (§1.7; ADR-COM-0002 amended). **A web manifest** with 192 and 512px icons (§1.8).
- **`npm run check:ledger`** (`scripts/check-ledger.mjs`): every block in `src/styles/overrides.css` carries a `ledger N` tag and every tag has an entry (§4.4). **`npm run measure`** (`scripts/measure.mjs`): computed sizes at three widths through the installed Chrome (§6). `scripts/lib/walk.mjs` shared by the prose and token checks.
- **The design gate covers Bash**: a shell command naming a UI file with a write verb is denied until the design skill has been invoked (§6).
- **The layer stack** on the framework page, styled as `guidelines/pattern-com-page.html` draws it; the questions, vocabulary and rule-and-call table given structure on the roles.
- Ledger items 25 (topbar wrap), 26 (body text at 17.6px) and 27 (one type scale).

#### Changed

- **Body copy is on the density everywhere** (§1.2, ledger 26). Before: prose paragraphs 22 / 24px, every paragraph, `dd` and `td` in the framework's data sections 17.6px, the layer headings 17.6px, all of `/toolkit` 17.6px. After: 18 / 22 / 24px at phone / laptop / wide on every element and page. Cause recorded for the package: `base.css` sets `body { font-size: 1.1rem }`.
- **One type scale** (§4.1, ledger 27): the `type-h1 / h2 / intro / sm` classes and `display-heading` on headings are gone from the markup; `.page-title`, `.page-lede` and `.meta` on the `--t-*` roles replace them. Prose h3 on `--t-section` (ledger 13).
- **CSS split by fate** (§4.4): `src/styles/site.css` is the site's own; `src/styles/overrides.css` is every ledger item, tagged. Range syntax for every media query (§4.2); `--gutter`, `--column` and `--underline` declared once (§4.3); the `.site-main` no-op and the two `width: auto` image patches deleted.
- **The mobile menu is a `<dialog>`** opened with `showModal()`: focus trap, Escape and inertness of the page behind it for free; open and close animate with `@starting-style`; the desktop and mobile navs no longer share a landmark label (§5). Measured: focus stays inside through six Tabs, Escape closes, focus returns to the trigger.
- **Marks through `layout="fixed"`** with real intrinsic sizes; the header mark imports from the package's `brand/` folder (§1.6). The hero art and the prose figure get `srcset` and `sizes` from the constrained layout (§1.3, §1.4); the figure breaks out with the hero (ledger 24, cap corrected to 0.2 × column).
- **The homepage intro** is rendered as inline Markdown, so its link works (§1.5); `@astrojs/markdown-remark`'s `unified()` is the site's processor (Astro 7's `markdown.processor`), with smartypants built in. The framework page's version line takes its date from the latest release (§1.8). Footer mark sized on both axes so it holds its box before it loads.
- `@/` path alias used throughout; the three unused aliases removed. `astro/zod` for schemas. Node 22.18+ (`engines`), so the validator can import the data module.
- `netlify.toml` no longer repeats the Node version; the edge function skips `.md`, `.txt`, `.xml`, `.ico` and the manifest.
- CI runs the staleness check through `npm run lint` rather than as a second step.

#### Removed

- `zod` and `remark-smartypants` as direct dependencies (unused, and built in respectively). `scripts/sitemap-lastmod.mjs` moved to `src/lib/lastmod.mjs`.

#### Fixed

- **The homepage's canonical URL and `og:url` were `/index`** (§1.1). Now `/`, and the validator checks the value on every page.
- The hero's `sizes` attribute predated the breakout, so at 1× Chrome stretched the 600w rendition over 649 to 682px (§1.3). The prose image shipped as one 1200px file for a 520 to 605px slot (§1.4).
- The intro's link in `home.mdx` was mistyped and, as an escaped expression, could not have rendered; "we deliver build" (§1.5).
- Netlify was serving hashed assets with `max-age=0` (§1.7).

### The front door, earlier the same day

The front door brought to the design system, then past it where the system fell short. Every departure from `@contentious/ui` is in `src/styles/overrides.css` with its reason and listed, with the decision it needs from Claude Design, in [docs/design-deviations-2026-09-07.md](docs/design-deviations-2026-09-07.md); item numbers below refer to it. [ADR-COM-0005](docs/adr/adr-com-0005-design-deviations-are-ledgered.md) is the policy.

### Added

- **The hero as content.** `eyebrow`, `heading`, `intro` and `cta` are front matter in `src/content/pages/home.md`; the page and its Markdown twin both read them, so the twin's H1 no longer differs from the page's.
- **A mobile nav** below 48rem: full-screen on the accent with limestone Bely Display links, the system's row stagger, a ✕ where the burger sits, closing on link, ✕ and Escape, scroll locked, reduced motion honoured (20).
- **Images through `astro:assets`**, as contentious.ltd: the apparatus in `src/assets/`, hashed WebP with `srcset` and `sizes` fitted to each use, the hero eager and high priority, the footer lazy (22).
- **A share image.** `public/images/og-default.png` existed only as a reference in `BaseLayout`; a 1200 × 630 placeholder stops the 404 (23).
- **`DEV_ALLOWED_HOSTS`** in `.env` for previewing the dev server over Tailscale, and a dev-only Vite plugin that serves font files immutable so resizing no longer flashes the fallback face (7).
- **The deviations ledger** and the ADR above.

### Changed

- **`@contentious/ui` v0.14.0 → v0.14.2.** v0.14.1 fixes the package's door import, which was invalid CSS and had silently dropped the whole marketing kit from every consumer; v0.14.2 applies design round 2026-09-07c (whole-object links opt out of the hover underline; `.c-topbar` and `.c-strip` gain a chrome column).
- **One column, one convention.** Every container on the family's 1080px column with the gutter outside it, as contentious.ltd and the chrome column do, so header, body and footer share an edge at every width (4).
- **Density 24px → 20px**, both tokens, on `:root` (8). `CLAUDE.md` updated.
- **Typography.** Brand and nav links at `--t-ui` in Bely Display 400 (5, 9); prose h2 and h3 in Bely Display, h2 at `--t-title` (13); `-webkit-font-smoothing: antialiased` on the body, as the specimen pages and contentious.ltd (16); footer on three sizes (17).
- **The hero** on Maturity Tool's rhythm: 5rem padding, 1.5u / 1u / 1.33u gaps, a 3.08u heading, the art column at 1.25fr, on the block's section wash (10, 11).
- **Text links** fade in and thicken over a downward-growing bar in sapling-500 (sapling-400 in the footer), 500ms in and 1.6s out; nav links included (15).
- **The topbar**: no hairline, `--shadow-sm`, sticky (12).
- **The footer mark** as a 4.8u block beside the name, as voicetoneandstyle.com (18).
- **Font preloads** point at the package's own files via `?url` imports rather than copies the CSS never used (7).
- **The favicon set** cut from `com-mark` rather than the cog (19).

### Fixed

- The header, hero and footer markup brought to `guidelines/pattern-com-page.html`: `.c-marketing` on the bands, `.c-hero__title` for the invented `.c-hero__heading`, the footer's real class structure, `.c-footer__legal` as a `div` so it centres (6).
- Buttons that are anchors keep their text colour on hover (14).
- The footer no longer overflows a phone, nor does the hero title's longest word, nor the topbar's burger onto a second row (21, 10, 20).
- `.c-section` no longer applied to the hero: the design system's `.c-section` is the app spacer and painted a strip of page ground under the topbar (10).

### Removed

- The tinted "The shape of it" section on the home page; the framework page carries it.
- `public/fonts/`: byte-identical copies of the package's fonts, unreferenced once the preloads pointed at the package.

## [0.1.0] – 2026-09-07

The repository, and the first two pages.

### Added

- **Astro 7 static site**, slash-free URLs, MDX content collections, sitemap with git-derived `lastmod`, deployed on Netlify. See [ADR-COM-0002](docs/adr/adr-com-0002-astro-static-site.md) for why this rather than the React SPA shape the sibling products use, and for the sized move to Railway when the first signed-in screen is scheduled.
- **`src/data/framework.ts`** – the framework as data: three layers, seven questions in the live order with `why` marked as the hub, the two registers, the fourteen derived cells, and the vocabulary including the terms deliberately not used. Transcribed from COM: Working reference v3 as amended by the settled additions of 4 and 5 September. See [ADR-COM-0003](docs/adr/adr-com-0003-framework-as-code.md).
- **The machine door** – a Markdown twin of every page at the same path, `llms.txt` and `llms-full.txt` generated from the same source, JSON-LD including a `DefinedTermSet` for the vocabulary, an RSS feed of framework releases, and `scripts/postbuild-validate.mjs`, which fails the build if any page is missing its description, canonical, structured data or twin. See [ADR-COM-0004](docs/adr/adr-com-0004-machine-door.md).
- **Home and the framework page**, from the drafts settled in Notion on 4 and 5 September, plus a changelog page, a toolkit placeholder and a 404.
- **`@contentious/ui` v0.14.0**, pinned by exact tag per suite ADR-0014, consumed as the reference `c-*` dialect per suite ADR-0012. The product signature is `[data-product="com"]`: limestone ground, sapling-700 accent, front door only, 24px.
- **Checks** – `lint:prose` (em dashes fatal in CI), `check:tokens` (no hex, no local palette), `check:ui-current` (the design system pin against its latest tag), and the postbuild validator, all wired into `.github/workflows/checks.yml`.
- **The design gate hook**, ported from Content Maturity, widened to `.astro`. The first UI edit in a session is denied until the `contentious-design` skill has been invoked.
