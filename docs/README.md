# Documentation

- **[adr/](adr/)** – architecture decisions for this repo, as `ADR-COM-NNNN`. Family-level decisions live in the [`contentious`](https://github.com/contentiousltd/contentious) meta-repo and are inherited.
- **[plans/](plans/)** – design and implementation detail. `project-setup.md` records how this repo was started, what was considered and what was rejected.

The roadmap is **not** here. Tasks, ideas and milestones live in the Notion Roadmap database with `Product = Content Operating Model`. See the Roadmap section of [CLAUDE.md](../CLAUDE.md).

## What belongs where

| Thing | Home |
| --- | --- |
| Why we chose A over B | An ADR here |
| How a piece of work will be done | A plan here |
| What the work is and where it stands | Notion Roadmap |
| What changed in this site | `CHANGELOG.md` |
| What changed in the framework | `src/content/releases/`, published at `/changelog` |
| The framework itself | `src/data/framework.ts` and `src/content/framework/` |
