import { z } from 'zod';

export const uuidSchema = z.uuidv7();
export const slugSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'must be a lowercase, hyphen-separated slug');
export const isoDateSchema = z.date(); 
export const emailSchema = z.email();
export const urlSchema = z.url();
export const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');
export const paginationInputSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  cursor: uuidSchema.optional(),
});
export type PaginationInput = z.infer<typeof paginationInputSchema>;
