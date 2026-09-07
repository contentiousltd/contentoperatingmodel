import type { APIRoute } from 'astro';
import { twins } from '../lib/markdown-twins';

/** Every Markdown twin, concatenated, for a client that wants one fetch. */
export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? 'https://contentoperatingmodel.com/').replace(/\/$/, '');
  const all = await twins(base);

  const body = all
    .map((twin) => `<!-- ${base}${twin.canonical} -->\n\n${twin.body}`)
    .join('\n\n---\n\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
