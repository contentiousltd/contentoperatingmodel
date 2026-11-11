# Content Operating Model: starting the project

**Status:** Draft for Julius's review
**Date:** 2026-09-07
**Scope:** How to start contentoperatingmodel.com so that it is clean now, future-proof for the roadmap (v0 toolkit, v1 hosted library, v2 AI-assisted assembly, v3 Content Layer integration), and a better template for the next new product than anything we have started from before.

---

## The recommendation in one paragraph

Build contentoperatingmodel.com as an **Astro static site with content as code**, consuming `@contentious/ui` in the reference `c-*` dialect, deployed on Netlify as one host with the move to Railway sized and triggered in advance, and with the machine door (Markdown renderings, `llms.txt`, structured data, one canonical URL per framework page) designed in from the first commit rather than retro-fitted. Do **not** copy the React SPA plus Express shape of Content Maturity and Content Health Check for the publication: their SEO story is a documented workaround (headless Chromium prerendering, ADR-CM-0007) for a site that is text first. What *should* be copied from those repos is their **repo conventions**: `docs/adr`, `CLAUDE.md`, `CHANGELOG.md`, the design gate hook, exact-tag pinning, CI checks, British English and en dashes, Roadmap in Notion. The **design-system round** that gates any page build landed on 7 September: `[data-product="com"]` now exists in the design system with a reference page and artwork. What remains is the package side (theme file, brand entry, changelog, release tag) before COM can pin it.

> **Revised 2026-09-07, later the same day.** Three things moved after the first draft: the hosting decision (Astro on Netlify, one host, move sized rather than pre-empted), the design round landing in contentious-ui, and email capture coming off Netlify Forms. Sections 1, 2, 6 and 8 reflect that; the original reasoning is kept where it still applies.
>
> **Built 2026-09-07.** Julius settled the three blocking questions: MailerLite for the list, Netlify for now, and yes to the package release. `@contentious/ui@v0.14.0` is tagged and pushed with COM's theme, brand entry and favicon set; this repo is scaffolded against it with the framework data module, the machine door, four ADRs and CI. What is left is in §9.

---

## 1. Where things stand

### The content is nearly ready; the codebase did not exist

*(Written before the scaffold landed on 7 September. Kept as the starting picture; §9 records where it got to.)*

- The project folder was empty. There was no git repo, no GitHub repo and no Netlify site. Roadmap milestone ROAD-1343 still says "No repo, and it may not need one for a while".
- The site structure was settled on 5 September (COM docs audit, Addendum 3): **Home** (the Intro draft, editorial register) · **The framework** (the canonical page, specification register, versioned v0.9, with vocabulary and changelog) · **The toolkit** as a journey (Transforming · Concepts to borrow · Diagnosis · Design) · **Email capture** for updates and the downloadable toolkit.
- Drafts exist for Home (Intro) and The framework (canonical page draft v0.9, linted). The Working reference is at v3 and needs a v4 pass (hub-and-spoke, live question order, rule and call) before the framework page is checked line by line against it. The four toolkit sub-pages do not yet have drafts beyond the Intro's outline and the May positioning piece.
- The machine door requirement is already written down: "section anchors per heading, structured data, llms.txt pointing at clean markdown renderings, one canonical URL for the framework".
- Roadmap items exist for the v0 toolkit (ROAD-1345), the canonical page (ROAD-1344), testing with organisations (ROAD-1346), the hosted library (ROAD-1347), AI-assisted assembly (ROAD-1348), CM as transition map (ROAD-1349) and the CM×COM mapping (ROAD-1366). Nothing tracks the site build itself yet.

### The design system now has a Content Operating Model in it, on the design side

The 7 September export "Content Operating Model becomes the sixth product" was applied to contentious-ui and committed (commit `423303f`, one ahead of the `v0.13.3` tag, untagged). What it settled, so none of it is re-decided in this repo:

