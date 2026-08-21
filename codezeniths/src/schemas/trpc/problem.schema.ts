import { z } from 'zod';
import {
    DifficultySchema,
    ProgressStatusSchema,
    ProblemOutputSchema,
    ProblemFilterInputSchema,
    ProblemSortingInputSchema,
    GetProblemProgressOutputSchema,
} from '@codezeniths/schemas/db';

export const GetProblemsTRPCInputSchema = z.discriminatedUnion('mode', [
    z.object({
        mode: z.literal('paginated'),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(10),
        filters: ProblemFilterInputSchema.optional(),
        sorting: ProblemSortingInputSchema.optional(),
    }),
    z.object({
        mode: z.literal('infinite'),
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(10),
        filters: ProblemFilterInputSchema.optional(),
        sorting: ProblemSortingInputSchema.optional(),
    }),
    z.object({
        mode: z.literal('filtered'),
        filters: ProblemFilterInputSchema.optional(),
        sorting: ProblemSortingInputSchema.optional(),
    }),
]);

export const GetProblemsTRPCOutputSchema = z.discriminatedUnion('mode', [
    z.object({
        mode: z.literal('paginated'),
        items: z.array(ProblemOutputSchema),
        total: z.number().int(),
        solvedCount: z.number().int(),
        page: z.number().int(),
        limit: z.number().int(),
        totalPages: z.number().int(),
        hasNextPage: z.boolean(),
    }),
    z.object({
        mode: z.literal('infinite'),
        items: z.array(ProblemOutputSchema),
        total: z.number().int(),
        solvedCount: z.number().int(),
        nextCursor: z.string().nullable(),
    }),
    z.object({
        mode: z.literal('filtered'),
        problemsCount: z.number().int(),
        solvedCount: z.number().int(),
        problemsCountByDifficulty: z.object({
            easy: z.number().int(),
            medium: z.number().int(),
            hard: z.number().int(),
        }),
        problems: z.array(ProblemOutputSchema),
    }),
]);

export const UpdateProblemTRPCInputSchema = z.object({
    problemId: z.uuidv7(),
    status: ProgressStatusSchema.optional(),
    notes: z.string().nullable().optional(),
    revisit: z.boolean().optional(),
    favourite: z.boolean().optional(),
}).refine(
    (data) => data.status !== undefined || data.notes !== undefined || data.revisit !== undefined || data.favourite !== undefined,
    {
        message: 'At least one of status, notes, revisit, or favourite must be provided to update',
    }
);

export const UpdateProblemTRPCOutputSchema = z.object({
    id: z.uuidv7(),
    problemId: z.uuidv7(),
    userId: z.uuidv7(),
    status: ProgressStatusSchema,
    revisit: z.boolean(),
    favourite: z.boolean(),
    notes: z.string().nullable(),
    problemSlug: z.string(),
});

// ─── getProblemTablePrimitives ──────────────────────────────────────────────────

export const GetProblemTablePrimitivesTRPCInputSchema = z.object({
    userId: z.string().optional(),
});

export const GetProblemTablePrimitivesTRPCOutputSchema = z.object({
    modules: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            slug: z.string(),
            topics: z.array(
                z.object({
                    id: z.string(),
                    title: z.string(),
                    slug: z.string(),
                })
            ),
        })
    ),
    tags: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            slug: z.string(),
        })
    ),
    totalProblems: z.number().int(),
    solvedProblems: z.number().int(),
});

// ─── getProblemProgress ─────────────────────────────────────────────────────────

export const GetProblemProgressTRPCInputSchema = z.object({
    userId: z.string().uuid().optional(),
});

export const GetProblemProgressTRPCOutputSchema = GetProblemProgressOutputSchema;

// ─── getRecentlySolvedProblems ───────────────────────────────────────────────

export const GetRecentlySolvedProblemsTRPCInputSchema = z.object({
    userId: z.string().uuid().optional(),
    limit: z.number().int().min(1).max(50).default(10),
});

export const RecentlySolvedProblemItemTRPCSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    solvedAt: z.coerce.date().nullable().optional(),
});

export const GetRecentlySolvedProblemsTRPCOutputSchema = z.array(RecentlySolvedProblemItemTRPCSchema);
