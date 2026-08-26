'use client';

import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import type { ITopicQueryService } from '../interfaces';
import {
    GetSingleTopicTRPCInputSchema,
    GetSingleTopicTRPCOutputSchema,
    GetSingleTopicProgressTRPCInputSchema,
    GetSingleTopicProgressTRPCOutputSchema,
    GetTopicSuggestionsTRPCInputSchema,
    GetTopicSuggestionsTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export class TopicQueryService implements ITopicQueryService {
    getSingleTopic(input: z.infer<typeof GetSingleTopicTRPCInputSchema>, options?: { enabled?: boolean }) {
        const validatedInput = GetSingleTopicTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.topic.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.topic.getSingleTopic.query(validatedInput);
                return GetSingleTopicTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleTopicProgress(input: z.infer<typeof GetSingleTopicProgressTRPCInputSchema>, options?: { enabled?: boolean }) {
        const validatedInput = GetSingleTopicProgressTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.topicSlug || validatedInput.topicId || 'unknown';
        return useQuery({
            queryKey: queryKeys.topic.progress(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.topic.getSingleTopicProgress.query(validatedInput);
                return GetSingleTopicProgressTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getTopicSuggestions(input: z.infer<typeof GetTopicSuggestionsTRPCInputSchema>, options?: { enabled?: boolean }) {
        const validatedInput = GetTopicSuggestionsTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.topicSlug || validatedInput.topicId || 'unknown';
        return useQuery({
            queryKey: queryKeys.topic.suggestions(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.topic.getTopicSuggestions.query(validatedInput);
                return GetTopicSuggestionsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled,
            ...CACHE_TIERS.STATIC_CATALOG,
        });
    }
}

export const topicQueryService = new TopicQueryService();
