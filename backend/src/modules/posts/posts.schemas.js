import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().max(120).optional().nullable(),
  body: z.string().min(1, 'Poem body is required').max(10000),
  tags: z.array(z.string()).optional().default([]),
});

export const updatePostSchema = createPostSchema.partial();

export const postQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  tag: z.string().optional(),
  authorId: z.string().optional(),
});
