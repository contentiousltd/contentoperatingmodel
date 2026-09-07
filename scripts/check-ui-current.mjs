#!/usr/bin/env node
/**
 * Is the pinned @contentious/ui the latest tag?
 *
 * Suite ADR-0014 §3: a consumer may be deliberately behind, never silently
 * behind. The package is meant to export this check; it does not yet, so this
 * is the local stand-in and should be deleted the day `check:ui-current` ships
 * upstream (recorded as improvement 4 in docs/plans/project-setup.md).
 *
 * Deliberately behind is expressed by ALLOW_UI_BEHIND=<tag> in the same commit
 * that pins it, so the allowance is reviewable rather than invisible.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const REPO = 'https://github.com/contentiousltd/contentious-ui.git';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const spec = pkg.dependencies?.['@contentious/ui'] ?? '';
const pinned = spec.match(/#(v[\d.]+)$/)?.[1];

if (!pinned) {
  console.error(
    `@contentious/ui must be pinned to an exact tag (ADR-0014 §2), not "${spec}".`,
  );
  process.exit(1);
}

let tags;
try {
  tags = execFileSync('git', ['ls-remote', '--tags', '--refs', REPO], { encoding: 'utf8' });
} catch (error) {
  console.log(`· could not reach ${REPO}, skipping the staleness check (${error.code ?? 'error'})`);
  process.exit(0);
}

const versions = [...tags.matchAll(/refs\/tags\/(v\d+\.\d+\.\d+)$/gm)].map((m) => m[1]);
const order = (v) => v.slice(1).split('.').map(Number);
const compare = (a, b) => {
  const [x, y] = [order(a), order(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};
const latest = versions.sort(compare).at(-1);

if (!latest || compare(pinned, latest) >= 0) {
  console.log(`✓ @contentious/ui is on ${pinned}, the latest tag`);
  process.exit(0);
}

if (process.env.ALLOW_UI_BEHIND === latest) {
  console.log(`· @contentious/ui is on ${pinned}, deliberately behind ${latest} (allowed)`);
  process.exit(0);
}

console.error(
  `@contentious/ui is on ${pinned}; the latest tag is ${latest}.\n` +
    `Bump it, or set ALLOW_UI_BEHIND=${latest} in the same commit that says why.`,
);
process.exit(1);
