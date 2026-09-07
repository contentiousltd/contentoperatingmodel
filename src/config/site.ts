/**
 * Site-wide configuration: the one place the site's name, URL, navigation and
 * family links are typed. Header, Footer, llms.txt, the structured data and
 * the Markdown twins all read from here, so none of them can disagree.
 */

export const SITE_URL = 'https://contentoperatingmodel.com';

export const SITE_NAME = 'Content Operating Model';

/** The practice behind the framework. Publisher in the structured data. */
export const PUBLISHER = {
  name: 'Contentious',
  url: 'https://contentious.ltd',
  description: 'the content strategy practice behind this framework',
} as const;

export interface NavItem {
  href: string;
  label: string;
}

/** Main navigation, in order. The header, the mobile menu and the footer's
 *  "This site" group render this list. */
export const NAV: readonly NavItem[] = [
  { href: '/framework', label: 'The framework' },
  { href: '/toolkit', label: 'The toolkit' },
  { href: '/changelog', label: 'Changelog' },
];

/** The sibling products, as the June SEO audit asked of every family site:
 *  descriptive anchors, and the same list in the footer and in llms.txt. */
export const FAMILY = [
  { href: 'https://contentmaturity.com', label: 'Content Maturity', description: "measures the system that produces an organisation's content" },
  { href: 'https://contenthealthcheck.com', label: 'Content Health Check', description: 'scores the content itself' },
  { href: 'https://voicetoneandstyle.com', label: 'Voice, Tone & Style', description: 'the style guide humans and machines both read' },
  { href: PUBLISHER.url, label: PUBLISHER.name, description: PUBLISHER.description },
] as const;

/** Copy for pages that render from data rather than from a content file. */
export const PAGES = {
  changelog: {
    title: 'Changelog',
    eyebrow: 'The framework',
    description: (version: string) =>
      `Every change to the Content Operating Model framework, release by release. Currently at version ${version}.`,
    intro: 'A call that fails becomes a rule in the next version. This is where that is recorded, release by release.',
  },
} as const;
