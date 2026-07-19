import type { CollectionEntry } from 'astro:content';

export function uniqueTags(posts: CollectionEntry<'blog'>[]): string[] {
  return [...new Set(posts.flatMap(p => p.data.tags))].sort();
}
