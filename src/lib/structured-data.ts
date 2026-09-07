/**
 * JSON-LD for every page: Organization and WebSite, plus whatever the page
 * adds. The framework page adds a DefinedTermSet built from the vocabulary in
 * src/data/framework.ts, which is what makes the framework's terms citable as
 * terms rather than as prose (ADR-COM-0004).
 */
export function buildJsonLd(siteUrl: string, extra: Record<string, unknown>[] = []) {
  const base = siteUrl.replace(/\/$/, '');

  const organization = {
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: 'Contentious',
    url: 'https://contentious.ltd',
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    url: base,
    name: 'Content Operating Model',
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'en-GB',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, ...extra],
  };
}
