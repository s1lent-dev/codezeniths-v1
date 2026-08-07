import { z } from 'zod';
import {
    GetModulesOutputSchema,
    GetSingleModuleOutputSchema,
    GetSingleModuleProgressOutputSchema,
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
