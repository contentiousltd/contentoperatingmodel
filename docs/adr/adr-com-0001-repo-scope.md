# ADR-COM-0001: Repo scope and family placement

**Status:** Accepted
**Date:** 2026-09-07
**Related:** meta-repo ADR-0001 (meta-repo scope), ADR-0003 (product boundaries), ADR-0008 (ADR namespacing); [docs/plans/project-setup.md](../plans/project-setup.md)

## Context

The Content Operating Model has existed as a framework and a body of thinking since May 2026, tracked in Notion and, from 23 August, in the Roadmap database as the first product tracked there before it had a codebase. Its milestone (ROAD-1343) said "No repo, and it may not need one for a while", which was true while the deliverable was a downloadable toolkit.

It needs one now, because the site structure was settled on 5 September and the first two pages are drafted. What it does not yet have is a stated boundary, and the family has a specific history of that going wrong: ADR-0003 in the meta-repo exists because Content Ensemble's repo accumulated family-level decisions and started to look like the platform for everything.

Two questions have to be answered before the first commit rather than after: what belongs in this repo, and where the product sits in the family.

## Decision

**1. This repo is contentoperatingmodel.com and the framework it publishes.**

What lives here:

- The site: pages, layouts, components, styles, build and deploy configuration.
- The framework as data (`src/data/framework.ts`) and as prose (`src/content/framework/`), and its own versioned changelog.
- The toolkit's content, including the v0 component library, shaped question by register.
- Decisions about any of the above, as `ADR-COM-NNNN`.

What does not:

- **Family-level concerns** — identity, organisations, entitlement, auth realms, the design system, shared-infrastructure policy. Those are the meta-repo's, and are inherited rather than restated.
- **Design decisions.** Colour, spacing, components and their rules originate in the `contentious-design` skill and ship in `@contentious/ui` (suite ADR-0011). This repo chooses values from what the package offers and invents nothing.
- **Content Maturity's assessment.** The Diagnosis page routes to it; it does not reimplement it. A COM diagnosis and a CM assessment join up rather than compete (recorded in the Working reference, 5 September), and the mapping between CM's five areas and the fourteen cells is CM's work, tracked as ROAD-1366.
- **The Content Layer's agents.** COM specifies the operating model for the whole content function; the Content Layer operationalises the agentic part of it. Its repo governs that.

**2. Content Operating Model is a sibling product at family level, not a member of the Content Layer suite.**

The suite members are Voice Tone & Style, Content Health Check, Content Maturity and More Than Transactional: four products a customer subscribes to. COM is the layer above them, the framework they are instruments of. Notion's positioning is explicit about this ("design your Content Operating Model, run it on The Content Layer"), and the design system's product block records the same thing from the other side, giving COM the house's own limestone ground on the argument that it is the layer the suite answers to rather than a sibling of the four.

So `products.md` and `family.md` in the meta-repo list it alongside the Content Layer and Maturity Tool, not inside the suite.

**3. Publication first; the app is deferred, with the seam named.**

v0 and v1 of the site are content. The hosted component library (ROAD-1347), the blueprint generator (ROAD-1348) and any signed-in surface are later and are not designed for here beyond one thing: **the framework data module and the components collection are the contract those surfaces will consume.** That is why both are structured now rather than written as prose. When the app is scheduled, ADR-COM-0005 decides whether it lives in this repo behind a server or beside it on a subdomain.

**4. ADRs here are `ADR-COM-NNNN`.** The prefix matches the Roadmap product name and takes a row in suite ADR-0008's table, per its own rule that a repo acquiring ADRs takes a row first.

## Consequences

**Positive**

- The question "where is this decided?" has one answer per kind of decision, before there is any code to argue about.
- The sibling framing keeps the framework free and the products commercial, which is the commercial boundary the Working reference left open and the services pages settled in practice.
- Structuring the framework and the components now means the v1 library is a new surface on existing data, not a migration.

**Negative**

- Some duplication of the family's conventions into `CLAUDE.md`, as every sibling repo does. The alternative, a pointer with no content, has not worked: agents read the local file first.
- "Sibling, not suite member" is a claim about positioning that could change if COM is ever sold as part of a bundle. It would be an ADR here plus a meta-repo change, which is the right cost.

## Alternatives considered

- **A folder in the meta-repo.** Rejected: the meta-repo is documentation-only by ADR-0001, and this is a deployed site.
- **A page on contentious.ltd.** Rejected: the framework needs its own domain, its own version number and its own canonical URL to be citable as a standard rather than as one consultancy's opinion. Owning the term is the strategic point of the product.
- **Inside content-layer.** Rejected for exactly the reason ADR-0003 exists: it would make the Content Layer look like the parent of the framework, when the relationship is the other way round.
