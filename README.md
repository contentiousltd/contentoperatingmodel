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
npm run lint         # astro check + tsc + prose + tokens
npm run build        # build, then the postbuild machine-door validation
```

Node 22.12 or later, per `.nvmrc` and Astro 7.

## How it is put together

```
src/
├── data/framework.ts     the framework AS DATA: layers, questions, registers,
│                         the fourteen cells, vocabulary, version. Every surface
│                         renders from this and nothing restates it.
├── content/
│   ├── pages/            the editorial register (home, the toolkit journey)
│   ├── framework/        the specification register (the canonical page)
│   ├── releases/         the framework's own changelog, as versioned content
│   └── components/       the v0 toolkit, shaped question x register
├── lib/                  structured data, and the Markdown twin generator
├── layouts/ components/  Astro over the design system's c-* classes
├── pages/                routes, including the .md twins, llms.txt and RSS
└── styles/               the package cascade, then page CSS. Tokens only.
```

Two ideas do most of the work:

**The framework is one object.** `src/data/framework.ts` is the single source. The page, its Markdown twin, the JSON-LD vocabulary, `llms.txt` and the toolkit all render from it, so they cannot disagree. When the hosted library arrives it reads the same module.

**The machine door is a build output.** Every page ships a Markdown twin at the same path, stable anchors, JSON-LD and an `llms.txt` entry. `scripts/postbuild-validate.mjs` fails the build if any of it is missing.

## Decisions

Architecture decisions are in [`docs/adr/`](docs/adr/) as `ADR-COM-NNNN`. The setup plan, including what was considered and rejected, is [`docs/plans/project-setup.md`](docs/plans/project-setup.md).

Family-level decisions – identity, entitlement, auth realms, the design system – live in the [`contentious`](https://github.com/contentiousltd/contentious) meta-repo and are inherited, not restated here.

## Conventions

British English. Sentence case headings. No Oxford comma. No em dashes, ever. Brand tokens only, never a hex value. Internal links without trailing slashes. See [CLAUDE.md](CLAUDE.md).
