import { z } from 'zod';
import {
    GetSingleTopicOutputSchema,
    GetSingleTopicProgressOutputSchema,
    GetTopicSuggestionsOutputSchema,
} from '@codezeniths/schemas/db';

// ─── getSingleTopic ────────────────────────────────────────────────────────────

export const GetSingleTopicTRPCInputSchema = z.object({
    id: z.uuidv7().optional(),
    slug: z.string().optional(),
}).refine((d) => d.slug || d.id, {
    message: 'At least one of slug or id must be provided',
});

export const GetSingleTopicTRPCOutputSchema = GetSingleTopicOutputSchema;

// ─── getSingleTopicProgress ────────────────────────────────────────────────────

export const GetSingleTopicProgressTRPCInputSchema = z.object({
    topicId: z.uuidv7().optional(),
    topicSlug: z.string().optional(),
}).refine((d) => d.topicSlug || d.topicId, {
    message: 'At least one of topicSlug or topicId must be provided',
});

export const GetSingleTopicProgressTRPCOutputSchema = GetSingleTopicProgressOutputSchema;

// ─── getTopicSuggestions ───────────────────────────────────────────────────────

export const GetTopicSuggestionsTRPCInputSchema = z.object({
    topicId: z.uuidv7().optional(),
    topicSlug: z.string().optional(),
}).refine((d) => d.topicSlug || d.topicId, {
    message: 'At least one of topicSlug or topicId must be provided',
});

export const GetTopicSuggestionsTRPCOutputSchema = GetTopicSuggestionsOutputSchema;
