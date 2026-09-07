# contentoperatingmodel.com

The public home of the **Content Operating Model**: a framework for how a content function is designed, run and maintained now that some of the work is done by machines.

The framework is free and stays free. This site publishes it, versioned, with a changelog, and in a form both people and machines can read.

- **Live:** https://contentoperatingmodel.com
- **Framework version:** 0.9 (see `src/data/framework.ts`)
- **Design system:** [`@contentious/ui`](https://github.com/contentiousltd/contentious-ui), pinned by exact tag

## Running it

```bash
npm install
npm run dev          # http://localhost:4321
npm run lint         # astro check + tsc + prose + tokens + ledger + design-system pin
npm run build        # build, then the postbuild machine-door validation
npm run preview      # serve dist/ on :4321, then in another terminal:
npm run measure      # computed sizes at 400, 1440 and 2192px (ADR-COM-0005)
```

Node 22.18 or later, per `.nvmrc` and Astro 7 (the validator imports `src/data/framework.ts` directly, which needs Node's type stripping).

Previewing the dev server from another machine, over Tailscale: Vite refuses hostnames it does not know, so put the MagicDNS name in `.env` as `DEV_ALLOWED_HOSTS` (see `.env.example`) and open `http://<name>:4321`. The dev server serves font files immutable so that resizing does not flash the fallback face; that is a dev-only plugin in `astro.config.mjs`, and the build does not need it. Layout claims are checked by measurement, not by eye: see [ADR-COM-0005](docs/adr/adr-com-0005-design-deviations-are-ledgered.md).

## How it is put together

```
src/
├── config/site.ts        the site's URL, name, navigation and family links
├── data/framework.ts     the framework AS DATA: layers, questions, registers,
│                         the fourteen cells, vocabulary, version, anchors.
│                         Every surface renders from this and nothing restates it.
├── content/              MDX, split by register
│   ├── pages/            the editorial register (home, the toolkit journey)
│   ├── framework/        the specification register: one file, the canonical
│   │                     page, with the data blocks placed as components
│   ├── releases/         the framework's own changelog, as versioned content
│   └── components/       the v0 toolkit, shaped question x register
├── components/
│   ├── framework/        Layers, Questions, RuleAndCall, Vocabulary: render
│   │                     from data/framework.ts, placed in framework.mdx
│   └── mdx/              Band (a marketing section) and AccentList
├── lib/                  the MDX-to-Markdown twin transform, the twins,
│                         structured data, git dates, the heading-anchor plugin
├── layouts/ pages/       Astro over the design system's c-* classes; routes
│                         include the .md twins, llms.txt and RSS
└── styles/               the package cascade, then site.css (the site's own)
                          and overrides.css (ledger-tagged deviations). Tokens only.
```

Two ideas do most of the work:

**The framework is one object.** `src/data/framework.ts` is the single source. The page, its Markdown twin, the JSON-LD vocabulary, `llms.txt` and the toolkit all render from it, so they cannot disagree. When the hosted library arrives it reads the same module.

**The machine door is a build output.** Every page ships a Markdown twin at the same path, stable anchors, JSON-LD and an `llms.txt` entry. The twin is a transform of the page's own MDX (`src/lib/mdx-to-markdown.ts`), so it is the page, not a summary. `scripts/postbuild-validate.mjs` fails the build if a twin is missing or its headings differ from the page's, if a canonical is wrong, if `llms.txt` and the twins disagree, or if a promised anchor is gone.

**Deviations from the design system are ledgered.** `src/styles/overrides.css` holds every rule the system should have supplied, each block tagged with its entry in [the ledger](docs/design-deviations-2026-09-07.md); `npm run check:ledger` keeps the two in step ([ADR-COM-0005](docs/adr/adr-com-0005-design-deviations-are-ledgered.md)).

## Decisions

Architecture decisions are in [`docs/adr/`](docs/adr/) as `ADR-COM-NNNN`. The setup plan, including what was considered and rejected, is [`docs/plans/project-setup.md`](docs/plans/project-setup.md).

Family-level decisions – identity, entitlement, auth realms, the design system – live in the [`contentious`](https://github.com/contentiousltd/contentious) meta-repo and are inherited, not restated here.

## Conventions

British English. Sentence case headings. No Oxford comma. No em dashes, ever. Brand tokens only, never a hex value. Internal links without trailing slashes. See [CLAUDE.md](CLAUDE.md).
