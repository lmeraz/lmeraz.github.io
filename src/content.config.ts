import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

export const CATEGORIES = [
  'Philosophy',
  'Art',
  'Acting',
] as const;

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).min(1),
    category: z.enum(CATEGORIES),
    ogImage: z.string().optional(),
    canonicalUrl: z.url().optional(),
    draft: z.boolean().default(false),
    handwritten: z.array(image()).optional(),
  }),
});

export const collections = { blog };
