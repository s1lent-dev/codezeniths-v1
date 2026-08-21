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
} from '@/schemas/trpc';
import { z } from 'zod';

export class TopicQueryService implements ITopicQueryService {
    getSingleTopic(input: z.infer<typeof GetSingleTopicTRPCInputSchema>) {
        const validatedInput = GetSingleTopicTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.topic.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.topic.getSingleTopic.query(validatedInput);
                return GetSingleTopicTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleTopicProgress(input: z.infer<typeof GetSingleTopicProgressTRPCInputSchema>) {
        const validatedInput = GetSingleTopicProgressTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.topicSlug || validatedInput.topicId || 'unknown';
        return useQuery({
            queryKey: queryKeys.topic.progress(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.topic.getSingleTopicProgress.query(validatedInput);
                return GetSingleTopicProgressTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }
}

export const topicQueryService = new TopicQueryService();
