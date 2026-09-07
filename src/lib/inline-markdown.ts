/**
 * Render a one-paragraph frontmatter field (a hero intro, a lede) as inline
 * HTML, so a link or emphasis in it works. The same string goes into the
 * Markdown twin untouched, because it is already Markdown. Same processor and
 * typographic treatment as the page body (astro.config.mjs).
 */
import { unified } from '@astrojs/markdown-remark';

const renderer = unified({ smartypants: true }).createRenderer({ syntaxHighlight: false });

export async function renderInline(markdown: string): Promise<string> {
  const { code } = await (await renderer).render(markdown.trim());
  // One paragraph in, one paragraph's worth of inline HTML out.
  return code.replace(/^\s*<p>/, '').replace(/<\/p>\s*$/, '');
}
