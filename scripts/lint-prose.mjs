#!/usr/bin/env node
/**
 * House style, checked. Em dashes fail; the heuristics advise.
 *
 * The suite rule is en dashes, never em dashes, and it is enforced in CI in
 * every sibling repo. contentious-astro also validates the built HTML for them,
 * because CMS content bypasses a source linter; this site has no CMS, so the
 * source check plus the postbuild check cover the same ground.
 *
 * STRICT_PROSE_RULES=em-dash (set in CI) makes em dashes fatal. The advisory
 * rules stay advisory on purpose: a linter that cries wolf gets ignored.
 */
import { readFile } from 'node:fs/promises';
import { walk } from './lib/walk.mjs';

const ROOTS = ['src'];
const EXTENSIONS = new Set(['.astro', '.md', '.mdx', '.ts']);

const ADVISORY = [
  [/\bin order to\b/gi, 'wordy: "to"'],
  [/\butilise\b/gi, 'say "use"'],
  [/\bleverage\b/gi, 'say "use"'],
  [/\bdelve\b/gi, 'AI tell'],
  [/\bit’s worth noting\b/gi, 'filler'],
  [/\bnot only\b.{0,40}\bbut also\b/gi, 'AI tell'],
];

const strict = (process.env.STRICT_PROSE_RULES ?? '').split(',').filter(Boolean);
let fatal = 0;
let advisories = 0;

for (const root of ROOTS) {
  for (const file of await walk(root, EXTENSIONS)) {
    const source = await readFile(file, 'utf8');
    source.split('\n').forEach((line, index) => {
      const where = `${file}:${index + 1}`;

      if (line.includes('—')) {
        const message = `${where}: em dash — house style is an en dash (–) or a rewrite`;
        if (strict.includes('em-dash')) {
          console.error(`  ✗ ${message}`);
          fatal++;
        } else {
          console.warn(`  · ${message}`);
          advisories++;
        }
      }

      for (const [pattern, note] of ADVISORY) {
        if (pattern.test(line)) {
          console.warn(`  · ${where}: ${note}`);
          advisories++;
        }
        pattern.lastIndex = 0;
      }
    });
  }
}

if (fatal) {
  console.error(`\nlint:prose failed — ${fatal} em dash(es).`);
  process.exit(1);
}
console.log(`✓ lint:prose — no fatal issues${advisories ? `, ${advisories} advisory` : ''}`);
