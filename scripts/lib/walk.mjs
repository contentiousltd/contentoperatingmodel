import { readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

/** Every file under dir whose extension is in the set, recursively. */
export async function walk(dir, extensions) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, extensions)));
    else if (extensions.has(extname(entry.name))) out.push(full);
  }
  return out;
}
