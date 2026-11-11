import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { PAGES, SITE_NAME, SITE_URL } from '@/config/site';
import { FRAMEWORK_VERSION } from '@/data/framework';
import { releases } from '@/lib/releases';

/**
 * Releases of the framework, not blog posts. A version number is the unit,
 * which is what makes a feed the right shape for it: someone who cares about
 * the framework wants to know when it changes.
 */
export const GET: APIRoute = async (context) =>
  rss({
    title: `${SITE_NAME} releases`,
    description: PAGES.changelog.description(FRAMEWORK_VERSION),
    site: context.site ?? SITE_URL,
    items: (await releases()).map((release) => ({
      title: `Version ${release.data.version}`,
      pubDate: release.data.date,
      description: release.data.summary,
      link: `/changelog#v${release.data.version}`,
    })),
    customData: '<language>en-gb</language>',
  });
