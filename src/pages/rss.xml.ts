import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Releases of the framework, not blog posts. A version number is the unit,
 * which is what makes a feed the right shape for it: someone who cares about
 * the framework wants to know when it changes.
 */
export const GET: APIRoute = async (context) => {
  const releases = (await getCollection('releases')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );

  return rss({
    title: 'Content Operating Model releases',
    description: 'Every change to the Content Operating Model framework, release by release.',
    site: context.site ?? 'https://contentoperatingmodel.com',
    items: releases.map((release) => ({
      title: `Version ${release.data.version}`,
      pubDate: release.data.date,
      description: release.data.summary,
      link: `/changelog#v${release.data.version}`,
    })),
  });
};
