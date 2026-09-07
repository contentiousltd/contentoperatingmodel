# Architecture decision records

Significant technical decisions for contentoperatingmodel.com, with the reasoning that produced them, so future contributors do not have to reconstruct it.

**ADR identifiers are namespaced by product** (suite ADR-0008): these are `ADR-COM-NNNN`. A bare four-digit `ADR-NNNN` means a family-level decision in the [`contentious`](https://github.com/contentiousltd/contentious) meta-repo, not one of these. Sibling products use `ADR-CHC-`, `ADR-CM-`, `ADR-VTS-`, `ADR-MT-`, `ADR-ENS-`. When citing another repo's ADR, name the repo too: relative links do not cross repository boundaries.

## Index

| # | Decision | Status | Date |
|---|---|---|---|
| [COM-0001](adr-com-0001-repo-scope.md) | Repo scope and family placement | Accepted | 2026-09-07 |
| [COM-0002](adr-com-0002-astro-static-site.md) | Astro static site on Netlify, with the move to Railway sized in advance | Accepted | 2026-09-07 |
| [COM-0003](adr-com-0003-framework-as-code.md) | The framework is code; Notion is the workshop | Accepted | 2026-09-07 |
| [COM-0004](adr-com-0004-machine-door.md) | The machine door is a build output, and the framework versions as content | Accepted | 2026-09-07 |
| [COM-0005](adr-com-0005-design-deviations-are-ledgered.md) | Design deviations are local, explicit and ledgered | Accepted | 2026-09-07 |

## When to write one

- You chose technology A over technology B.
- You adopted a pattern that is not obvious.
- You made a trade-off someone might later question.
- You decided *not* to do something that looks like it should be done.

Decisions affecting only this product live here. Decisions affecting two or more products in the family go in the meta-repo.

## Template

```markdown
# ADR-COM-NNNN: Title

**Status:** Proposed | Accepted | Superseded by ADR-COM-NNNN
**Date:** YYYY-MM-DD
**Related:** other ADRs, plans or docs

## Context
What prompted this decision? What forces are at play?

## Decision
What did we decide? Enumerate the specific points.

## Consequences
What follows, both positive and negative?

## Alternatives considered
What else was on the table, and why it lost.
```
