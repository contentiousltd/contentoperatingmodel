/**
 * JSON-LD for every page: Organization and WebSite, plus whatever the page
 * adds. Prose pages add an Article with the dates git knows; the framework
 * page adds a DefinedTermSet built from the vocabulary in
 * src/data/framework.ts, which is what makes the framework's terms citable as
 * terms rather than as prose (ADR-COM-0004).
 */
import { FAMILY, PUBLISHER, SITE_NAME } from '../config/site';

export type JsonLdNode = Record<string, unknown>;

export function buildJsonLd(siteUrl: string, extra: JsonLdNode[] = []) {
  const base = siteUrl.replace(/\/$/, '');

  const organization = {
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: PUBLISHER.name,
    url: PUBLISHER.url,
    // The family's other sites, all Contentious's own.
    sameAs: FAMILY.map((site) => site.href).filter((href) => href !== PUBLISHER.url),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: SITE_NAME,
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'en-GB',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, ...extra],
  };
}

export interface ArticleInput {
  /** Absolute canonical URL of the page. */
  url: string;
  headline: string;
  description: string;
  /** ISO dates from git; either may be undefined on a fresh clone. */
  published?: string;
  modified?: string;
  /** The framework's version, for the framework page only. */
  version?: string;
}

/** An Article node for a prose page, with the dates git knows about it. */
export function articleNode(base: string, input: ArticleInput): JsonLdNode {
  const node: JsonLdNode = {
    '@type': 'Article',
    '@id': `${input.url}#article`,
    mainEntityOfPage: input.url,
    headline: input.headline,
    description: input.description,
    inLanguage: 'en-GB',
    author: { '@id': `${base.replace(/\/$/, '')}/#organization` },
    publisher: { '@id': `${base.replace(/\/$/, '')}/#organization` },
    isPartOf: { '@id': `${base.replace(/\/$/, '')}/#website` },
  };
  if (input.published) node.datePublished = input.published;
  if (input.modified) node.dateModified = input.modified;
  if (input.version) node.version = input.version;
  return node;
}
