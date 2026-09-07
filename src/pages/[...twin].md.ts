import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { twins } from '@/lib/markdown-twins';

export const getStaticPaths = (async () => {
  const all = await twins(import.meta.env.SITE);
  return all.map((twin) => ({
    // "framework.md" -> /framework.md ; "index.md" -> /index.md
    params: { twin: twin.path.replace(/\.md$/, '') },
    props: { body: twin.body },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props> = ({ props }) =>
  new Response(props.body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
