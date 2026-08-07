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

