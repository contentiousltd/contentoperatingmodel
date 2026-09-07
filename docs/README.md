# Documentation

- **[adr/](adr/)** – architecture decisions for this repo, as `ADR-COM-NNNN`. Family-level decisions live in the [`contentious`](https://github.com/contentiousltd/contentious) meta-repo and are inherited.
- **[plans/](plans/)** – design and implementation detail. `project-setup.md` records how this repo was started, what was considered and what was rejected.
- **[design-deviations-2026-09-07.md](design-deviations-2026-09-07.md)** – every place this site departs from `@contentious/ui`, with what the system does, what the site does instead, and the decision Claude Design needs. It is the feedback channel to the design system and the list of overrides that go when the system answers. [ADR-COM-0005](adr/adr-com-0005-design-deviations-are-ledgered.md) is why it exists. Each entry's CSS is tagged `ledger N` in `src/styles/overrides.css`; `npm run check:ledger` keeps them in step.
- **[optimisations-2026-09-07.md](optimisations-2026-09-07.md)** – the audit of the site's own setup (bugs, the machine door, Astro features, CSS, accessibility, developer experience) with what was done for each item, and §7, the list of package asks for the design system that the ledger does not carry.

The roadmap is **not** here. Tasks, ideas and milestones live in the Notion Roadmap database with `Product = Content Operating Model`. See the Roadmap section of [CLAUDE.md](../CLAUDE.md).

## What belongs where

| Thing | Home |
| --- | --- |
| Why we chose A over B | An ADR here |
| How a piece of work will be done | A plan here |
| Where this site departs from the design system, and why | The deviations ledger here, and the `ledger N` block in `src/styles/overrides.css` |
| What the design system should ship for the next Astro consumer | §7 of the optimisation audit here, carried to Claude Design by ROAD-1368 |
| What the work is and where it stands | Notion Roadmap |
| What changed in this site | `CHANGELOG.md` |
| What changed in the framework | `src/content/releases/`, published at `/changelog` |
| The framework itself | `src/data/framework.ts` and `src/content/framework/` |
