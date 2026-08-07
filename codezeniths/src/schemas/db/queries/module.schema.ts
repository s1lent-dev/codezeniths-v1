import { z } from 'zod';
import { LevelSchema, DifficultySchema } from '../db.schema';

// ─── getModules ────────────────────────────────────────────────────────────────

export const GetModulesOutputSchema = z.array(
    z.object({
        id: z.uuidv7(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
    }),
);

// ─── getSingleModule ───────────────────────────────────────────────────────────
// Returns module info + all topics enriched with per-topic stats for a user.

export const GetSingleModuleInputSchema = z.object({
    slug: z.string().optional(),
    id: z.uuidv7().optional(),
    userId: z.uuidv7(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

const TopicStatsSchema = z.object({
    title: z.string(),
    description: z.string().nullable().optional(),
    slug: z.string(),
    level: LevelSchema.nullable(),
    order: z.number().int(),
    problemsCount: z.number().int(),
    problemsCountByDifficulty: z.record(DifficultySchema, z.number().int()),
    problemsSolvedCount: z.number().int(),
    problemsSolvedPercentage: z.number(),
});

export const GetSingleModuleOutputSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    description: z.string().nullable(),
    slug: z.string(),
    topics: z.array(TopicStatsSchema),
});

// ─── getSingleModuleProgress ───────────────────────────────────────────────────
// Returns getUserProgress-style aggregate stats scoped to one module.

export const GetSingleModuleProgressInputSchema = z.object({
    moduleSlug: z.string().optional(),
    moduleId: z.uuidv7().optional(),
    userId: z.uuidv7(),
}).refine((d) => d.moduleSlug || d.moduleId, {
    message: 'At least one of moduleSlug or moduleId must be provided',
});

export const GetSingleModuleProgressOutputSchema = z.object({
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
    problemsCountByTopic: z.record(z.string(), z.number().int()),
    problemsSolvedCountByTopic: z.record(z.string(), z.number().int()),
    problemsCountByTags: z.record(z.string(), z.number().int()),
    problemsSolvedCountByTags: z.record(z.string(), z.number().int()),
});
