# Changelog

Developer-facing changes to this site. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**This is not the framework's changelog.** The framework is versioned separately as content, authored in `src/content/releases/` and published at `/changelog`. A CSS fix here does not touch the framework's version, and a framework release is not a release of this site.

---

## [Unreleased]

The front door brought to the design system, then past it where the system fell short. Every departure from `@contentious/ui` is in `src/styles/site.css` with its reason and listed, with the decision it needs from Claude Design, in [docs/design-deviations-2026-09-07.md](docs/design-deviations-2026-09-07.md); item numbers below refer to it. [ADR-COM-0005](docs/adr/adr-com-0005-design-deviations-are-ledgered.md) is the policy.

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
