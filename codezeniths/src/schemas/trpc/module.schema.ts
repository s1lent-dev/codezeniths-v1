import { z } from 'zod';
import {
    GetModulesOutputSchema,
    GetSingleModuleOutputSchema,
    GetSingleModuleProgressOutputSchema,
    GetRecentlySolvedModuleOutputSchema,
    GetModulesWithTopicsOutputSchema,
} from '@codezeniths/schemas/db';

// ─── getModules ────────────────────────────────────────────────────────────────

export const GetModulesTRPCOutputSchema = GetModulesOutputSchema;

// ─── getSingleModule ───────────────────────────────────────────────────────────

export const GetSingleModuleTRPCInputSchema = z.object({
    id: z.uuidv7().optional(),
    slug: z.string().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

export const GetSingleModuleTRPCOutputSchema = GetSingleModuleOutputSchema;

// ─── getSingleModuleProgress ───────────────────────────────────────────────────

export const GetSingleModuleProgressTRPCInputSchema = z.object({
    moduleId: z.uuidv7().optional(),
    moduleSlug: z.string().optional(),
}).refine((d) => d.moduleSlug || d.moduleId, {
    message: 'At least one of moduleSlug or moduleId must be provided',
});

export const GetSingleModuleProgressTRPCOutputSchema = GetSingleModuleProgressOutputSchema;

// ─── getRecentlySolvedModule ───────────────────────────────────────────────────

export const GetRecentlySolvedModuleTRPCOutputSchema = GetRecentlySolvedModuleOutputSchema;

// ─── getModulesWithTopics ──────────────────────────────────────────────────────

export const GetModulesWithTopicsTRPCInputSchema = z.object({}).optional();
export const GetModulesWithTopicsTRPCOutputSchema = GetModulesWithTopicsOutputSchema;

// ─── toggleModuleBookmark ──────────────────────────────────────────────────────

export const ToggleModuleBookmarkTRPCInputSchema = z.object({
    moduleId: z.uuidv7().optional(),
    moduleSlug: z.string().optional(),
}).refine((d) => d.moduleId || d.moduleSlug, {
    message: 'At least one of moduleId or moduleSlug must be provided',
});

export const ToggleModuleBookmarkTRPCOutputSchema = z.object({
    isBookmarked: z.boolean(),
    moduleId: z.uuidv7(),
});

// ─── toggleTopicBookmark ───────────────────────────────────────────────────────

export const ToggleTopicBookmarkTRPCInputSchema = z.object({
    topicId: z.uuidv7().optional(),
    topicSlug: z.string().optional(),
}).refine((d) => d.topicId || d.topicSlug, {
    message: 'At least one of topicId or topicSlug must be provided',
});

export const ToggleTopicBookmarkTRPCOutputSchema = z.object({
    isBookmarked: z.boolean(),
    topicId: z.uuidv7(),
});
