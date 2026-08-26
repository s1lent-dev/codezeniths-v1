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
// Returns module metadata + all topics with per-topic total & solved counts.

export const GetSingleModuleInputSchema = z.object({
    slug: z.string().optional(),
    id: z.uuidv7().optional(),
    userId: z.uuidv7().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

const TopicStatsSchema = z.object({
    id: z.uuidv7().optional(),
    title: z.string(),
    description: z.string().nullable().optional(),
    slug: z.string(),
    level: LevelSchema.nullable(),
    order: z.number().int(),
    isBookmarked: z.boolean().default(false),
    problemsCount: z.number().int(),
    problemsSolvedCount: z.number().int(),
    problemsSolvedPercentage: z.number(),
});

export const GetSingleModuleOutputSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    isBookmarked: z.boolean().default(false),
    tagCount: z.number().int().default(0),
    topicCount: z.number().int().default(0),
    problemsCount: z.number().int().default(0),
    topics: z.array(TopicStatsSchema).optional(),
});

// ─── toggleModuleBookmark ──────────────────────────────────────────────────────

export const ToggleModuleBookmarkInputSchema = z.object({
    moduleId: z.uuidv7().optional(),
    moduleSlug: z.string().optional(),
    userId: z.uuidv7(),
}).refine((d) => d.moduleId || d.moduleSlug, {
    message: 'At least one of moduleId or moduleSlug must be provided',
});

export const ToggleModuleBookmarkOutputSchema = z.object({
    isBookmarked: z.boolean(),
    moduleId: z.uuidv7(),
});

// ─── toggleTopicBookmark ───────────────────────────────────────────────────────

export const ToggleTopicBookmarkInputSchema = z.object({
    topicId: z.uuidv7().optional(),
    topicSlug: z.string().optional(),
    userId: z.uuidv7(),
}).refine((d) => d.topicId || d.topicSlug, {
    message: 'At least one of topicId or topicSlug must be provided',
});

export const ToggleTopicBookmarkOutputSchema = z.object({
    isBookmarked: z.boolean(),
    topicId: z.uuidv7(),
});

// ─── getSingleModuleProgress ───────────────────────────────────────────────────
// Returns O(1) aggregate progress stats scoped to one module.

export const GetSingleModuleProgressInputSchema = z.object({
    moduleSlug: z.string().optional(),
    moduleId: z.uuidv7().optional(),
    userId: z.uuidv7().optional(),
}).refine((d) => d.moduleSlug || d.moduleId, {
    message: 'At least one of moduleSlug or moduleId must be provided',
});

export const GetSingleModuleProgressOutputSchema = z.object({
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

// ─── getRecentlySolvedModule ───────────────────────────────────────────────────
export const GetRecentlySolvedModuleInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetRecentlySolvedModuleOutputSchema = z.object({
    module: z.object({
        id: z.uuidv7(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
        problemsCount: z.number().int(),
        problemsSolvedCount: z.number().int(),
        problemsSolvedPercentage: z.number(),
    }).nullable(),
    lastProblem: z.object({
        title: z.string(),
        slug: z.string(),
    }).nullable(),
});

// ─── getModulesWithTopics ──────────────────────────────────────────────────────
export const GetModulesWithTopicsInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const GetModulesWithTopicsOutputSchema = z.array(
    z.object({
        id: z.uuidv7(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
        topicsCount: z.number().int(),
        topics: z.array(
            z.object({
                id: z.uuidv7(),
                title: z.string(),
                slug: z.string(),
                description: z.string().nullable(),
                level: LevelSchema.nullable(),
                order: z.number().int(),
                problemsCount: z.number().int(),
                problemsSolvedCount: z.number().int(),
                problemsSolvedPercentage: z.number(),
            }),
        ),
    }),
);
