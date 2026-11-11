/**
 * Hand-set heading anchors: `## Some heading {#some-id}`. In MDX, where a
 * brace opens an expression, the marker is escaped: `\{#some-id\}`. Both
 * arrive here as the text "{#some-id}" at the end of the heading.
 *
 * ADR-COM-0004 §5: anchors on the framework page are stable. Astro's default
 * slugger derives the id from the heading text, so rewording a heading breaks
 * every deep link into it. This plugin lets the author pin the id in the
 * source, strips the marker from the rendered text, and leaves headings
 * without a marker to the slugger as before. Astro's own rehype step keeps an
 * id that is already set (rehype-collect-headings checks before slugging).
 *
 * The twin generator (src/lib/markdown-twins.ts) drops the marker so the
 * Markdown rendering stays plain.
 */
import { visit } from 'unist-util-visit';

export const HEADING_ID = /\s*\{#([A-Za-z][\w-]*)\}\s*$/;

export default function remarkHeadingIds() {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      const last = node.children.at(-1);
      if (!last || last.type !== 'text') return;
      const match = last.value.match(HEADING_ID);
      if (!match) return;
      last.value = last.value.replace(HEADING_ID, '');
      if (!last.value) node.children.pop();
      node.data ??= {};
      node.data.hProperties = { ...(node.data.hProperties ?? {}), id: match[1] };
    });
  };
}
