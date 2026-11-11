/**
 * The Markdown twin of every published page.
 *
 * One object, many renderings: the same source produces the HTML page, this
 * file and the entries in llms.txt. A twin is not a summary and not a second
 * document – it is the page, in the format a machine reads without parsing
 * layout (ADR-COM-0004). Each page's twin is a transform of that page's own
 * MDX source (src/lib/mdx-to-markdown.ts) plus whatever the page template adds
 * around it (the hero's heading and intro, the version line), so nothing here
 * is typed a second time.
 *
 * Each twin carries front matter naming the canonical HTML URL and, for the
 * framework, the version, so a copy of it that travels still says what it is
 * and what it is a copy of.
 */
import { getCollection, getEntry } from 'astro:content';
import { PAGES, SITE_URL } from '@/config/site';
import { CELLS, FRAMEWORK_VERSION } from '@/data/framework';
import { mdxToMarkdown } from './mdx-to-markdown';
import { layersMarkdown, questionsMarkdown, ruleAndCallMarkdown, vocabularyMarkdown } from './framework-markdown';
import { latestRelease, releaseDate } from './releases';

export interface Twin {
  /** Route of the twin itself, without the leading slash: "framework.md". */
  path: string;
  /** Canonical HTML route: "/framework". */
  canonical: string;
  title: string;
  description: string;
  body: string;
}

const frontMatter = (fields: Record<string, string>) =>
  ['---', ...Object.entries(fields).map(([k, v]) => `${k}: ${JSON.stringify(v)}`), '---'].join('\n');

/** The components and expressions the content files use, as Markdown. */
const TWIN_OPTIONS = {
  components: {
    Layers: () => layersMarkdown(),
    Questions: () => questionsMarkdown(),
    RuleAndCall: () => ruleAndCallMarkdown(),
    Vocabulary: (attrs: Record<string, unknown>) => vocabularyMarkdown(Boolean(attrs.rejected)),
    // Decorative art, not content.
    Image: (attrs: Record<string, unknown>) => (typeof attrs.alt === 'string' && attrs.alt.trim() ? `_${attrs.alt.trim()}_` : null),
    // An eyebrow is a label for the eye; the heading under it says the same
    // thing to a machine. Any other <p> is unwrapped to its text.
    p: (attrs: Record<string, unknown>) => (/\bc-eyebrow\b/.test(String(attrs.class ?? '')) ? null : undefined),
  },
  expressions: {
    'CELLS.length': String(CELLS.length),
    FRAMEWORK_VERSION,
  },
};

let cached: Promise<Twin[]> | undefined;

/** Every twin. Computed once per build; three routes read it. */
export function twins(siteUrl: string = SITE_URL): Promise<Twin[]> {
  cached ??= build(siteUrl);
  return cached;
}

async function build(siteUrl: string): Promise<Twin[]> {
  const base = siteUrl.replace(/\/$/, '');
  const out: Twin[] = [];

  const home = await getEntry('pages', 'home');
  if (home) {
    out.push({
      path: 'index.md',
      canonical: '/',
      title: home.data.title,
      description: home.data.description,
      body: [
        frontMatter({ title: home.data.title, description: home.data.description, canonical: `${base}/` }),
        '',
        `# ${home.data.heading ?? home.data.title}`,
        '',
        ...(home.data.intro ? [home.data.intro.trim(), ''] : []),
        mdxToMarkdown(home.body ?? '', TWIN_OPTIONS),
      ].join('\n'),
    });
  }

  const framework = await getEntry('framework', 'framework');
  if (framework) {
    const release = await latestRelease();
    out.push({
      path: 'framework.md',
      canonical: '/framework',
      title: framework.data.title,
      description: framework.data.description,
      body: [
        frontMatter({
          title: framework.data.title,
          description: framework.data.description,
          canonical: `${base}/framework`,
          version: FRAMEWORK_VERSION,
          ...(release ? { released: release.data.date.toISOString().slice(0, 10) } : {}),
        }),
        '',
        `# ${framework.data.title}`,
        '',
        `Version ${FRAMEWORK_VERSION}${release ? ` · ${releaseDate(release)}` : ''} · an open framework from Contentious, being tested with real organisations before 1.0.`,
        '',
        mdxToMarkdown(framework.body ?? '', TWIN_OPTIONS),
      ].join('\n'),
    });
  }

  const toolkit = await getEntry('pages', 'toolkit');
  if (toolkit) {
    out.push({
      path: 'toolkit.md',
      canonical: '/toolkit',
      title: toolkit.data.title,
      description: toolkit.data.description,
      body: [
        frontMatter({ title: toolkit.data.title, description: toolkit.data.description, canonical: `${base}/toolkit` }),
        '',
        `# ${toolkit.data.heading ?? toolkit.data.title}`,
        '',
        ...(toolkit.data.intro ? [toolkit.data.intro.trim(), ''] : []),
        mdxToMarkdown(toolkit.body ?? '', TWIN_OPTIONS),
      ].join('\n'),
    });
  }

  const releases = (await getCollection('releases')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  out.push({
    path: 'changelog.md',
    canonical: '/changelog',
    title: PAGES.changelog.title,
    description: PAGES.changelog.description(FRAMEWORK_VERSION),
    body: [
      frontMatter({
        title: PAGES.changelog.title,
        description: PAGES.changelog.description(FRAMEWORK_VERSION),
        canonical: `${base}/changelog`,
      }),
      '',
      `# ${PAGES.changelog.title}`,
      '',
      PAGES.changelog.intro,
      '',
      ...releases.flatMap((release) => [
        `## Version ${release.data.version}`,
        '',
        `Released ${release.data.date.toISOString().slice(0, 10)}.`,
        '',
        release.data.summary,
        '',
        (release.body ?? '').trim(),
        '',
      ]),
    ].join('\n'),
  });

  return out;
}
