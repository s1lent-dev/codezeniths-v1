import { z } from 'zod';

export const AutocompleteTRPCInputSchema = z.object({
  collection: z.string(),
  prefix: z.string().min(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export const AutocompleteTRPCOutputSchema = z.array(z.string());

export const MoreLikeThisTRPCInputSchema = z.object({
  collection: z.string(),
  id: z.string(),
  limit: z.number().int().min(1).max(20).default(5),
});

export const MoreLikeThisTRPCOutputSchema = z.array(z.any()); // Since it can return any document based on collection

export const SearchTRPCInputSchema = z.object({
  collection: z.string(),
  query: z.string(),
  limit: z.number().int().min(1).max(100).default(10),
  fuzzy: z.object({
    algorithm: z.enum(['jaro-winkler', 'levenshtein']).default('jaro-winkler'),
    threshold: z.number().min(0).max(1).default(0.7),
  }).optional(),
  phonetic: z.object({
    algorithm: z.enum(['metaphone', 'soundex']).default('metaphone'),
  }).optional(),
  didYouMean: z.boolean().default(false),
  autocomplete: z.object({
    limit: z.number().int().min(1).max(50).default(10),
  }).optional(),
});

export const SearchTRPCOutputSchema = z.object({
  hits: z.array(z.object({
    document: z.any(),
    score: z.number(),
    matchedStrategies: z.array(z.string())
  })),
  metadata: z.object({
    tookMs: z.number(),
    didYouMean: z.string().optional(),
    autocomplete: z.array(z.string()).optional()
  })
});
