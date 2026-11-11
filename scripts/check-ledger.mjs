#!/usr/bin/env node
/**
 * The deviations ledger and the override CSS must agree.
 *
 * ADR-COM-0005: every rule in src/styles/overrides.css exists because the
 * design system does not yet answer something, and each block is tagged with
 * the ledger item it implements: a comment containing `ledger 12` (one number
 * or several, `ledger 4, 17`). This script fails when a tagged item has no
 * ledger entry (the CSS is inventing) and lists ledger items that no longer
 * have CSS (the system answered; the entry can move to "Answered"). It is the
 * mechanical step behind "delete when the system answers".
 */
import { readFileSync } from 'node:fs';

const LEDGER = 'docs/design-deviations-2026-09-07.md';
const OVERRIDES = 'src/styles/overrides.css';

const ledger = readFileSync(LEDGER, 'utf8');
const css = readFileSync(OVERRIDES, 'utf8');

// Numbered items: "12. **Title.**" at the start of a line.
const items = new Set([...ledger.matchAll(/^(\d+)\.\s+\*\*/gm)].map((m) => Number(m[1])));
// Tags in the CSS: "ledger 12" or "ledger 4, 17" inside a comment.
const tagged = new Set(
  [...css.matchAll(/ledger\s+(\d+(?:\s*,\s*\d+)*)/gi)].flatMap((m) => m[1].split(/\s*,\s*/).map(Number)),
);

// Every comment block with a rule after it should carry a tag. Count top-level
// rule groups (a `{` at indentation 0 or 2 preceded by a selector) that have
// no `ledger N` in the comment immediately before them.
const untagged = [];
const blocks = css.split(/\n(?=\/\*)/);
for (const block of blocks) {
  if (!/\{/.test(block)) continue; // comment-only
  if (!/ledger\s+\d/i.test(block)) untagged.push(block.trim().split('\n')[0].slice(0, 70));
}

let failed = false;
for (const n of [...tagged].sort((a, b) => a - b)) {
  if (!items.has(n)) {
    console.error(`  ✗ overrides.css tags ledger ${n}, which is not in ${LEDGER}`);
    failed = true;
  }
}
for (const line of untagged) {
  console.error(`  ✗ overrides.css has an untagged rule: ${line}`);
  failed = true;
}
const closed = [...items].filter((n) => !tagged.has(n)).sort((a, b) => a - b);
if (closed.length) {
  console.log(`  · ledger items with no override CSS (answered, markup-only or informational): ${closed.join(', ')}`);
}

if (failed) {
  console.error('\ncheck:ledger failed. Every override carries its ledger number, and every number exists.');
  process.exit(1);
}
console.log(`✓ check:ledger — ${tagged.size} ledger item(s) implemented in overrides.css, all recorded`);
