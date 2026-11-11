import type { APIRoute } from 'astro';
import { FAMILY, SITE_NAME, SITE_URL } from '@/config/site';
import { FRAMEWORK_VERSION } from '@/data/framework';
import { twins } from '@/lib/markdown-twins';

/**
 * /llms.txt – the map (see llmstxt.org). Points at the Markdown twins rather
 * than the HTML pages, because the twins are the same documents without the
 * layout. Generated, so it cannot drift from what the site actually publishes.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? `${SITE_URL}/`).replace(/\/$/, '');
  const all = await twins(base);

  const body = `# ${SITE_NAME}

> An open framework for how a content function is designed, run and maintained in the AI era. Three layers, seven questions, and two registers: the rule set once and the call made every time. Currently at version ${FRAMEWORK_VERSION}, from Contentious.

The framework is free and stays free. Every page below is also published as Markdown at the same path with a .md extension; those are the same documents, not summaries.

## Pages

${all.map((twin) => `- [${twin.title}](${base}/${twin.path}): ${twin.description}`).join('\n')}

## Everything at once

- [llms-full.txt](${base}/llms-full.txt): every page above, concatenated.

## Elsewhere

${[...FAMILY].reverse().map((site) => `- [${site.label}](${site.href}): ${site.description}.`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
