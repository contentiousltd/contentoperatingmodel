/**
 * The Markdown twin of every published page.
 *
 * One object, many renderings: the same source produces the HTML page, this
 * file and the entries in llms.txt. A twin is not a summary and not a second
 * document – it is the page, in the format a machine reads without parsing
 * layout (ADR-COM-0004).
 *
 * Each twin carries front matter naming the canonical HTML URL and, for the
 * framework, the version, so a copy of it that travels still says what it is
 * and what it is a copy of.
 */
import { getCollection, getEntry } from 'astro:content';
import {
  FRAMEWORK_VERSION,
  LAYERS,
  QUESTIONS,
  VOCABULARY,
} from '../data/framework';

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

/** The framework's structured half, rendered as Markdown rather than HTML. */
function frameworkTables(): string {
  const layers = LAYERS.map(
    (layer) => `### ${layer.name}\n\n${layer.summary}\n\nHolds: ${layer.holds.join(', ')}.`,
  ).join('\n\n');

  const questions = QUESTIONS.map(
    (q) => `### ${q.name} ${q.subtitle}\n\n${q.summary}${q.hub ? '\n\nThis is the hub: the other six connect to it.' : ''}`,
  ).join('\n\n');

  const grid = [
    '| Question | The rule, set once | The call, made every time |',
    '| --- | --- | --- |',
    ...QUESTIONS.map((q) => `| ${q.name} | ${q.rule} | ${q.call} |`),
  ].join('\n');

  const vocabulary = VOCABULARY.filter((t) => !t.rejected)
    .map((t) => `- **${t.term}** – ${t.definition}`)
    .join('\n');

  const rejected = VOCABULARY.filter((t) => t.rejected)
    .map((t) => `- **${t.term}** – ${t.definition}`)
    .join('\n');

  return [
    '## The three layers',
    layers,
    '## The seven questions',
    questions,
    '## Every question is answered twice',
    'A strategy sets the rule once; an operating model makes the call every time.',
    grid,
    '## Vocabulary',
    vocabulary,
    '### Terms deliberately not used',
    rejected,
  ].join('\n\n');
}

export async function twins(siteUrl: string): Promise<Twin[]> {
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
        frontMatter({
          title: home.data.title,
          description: home.data.description,
          canonical: `${base}/`,
        }),
        '',
        `# ${home.data.title}`,
        '',
        home.body ?? '',
      ].join('\n'),
    });
  }

  const framework = await getEntry('framework', 'framework');
  if (framework) {
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
        }),
        '',
        `# ${framework.data.title}`,
        '',
        `Version ${FRAMEWORK_VERSION}. An open framework from Contentious.`,
        '',
        framework.body ?? '',
        '',
        frameworkTables(),
      ].join('\n'),
    });
  }

  const releases = (await getCollection('releases')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  out.push({
    path: 'changelog.md',
    canonical: '/changelog',
    title: 'Changelog',
    description: 'Every change to the Content Operating Model framework, release by release.',
    body: [
      frontMatter({
        title: 'Changelog',
        description: 'Every change to the Content Operating Model framework, release by release.',
        canonical: `${base}/changelog`,
      }),
      '',
      '# Changelog',
      '',
      ...releases.flatMap((release) => [
        `## Version ${release.data.version}`,
        '',
        `Released ${release.data.date.toISOString().slice(0, 10)}.`,
        '',
        release.data.summary,
        '',
      ]),
    ].join('\n'),
  });

  out.push({
    path: 'toolkit.md',
    canonical: '/toolkit',
    title: 'The toolkit',
    description:
      'Building a content operating model: what changes, what to borrow from devops, where you are now, and what to design.',
    body: [
      frontMatter({
        title: 'The toolkit',
        description: 'Building a content operating model.',
        canonical: `${base}/toolkit`,
      }),
      '',
      '# The toolkit',
      '',
      'In development, arriving with version 1.0. It covers transforming, concepts to borrow from devops, diagnosis, and design: a template for each of the fourteen cells.',
    ].join('\n'),
  });

  return out;
}
