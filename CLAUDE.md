# Claude Code Instructions – Content Operating Model

## What this is

`contentoperatingmodel.com`: the public home of the Content Operating Model framework. Today it is a publication, an Astro static site on Netlify. Later it grows a hosted component library and a blueprint generator, at which point it grows a server. See [docs/adr/adr-com-0001-repo-scope.md](docs/adr/adr-com-0001-repo-scope.md) for the boundary and [docs/plans/project-setup.md](docs/plans/project-setup.md) for how it was set up and why.

## Suite architecture (read before any cross-product work)

COM is one product in the **Contentious family**. Decisions about anything that spans products – **identity, organisations, membership, entitlement and billing across products, auth realms, the design system** – are owned at the **suite level, not here**. Their source of truth is the meta-repo:

- **`~/Projects/contentious/docs/adr/`** (4-digit ADRs). Load-bearing here: **ADR-0011** (design-system architecture: the skill is the origin, products choose values and never invent names), **ADR-0012** (CSS strategy: token-first `c-*` is the reference dialect), **ADR-0013** (no dark mode), **ADR-0014** (exact tag pins, loud staleness), **ADR-0004** and **ADR-0006** when auth arrives.
- Shared code: **`~/Projects/packages/contentious-ui`** (`@contentious/ui`) and **`~/Projects/packages/contentious-auth`**.

**Before designing anything touching those concerns, read the relevant meta-repo ADR first** (`/add-dir ~/Projects/contentious` if it is not in the workspace). If a decision here conflicts with a suite ADR, surface it rather than re-deciding locally.

## The framework is data, not prose in a component

`src/data/framework.ts` is the single source for the layers, the seven questions, the two registers, the fourteen cells, the vocabulary and the page's promised anchors (`ANCHORS`). The framework page, its Markdown twin, the JSON-LD `DefinedTermSet`, `llms.txt` and the toolkit all render from it. **Never type a question, a register or a definition anywhere else.** Two copies of a framework is the drift the Working reference exists to catch (ADR-COM-0003).

Prose lives in `src/content/`, split by register: `pages/` is the editorial voice (home, the toolkit journey), `framework/` is the specification voice. Content files are MDX. The framework page is one file, `framework/framework.mdx`: its prose in the specification voice, with the data-driven blocks placed where they belong as components from `src/components/framework/` (`<Layers />`, `<Questions />`, `<RuleAndCall />`, `<Vocabulary />`) and its sections wrapped in `<Band>`. Headings carry hand-set anchors as `\{#id\}` (escaped braces, because MDX reads a brace as an expression). **Never put prose in a page template**; a page's `.astro` renders its content file and nothing more.

Site-wide strings live in `src/config/site.ts`: the URL, the name, the navigation and the family links. Header, footer, `llms.txt` and the structured data read from it.

The framework's own version (`FRAMEWORK_VERSION`, 0.9 today) is **content** and is not this repo's semver. Changing it means adding a release in `src/content/releases/`.

## Code conventions

- **British English** throughout – organisation, analyse, colour, unauthorised.
- **Sentence case for headings**, not Title Case.
- **No Oxford comma** in prose and copy.
- **No em dashes, ever** – use an en dash (–) or rephrase. Enforced by `npm run lint:prose` (fatal in CI) and again on the built HTML by `scripts/postbuild-validate.mjs`.
- **Brand tokens only** – no hex, no palette copies, no invented values. Colour comes from `@contentious/ui`; this repo defines no palette. Enforced by `npm run check:tokens`.
- **`<html data-product="com">`** is the whole theming integration. Without it every token silently falls back to Content Health Check's.
- **Internal links are slash-free** – `/framework`, never `/framework/`. The build emits `framework.html`, Netlify serves it at `/framework`, and the edge function 301s the slashed form. A slashed internal link costs a redirect hop and fails the postbuild check.
- **Invoke the `contentious-design` skill before touching UI.** A hook denies the first UI edit in a session until you have. Never originate a visual decision; if the design system does not answer it, raise it in `contentious-ui`'s `GAPS.md` and stop.

## Typography

- Headings use `font-display` (Bely Display) and are **never bold** – it has inherent display weight.
- Base font size is `var(--base-font-size)`, **20px**, set in `src/styles/overrides.css` over the theme's 24px: the brand's marketing value read as too big on a large monitor (28.8px body copy at the top responsive step), and 20px gives 24px there, 22px on a laptop, 18px on a phone. Density is derived from deployment mode, not chosen. When the app arrives it takes 19px, and that is a property of those surfaces, not a change here. The override is recorded in `docs/design-deviations-2026-09-07.md` (item 8) for the signature block to settle.
- **One type scale: the roles.** Sizes are `--t-*` (`--t-title`, `--t-lede`, `--t-body`, `--t-hint` …), never the package's em-based `type-*` classes or `--font-size-h*`, which are anchored to the reset's 17.6px and disagree with the roles on the same page (ledger items 26 and 27). Page titles take `.page-title`, ledes `.page-lede`, small metadata `.meta`.
- Component styling comes from the design system's `c-*` classes. This site's CSS is two files, split by fate: `src/styles/site.css` is the site's own layout and the pieces the COM reference page builds from plain markup (the layer stack); `src/styles/overrides.css` is every rule the design system should have supplied, each block tagged `ledger N` with its entry in the deviations ledger. `npm run check:ledger` fails if a block has no number or a number has no entry. When the system answers an item, delete its block and move the entry to Answered.
- **Media queries use range syntax** (`(width < 48rem)`), never `max-width: 47.99rem`. 48rem is the system's chrome breakpoint, 52rem its hero breakpoint.
- **Images go through `astro:assets`.** `image.layout` is `constrained` in `astro.config.mjs`, so every `<Image>` and every markdown image gets a `srcset` and `sizes` from its `width`; fixed-size marks use `layout="fixed"` with `width` and `height`. Never hand-write `widths` or `sizes`. The header mark imports from the package's `brand/` folder, not a local copy.
- **Measure, don't eyeball.** `npm run preview` in one terminal and `npm run measure` in another prints computed sizes at 400, 1440 and 2192px for a set of selectors (ADR-COM-0005). A layout claim in the ledger or a commit message carries its numbers.

