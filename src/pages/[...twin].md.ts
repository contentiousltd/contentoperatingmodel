import type { APIRoute, GetStaticPaths } from 'astro';
import { twins } from '../lib/markdown-twins';

const SITE = 'https://contentoperatingmodel.com';

export const getStaticPaths: GetStaticPaths = async () => {
  const all = await twins(SITE);
  return all.map((twin) => ({
    // "framework.md" -> /framework.md ; "index.md" -> /index.md
    params: { twin: twin.path.replace(/\.md$/, '') },
    props: { body: twin.body },
  }));
};

export const GET: APIRoute = ({ props }) =>
  new Response(props.body as string, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
