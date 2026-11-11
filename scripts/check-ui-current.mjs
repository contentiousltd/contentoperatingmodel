#!/usr/bin/env node
/**
 * Is the pinned @contentious/ui the latest published version?
 *
 * Suite ADR-0014 §3: a consumer may be deliberately behind, never silently
 * behind. The package is meant to export this check; it does not yet, so this
 * is the local stand-in and should be deleted the day `check:ui-current` ships
 * upstream (recorded as improvement 4 in docs/plans/project-setup.md).
 *
 * The package installs from GitHub Packages as @contentiousltd/ui, aliased to
 * @contentious/ui (see .npmrc and the meta-repo's
 * docs/plans/package-registry.md), so "latest" is the registry's latest
 * published version rather than the newest git tag.
 *
 * Deliberately behind is expressed by ALLOW_UI_BEHIND=<version> in the same
 * commit that pins it, so the allowance is reviewable rather than invisible.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PACKAGE = '@contentiousltd/ui';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const spec = pkg.dependencies?.['@contentious/ui'] ?? '';
const pinned = spec.match(/^npm:@contentiousltd\/ui@(\d+\.\d+\.\d+)$/)?.[1];

if (!pinned) {
  console.error(
    `@contentious/ui must be pinned to an exact published version (ADR-0014 §2), ` +
      `as "npm:${PACKAGE}@X.Y.Z", not "${spec}".`,
  );
  process.exit(1);
}

let latest;
try {
  latest = execFileSync('npm', ['view', PACKAGE, 'version'], { encoding: 'utf8' }).trim();
} catch (error) {
  console.log(`· could not reach the registry for ${PACKAGE}, skipping the staleness check (${error.code ?? 'error'})`);
  process.exit(0);
}

const order = (v) => v.split('.').map(Number);
const compare = (a, b) => {
  const [x, y] = [order(a), order(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

if (!/^\d+\.\d+\.\d+$/.test(latest) || compare(pinned, latest) >= 0) {
  console.log(`✓ @contentious/ui is on ${pinned}, the latest published version`);
  process.exit(0);
}

if (process.env.ALLOW_UI_BEHIND?.replace(/^v/, '') === latest) {
  console.log(`· @contentious/ui is on ${pinned}, deliberately behind ${latest} (allowed)`);
  process.exit(0);
}

console.error(
  `@contentious/ui is on ${pinned}; the latest published version is ${latest}.\n` +
    `Bump it, or set ALLOW_UI_BEHIND=${latest} in the same commit that says why.`,
);
process.exit(1);
