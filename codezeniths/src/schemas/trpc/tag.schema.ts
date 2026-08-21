import { z } from 'zod';
import {
    GetTagsOutputSchema,
    GetTagsFilteredOutputSchema,
    TagFilterSchema,
    TagSortingSchema,
    GetSingleTagProblemsOutputSchema,
    GetSingleTagProblemProgressOutputSchema,
    GetSingleTagOutputSchema,
} from '@codezeniths/schemas/db';

// ─── getTags ───────────────────────────────────────────────────────────────────

export const GetTagsTRPCOutputSchema = GetTagsOutputSchema;

// ─── getTagsFiltered ───────────────────────────────────────────────────────────

export const GetTagsFilteredTRPCInputSchema = z.object({
    filters: TagFilterSchema.optional(),
    sorting: TagSortingSchema.optional(),
});

export const GetTagsFilteredTRPCOutputSchema = GetTagsFilteredOutputSchema;


// ─── getSingleTagProblems ──────────────────────────────────────────────────────

export const GetSingleTagProblemsTRPCInputSchema = z.object({
    id: z.uuidv7().optional(),
    slug: z.string().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

export const GetSingleTagProblemsTRPCOutputSchema = GetSingleTagProblemsOutputSchema;

// ─── getSingleTagProblemProgress ────────────────────────────────────────────────

export const GetSingleTagProblemProgressTRPCInputSchema = z.object({
    tagId: z.uuidv7().optional(),
    tagSlug: z.string().optional(),
}).refine((d) => d.tagSlug || d.tagId, {
    message: 'At least one of tagSlug or tagId must be provided',
});

export const GetSingleTagProblemProgressTRPCOutputSchema = GetSingleTagProblemProgressOutputSchema;

// ─── getSingleTag ─────────────────────────────────────────────────────────────

export const GetSingleTagTRPCInputSchema = z.object({
    id: z.uuidv7().optional(),
    slug: z.string().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

export const GetSingleTagTRPCOutputSchema = GetSingleTagOutputSchema;

// ─── toggleTagBookmark ─────────────────────────────────────────────────────────

export const ToggleTagBookmarkTRPCInputSchema = z.object({
    tagId: z.uuidv7().optional(),
    tagSlug: z.string().optional(),
}).refine((d) => d.tagId || d.tagSlug, {
    message: 'At least one of tagId or tagSlug must be provided',
});

export const ToggleTagBookmarkTRPCOutputSchema = z.object({
    isBookmarked: z.boolean(),
    tagId: z.uuidv7(),
});

// ─── getUserTagProgressByLevel ───────────────────────────────────────────────

export const GetUserTagProgressByLevelTRPCInputSchema = z.object({
    userId: z.string().uuid().optional(),
    moduleSlug: z.string().optional(),
    moduleId: z.string().uuid().optional(),
});

export const TagProgressItemTRPCSchema = z.object({
    id: z.string().uuid(),
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

