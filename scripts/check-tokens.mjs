#!/usr/bin/env node
/**
 * No colour originates in this repo.
 *
 * ADR-0011 §3 in the meta-repo: products choose values, never invent names, and
 * a product maintains no local token definitions or palette copies. The design
 * gate hook stops an agent writing UI without reading the design system; this
 * catches what gets through, including a human in a hurry.
 *
 * Two rules:
 *   1. No hex literal anywhere in src/. Use var(--token).
 *   2. No locally declared palette-named custom property (--limestone-600,
 *      --sapling-700 …). Those names belong to @contentious/ui, and a second
 *      declaration is a copy that will drift.
 *
 * The package promises its own token-copy detector (ADR-0011 §5). When it
 * ships, this script is deleted in favour of it rather than kept alongside.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'src';
const EXTENSIONS = new Set(['.css', '.astro', '.ts', '.tsx', '.jsx', '.mdx', '.md']);
const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const PALETTE_FAMILIES =
  'limestone|gloaming|sunshine|wave|fire|sapling|coffee|sorbet|amber|olive|lichen';
const LOCAL_PALETTE = new RegExp(`^\\s*--(${PALETTE_FAMILIES})-\\d{2,3}\\s*:`, 'gm');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (EXTENSIONS.has(extname(entry.name))) out.push(full);
  }
  return out;
}

const failures = [];

for (const file of await walk(ROOT)) {
  const source = await readFile(file, 'utf8');

  // Strip comments before matching: a comment may legitimately quote a hex
  // while recording why a token holds it.
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1');

  for (const match of code.matchAll(HEX)) {
    failures.push(`${file}: hex literal ${match[0]} — use a var(--token)`);
  }
  for (const match of code.matchAll(LOCAL_PALETTE)) {
    failures.push(
      `${file}: declares ${match[0].trim()} — palette tokens belong to @contentious/ui`,
    );
  }
}

if (failures.length) {
  console.error('check:tokens failed\n');
  for (const failure of failures) console.error(`  ${failure}`);
  console.error(
    '\nColour is originated in the design system, never here. If the system has no' +
      '\nanswer, raise it in contentious-ui GAPS.md and stop — do not pick a value.',
  );
  process.exit(1);
}

console.log('✓ no hex literals and no local palette declarations in src/');
