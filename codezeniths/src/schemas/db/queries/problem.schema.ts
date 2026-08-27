import { z } from 'zod';
import { DifficultySchema, ProgressStatusSchema } from '../db.schema';
import { ProblemFilterInputSchema, ProblemSortingInputSchema } from './shared/problem-filter.schema';
import { paginatedOutput, cursorOutput } from './shared/pagination.schema';

// ─── Reusable Problem Schema ──────────────────────────────────────────────────

export const ProblemOutputSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    difficulty: DifficultySchema,
    order: z.number().int(),
    articleUrl: z.string().url().nullable().optional(),
    problemUrl: z.string().url().nullable().optional(),
    favouriteCount: z.number().int().default(0),
    topicId: z.uuidv7().nullable().optional(),
    topicSlug: z.string().nullable().optional(),
    tags: z.array(
        z.object({
            id: z.uuidv7(),
            name: z.string(),
            slug: z.string(),
        }),
    ),
    status: ProgressStatusSchema.nullable().optional(),
    revisit: z.boolean().nullable().optional(),
    favourite: z.boolean().nullable().optional(),
});

// ─── getProblemsPaginated ──────────────────────────────────────────────────────

export const GetProblemsPaginatedInputSchema = z
    .object({
        userId: z.uuidv7().optional(),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        sorting: ProblemSortingInputSchema.optional(),
    })
    .merge(ProblemFilterInputSchema);

export const GetProblemsPaginatedOutputSchema = z.object({
    items: z.array(ProblemOutputSchema),
    total: z.number().int(),
    solvedCount: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
});

// ─── getProblemsInfinite ───────────────────────────────────────────────────────

export const GetProblemsInfiniteInputSchema = z
    .object({
        userId: z.uuidv7().optional(),
        cursor: z.uuidv7().optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20),
        sorting: ProblemSortingInputSchema.optional(),
    })
    .merge(ProblemFilterInputSchema);

export const GetProblemsInfiniteOutputSchema = z.object({
    items: z.array(ProblemOutputSchema),
    total: z.number().int(),
    solvedCount: z.number().int(),
    nextCursor: z.string().nullable(),
});

// ─── getProblemsWithFilters ────────────────────────────────────────────────────

export const GetProblemsWithFiltersInputSchema = z.object({
    userId: z.uuidv7().optional(),
    filters: ProblemFilterInputSchema.optional(),
    sorting: ProblemSortingInputSchema.optional(),
});

export const GetProblemsWithFiltersOutputSchema = z.object({
    problemsCount: z.number().int(),
    solvedCount: z.number().int(),
    problemsCountByDifficulty: z.object({
        easy: z.number().int(),
        medium: z.number().int(),
        hard: z.number().int(),
    }),
    problems: z.array(ProblemOutputSchema),
});

// ─── updateProblemStatus ───────────────────────────────────────────────────────

export const UpdateProblemStatusInputSchema = z.object({
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    status: ProgressStatusSchema,
});

export const UpdateProblemStatusOutputSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    problemSlug: z.string(),
    status: ProgressStatusSchema,
    revisit: z.boolean(),
    favourite: z.boolean(),
});

// ─── getProblemNote ───────────────────────────────────────────────────────────

export const GetProblemNoteInputSchema = z.object({
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
});

export const GetProblemNoteOutputSchema = z.object({
    problemId: z.uuidv7(),
    notes: z.string().nullable(),
});

// ─── updateProblemNote ─────────────────────────────────────────────────────────

export const UpdateProblemNoteInputSchema = z.object({
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    notes: z.string().nullable().optional(),
});

export const UpdateProblemNoteOutputSchema = z.object({
    id: z.uuidv7(),
    problemId: z.uuidv7(),
    userId: z.uuidv7(),
    notes: z.string().nullable(),
    problemSlug: z.string(),
});

// ─── updateProblemFavourite ────────────────────────────────────────────────────

export const UpdateProblemFavouriteInputSchema = z.object({
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    favourite: z.boolean(),
});

export const UpdateProblemFavouriteOutputSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    problemSlug: z.string(),
    status: ProgressStatusSchema,
    revisit: z.boolean(),
    favourite: z.boolean(),
});

// ─── updateProblemRevisit ──────────────────────────────────────────────────────

export const UpdateProblemRevisitInputSchema = z.object({
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    revisit: z.boolean(),
});

export const UpdateProblemRevisitOutputSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
    problemId: z.uuidv7(),
    problemSlug: z.string(),
    status: ProgressStatusSchema,
    revisit: z.boolean(),
    favourite: z.boolean(),
});

// ─── getProblemTablePrimitives ──────────────────────────────────────────────────

export const GetProblemTablePrimitivesInputSchema = z.object({
    userId: z.uuidv7().optional(),
});

export const GetProblemTablePrimitivesOutputSchema = z.object({
    modules: z.array(
        z.object({
            id: z.uuidv7(),
            title: z.string(),
            slug: z.string(),
            topics: z.array(
                z.object({
                    id: z.uuidv7(),
                    title: z.string(),
                    slug: z.string(),
                })
            ),
        })
    ),
    tags: z.array(
        z.object({
            id: z.uuidv7(),
            name: z.string(),
            slug: z.string(),
        })
    ),
    totalProblems: z.number().int(),
    solvedProblems: z.number().int(),
});

// ─── getProblemProgress ─────────────────────────────────────────────────────────

export const GetProblemProgressInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetProblemProgressOutputSchema = z.object({
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

// ─── getRecentlySolvedProblems ───────────────────────────────────────────────

export const GetRecentlySolvedProblemsInputSchema = z.object({
    userId: z.uuidv7(),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const RecentlySolvedProblemItemSchema = z.object({
    id: z.uuidv7(),
    title: z.string(),
    slug: z.string(),
    solvedAt: z.coerce.date().nullable().optional(),
});

export const GetRecentlySolvedProblemsOutputSchema = z.array(RecentlySolvedProblemItemSchema);
