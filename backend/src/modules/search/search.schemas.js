import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  limit: z.coerce.number().min(1).max(20).default(8),
});
