import { z } from 'zod';
import { LevelSchema } from '../db.schema';

// ─── getSingleTopic ────────────────────────────────────────────────────────────
// Returns lean topic metadata & module relationship.

export const GetSingleTopicInputSchema = z.object({
    slug: z.string().optional(),
    id: z.string().optional(),
    userId: z.string().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

export const GetSingleTopicOutputSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: LevelSchema.nullable().optional(),
    order: z.number().int(),
    isBookmarked: z.boolean().default(false),
    problemsCount: z.number().int().default(0),
    module: z.object({
        title: z.string(),
        slug: z.string(),
    }).optional(),
});

// ─── getSingleTopicProgress ───────────────────────────────────────────────────
// Returns topic progress stats matching ProblemProgressCard / DetailInfoProgress.

export const GetSingleTopicProgressInputSchema = z.object({
    topicSlug: z.string().optional(),
    topicId: z.string().optional(),
    userId: z.string().optional(),
}).refine((d) => d.topicSlug || d.topicId, {
    message: 'At least one of topicSlug or topicId must be provided',
});

export const GetSingleTopicProgressOutputSchema = z.object({
    problemsCount: z.number().int(),
    problemsSolvedCount: z.number().int(),
    problemsRevisitCount: z.number().int(),
    problemNotSolvedCount: z.number().int(),
    problemsSolvedPercentage: z.number(),
    problemsCountByDifficulty: z.object({
        easy: z.number().int(),
        medium: z.number().int(),
        hard: z.number().int(),
    }),
    problemsSolvedCountByDifficulty: z.object({
        easy: z.number().int(),
        medium: z.number().int(),
        hard: z.number().int(),
    }),
});

// ─── getTopicSuggestions ───────────────────────────────────────────────────────
// Returns semantic similarity topic suggestions.

export const SimilarTopicSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    level: LevelSchema.nullable().optional(),
    moduleTitle: z.string().optional(),
    moduleSlug: z.string().optional(),
    problemsCount: z.number().int(),
});

export const GetTopicSuggestionsInputSchema = z.object({
    topicSlug: z.string().optional(),
    topicId: z.string().optional(),
}).refine((d) => d.topicSlug || d.topicId, {
    message: 'At least one of topicSlug or topicId must be provided',
});

export const GetTopicSuggestionsOutputSchema = z.array(SimilarTopicSchema);


