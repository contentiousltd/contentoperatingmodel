# Claude Code Instructions – Content Operating Model

## What this is

`contentoperatingmodel.com`: the public home of the Content Operating Model framework. Today it is a publication, an Astro static site on Netlify. Later it grows a hosted component library and a blueprint generator, at which point it grows a server. See [docs/adr/adr-com-0001-repo-scope.md](docs/adr/adr-com-0001-repo-scope.md) for the boundary and [docs/plans/project-setup.md](docs/plans/project-setup.md) for how it was set up and why.

## Suite architecture (read before any cross-product work)

COM is one product in the **Contentious family**. Decisions about anything that spans products – **identity, organisations, membership, entitlement and billing across products, auth realms, the design system** – are owned at the **suite level, not here**. Their source of truth is the meta-repo:

- **`~/Projects/contentious/docs/adr/`** (4-digit ADRs). Load-bearing here: **ADR-0011** (design-system architecture: the skill is the origin, products choose values and never invent names), **ADR-0012** (CSS strategy: token-first `c-*` is the reference dialect), **ADR-0013** (no dark mode), **ADR-0014** (exact tag pins, loud staleness), **ADR-0004** and **ADR-0006** when auth arrives.
- Shared code: **`~/Projects/packages/contentious-ui`** (`@contentious/ui`) and **`~/Projects/packages/contentious-auth`**.

**Before designing anything touching those concerns, read the relevant meta-repo ADR first** (`/add-dir ~/Projects/contentious` if it is not in the workspace). If a decision here conflicts with a suite ADR, surface it rather than re-deciding locally.

## The framework is data, not prose in a component

`src/data/framework.ts` is the single source for the layers, the seven questions, the two registers, the fourteen cells and the vocabulary. The framework page, its Markdown twin, the JSON-LD `DefinedTermSet`, `llms.txt` and the toolkit all render from it. **Never type a question, a register or a definition anywhere else.** Two copies of a framework is the drift the Working reference exists to catch (ADR-COM-0003).

Prose lives in `src/content/`, split by register: `pages/` is the editorial voice (home, the toolkit journey), `framework/` is the specification voice.

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
- Base font size is `var(--base-font-size)`, **24px**, because every surface this product owns today is a front door. Density is derived from deployment mode, not chosen. When the app arrives it takes 19px, and that is a property of those surfaces, not a change here.
- Component styling comes from the design system's `c-*` classes. `src/styles/site.css` is for page layout only.

## Machine door

Every published page ships with a Markdown twin at the same path (`/framework` → `/framework.md`), stable hand-set anchors, JSON-LD, and an entry in `llms.txt`. `scripts/postbuild-validate.mjs` fails the build if any of that is missing. This is the product's whole reason for existing in the form it takes, so treat a validator failure as a content bug, not a build annoyance.

## Checks

```bash
npm run lint            # astro check + tsc + prose + tokens
npm run build           # build, then postbuild validation
npm run check:ui-current # is the pinned @contentious/ui the latest tag?
```

## Hosting

Netlify, from `main`. The move to Railway is decided in advance rather than deferred: see [ADR-COM-0002](docs/adr/adr-com-0002-astro-static-site.md) for the trigger, the sized work and the named list of Netlify-specific things. **Do not add Netlify Functions or Netlify Forms** – each would grow that list.

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