## Machine door

Every published page ships with a Markdown twin at the same path (`/framework` → `/framework.md`), stable hand-set anchors, JSON-LD (Organization, WebSite, an Article with the dates git knows, and the framework's DefinedTermSet), and an entry in `llms.txt`. The twin is generated from the page's own MDX by `src/lib/mdx-to-markdown.ts`, which swaps each data component for its Markdown rendering (`src/lib/framework-markdown.ts`), so the twin is the page by construction. `scripts/postbuild-validate.mjs` fails the build if a twin is missing, if its h2s differ from the page's, if a canonical is wrong, if `llms.txt` and the twins disagree, or if an anchor in `ANCHORS` is missing. This is the product's whole reason for existing in the form it takes, so treat a validator failure as a content bug, not a build annoyance.

## Checks

```bash
npm run lint             # astro check + tsc + prose + tokens + ledger + ui-current
npm run build            # build, then postbuild validation
npm run check:ledger     # overrides.css tags ↔ the deviations ledger
npm run check:ui-current # is the pinned @contentious/ui the latest tag?
npm run measure          # computed sizes at three widths, against npm run preview
```

The design gate hook (`.claude/hooks/require-design-skill.py`) covers `Edit`, `Write` and `Bash`: a shell command that names a file under `src/` ending `.astro`, `.css`, `.tsx` or `.jsx` together with a write verb (`sed -i`, a redirect, `tee`, `cp`, `mv`, a heredoc, `python`, `node`) is denied until the `contentious-design` skill has been invoked in the session.

## Hosting

Netlify, from `main`. The move to Railway is decided in advance rather than deferred: see [ADR-COM-0002](docs/adr/adr-com-0002-astro-static-site.md) for the trigger, the sized work and the named list of Netlify-specific things (the edge function, the `[[headers]]` blocks, the docs-only build skip, deploy previews). **Do not add Netlify Functions or Netlify Forms** – each would grow that list.

## Versioning and releases

Product semver in `package.json`, starting at `0.1.0`. MAJOR for a new pillar, MINOR for a new page or feature, PATCH for fixes and copy. `CHANGELOG.md` is developer-facing. The framework's changelog at `/changelog` is a different thing entirely: versioned content, authored in `src/content/releases/`.

## ADRs

`docs/adr/`, as `adr-com-NNNN-slug.md`. **ADR identifiers are namespaced by product** (suite ADR-0008): this repo's are `ADR-COM-NNNN`; a bare four-digit `ADR-NNNN` always means a suite-level decision in the meta-repo. Sibling products use `ADR-CHC-`, `ADR-CM-`, `ADR-VTS-`, `ADR-MT-`, `ADR-ENS-`. When citing another repo's ADR, name the repo too.

## Roadmap — the tracker lives in Notion

Tasks, ideas and milestones for every product in the suite live in **one Notion database: Roadmap** (Products and tools → Products). There is no `BACKLOG.md` in this repo and there should not be: it was created after the 22 August 2026 cutover.

- **Log new work directly in Roadmap**, with `Product = Content Operating Model`. Creating the row assigns its id.
- **Ids are `ROAD-1204`**, permanent and never reused. Any item opens at `notion.so/ROAD-1204`.
- **Status is a field:** In progress = started but unfinished · Next = decided and ready, not started · Planned = decided, not scheduled · Idea = not decided · Parked = deliberately not doing · Done.
- **Summary is one or two plain sentences** — what is wanted and why it matters. Findings and file paths go in the page body.
- **The dev plan stays in the repo.** `docs/plans/*.md` holds design work and implementation detail; Roadmap holds what the work is and where it stands.

### Keeping it current

- **Work starts** → In progress, before the first commit. If there is no row, make one.
- **Work ships** → Done, with a Done date.
- **Decided against** → Parked, with the reason in the Summary.
- **Found mid-work** → write the row immediately, at whatever status is honest.

## Writing prose for this site

The two registers are a real distinction and the folder boundary enforces it. `src/content/pages/` argues; `src/content/framework/` specifies. When drafting or revising either, use the `write-for-contentious` skill – this is brand-voice content published under the Contentious name.
