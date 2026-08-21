import { z } from 'zod';
import { LevelSchema, DifficultySchema, ProgressStatusSchema } from '../db.schema';

// ─── getSingleTopic ────────────────────────────────────────────────────────────

export const GetSingleTopicInputSchema = z.object({
    slug: z.string().optional(),
    id: z.uuidv7().optional(),
    userId: z.uuidv7().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

const TopicProblemTagSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    slug: z.string(),
});

const TopicProblemSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    difficulty: DifficultySchema,
    order: z.number().int(),
    articleUrl: z.url().nullable().optional(),
    problemUrl: z.url().nullable().optional(),
    favouriteCount: z.number().int().default(0),
    tags: z.array(TopicProblemTagSchema),
    status: ProgressStatusSchema.nullable().optional(),
    favourite: z.boolean().nullable().optional(),
});

export const SimilarTopicSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    level: LevelSchema.nullable().optional(),
    moduleTitle: z.string().optional(),
    moduleSlug: z.string().optional(),
    problemsCount: z.number().int(),
});

export const GetSingleTopicOutputSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: LevelSchema.nullable().optional(),
    order: z.number().int(),
    isBookmarked: z.boolean().default(false),
    module: z.object({
        title: z.string(),
        slug: z.string(),
    }).optional(),
    progress: z.object({
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
    }),
    similarTopics: z.array(SimilarTopicSchema),
    problems: z.array(TopicProblemSchema).optional(),
});

// ─── getSingleTopicProgress ───────────────────────────────────────────────────

export const GetSingleTopicProgressInputSchema = z.object({
    topicSlug: z.string().optional(),
    topicId: z.uuidv7().optional(),
    userId: z.uuidv7(),
}).refine((d) => d.topicSlug || d.topicId, {
    message: 'At least one of topicSlug or topicId must be provided',
});

export const GetSingleTopicProgressOutputSchema = z.object({
    problemsCount: z.number().int(),
    problemsSolvedCount: z.number().int(),
    problemsRevisitCount: z.number().int(),
    problemsAttemptedCount: z.number().int(),
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
    problemsCountByTags: z.record(z.string(), z.number().int()),
    problemsSolvedCountByTags: z.record(z.string(), z.number().int()),
});
