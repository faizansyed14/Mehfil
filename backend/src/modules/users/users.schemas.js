import { z } from 'zod';

export const checkUsernameSchema = z.object({
  value: z.string().min(1)
});

export const updateMeSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(280).optional()
});
