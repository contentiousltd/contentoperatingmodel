# ADR-COM-0004: The machine door is a build output, and the framework versions as content

**Status:** Accepted
**Date:** 2026-09-07
**Related:** meta-repo ADR-0007 (machine doors, Proposed); Content Maturity ADR-CM-0007 and `docs/porting-seo-to-sibling-sites.md`; [ADR-COM-0003](adr-com-0003-framework-as-code.md)

## Context

The site structure settled on 5 September carried a requirement in one line: "Machine door per the May craft notes, across the site: section anchors per heading, structured data, llms.txt pointing at clean markdown renderings, one canonical URL for the framework."

That is not an SEO chore. The framework's argument is that an operating model has to be written down because an agent gets what is written down and nothing else. A framework that machines cannot read cleanly would be refuted by its own delivery.

Suite ADR-0007 covers machine doors for the products and is about actions: one definition rendered as an HTTP endpoint, an MCP tool and an in-app call. COM v0 has no actions, only documents. What carries across is the principle Voice Tone & Style states from the other side: **one object, many renderings.**

## Decision

**1. Every published page ships a Markdown twin at the same path.** `/framework` has `/framework.md`. The twin is the page, not a summary, generated from the same source, with front matter naming the canonical HTML URL and, for the framework, the version. A copy that travels still says what it is and what it is a copy of.

**2. Structured data on every page**, as a `@graph`: `Organization` and `WebSite` everywhere, and on the framework page a **`DefinedTermSet`** built from the vocabulary. That last one is what makes the framework's terms citable as terms rather than as prose, which is the point of having a vocabulary section at all.

**3. `llms.txt` and `llms-full.txt` are generated**, never hand-authored. Content Maturity's pipeline leaves `llms.txt` hand-written and it is the file most likely to go stale, because nothing fails when it does. Here it is derived from the same twin list the pages come from, so it cannot describe a site that does not exist.

**4. The framework versions as content, separately from the site.** `FRAMEWORK_VERSION` in the data, releases in `src/content/releases/`, published at `/changelog` with an RSS feed. This repo's `package.json` version and `CHANGELOG.md` are developer-facing and move independently: a CSS fix is not a framework release, and framework 1.0 is not a site release. Two changelogs is a pattern the family already runs (Content Maturity, Content Health Check); this is the same idea with the second one being versioned content rather than customer-facing marketing copy.

**5. Anchors on the framework page are hand-set and stable.** `#the-seven-questions`, `#rule-and-call`, `#vocabulary`, and one per question and layer from their ids in the data. Generated slugs change when a heading is reworded; a deep link into a specification must not.

**6. The build asserts all of it.** `scripts/postbuild-validate.mjs` fails on a page with no description, no canonical, no structured data, an internal trailing-slash link, an em dash, or a missing Markdown twin; and on a missing `llms.txt`, `llms-full.txt`, sitemap, `robots.txt` or feed. It also fails if the framework page's stated version has drifted from the data.

**7. AI crawlers are allowed**, explicitly, in `robots.txt`. `blockedAiCrawlers` is empty in the sibling products' SEO config for the same reason: being read by machines is the objective.

## Consequences

**Positive**

- A machine gets the framework as clean Markdown, with the version attached, in one fetch or per page.
- The requirement cannot rot: it is a build failure rather than a checklist item.
- When the hosted library needs a real machine door under suite ADR-0007, the data it would expose is already structured and already rendered several ways.

**Negative**

- Twins are a second route per page to keep working. Cheap while pages come from collections; if a page is ever hand-built without a twin the validator fails, which is the intended cost.
- `llms-full.txt` grows with the site and will eventually want trimming to the framework and toolkit rather than everything.

## Alternatives considered

- **HTML only, trusting crawlers to parse it.** Rejected: the framework's own argument is that what is written down explicitly is what machines can act on.
- **A JSON API of the framework.** Deferred, not rejected. The data module makes it a small addition when something actually consumes it. Building it now would be a machine door with no machine on the other side.
- **Hand-authored `llms.txt`, as the sibling products have.** Rejected: it is the file with the least feedback when it is wrong.
