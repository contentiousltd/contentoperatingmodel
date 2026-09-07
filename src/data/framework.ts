/**
 * The Content Operating Model, as data.
 *
 * THIS FILE IS THE FRAMEWORK. Every surface renders from it: the framework
 * page, that page's Markdown twin, the DefinedTermSet in its structured data,
 * llms.txt, the toolkit templates, and – when they arrive – the hosted
 * component library and the machine door. Nothing here is typed twice
 * anywhere else, because two copies of a framework is exactly the drift the
 * Working reference exists to catch (ADR-COM-0003).
 *
 * Source: COM: Working reference v3 (19 Aug 2026) as amended by the two
 * settled additions of 4-5 Sept – rule and call, and `why` at the centre.
 * When the reference reaches v4, this file is the thing reconciled against it,
 * and the reconciliation is a commit, not a retype.
 *
 * The prose of the page lives beside this in src/content/framework/, because
 * prose is prose. What lives HERE is anything another surface has to be able
 * to enumerate, link to, or answer a question about.
 */

/** A layer of the model. Ordered bottom (essence) to top (content). */
export interface Layer {
  id: string;
  name: string;
  /** One sentence, for a card or a list item. */
  summary: string;
  /** What the layer holds, as the reference names them. */
  holds: string[];
  /** True for the two layers the organisation populates rather than the COM. */
  foundation: boolean;
}

/** One of the seven questions the content layer answers. */
export interface Question {
  id: string;
  /** With the question mark: "Why?", "For whom?". */
  name: string;
  /** The reference's short title for it: "strategic aims", "substance". */
  subtitle: string;
  /** One sentence. */
  summary: string;
  /** The rule register: settled once, strategically. */
  rule: string;
  /** The call register: made every time, operationally. */
  call: string;
  /** True for `why`, which sits at the centre with the other six around it. */
  hub?: boolean;
}

export interface Register {
  id: 'rule' | 'call';
  name: string;
  summary: string;
}

export interface VocabularyEntry {
  term: string;
  definition: string;
  /** Set when the term is deliberately NOT used, with the reason. */
  rejected?: boolean;
}

export const FRAMEWORK_VERSION = '0.9';

export const LAYERS: Layer[] = [
  {
    id: 'essence',
    name: 'Essence',
    summary:
      'Who the organisation is: its purpose, positions, values and voice. The layer that changes slowest and matters most.',
    holds: ['Purpose', 'Character', 'Relationships'],
    foundation: true,
  },
  {
    id: 'knowledge-and-opinion',
    name: 'Knowledge and opinion',
    summary:
      'What the organisation knows and thinks: its expertise, evidence, data and arguments. The reason anyone should listen.',
    holds: ['Frames', 'Data', 'Beliefs'],
    foundation: true,
  },
  {
    id: 'content',
    name: 'Content',
    summary:
      'What the organisation publishes: the pages, posts, guides and emails that carry the other two layers out into the world.',
    holds: ['The seven questions'],
    foundation: false,
  },
];

export const REGISTERS: Register[] = [
  {
    id: 'rule',
    name: 'The rule, set once',
    summary:
      'Settled once, strategically, so nobody relitigates it project by project.',
  },
  {
    id: 'call',
    name: 'The call, made every time',
    summary:
      'Made daily, operationally, by a person or an agent, against that rule.',
  },
];

/**
 * The seven questions, in the live order the two published pages share:
 * why, what, for whom, where, how, by whom, when. The reference's v3 order
 * differs and is the outlier; `why` is the hub either way.
 */
