/**
 * One source, two renderings. The page renders an MDX file through Astro; the
 * Markdown twin renders the same file through this transform, which:
 *
 *  - drops import/export statements;
 *  - replaces known components with their Markdown rendering (the framework's
 *    data blocks become headings, lists and a table) and unwraps layout-only
 *    components (Band) to their children;
 *  - substitutes the expressions a page uses ({CELLS.length}) with their
 *    values, so the twin says "14 cells" and not "{CELLS.length} cells";
 *  - strips hand-set anchor markers ({#id}) from headings;
 *  - drops decorative images (empty alt) and keeps described ones as text.
 *
 * ADR-COM-0004 §1: the twin is the page, not a summary. Making it a transform
 * of the page's own source is what makes that true by construction.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkStringify from 'remark-stringify';
import { visit, SKIP } from 'unist-util-visit';
import type { Root, RootContent } from 'mdast';
import { HEADING_ID } from './remark-heading-ids.mjs';

type Attrs = Record<string, string | boolean | undefined>;

export interface TwinOptions {
  /** Component name → Markdown, null to drop it, undefined to unwrap to its
   *  children. Absent names are unwrapped. */
  components?: Record<string, (attrs: Attrs) => string | null | undefined>;
  /** JSX expression source → replacement text. Absent expressions are dropped. */
  expressions?: Record<string, string>;
}

type JsxNode = RootContent & {
  name?: string | null;
  attributes?: { type: string; name?: string; value?: unknown }[];
  children?: RootContent[];
};

function attrsOf(node: JsxNode): Attrs {
  const out: Attrs = {};
  for (const a of node.attributes ?? []) {
    if (a.type !== 'mdxJsxAttribute' || !a.name) continue;
    out[a.name] = a.value === null || a.value === undefined ? true : typeof a.value === 'string' ? a.value : String((a.value as { value?: string }).value ?? '');
  }
  return out;
}

const processor = unified().use(remarkParse).use(remarkMdx).use(remarkStringify, {
  bullet: '-',
  emphasis: '_',
  strong: '*',
  rule: '-',
  fences: true,
  resourceLink: true,
});

export function mdxToMarkdown(source: string, options: TwinOptions = {}): string {
  const components = options.components ?? {};
  const expressions = options.expressions ?? {};
  const tree = processor.parse(source) as Root;

  // Anything that is not the document: imports, exports.
  visit(tree, 'mdxjsEsm', (_node, index, parent) => {
    parent!.children.splice(index!, 1);
    return [SKIP, index];
  });

  // Components: render, drop or unwrap.
  visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node, index, parent) => {
    const jsx = node as JsxNode;
    const name = jsx.name ?? '';
    let replacement: RootContent[];
    const md = name in components ? components[name]!(attrsOf(jsx)) : undefined;
    if (md === undefined) replacement = jsx.children ?? [];
    else if (md === null) replacement = [];
    else replacement = [{ type: 'html', value: md } as RootContent];
    parent!.children.splice(index!, 1, ...replacement);
    return [SKIP, index];
  });

  // Expressions: {CELLS.length} and friends.
  visit(tree, ['mdxFlowExpression', 'mdxTextExpression'], (node, index, parent) => {
    const value = (node as { value: string }).value.trim();
    const isComment = value.startsWith('/*');
    const text = isComment ? undefined : expressions[value];
    const replacement: RootContent[] = text === undefined ? [] : [{ type: 'text', value: text } as RootContent];
    parent!.children.splice(index!, 1, ...replacement);
    return [SKIP, index];
  });

  // Headings: strip the anchor marker. Merge adjacent text nodes first so a
  // heading like "Version {x}, and what {#id}" ends in one text node.
  visit(tree, 'heading', (node) => {
    const merged: RootContent[] = [];
    for (const child of node.children) {
      const last = merged.at(-1);
      if (child.type === 'text' && last?.type === 'text') last.value += child.value;
      else merged.push(child);
    }
    node.children = merged as typeof node.children;
    const last = node.children.at(-1);
    if (last?.type === 'text') {
      last.value = last.value.replace(HEADING_ID, '');
      if (!last.value) node.children.pop();
    }
  });

  // Images: decorative ones carry nothing for a machine reader and their src
  // is a path into src/assets/ that does not exist at the twin's URL.
  visit(tree, 'image', (node, index, parent) => {
    const alt = (node.alt ?? '').trim();
    const replacement: RootContent[] = alt ? [{ type: 'emphasis', children: [{ type: 'text', value: alt }] } as RootContent] : [];
    parent!.children.splice(index!, 1, ...replacement);
    return [SKIP, index];
  });

  // Paragraphs left empty by the removals above.
  visit(tree, 'paragraph', (node, index, parent) => {
    if (node.children.length === 0) {
      parent!.children.splice(index!, 1);
      return [SKIP, index];
    }
  });

  return processor.stringify(tree).trim();
}
