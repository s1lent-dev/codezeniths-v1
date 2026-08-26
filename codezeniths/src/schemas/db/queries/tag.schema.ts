import { z } from 'zod';
import { DifficultySchema, LevelSchema, ProgressStatusSchema } from '../db.schema';

// ─── getTags (Lightweight Navbar / Chips Catalog) ──────────────────────────────

export const GetTagsOutputSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable().optional(),
        level: LevelSchema.nullable().optional(),
        module: z
            .object({
                title: z.string(),
                slug: z.string(),
            })
            .optional(),
    }),
);

// ─── Tag Filter & Sort Primitive Schemas ───────────────────────────────────────

export const TagFilterSchema = z.object({
    search: z.string().optional(),
    moduleSlug: z.string().optional(),
    level: LevelSchema.optional(),
});

export const TagSortingSchema = z.object({
    sortBy: z.enum(['name', 'level', 'createdAt', 'problemsCount']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
});

// ─── Tag Card Item DTO Schema ──────────────────────────────────────────────────

export const TagCardItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: LevelSchema.nullable().optional(),
    module: z
        .object({
            title: z.string(),
            slug: z.string(),
        })
        .optional(),
    problemsCount: z.number().int(),
    problemsSolvedCount: z.number().int(),
    problemsSolvedPercentage: z.number(),
    isBookmarked: z.boolean().default(false),
    createdAt: z.coerce.date().optional(),
});

// ─── getTagsCatalogue (Rich Paginated, Infinite & Filtered) ────────────────────

export const GetTagsCatalogueInputSchema = z.discriminatedUnion('mode', [
    z.object({
        mode: z.literal('paginated'),
        userId: z.string().optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(6),
        filters: TagFilterSchema.optional(),
        sorting: TagSortingSchema.optional(),
    }),
    z.object({
        mode: z.literal('infinite'),
        userId: z.string().optional(),
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(6),
        filters: TagFilterSchema.optional(),
        sorting: TagSortingSchema.optional(),
    }),
    z.object({
        mode: z.literal('filtered'),
        userId: z.string().optional(),
        filters: TagFilterSchema.optional(),
        sorting: TagSortingSchema.optional(),
    }),
]);

export const GetTagsCatalogueOutputSchema = z.discriminatedUnion('mode', [
    z.object({
        mode: z.literal('paginated'),
        items: z.array(TagCardItemSchema),
        total: z.number().int(),
        page: z.number().int(),
        limit: z.number().int(),
        totalPages: z.number().int(),
        hasNextPage: z.boolean(),
    }),
    z.object({
        mode: z.literal('infinite'),
        items: z.array(TagCardItemSchema),
        total: z.number().int(),
        nextCursor: z.string().nullable(),
    }),
    z.object({
        mode: z.literal('filtered'),
        items: z.array(TagCardItemSchema),
        total: z.number().int(),
    }),
]);

// ─── getSingleTagProgress ──────────────────────────────────────────────────────
// Returns tag progress stats matching ProblemProgressCard / DetailInfoProgress.

export const GetSingleTagProgressInputSchema = z
    .object({
        tagSlug: z.string().optional(),
        tagId: z.string().optional(),
        userId: z.string().optional(),
    })
    .refine((d) => d.tagSlug || d.tagId, {
        message: 'At least one of tagSlug or tagId must be provided',
    });

export const GetSingleTagProgressOutputSchema = z.object({
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
// Returns lean tag metadata & module relationship.

export const GetSingleTagInputSchema = z
    .object({
        slug: z.string().optional(),
        id: z.string().optional(),
        userId: z.string().optional(),
    })
    .refine((d) => d.slug || d.id, {
        message: 'At least one of slug or id must be provided',
    });

export const GetSingleTagOutputSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    level: LevelSchema.nullable().optional(),
    isBookmarked: z.boolean().default(false),
    problemsCount: z.number().int().default(0),
    module: z
        .object({
            title: z.string(),
            slug: z.string(),
        })
        .optional(),
});

// ─── getTagSuggestions ────────────────────────────────────────────────────────
// Returns semantic similarity tag suggestions.

export const SimilarTagSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    level: LevelSchema.nullable().optional(),
    moduleTitle: z.string().optional(),
    moduleSlug: z.string().optional(),
    problemsCount: z.number().int(),
});

export const GetTagSuggestionsInputSchema = z
    .object({
        tagSlug: z.string().optional(),
        tagId: z.string().optional(),
    })
    .refine((d) => d.tagSlug || d.tagId, {
        message: 'At least one of tagSlug or tagId must be provided',
    });

export const GetTagSuggestionsOutputSchema = z.array(SimilarTagSchema);

// ─── toggleTagBookmark ─────────────────────────────────────────────────────────

export const ToggleTagBookmarkInputSchema = z
    .object({
        tagId: z.string().optional(),
        tagSlug: z.string().optional(),
        userId: z.string(),
    })
    .refine((d) => d.tagId || d.tagSlug, {
        message: 'At least one of tagId or tagSlug must be provided',
    });

export const ToggleTagBookmarkOutputSchema = z.object({
    isBookmarked: z.boolean(),
    tagId: z.string(),
});

// ─── getUserTagProgressByLevel ───────────────────────────────────────────────

export const GetUserTagProgressByLevelInputSchema = z.object({
    userId: z.string(),
    moduleSlug: z.string().optional(),
    moduleId: z.string().optional(),
});

export const TagProgressItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    level: LevelSchema.nullable().optional(),
    solvedCount: z.number().int(),
    totalProblems: z.number().int(),
});

export const GetUserTagProgressByLevelOutputSchema = z.object({
    fundamental: z.array(TagProgressItemSchema),
    intermediate: z.array(TagProgressItemSchema),
    advanced: z.array(TagProgressItemSchema),
});
