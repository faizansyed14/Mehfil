import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  username: z.string()
    .min(3)
    .max(20)
    .regex(/^[a-z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
    .refine(u => !u.startsWith('_') && !u.endsWith('_'), 'Cannot start or end with underscore')
    .refine(u => !u.includes('__'), 'Cannot have consecutive underscores'),
  displayName: z.string().min(1).max(50),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain one uppercase letter').regex(/[0-9]/, 'Must contain one number'),
});

export const signinSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1),
});