- **`[data-product="com"]`** in `skills/contentious-design/tokens/products.css`: limestone ground (CHC's, stop for stop, recorded as a deliberate exception to rule 4 on the argument that COM is the layer the suite answers to, so it looks like the house), **sapling-700 accent** (the dark end, so no fill can be mistaken for a score rung; sapling is now spent as an accent for the whole suite), illustration register "apparatus and mechanism", `--signature-deployment: "reserved – front door only until v1"`, every surface 24px, `--surface-page` and `--surface-front` declared equal and separating when the app arrives, `--surface-card-deep` measured for the future library's component cards.
- **The set grew to 38** with `--accent-link-on-reverse` and its hover, so footer links stop being hardcoded fire on non-fire products. COM's are sapling-400 and sapling-300 on the gloaming-700 footer.
- **A reference page**, `guidelines/pattern-com-page.html`: nav, hero, one body section, the three-layer stack as page markup, footer, built only from the marketing kit at `data-product="com"`. The first page of the site is an assembly job from it. The three-layer stack is deliberately not a component until it appears on a third page.
- **Artwork**: `images/com-apparatus.png` (the lino-cut apparatus, transparent, 1200px; hero, header mark at 40px, footer mark at 29px) and `images/com-cog.png` (the favicon shape). Two cuts of one mark, split on size.
- **`SKILL.md`** now names Content Operating Model in its description, so the design gate hook will invoke correctly in this repo.
- The **marketing kit** from the same day (`.c-hero`, `.c-eyebrow`, `.c-pullquote`, `.c-steps`, `.c-price-row`, `.c-divider--taper`, `.c-bullets--accent`, `.c-literal`, `.c-marketing-section`) and `--surface-front` / `--surface-front-tint` are what the site is built from. Maturity Tool is the first consumer; COM is the second.

What is **not** done, and gates COM pinning the package:

- Repo side of contentious-ui: `src/styles/themes/content-operating-model.css` (the short knob list ADR-0011 §3 describes: density 24px, and nothing else the block does not already declare), a `brand/content-operating-model/` entry in `brand/brands.json` with the mark, a favicon file set cut from the cog (`.ico` plus the PNG sizes), the `CHANGELOG.md` entry the apply commit did not write, and a **minor release and tag** (new tokens are additive, so `v0.14.0`). Until the tag exists, nothing can pin it.
- Two decisions the round hands back (question 1 in §8): the published three-layer diagram is fire and sunshine and predates the sapling accent, so either it is recoloured (*why* at the centre in sapling-700, the other six in sunshine) or the accent is reconsidered against its own centrepiece; and whether the `.c-topbar` app chrome doing marketing duty is acceptable for launch, which the round flags but does not solve.
- Unrelated but seen while checking: `npm run check:signatures` fails on `mt` (`--surface-menu` equals `--surface-field`), and that failure predates this export and is not in the package's CI workflow. Worth a Roadmap row against contentious-ui, not COM.

### What the siblings actually give us

| Repo | Shape | What to take | What not to take |
| --- | --- | --- | --- |
| contentious-astro | Astro 5, MDX collections plus Storyblok, Netlify | The Astro conventions: slash-free URLs (`build.format: 'file'`, `trailingSlash: 'never'`, the edge function), `BaseLayout` head (canonical, OG, JSON-LD), `llms.txt.ts`, `sitemap-lastmod.mjs`, `lint-astro-prose.mjs`, `postbuild-validate.mjs`, the CI shape | Storyblok; the local `design-tokens.css` aliases (pre-ADR-0011); the `docs/` style (improvements and roadmap trackers, superseded by Roadmap in Notion) |
| contentmaturity | React SPA plus Express on Railway, Tailwind 4 | `CLAUDE.md` conventions, `docs/adr` with `ADR-CM-` prefix, the design gate hook, `check:dashes`, CI structure, product semver and the two-changelog idea, `seo.config.json` as the pattern for declaring public routes | The runtime shape; Playwright prerendering; Tailwind |
| contenthealthcheck | Same shape, largest codebase | The "suite architecture" block in `CLAUDE.md`, the effort-calibration note, documentation-as-part-of-the-work, release workflow | The scale |
| voicetoneandstyle | React SPA, holding site on `main`, product on `develop` | The reference `c-*` CSS dialect (ADR-VTS-0005), `llms.txt` as a hand-authored map, the holding-site precedent | The two-branch model, which is an app-versus-holding-site problem COM does not have |
| maturitytool | Plain HTML plus a copy script, Netlify | The package wiring in `index.html` (layer order, `data-product`, `semantic.css` then `products.css`), Umami, the `netlify.toml` docs-ignore | Its single-file build; it will not scale to a growing site |
| content-layer | Docs only | The `README` and `CLAUDE.md` shape for a repo whose scope is bounded by the family | n/a |

### Family obligations before the first commit

- **ADR-0008** says a repo that acquires ADRs takes a row in its table first. COM needs the prefix `com` (`ADR-COM-0001`, `adr-com-0001-slug.md`), matching Roadmap's `Product = Content Operating Model`.
- **products.md and family.md** have no Content Operating Model. Where it sits is a family decision: Notion positions it as the strategic design layer *above* the suite ("Design your COM. Run it on The Content Layer."), not as a suite member. My recommendation is a sibling product at family level, described as the strategic upstream, consuming shared infrastructure like everything else.
- **shared-infrastructure.md** lists `@contentious/ui` consumers; COM is added when it pins.
- **ADR-0011 §4** requires every product, marketing sites included, to consume the package; **ADR-0012 §2** says Astro sites consume the reference `c-*` dialect directly; **ADR-0013** rules out dark mode; **ADR-0014 §2** requires an exact tag pin.
- **ADR-0007** (machine doors) is Proposed and framed around action registries and MCP for the apps. COM v0 has no actions, only documents. The relevant principle is the one VTS states: **one object, many renderings**. The content model below is designed so that a future MCP door renders the same framework data, not a second copy.

---

## 2. Decisions this plan takes, and why

Each of these becomes an `ADR-COM-` record in the repo. The numbered questions at the end are the ones I cannot take for you.

### D1. Astro static site, not the React SPA shape

The publication needs: real HTML at build time, per-page metadata and JSON-LD in the raw response, Markdown as the authoring format, Markdown renderings for machines, a sitemap with true `lastmod`, RSS for the framework changelog, and a build that a single person can run in seconds. Astro gives all of that natively; the SPA shape gets there via `scripts/prerender.mjs`, a 150 MB Chromium install and soft 404s (ADR-CM-0007 lists these as accepted costs). contentious-astro already proves the Astro shape on the family's own site, so this is the second Astro site rather than a new stack.

When functionality arrives, Astro does not run out: React islands for interactive pieces, and the Node adapter in middleware mode inside Express with `@contentious/auth` when the v1 library needs sign-in (D6 sizes that move). The alternative at that point is a sibling app on a subdomain under the `.contentious.ltd` realm rules (ADR-0006), sharing the design system and the framework data. **That choice is deferred and recorded as deferred**, with the seam named: the framework data module is the thing both halves would share.

**Versions.** Start on the current major, not the one contentious-astro is on. Checked against the registry on 2026-09-07: Astro `7.3.1` (Node `>=22.12`, so `.nvmrc` stays at 22), `@astrojs/sitemap` `3.7.4`, `@astrojs/mdx` `8.0.0`, `@astrojs/rss` `4.0.19`, `@astrojs/react` `6.0.5` when islands arrive, `@astrojs/node` `11.1.5` when the move to Railway happens. contentious-astro runs `5.17.1`, so its config and scripts are ported by reading them, not copying them: the content-collection, sitemap and build-format APIs are checked against the 7.x docs at scaffold time rather than assumed. Caret ranges within the major, as the siblings do; only `@contentious/ui` is pinned exact.

### D2. Content as code; Notion is the workshop, the repo is the record

The framework page, the vocabulary, the seven questions, the fourteen cells and the changelog are **structured data in the repo**, validated by a schema, rendered into every surface (page, `.md`, `llms.txt`, JSON-LD, the toolkit templates, and later the library and the MCP door). Prose pages (Home, the toolkit journey) are Markdown/MDX content collections. No CMS. This follows ADR-CM-0006/0008 (framework as code, schema as the reusable artefact) and the meta-repo's "Markdown only" rule, and it is the only way the "one canonical URL, versioned, with a changelog" promise stays true.

Consequence for Notion: once a page is published, its Notion draft gets a banner pointing at the repo, and the product page slims to the hub the audit already recommends. Two sources of truth for the framework text is exactly the drift the Working reference exists to catch.

### D3. The machine door is a build output, not a feature

Every published page ships with:

- a `.md` twin at the same path (`/framework` → `/framework.md`) rendered from the same source, with the version and canonical URL in its front matter;
- section anchors on every heading, stable and hand-set for the framework page (`#the-seven-questions`, `#rule-and-call`) so deep links survive edits;
- JSON-LD: `Organization` and `WebSite` everywhere; `Article` on prose pages with `datePublished` and `dateModified`; `FAQPage` on the framework's "Questions people ask"; `DefinedTermSet` for the vocabulary, which is what makes the framework's terms citable as terms;
- `llms.txt` generated from the collections (as contentious-astro does) plus `llms-full.txt` concatenating the `.md` twins;
- `robots.txt` allowing AI crawlers, `sitemap.xml` with git-derived `lastmod`, an RSS feed of framework releases.

The post-build validator asserts all of it, so a page cannot ship without its twin, its description, its canonical or its JSON-LD. That is the same mechanism contentious-astro uses for em dashes and trailing slashes, extended.

### D4. Two version numbers, deliberately

The **framework** has a version (v0.9 today, v1.0 at canonisation) and a public changelog; that is content, lives in the framework data and is rendered on the page and in RSS. The **site** has product semver from `0.1.0` in `package.json` with a developer `CHANGELOG.md`, following CM and CHC. They are not coupled: a copy fix on the homepage does not bump the framework, and framework v1.0 is not a site release. Git tags name site releases (`v0.1.0`); framework releases are entries in the releases collection with a date.

### D5. Design consumption exactly as ADR-0011 and ADR-0014 say

- `@contentious/ui` pinned by exact tag. Import order in `src/styles/index.css`: `layers` → `tokens` → `base` → `themes/content-operating-model` → `semantic` → `products` → `typography` → `components`, then COM's own page CSS. `<html data-product="com">`.
- No local palette, no hex anywhere in `src/`, no Tailwind. COM page CSS uses `var(--…)` only and BEM names for page-specific elements, as VTS does. Component-level styling comes from `c-*` classes; if a component is missing, it goes in `GAPS.md` in contentious-ui, not in COM.
- The `require-design-skill` hook from CM, with its path regex widened to `src/.*\.(astro|css|tsx|jsx)$`.
- A local token-copy check (fail on `#[0-9a-f]{3,8}` in `src/**` and on any locally defined `--limestone-*`-style property) until the package ships its own detector (ADR-0011 §5 promises one).
- The first page is assembled from `guidelines/pattern-com-page.html`, not designed. The artwork ships from the package (`images/com-apparatus.png`, `images/com-cog.png`), and the canonical stacked-circles diagram is the one picture the framework page must carry, "no other version". Its recolour is question 1.

### D6. One host: Netlify now, with the move to Railway sized and triggered in advance

Decided in conversation on 7 September after weighing three options. **Netlify on its own merits is the better host for a static site**: CDN edge, no process to run, atomic deploys, free previews, and it is where contentious.ltd, the VTS holding site and maturitytool already work well. **Railway wins only on the roadmap**: the hosted library, subscriptions and organisations are decided if unscheduled, Railway is already paid for so a small service costs nothing marginal, and hosting there from day one would save a later move. **Hosting the pages and the app in two places** (Netlify plus a Railway subdomain, the family's existing pattern) avoids the move entirely but is more to hold in the head than a one-person shop wants.

The decision is the simplest one: **Astro on Netlify, one host, and the move to Railway written down as the planned exit rather than discovered later.** Two rules keep the move small:

1. **No Netlify Functions**, and no Netlify-specific behaviour beyond a named list kept in ADR-COM-0002: the trailing-slash edge function, the docs-only build skip in `netlify.toml`, and deploy previews. Each has a direct Express or Railway replacement.
2. **Email capture does not use Netlify Forms.** The free plan's form submissions are a small monthly cap shared across every site on the account, and the toolkit download is the feature most likely to exceed it. The form posts from one component to wherever the list lives (question 6), so the move never touches it.

**Sized:** a day including verification. Add `@astrojs/node` in middleware mode and a small Express entry copying CM's `railway.json` and Nixpacks setup (an hour); edge function becomes middleware (minutes); build skip becomes watch paths (minutes); DNS and a re-run of the `curl` checks (an hour). No page, layout, content file, CSS, CI check or URL changes.

**Triggers, either one:** the first signed-in screen is scheduled, or Netlify usage on the account crosses into the paid tier while Railway's marginal cost is still zero.

**Account:** the repo is `contentiousltd/contentoperatingmodel`, private. Netlify's free tier does not deploy private repos from an organisation account, which is why contentious-astro, VTS and maturitytool sit under `juliushonnor`. Which Netlify account and whether the free tier still has room is question 3.

### D7. Roadmap in Notion from day one, no `BACKLOG.md`

COM is the first product repo created after the 22 August cutover, so it never had a backlog file to freeze. The `CLAUDE.md` carries the standard Roadmap block with `Product = Content Operating Model`. The site build gets its own Roadmap items (question 11).

---

## 3. The shape of the repo

```
contentoperatingmodel/
├── README.md                     what this is, how to run it, where decisions live
├── CLAUDE.md                     suite pointer, conventions, design gate, Roadmap block
├── CHANGELOG.md                  developer changelog (Keep a Changelog), site semver
├── package.json                  astro, @astrojs/sitemap, @astrojs/mdx, @astrojs/rss,
│                                 remark-smartypants, @contentious/ui#vX.Y.Z (exact)
├── .nvmrc                        22
├── .env.example
├── astro.config.mjs              site, trailingSlash 'never', build.format 'file',
│                                 sitemap with lastmod, mdx, smartypants
├── netlify.toml                  build, publish, docs-ignore, pretty_urls=false
├── netlify/edge-functions/strip-trailing-slash.js
├── .github/workflows/checks.yml  see §5
├── .claude/settings.json         PreToolUse design gate
├── .claude/hooks/require-design-skill.py
├── docs/
│   ├── README.md                 documentation index
│   ├── adr/README.md             ADR-COM index and template
│   ├── adr/adr-com-0001-….md     see §4
│   └── plans/project-setup.md    this file
├── public/
│   ├── robots.txt
│   ├── favicon.svg               from the design round
│   └── images/og-default.png     from the design round
├── scripts/
│   ├── lint-prose.mjs            em dashes, house style (from contentious-astro,
│   │                             or the contentious-plugins linter, see §7)
│   ├── postbuild-validate.mjs    description, canonical, JSON-LD, .md twin, no slashes
│   ├── sitemap-lastmod.mjs
│   └── check-tokens.mjs          no hex, no local palette
└── src/
    ├── content.config.ts         collections and schemas (Astro 5 content layer)
    ├── content/
    │   ├── pages/                home.md, and the toolkit journey pages
    │   ├── framework/            framework.md (the prose of the canonical page)
    │   ├── releases/             0.9.md, later 1.0.md (framework changelog)
    │   └── components/           v0 toolkit: one file per cell or component
    ├── data/
    │   └── framework.ts          the structured model: layers, questions, registers,
    │                             the 14 cells, vocabulary, version. Zod-validated.
    ├── layouts/BaseLayout.astro  head, JSON-LD, canonical, skip link, header, footer
    ├── components/               Astro components over c-* classes only
    ├── pages/
    │   ├── index.astro           Home
    │   ├── framework.astro       The framework (one canonical URL)
    │   ├── toolkit/              index, transforming, concepts, diagnosis, design
    │   ├── changelog.astro       framework releases
    │   ├── [...path].md.ts       the Markdown twin of every published page
    │   ├── llms.txt.ts, llms-full.txt.ts, rss.xml.ts
    │   └── 404.astro
    └── styles/
        ├── index.css             the package cascade, then COM CSS
        └── *.css                 page and pattern CSS, tokens only
```

Two things the layout is protecting:

- **`src/data/framework.ts` is the one object.** The framework page, the `.md` twin, the JSON-LD `DefinedTermSet`, `llms.txt`, the toolkit templates and the future library and MCP door all read it. The Working reference's vocabulary section becomes this file's `vocabulary` array; the seven questions and two registers become its `questions` and `registers`; the fourteen cells are derived, not typed twice.
- **Content is separated by register.** `pages/` is the editorial register, `framework/` the specification register. The audit's "the homepage argues, the framework page specifies" is a folder boundary, and the linter can be stricter on one than the other.

---

## 4. ADRs to write at the start

| Id | Decision | Notes |
| --- | --- | --- |
| ADR-COM-0001 | Repo scope and family placement | What lives here (the public framework, the site, the toolkit content), what does not (CM's assessment, the Content Layer's agents, shared infrastructure). Publication first; app surface deferred with the seam named. Links ADR-0003, ADR-0011, ADR-0014 in the meta-repo. |
| ADR-COM-0002 | Astro static site over the React SPA shape; Netlify as one host | D1 and D6 above. Records the alternatives (React on Railway from day one; Netlify pages plus a Railway app subdomain) and why they lost, the named list of Netlify-specific behaviour, the sized move, and the two triggers. Also the rule that app UI is React islands from the first interactive screen, never Astro templates with scripts, so a later split to a standalone app is a lift and shift. |
| ADR-COM-0003 | Framework as code; Notion is the workshop | D2 above. Names `src/data/framework.ts` as the single source, and the Notion handoff rule. |
| ADR-COM-0004 | The machine door | D3 and D4 above. What every page ships with, and why the framework version is content. |

Hosting is a paragraph in ADR-COM-0002 rather than its own record, unless question 3 turns out to be contentious.

---

## 5. Checks that run on every push

Mirrors contentious-astro's CI and CM's `checks.yml`, sized for a static site:

1. `npm ci` (the package is public today; if the platform plan takes it private, add CM's `private-packages-auth` action and the `CONTENTIOUS_PACKAGES_TOKEN` secret).
2. `astro check` and `tsc --noEmit`.
3. `npm run lint:prose`: em dashes fail the build; heuristic house-style rules advisory. Covers `src/content/**`, `src/**/*.astro` and `src/data/`.
4. `npm run check:tokens`: no hex in `src/`, no locally declared palette-named properties.
5. `npm run build`, whose `postbuild` runs the validator: every HTML page has a meta description, a canonical, JSON-LD, no trailing-slash internal links, no em dashes; every content page has a `.md` twin; `llms.txt` lists every non-noindex page; the framework page's version matches `framework.ts`.
6. `npm run check:ui-current` once the package ships it (ADR-0014 §3). See §7.

Deliberately absent: a test runner (nothing to unit test in v0), Playwright, Lighthouse in CI (run by hand before launch; add later if a regression bites).

---

## 6. Phases

### Phase 0: prerequisites (nothing in this repo depends on order within the phase)

1. **Design-system round for COM.** Design side **done** (7 September export, applied and committed in contentious-ui). Remaining on the package side, one PR in contentious-ui: `src/styles/themes/content-operating-model.css`, `brand/content-operating-model/` and the `brand/brands.json` entry, the favicon file set cut from `images/com-cog.png`, an OG image, the `CHANGELOG.md` entry, version bump to `0.14.0`, tag and push. **Gates Phase 1**, because COM pins by exact tag. Still wanted from a later design round, not blocking: a specimen for the 7×2 grid, and the recoloured diagram if question 1 goes that way.
2. **Meta-repo entries** (one PR in `contentious`): products.md entry, family.md diagram, ADR-0008 table row for `com`, glossary entry, shared-infrastructure consumer list placeholder. Depends on question 7.
3. **Accounts**: GitHub repo `contentiousltd/contentoperatingmodel` (question 2), Netlify site and DNS for contentoperatingmodel.com (question 3), Umami site id (question 9), Search Console property. Update the Notion product row's "Github repository" property.
4. **Content**: Working reference v4 in Notion (hub-and-spoke, order, rule and call, the settled commercial boundary), then the framework page checked line by line against it. This is editorial work that runs in parallel with 1 to 3 and is the real critical path for launch.

### Phase 1: the repo and the framework page (site v0.1.0, framework v0.9)

1. `git init`, scaffold per §3, `CLAUDE.md`, `README.md`, ADR-COM-0001 to 0004, CI, hooks. First commit is the scaffold with a passing build of a placeholder page, so CI is green from commit one.
2. `src/data/framework.ts` transcribed from Working reference v4: layers, questions in the live order with *why* marked as the hub, registers, cells, vocabulary with the deliberately unused terms, version `0.9`, release note.
3. `BaseLayout` with the full head, the `.md` twin endpoint, `llms.txt`, `llms-full.txt`, RSS, sitemap, robots, 404.
4. The framework page rendered from the data plus `framework/framework.md` prose, with the grid and the stack built from the marketing kit and the design round's specimen. Hand-set anchors.
5. Home from the Intro draft. Footer with the "built by Contentious" cross-links (descriptive anchors to contentious.ltd, CM, CHC, VTS), as the SEO audit asked of every sibling.
6. Changelog page and the releases collection with the 0.9 entry.
7. Deploy preview → verify with `curl` (no JS): 200 with real text, `.md` twin, JSON-LD present, garbage URL is a real 404, clean URLs 200 without redirect. Go live. Submit the sitemap.

### Phase 2: the toolkit journey and email capture (site 0.2.x)

1. The four toolkit pages as they are drafted: Transforming, Concepts to borrow (absorbing "From prompts to operating models"), Diagnosis (five board-room questions, routing to CM), Design (the fourteen cells; home of the component library).
2. Email capture as one component posting to the list's own endpoint (question 6), not Netlify Forms, per D6.
3. The v0 toolkit (ROAD-1345) as a `components` collection rendered on the Design page and packaged as the download. The collection schema is question × register × component so that v1's hosted library reads the same files.

### Phase 3: the app seam (not now)

When ROAD-1347 (hosted library, subscription) is scheduled: decide SSR-in-Astro versus a sibling app, write ADR-COM-0005, adopt `@contentious/auth` and the org model per ADR-0004/0015/0016, and declare the app's ground in the signature. The framework data module and the components collection are the contract the app consumes. Nothing in Phases 1 and 2 should need to change for this; if it does, that is the finding to record.

---

## 7. Improvements to how we start new projects

Things this exercise surfaced. Some are for this repo, most are for the family.

1. **Design before code, as a rule.** The design gate makes a repo without a product signature unable to build its first page legitimately. Starting a product should mean starting a design-system round, and the recipe in `products.css` is the checklist. Make "signature exists in `@contentious/ui`" the first line of the new-product checklist below.
2. **A `docs/new-product.md` checklist in the meta-repo.** Notion product row and domain row · GitHub repo in the org · design-system round · products.md, family.md, ADR-0008 row, glossary · repo scaffold (`CLAUDE.md`, `docs/adr`, `CHANGELOG.md`, CI, hooks) · hosting and DNS · analytics · Search Console · `llms.txt` · Roadmap items. This plan is its first draft; I would write it into `contentious/docs/` as part of Phase 0.2 so the next product does not start from an empty folder and a survey.
3. **Shared `CLAUDE.md` fragments.** The Roadmap block is copied verbatim into five repos, and the "suite architecture" block exists only in CHC's. Keep the canonical text in one place (the meta-repo, or contentious-plugins, which already ships skills to every repo) with a version marker, and a script that reports which repos are stale. Cheap, and it stops the next cutover being six hand edits.
4. **Ship `check:ui-current`.** ADR-0014 §3 promised a staleness check and it is not in contentious-ui's scripts. COM would be the seventh consumer with no loud signal. It is a small script (`git ls-remote --tags` against the pinned tag) and belongs in the package before COM pins, so the first pin is checked.
5. **Let COM be the Astro template, without extracting yet.** contentious-astro's SEO and validation scripts are what every text-first product needs, and `porting-seo-to-sibling-sites.md` shows SEO being re-derived per repo. ADR-0002's rule says extract at the third implementation; COM is the second Astro site. Build it clean enough that a starter can be cut from it when the third (More Than Transactional, Slow Content) arrives.
6. **Wire the house-style linter from contentious-plugins, not a third copy.** VTS keeps `dash-review.py` and `slop-check.py` as prototypes in `docs/plans/prototypes`; contentious-astro has `lint-astro-prose.mjs`; the plugin repo ships house-style linters. A text-first site should run the plugin's linter in CI and contribute fixes upstream.
7. **Decide the GitHub account question once.** The `juliushonnor` versus `contentiousltd` split exists only because of Netlify's free tier, and the free tier is now close to its limits. Either pay for the plan, or record that static sites live under the personal account, so it is not re-decided per repo. COM is the fourth site to hit this.
8. **Define the Notion-to-repo handoff.** Drafting in Notion is working well; the failure mode is a published page whose Notion draft keeps being edited. A one-line rule (published → banner in Notion → edits in the repo) and the audit's "slim the product page to a hub" close it.
9. **Framework changelog as a content type.** CM and CHC each have a developer changelog and a public "what's new". COM's framework changelog is a third kind: versioned content. Setting it up as a collection from day one avoids a `CHANGELOG.md` that mixes CSS fixes with canonical framework changes.
10. **The apply commit should carry the changelog.** contentious-ui's own rule is document then commit, and the COM export landed with an empty `[Unreleased]`. `design:apply` could print the reminder, or refuse to finish while `[Unreleased]` is empty and the skill tree changed.

---

## 8. Questions for Julius

**Settled since the first draft**, in conversation or by the design round: the stack (Astro), hosting (Netlify, one host, move sized), email capture off Netlify Forms, the ground and accent (limestone and sapling-700, recorded as an exception), the deployment mode (front door only until v1), and where the design work lives (inside the design-system project; applied). Those were questions 1, 3, 4, 10 and 11; they are replaced below and the numbering is fresh.

1. **The diagram.** The published three-layer diagram is fire and sunshine and predates the sapling accent. Recolour it (*why* at the centre in sapling-700, the other six in sunshine), or reconsider the accent against its own centrepiece? The design round explicitly leaves this to you. My default: recolour, in the next design round, and launch with the current diagram if the round is not in time.
2. **Repo visibility.** `contentiousltd/contentoperatingmodel`, private? Or public, given the framework is "free and stays free" and a public repo would itself be part of the machine door? My default: private.
3. **Netlify account.** Which account hosts it, and does the free tier still have the build minutes and bandwidth for a fourth site? If the honest answer is that the paid plan is coming anyway, that is a point for Railway from day one, and D6 should be re-read with that in mind.
4. **v0 scope.** Does the first release ship Home and The framework only, with the toolkit journey following as drafts land? Is the downloadable toolkit (ROAD-1345) in the first release or Phase 2? My default: Home plus framework plus changelog first, toolkit pages as they are written.
5. **Package release.** Shall I do the contentious-ui repo side (theme file, brand entry, favicon set, changelog, `v0.14.0` tag) so COM has something to pin? It is the only thing gating Phase 1 on the technical side.
6. **Email capture.** Where does the list live? It has to be decided now, since the form posts straight to it. It is the v1.0 launch audience.
7. **Family placement.** Sibling product at family level ("the strategic upstream", which is also how the design round describes it), or a member of the Content Layer suite? Decides the products.md and family.md wording. My default: sibling.
8. **Versioning.** Two versions as in D4 (framework version as content, site semver separately)? My default: yes.
9. **Analytics.** Umami at umami.contentious.ltd, as maturitytool? My default: yes.
10. **The nav.** The reference page uses `.c-topbar`, which is app chrome doing marketing duty, and the round flags that it wraps at the 24px front-door density. Launch with it as the other sites do, or ask for a marketing nav variant first? My default: launch with it.
11. **Roadmap.** Shall I create the site-build items in Roadmap under `Product = Content Operating Model` (Phase 0 to 2 as above, linked to ROAD-1343) and set the repo property on the product row once the repo exists?

---

## 9. What is left

Recorded 2026-09-07, after the scaffold landed.

**Blocked on Julius**

- **The diagram** (question 1). The published three-layer diagram is fire and sunshine; the accent is sapling-700. Recolour, or reconsider the accent. Nothing is blocked on it, and the framework page currently carries no diagram at all, which is the weakest thing about it.
- **The Netlify account** (question 3). Which account, and whether the free tier has room for a fourth site. The site is not deployed until this is answered.
- **MailerLite credentials.** `.env.example` names `MAILERLITE_API_KEY` and `MAILERLITE_GROUP_ID`. The form is not built yet and wants both, plus a decision on whether it posts directly from the browser or through a route (which on a static host means a small serverless function, and ADR-COM-0002 §5 says no Netlify Functions, so the honest options are MailerLite's own hosted form endpoint or waiting for the Railway move).

**Next in this repo**

- The toolkit journey pages, as their drafts land: Transforming, Concepts to borrow, Diagnosis, Design.
- ~~The three-layer stack as the reference page draws it~~ (done in the optimisation audit, 7 September). The fourteen cells are still a plain table with hairlines; the 7×2 specimen from the design round is what replaces it.
- ~~An OG image~~ (a placeholder exists; the designed share card is ledger item 23).
- The v0 toolkit's components, into `src/content/components/`, which is why that collection's schema exists already.

**Next elsewhere**

- Meta-repo entries: `products.md`, `family.md`, the ADR-0008 table row for `com`, the glossary, and COM added to `shared-infrastructure.md`'s consumer list for `@contentious/ui`.
- Roadmap rows for the site build, under `Product = Content Operating Model`, linked to ROAD-1343, and the repo property set on the product row.
- A Roadmap row against contentious-ui for the `mt` signature-check failure, which predates today and is not in that repo's CI.
- The Notion handoff from ADR-COM-0003 §5: a banner on the published drafts pointing here, and the product page slimmed to a hub.

## Sources read for this plan

Meta-repo: `README.md`, `docs/family.md`, `docs/products.md`, `docs/shared-infrastructure.md`, `docs/glossary.md`, ADR-0001 to 0016, `docs/plans/machine-door-plan.md`. contentious-ui: `CLAUDE.md`, `README.md`, `GAPS.md`, `CHANGELOG.md` to v0.13.3, `docs/theming.md`, `docs/ci-handoff.md`, `docs/design-system-sync.md`, ADR-UI-0006, `docs/plans/contentious-platform.md`, `skills/contentious-design/CHANGES.md`, `tokens/products.css`, the theme files, `brand/brands.json`, the check scripts. Sibling repos: contentmaturity (`CLAUDE.md`, `package.json`, ADR-CM-0006/0007, `docs/porting-seo-to-sibling-sites.md`, CI, hooks), contenthealthcheck (`CLAUDE.md`), contentious-astro (`.claude/CLAUDE.md`, `astro.config.mjs`, `netlify.toml`, CI, `BaseLayout.astro`, `llms.txt.ts`, `postbuild-validate.mjs`, content schemas), voicetoneandstyle (`CLAUDE.md`, ADR-VTS-0006, `netlify.toml`, `llms.txt`), maturitytool (`CLAUDE.md`, `docs/site.md`, `index.html`, `build.mjs`), content-layer (`README.md`, `CLAUDE.md`). Notion: the Content Operating Model product page, Intro, COM: Working reference v3, Rule and call, the canonical page draft v0.9, the COM docs audit and publication plan with its three addenda, the roadmap milestone and its seven items, Strategy as practised (September 2026), the Products page.