export const QUESTIONS: Question[] = [
  {
    id: 'why',
    name: 'Why?',
    subtitle: 'the purpose',
    summary:
      'What the content is for, and how you would know it was working. Every other question answers to this one.',
    rule: 'The purpose, and the measures that would show it working',
    call: 'Does this piece serve the purpose, or fill a slot?',
    hub: true,
  },
  {
    id: 'what',
    name: 'What?',
    subtitle: 'substance',
    summary: 'The content itself: its types, subjects and standards.',
    rule: 'Types, subjects and standards',
    call: 'Is this draft up to standard, and is it ours to say?',
  },
  {
    id: 'for-whom',
    name: 'For whom?',
    subtitle: 'audience and relationships',
    summary: 'The audience, what they need and how you know.',
    rule: 'The audience definition and its needs',
    call: 'Which reader wins the homepage today?',
  },
  {
    id: 'where',
    name: 'Where?',
    subtitle: 'structure',
    summary:
      'The channels and platforms the content lives on, and the ones it does not.',
    rule: 'The channels and the job each one does',
    call: 'Blog, newsletter or nowhere?',
  },
  {
    id: 'how',
    name: 'How?',
    subtitle: 'artefacts, interfaces, workflows and guardrails',
    summary: 'The machinery: workflows, tools, guardrails and handoffs.',
    rule: 'The workflow, its guardrails and handoffs',
    call: 'This draft, this check, this escalation, now',
  },
  {
    id: 'by-whom',
    name: 'By whom?',
    subtitle: 'responsibility and execution',
    summary:
      'The people and, now, the agents: who has the capability and who holds the responsibility.',
    rule: 'Capabilities and responsibilities, human and agent',
    call: 'Who, or what, drafts this, and who signs it off?',
  },
  {
    id: 'when',
    name: 'When?',
    subtitle: 'cadence and lifecycle',
    summary: 'The rhythm: cadences, triggers, review and retirement.',
    rule: 'Cadences, triggers and lifecycle',
    call: 'The anniversary has fired: review, update or retire?',
  },
];

/**
 * The fourteen cells, derived rather than typed. Crossing the seven questions
 * with the two registers is what gives the model its working surface, and the
 * v1.0 toolkit provides a template for each cell.
 */
export const CELLS = QUESTIONS.flatMap((question) =>
  REGISTERS.map((register) => ({
    id: `${question.id}-${register.id}`,
    question,
    register,
    answer: register.id === 'rule' ? question.rule : question.call,
  })),
);

export const VOCABULARY: VocabularyEntry[] = [
  {
    term: 'Content Operating Model (COM)',
    definition: 'The framework. Always capitalised.',
  },
  {
    term: 'Essence layer',
    definition: 'The deepest stratum: purpose, character, relationships.',
  },
  {
    term: 'Knowledge and opinion layer',
    definition: 'The stratum above essence: frames, data, beliefs.',
  },
  {
    term: 'The foundations',
    definition:
      'The essence and knowledge and opinion layers together, where a shorthand is needed.',
  },
  {
    term: 'Content layer',
    definition:
      'The working machinery on top of the foundations; everything that operates in service of them.',
  },
  {
    term: 'Rule',
    definition:
      'A question answered once, strategically, so nobody relitigates it project by project.',
  },
  {
    term: 'Call',
    definition:
      'A question answered every time, operationally, by a person or an agent, against the rule.',
  },
  {
    term: 'Strategic register / operational register',
    definition:
      'The collective nouns for rules and calls. Not layers: layer is taken, and overloading it is the drift this vocabulary exists to prevent.',
  },
  {
    term: 'Capability / responsibility / execution mode',
    definition:
      'The three things the model separates within the by whom question. Capabilities are stable, responsibility stays with named humans, execution mode is the dial that moves.',
  },
  {
    term: 'Artefacts / interfaces / workflows / guardrails',
    definition: 'The four practical components of the how question.',
  },
  {
    term: 'Semantic layer',
    definition:
      'Not used as canonical: overloaded by data-architecture usage. Available as an explanatory gloss for technical audiences.',
    rejected: true,
  },
  {
    term: 'Core layer',
    definition:
      'Not used: grammatically awkward, and lifting from core content strategy without acknowledgement is inappropriate.',
    rejected: true,
  },
  {
    term: 'Purpose layer',
    definition:
      'Not used: superseded by the three-layer model, where the foundations are essence plus knowledge and opinion. Kept as a historical note.',
    rejected: true,
  },
  {
    term: 'Axes',
    definition: 'Not used for the seven questions. Say questions.',
    rejected: true,
  },
];
