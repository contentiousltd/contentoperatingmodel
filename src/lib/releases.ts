/**
 * The framework's releases, newest first, and the one date the framework page
 * states beside its version. The date is content (the release's), not the
 * build clock's and not typed in a template.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Release = CollectionEntry<'releases'>;

export async function releases(): Promise<Release[]> {
  return (await getCollection('releases')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function latestRelease(): Promise<Release | undefined> {
  return (await releases())[0];
}

/** "September 2026", as the framework page states it. */
export function releaseDate(release: Release): string {
  return release.data.date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

/** "7 September 2026", for the changelog list. */
export function releaseDateLong(release: Release): string {
  return release.data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
