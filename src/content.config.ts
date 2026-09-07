import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content is separated by REGISTER, not just by folder. The audit's line –
 * "the homepage argues, the framework page specifies" – is a directory
 * boundary here, so the prose linter can be stricter on one than the other and
 * so nobody has to remember which voice a file is in.
 */

/** The editorial register: home, and the toolkit journey. */
const pages = defineCollection({
  loader: glob({ base: 'src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** Overrides the <title> tag; the title above is the page's H1. */
    metaTitle: z.string().optional(),
    /** 150-160 characters. The postbuild validator fails a page without one. */
    description: z.string(),
    /** Ordering within the toolkit journey. Absent for standalone pages. */
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * The specification register: the canonical framework page. A collection of
 * one, deliberately – it is a collection so the page's prose is authored as
 * markdown beside src/data/framework.ts rather than inside a component, and
 * one entry because ADR-COM-0003 gives the framework a single canonical URL.
 */
const framework = defineCollection({
  loader: glob({ base: 'src/content/framework', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    description: z.string(),
  }),
});

/**
 * The framework's own changelog. Versioned content, and a third kind of
 * changelog: not this repo's developer CHANGELOG.md and not a customer
 * "what's new". A release here is a change to the framework itself.
 */
const releases = defineCollection({
  loader: glob({ base: 'src/content/releases', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    version: z.string(),
    date: z.coerce.date(),
    /** One sentence for the feed and the changelog list. */
    summary: z.string(),
  }),
});

/**
 * The v0 toolkit's components. Shaped question × register from the start, so
 * the hosted library (ROAD-1347) reads these same files rather than a second
 * store. Empty until the toolkit is written; the schema is here so the first
 * component does not have to invent it.
 */
const components = defineCollection({
  loader: glob({ base: 'src/content/components', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    /** A question id from src/data/framework.ts. */
    question: z.enum(['why', 'what', 'for-whom', 'where', 'how', 'by-whom', 'when']),
    register: z.enum(['rule', 'call']),
    summary: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages, framework, releases, components };
