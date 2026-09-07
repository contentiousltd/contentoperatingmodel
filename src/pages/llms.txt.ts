import type { APIRoute } from 'astro';
import { twins } from '../lib/markdown-twins';
import { FRAMEWORK_VERSION } from '../data/framework';

/**
 * /llms.txt – the map (see llmstxt.org). Points at the Markdown twins rather
 * than the HTML pages, because the twins are the same documents without the
 * layout. Generated, so it cannot drift from what the site actually publishes.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? 'https://contentoperatingmodel.com/').replace(/\/$/, '');
  const all = await twins(base);

  const body = `# Content Operating Model

> An open framework for how a content function is designed, run and maintained in the AI era. Three layers, seven questions, and two registers: the rule set once and the call made every time. Currently at version ${FRAMEWORK_VERSION}, from Contentious.

The framework is free and stays free. Every page below is also published as Markdown at the same path with a .md extension; those are the same documents, not summaries.

## Pages

${all.map((twin) => `- [${twin.title}](${base}/${twin.path}): ${twin.description}`).join('\n')}

## Everything at once

- [llms-full.txt](${base}/llms-full.txt): every page above, concatenated.

## Elsewhere

- [Contentious](https://contentious.ltd): the content strategy practice behind this framework.
- [Content Maturity](https://contentmaturity.com): measures the system that produces an organisation's content.
- [Content Health Check](https://contenthealthcheck.com): scores the content itself.
- [Voice, Tone & Style](https://voicetoneandstyle.com): the style guide humans and machines both read.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
