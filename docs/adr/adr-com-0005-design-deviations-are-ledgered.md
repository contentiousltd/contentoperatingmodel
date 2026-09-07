# ADR-COM-0005: Design deviations are local, explicit and ledgered

**Status:** Accepted
**Date:** 2026-09-07
**Related:** suite ADR-0011 (the skill is the origin; products choose values and never invent names), suite ADR-0012 (CSS strategy), [CLAUDE.md](../../CLAUDE.md), [docs/design-deviations-2026-09-07.md](../design-deviations-2026-09-07.md), `contentious-ui/docs/design-system-sync.md`

## Context

This product is built on `@contentious/ui`, and the suite's rule is that no product originates a visual decision: if the design system does not answer a question, the product raises it and stops.

The first day of building the front door met that rule head on. The package had never shipped its marketing kit to any consumer (an invalid `@import`, fixed in v0.14.1). The kit, once present, disagreed with the library it ships in about what a container is, what `.c-section` means and how big an h2 is. The specimen pages had never been rendered at a phone width or on a wide monitor. And the proper loop, report in `design-system-sync.md` → Claude Design fixes → export → release → re-pin, took a working day to return one round, at the end of which the site was still not usable.

Julius's call at that point was to fix locally and keep going. This ADR records how that is done so it does not become silent drift.

## Decision

1. **A deviation is allowed** when the design system does not answer the question, answers it wrongly (measured, not felt), or when the product owner overrules it. Taste calls are the owner's; the first two need numbers.
2. **A deviation lives in one place**, `src/styles/site.css` (or the component's markup when it is structural), never in a token override scattered through components. Component styling still comes from the system's `c-*` classes; `site.css` overrides, it does not re-implement.
3. **Every deviation carries its reason in a comment on the rule**: what the system does, what this does instead, whose call it was and when.
4. **Every deviation is an item in the ledger**, `docs/design-deviations-<date>.md`, with the measurement that found it and the decision Claude Design needs. The ledger is the feedback channel to the design system, alongside `contentious-ui/docs/design-system-sync.md`'s Open list for anything found while reading the package.
5. **A deviation is temporary by definition.** When the system answers, the override goes and the ledger item is closed. An override the system has answered and that is still here is a bug.
6. **Values are still never invented.** A deviation chooses among the system's tokens and roles, or takes a sibling site's measured value and says which; a raw number appears only when no token exists, and then the ledger asks for one.
7. **Alignment is verified by measurement**, not by looking: `getBoundingClientRect` at the widths that matter, including the owner's real monitor and a phone. A layout claim without a number is not a claim.

## Consequences

- The site can ship while the design system catches up, and the design system gets a single, complete, measured list rather than one export round per finding.
- `site.css` grows, and it will look like a product doing its own design. The comments and the ledger are what make it not that; reviewers should read a rule without a reason as a defect.
- Some ledger items will be answered by the system changing and some by the product being told no. Either closes the item.
- The day's structural findings, which no product override should own, are named for the system: one container convention (padding inside the box vs gutter outside the column), one owner per class name (`.c-section`, `.c-card`, `.c-hero__*` are defined on both sides of the package), a consumer build in the system's CI, and font smoothing in `base.css`.

## Alternatives considered

- **Wait for the loop.** The rule as written. Rejected on the day by the owner after it consumed the day; the loop remains the right shape for design that originates in the design project, and this ADR does not replace it for that.
- **Fork the design system locally.** Copy the skill's CSS into the repo and edit it. Rejected: it hides the deviations inside a copy, breaks `check:ui-current` and the exact-tag pin (suite ADR-0014), and the next export overwrites nothing while the copy drifts forever.
- **Override silently.** Fix in `site.css` with no comment and no ledger. Rejected: that is the drift the suite rules exist to prevent, and it leaves Claude Design with nothing to act on.
- **Log in the Notion Roadmap instead of a ledger.** Rejected: the Roadmap holds what the work is and where it stands, not per-rule findings with measurements; the ledger is a document Claude Design can read from the repo.
