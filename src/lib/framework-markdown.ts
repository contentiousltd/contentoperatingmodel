/**
 * The framework's structured half rendered as Markdown. Each function is the
 * twin of one component in src/components/framework/, and the twin generator
 * maps the component's name to the function, so the page and the twin render
 * the same data in the same place.
 */
import { LAYERS, QUESTIONS, REGISTERS, VOCABULARY } from '@/data/framework';

export function layersMarkdown(): string {
  // Top-down on the page, as Layers.astro draws it.
  return [...LAYERS]
    .reverse()
    .map((layer) => `### ${layer.name}\n\n${layer.foundation ? 'Foundation.' : 'The working machinery.'} ${layer.summary}\n\nHolds: ${layer.holds.join(', ')}.`)
    .join('\n\n');
}

export function questionsMarkdown(): string {
  return QUESTIONS.map(
    (q) => `### ${q.name} ${q.subtitle}\n\n${q.summary}${q.hub ? '\n\nThis is the hub: the other six connect to it.' : ''}`,
  ).join('\n\n');
}

export function ruleAndCallMarkdown(): string {
  return [
    `| Question | ${REGISTERS.map((r) => r.name).join(' | ')} |`,
    `| --- | ${REGISTERS.map(() => '---').join(' | ')} |`,
    ...QUESTIONS.map((q) => `| ${q.name} | ${q.rule} | ${q.call} |`),
  ].join('\n');
}

export function vocabularyMarkdown(rejected = false): string {
  return VOCABULARY.filter((t) => Boolean(t.rejected) === rejected)
    .map((t) => `- **${t.term}** – ${t.definition}`)
    .join('\n');
}
