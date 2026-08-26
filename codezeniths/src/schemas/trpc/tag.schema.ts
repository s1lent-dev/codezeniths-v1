import { z } from 'zod';
import {
    GetTagsOutputSchema,
    GetTagsCatalogueInputSchema,
    GetTagsCatalogueOutputSchema,
    TagFilterSchema,
    TagSortingSchema,
    GetSingleTagProgressOutputSchema,
    GetSingleTagOutputSchema,
    GetTagSuggestionsOutputSchema,
} from '@codezeniths/schemas/db';

// ─── getTags (Lightweight Navbar / Chips Catalog) ──────────────────────────────

export const GetTagsTRPCOutputSchema = GetTagsOutputSchema;

// ─── getTagsCatalogue (Rich Paginated, Infinite & Filtered) ────────────────────

export const GetTagsCatalogueTRPCInputSchema = z.discriminatedUnion('mode', [
    z.object({
        mode: z.literal('paginated'),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(6),
        filters: TagFilterSchema.optional(),
        sorting: TagSortingSchema.optional(),
    }),
    z.object({
        mode: z.literal('infinite'),
        cursor: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(6),
        filters: TagFilterSchema.optional(),
        sorting: TagSortingSchema.optional(),
    }),
    z.object({
        mode: z.literal('filtered'),
        filters: TagFilterSchema.optional(),
        sorting: TagSortingSchema.optional(),
    }),
]);

export const GetTagsCatalogueTRPCOutputSchema = GetTagsCatalogueOutputSchema;

// ─── getSingleTagProgress ──────────────────────────────────────────────────────

export const GetSingleTagProgressTRPCInputSchema = z
    .object({
        tagId: z.string().optional(),
        tagSlug: z.string().optional(),
    })
    .refine((d) => d.tagSlug || d.tagId, {
        message: 'At least one of tagSlug or tagId must be provided',
    });

export const GetSingleTagProgressTRPCOutputSchema = GetSingleTagProgressOutputSchema;

// ─── getSingleTag ─────────────────────────────────────────────────────────────

export const GetSingleTagTRPCInputSchema = z
    .object({
        id: z.string().optional(),
        slug: z.string().optional(),
    })
    .refine((d) => d.slug || d.id, {
        message: 'At least one of slug or id must be provided',
    });

export const GetSingleTagTRPCOutputSchema = GetSingleTagOutputSchema;

// ─── getTagSuggestions ────────────────────────────────────────────────────────

export const GetTagSuggestionsTRPCInputSchema = z
    .object({
        tagId: z.string().optional(),
        tagSlug: z.string().optional(),
    })
    .refine((d) => d.tagSlug || d.tagId, {
        message: 'At least one of tagSlug or tagId must be provided',
    });

export const GetTagSuggestionsTRPCOutputSchema = GetTagSuggestionsOutputSchema;

// ─── toggleTagBookmark ─────────────────────────────────────────────────────────

export const ToggleTagBookmarkTRPCInputSchema = z
    .object({
        tagId: z.string().optional(),
        tagSlug: z.string().optional(),
    })
    .refine((d) => d.tagId || d.tagSlug, {
        message: 'At least one of tagId or tagSlug must be provided',
    });

export const ToggleTagBookmarkTRPCOutputSchema = z.object({
    isBookmarked: z.boolean(),
    tagId: z.string(),
});

// ─── getUserTagProgressByLevel ───────────────────────────────────────────────

export const GetUserTagProgressByLevelTRPCInputSchema = z.object({
    userId: z.string().optional(),
    moduleSlug: z.string().optional(),
    moduleId: z.string().optional(),
});

export const TagProgressItemTRPCSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    level: z.enum(['fundamental', 'intermediate', 'advanced']).nullable().optional(),
    solvedCount: z.number().int(),
    totalProblems: z.number().int(),
});

export const GetUserTagProgressByLevelTRPCOutputSchema = z.object({
    fundamental: z.array(TagProgressItemTRPCSchema),
    intermediate: z.array(TagProgressItemTRPCSchema),
    advanced: z.array(TagProgressItemTRPCSchema),
});
