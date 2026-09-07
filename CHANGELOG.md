# Changelog

Developer-facing changes to this site. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**This is not the framework's changelog.** The framework is versioned separately as content, authored in `src/content/releases/` and published at `/changelog`. A CSS fix here does not touch the framework's version, and a framework release is not a release of this site.

---

## [Unreleased]

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
