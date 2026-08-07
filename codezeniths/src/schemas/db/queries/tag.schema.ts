import { z } from 'zod';
import { DifficultySchema, LevelSchema, ProgressStatusSchema } from '../db.schema';

// ─── getTags ───────────────────────────────────────────────────────────────────

export const GetTagsOutputSchema = z.array(
    z.object({
        id: z.uuidv7(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable().optional(),
        level: LevelSchema.nullable().optional(),
        module: z.object({
            title: z.string(),
            slug: z.string(),
        }).optional(),
    }),
);

// ─── getTagsFiltered ───────────────────────────────────────────────────────────

export const TagFilterSchema = z.object({
    search: z.string().optional(),
    moduleSlug: z.string().optional(),
    level: LevelSchema.optional(),
});

export const TagSortingSchema = z.object({
    sortBy: z.enum(['name', 'level', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

export const GetTagsFilteredInputSchema = z.object({
    userId: z.uuidv7().optional(),
    filters: TagFilterSchema.optional(),
    sorting: TagSortingSchema.optional(),
});

export const GetTagsFilteredOutputSchema = z.array(
    z.object({
        id: z.uuidv7(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable().optional(),
        level: LevelSchema.nullable().optional(),
        module: z.object({
            title: z.string(),
            slug: z.string(),
        }).optional(),
        problemsCount: z.number().int(),
        problemsSolvedCount: z.number().int(),
        problemsSolvedPercentage: z.number(),
        createdAt: z.coerce.date().optional(),
    }),
);



// ─── getSingleTagProblems ──────────────────────────────────────────────────────

export const GetSingleTagProblemsInputSchema = z.object({
    slug: z.string().optional(),
    id: z.uuidv7().optional(),
    userId: z.uuidv7(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

const TagProblemTagSchema = z.object({
    id: z.uuidv7(),
    name: z.string(),
    slug: z.string(),
});

const TagProblemSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    difficulty: DifficultySchema,
    order: z.number().int(),
    articleUrl: z.url().nullable().optional(),
    problemUrl: z.url().nullable().optional(),
    favouriteCount: z.number().int().default(0),
    tags: z.array(TagProblemTagSchema),
    status: ProgressStatusSchema,
    favourite: z.boolean(),
});

export const GetSingleTagProblemsOutputSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: LevelSchema.nullable().optional(),
    problemsCount: z.number().int(),
    problemsSolvedCount: z.number().int(),
    problemsSolvedPercentage: z.number(),
    problems: z.array(TagProblemSchema),
});

// ─── getSingleTagProblemProgress ────────────────────────────────────────────────

export const GetSingleTagProblemProgressInputSchema = z.object({
    tagSlug: z.string().optional(),
    tagId: z.uuidv7().optional(),
    userId: z.uuidv7(),
}).refine((d) => d.tagSlug || d.tagId, {
    message: 'At least one of tagSlug or tagId must be provided',
});

export const GetSingleTagProblemProgressOutputSchema = z.object({
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

// ─── getSingleTag ─────────────────────────────────────────────────────────────

export const GetSingleTagInputSchema = z.object({
    slug: z.string().optional(),
    id: z.uuidv7().optional(),
    userId: z.uuidv7().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

export const SimilarTagSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    level: LevelSchema.nullable().optional(),
    moduleTitle: z.string().optional(),
    problemsCount: z.number().int(),
});

export const GetSingleTagOutputSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: LevelSchema.nullable().optional(),
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
    similarTags: z.array(SimilarTagSchema),
});

