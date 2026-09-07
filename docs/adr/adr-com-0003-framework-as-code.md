# ADR-COM-0003: The framework is code; Notion is the workshop

**Status:** Accepted
**Date:** 2026-09-07
**Related:** Content Maturity ADR-CM-0006 and ADR-CM-0008 (framework as code, schema as the reusable artefact); meta-repo ADR-0001 (Markdown only for authoritative content)

## Context

The framework exists today as seven Notion documents, of which the Working reference is the source of truth and the canonical page draft is derived from it. The September audit found the predictable result: definitions duplicated between the product page and the reference, two version ladders, an essay outline using a seven that is not the canonical seven, and a question order on the live pages that disagrees with the reference.

Every one of those is a copy drifting from another copy. The framework's whole promise is that it is a specification with a version and a changelog, and a specification that exists in four places with three orderings is not one.

Content Maturity solved the same problem in June. ADR-CM-0006 moved its framework out of Notion into typed code; ADR-CM-0008 refined the home and named the real insight, that **the reusable artefact is the schema, not the content**.

## Decision

**1. `src/data/framework.ts` is the framework.** The three layers, the seven questions in the live order with `why` marked as the hub, the two registers, the derived fourteen cells and the vocabulary including the terms deliberately not used. Typed, so a missing field is a build error.

**2. Everything renders from it.** The framework page, its Markdown twin, the `DefinedTermSet` in its structured data, `llms.txt`, the toolkit templates and, later, the hosted library and any machine door. **Nothing restates it.** The fourteen cells are derived from the questions and registers rather than typed, because a hand-maintained cross product is a copy waiting to drift.

**3. Prose is Markdown in `src/content/`, split by register.** `pages/` is the editorial voice, `framework/` the specification voice. The audit's line, that the homepage argues and the framework page specifies, is a directory boundary rather than a note in a style guide.

**4. No CMS.** Not Notion, not Storyblok, not Sanity. A single technical editor, a fixed schema, and a requirement that every change be a reviewable diff with a version attached.

**5. Notion becomes the workshop.** Drafting there is working well and continues. What changes is what happens after publication: **the published page is the repo's, and the Notion draft gets a banner pointing here.** The product page slims to a hub, as the audit already recommended. Notion keeps what it is good at, which is thinking, the Roadmap database and collaboration with people who do not use git.

**6. The framework's version is content.** `FRAMEWORK_VERSION` in the data, with releases in `src/content/releases/`. It is not this repo's semver: see ADR-COM-0004 §4.

## Consequences

**Positive**

- One place to change a question, a definition or an order, and every surface follows.
- Every framework change is a reviewable diff with a date, which is what "versioned, with a changelog" has to mean to be true.
- The v1 hosted library is a new surface over existing data rather than a migration.
- The build can assert things about the framework, and does: the postbuild validator fails if the page's stated version drifts from the data.

**Negative**

- Editing the framework needs a commit. Acceptable for one technical editor; GitHub's web editor covers a wording fix without a checkout.
- The Working reference in Notion and this file will both exist for a period. That is the drift risk the decision is meant to remove, so the reconciliation is a one-off task with an owner rather than an ongoing habit: reference v4 lands, this file is reconciled against it in a commit, and after that the repo is the source.

## Alternatives considered

- **Keep the reference in Notion as the source and copy into the site.** Rejected: it is precisely what produces the drift the audit found.
- **Markdown with front matter instead of TypeScript.** Tempting, and it is what the prose uses. Rejected for the structured half because the fourteen cells are derived and the vocabulary is typed: TypeScript catches a missing register or a question id that does not exist, and front matter does not.
- **A shared `@contentious/frameworks` package.** Rejected for now, and ADR-CM-0008 already worked out why: the reusable artefact across products is the schema, not one product's content. Suite ADR-0002's extraction trigger is three implementations, and this is the second.
