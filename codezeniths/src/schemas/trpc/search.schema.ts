import { z } from 'zod';

export const AutocompleteTRPCInputSchema = z.object({
  collection: z.string().default('all'),
  prefix: z.string().min(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export const AutocompleteTRPCOutputSchema = z.array(z.string());

export const MoreLikeThisTRPCInputSchema = z.object({
  collection: z.string(),
  id: z.string(),
  limit: z.number().int().min(1).max(20).default(5),
});

export const MoreLikeThisTRPCOutputSchema = z.array(z.any());

export const SearchTRPCInputSchema = z.object({
  collection: z.string().default('all'),
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

// ─── Search History TRPC Schemas ──────────────────────────────────────────────

import { SearchCollectionSchema, UserSearchHistorySchema } from '@codezeniths/schemas/db';

export const RecordSearchSelectionTRPCInputSchema = z.object({
  collection: SearchCollectionSchema,
  resultId: z.string(),
  title: z.string(),
  slug: z.string().nullable().optional(),
  document: z.record(z.string(), z.any()),
});

export const RecordSearchSelectionTRPCOutputSchema = z.object({
  success: z.boolean(),
});

export const GetRecentSearchHistoryTRPCInputSchema = z.object({
  limit: z.number().int().min(1).max(20).default(10).optional(),
}).optional();

export const GetRecentSearchHistoryTRPCOutputSchema = z.array(UserSearchHistorySchema);

export const DeleteSearchHistoryItemTRPCInputSchema = z.object({
  id: z.uuidv7(),
});

export const DeleteSearchHistoryItemTRPCOutputSchema = z.object({
  success: z.boolean(),
});

export const ClearSearchHistoryTRPCOutputSchema = z.object({
  success: z.boolean(),
});

export const SearchHistoryCategoryFilterTRPCSchema = z.enum([
  'all',
  'problem',
  'topic',
  'module',
  'tag',
  'user',
  'product',
]);

export const GetSearchHistoryInfiniteTRPCInputSchema = z.object({
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(50).default(6).optional(),
  collection: SearchHistoryCategoryFilterTRPCSchema.default('all').optional(),
  search: z.string().optional(),
}).optional();

export const GetSearchHistoryInfiniteTRPCOutputSchema = z.object({
  items: z.array(UserSearchHistorySchema),
  nextCursor: z.string().nullable().optional(),
  hasNextPage: z.boolean(),
  totalCount: z.number(),
});

export const GetSearchHistoryStatsTRPCInputSchema = z.object({}).optional();

export const GetSearchHistoryStatsTRPCOutputSchema = z.object({
  totalSearches: z.number(),
  todaySearches: z.number(),
  topCategory: z.string().nullable(),
});
