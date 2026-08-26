'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import { CacheInvalidationService } from '../cache-invalidation.service';
import type { IModuleQueryService } from '../interfaces';
import {
    GetModulesTRPCOutputSchema,
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleTRPCOutputSchema,
    GetSingleModuleProgressTRPCInputSchema,
    GetSingleModuleProgressTRPCOutputSchema,
    GetRecentlySolvedModuleTRPCOutputSchema,
    GetModulesWithTopicsTRPCOutputSchema,
    ToggleModuleBookmarkTRPCInputSchema,
    ToggleTopicBookmarkTRPCInputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export class ModuleQueryService implements IModuleQueryService {
    getModules() {
        return useQuery({
            queryKey: queryKeys.module.list(),
            queryFn: async () => {
                const raw = await trpcClient.module.getModules.query();
                return GetModulesTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.STATIC_CATALOG,
        });
    }

    getSingleModule(input: z.infer<typeof GetSingleModuleTRPCInputSchema>, options?: { enabled?: boolean }) {
        const validatedInput = GetSingleModuleTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.module.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.module.getSingleModule.query(validatedInput);
                return GetSingleModuleTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleModuleProgress(input: z.infer<typeof GetSingleModuleProgressTRPCInputSchema>, options?: { enabled?: boolean }) {
        const validatedInput = GetSingleModuleProgressTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.moduleSlug || validatedInput.moduleId || 'unknown';
        return useQuery({
            queryKey: queryKeys.module.progress(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.module.getSingleModuleProgress.query(validatedInput);
                return GetSingleModuleProgressTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getRecentlySolvedModule() {
        return useQuery({
            queryKey: queryKeys.module.recentlySolved(),
            queryFn: async () => {
                const raw = await trpcClient.module.getRecentlySolvedModule.query();
                return GetRecentlySolvedModuleTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getModulesWithTopics() {
        return useQuery({
            queryKey: queryKeys.module.listWithTopics(),
            queryFn: async () => {
                const raw = await trpcClient.module.getModulesWithTopics.query();
                return GetModulesWithTopicsTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    toggleModuleBookmark() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (input: z.infer<typeof ToggleModuleBookmarkTRPCInputSchema>) => {
                return await trpcClient.module.toggleModuleBookmark.mutate(input);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnModuleBookmarkChange(queryClient);
            },
        });
    }

    toggleTopicBookmark() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (input: z.infer<typeof ToggleTopicBookmarkTRPCInputSchema>) => {
                return await trpcClient.module.toggleTopicBookmark.mutate(input);
            },
            onMutate: async (variables) => {
                const key = variables.topicSlug || variables.topicId;
                await queryClient.cancelQueries({ queryKey: ['topic'] });

                const previousSingleTopic = key ? queryClient.getQueryData(queryKeys.topic.single(key)) : undefined;

                if (key) {
                    queryClient.setQueryData(queryKeys.topic.single(key), (old: any) => {
                        if (!old) return old;
                        return {
                            ...old,
                            isBookmarked: !old.isBookmarked,
                        };
                    });
                }

                return { previousSingleTopic, key };
            },
            onError: (_err, _variables, context) => {
                if (context?.key && context?.previousSingleTopic) {
                    queryClient.setQueryData(queryKeys.topic.single(context.key), context.previousSingleTopic);
                }
            },
            onSettled: async (_data, _error, variables) => {
                const key = variables.topicSlug || variables.topicId;
                if (key) {
                    queryClient.invalidateQueries({ queryKey: queryKeys.topic.single(key) });
                }
                await CacheInvalidationService.invalidateOnModuleBookmarkChange(queryClient);
            },
        });
    }
}

export const moduleQueryService = new ModuleQueryService();
