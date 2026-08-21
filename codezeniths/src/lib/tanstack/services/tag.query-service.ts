'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import type { ITagQueryService } from '../interfaces';
import {
    GetTagsTRPCOutputSchema,
    GetTagsFilteredTRPCInputSchema,
    GetTagsFilteredTRPCOutputSchema,
    GetSingleTagProblemsTRPCInputSchema,
    GetSingleTagProblemsTRPCOutputSchema,
    GetSingleTagProblemProgressTRPCInputSchema,
    GetSingleTagProblemProgressTRPCOutputSchema,
    GetSingleTagTRPCInputSchema,
    GetSingleTagTRPCOutputSchema,
    ToggleTagBookmarkTRPCInputSchema,
    GetUserTagProgressByLevelTRPCInputSchema,
    GetUserTagProgressByLevelTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export class TagQueryService implements ITagQueryService {
    getTags() {
        return useQuery({
            queryKey: queryKeys.tag.list(),
            queryFn: async () => {
                const raw = await trpcClient.tag.getTags.query();
                return GetTagsTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.STATIC_CATALOG,
        });
    }

    getTagsFiltered(input?: z.infer<typeof GetTagsFilteredTRPCInputSchema>) {
        const validatedInput = GetTagsFilteredTRPCInputSchema.optional().parse(input) || {};
        return useQuery({
            queryKey: queryKeys.tag.list(validatedInput),
            queryFn: async () => {
                const raw = await trpcClient.tag.getTagsFiltered.query(validatedInput);
                return GetTagsFilteredTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleTagProblems(input: z.infer<typeof GetSingleTagProblemsTRPCInputSchema>) {
        const validatedInput = GetSingleTagProblemsTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.singleProblems(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTagProblems.query(validatedInput);
                return GetSingleTagProblemsTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleTagProblemProgress(input: z.infer<typeof GetSingleTagProblemProgressTRPCInputSchema>) {
        const validatedInput = GetSingleTagProblemProgressTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.tagSlug || validatedInput.tagId || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.progress(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTagProblemProgress.query(validatedInput);
                return GetSingleTagProblemProgressTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleTag(input: z.infer<typeof GetSingleTagTRPCInputSchema>) {
        const validatedInput = GetSingleTagTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTag.query(validatedInput);
                return GetSingleTagTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    toggleTagBookmark() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (input: z.infer<typeof ToggleTagBookmarkTRPCInputSchema>) => {
                return await trpcClient.tag.toggleTagBookmark.mutate(input);
            },
            onSuccess: (_data, variables) => {
                const key = variables.tagSlug || variables.tagId;
                if (key) {
                    queryClient.invalidateQueries({ queryKey: queryKeys.tag.single(key) });
                }
                queryClient.invalidateQueries({ queryKey: ['tag'] });
                queryClient.invalidateQueries({ queryKey: ['user', 'profileDetails'] });
            },
        });
    }

    getUserTagProgressByLevel(
        input?: { userId?: string; moduleSlug?: string; moduleId?: string },
        options?: { enabled?: boolean }
    ) {
        return useQuery({
            queryKey: queryKeys.tag.progressByLevel(input?.userId, input?.moduleSlug || input?.moduleId),
            queryFn: async () => {
                const validatedInput = GetUserTagProgressByLevelTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.tag.getUserTagProgressByLevel.query(validatedInput);
                return GetUserTagProgressByLevelTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }
}

export const tagQueryService = new TagQueryService();
