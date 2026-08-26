'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import { CacheInvalidationService } from '../cache-invalidation.service';
import type { ITagQueryService } from '../interfaces';
import {
    GetTagsTRPCOutputSchema,
    GetTagsCatalogueTRPCInputSchema,
    GetTagsCatalogueTRPCOutputSchema,
    GetSingleTagProgressTRPCInputSchema,
    GetSingleTagProgressTRPCOutputSchema,
    GetSingleTagTRPCInputSchema,
    GetSingleTagTRPCOutputSchema,
    GetTagSuggestionsTRPCInputSchema,
    GetTagSuggestionsTRPCOutputSchema,
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

    getTagsCatalogue(
        input: z.infer<typeof GetTagsCatalogueTRPCInputSchema>,
        options?: { enabled?: boolean }
    ) {
        const validatedInput = GetTagsCatalogueTRPCInputSchema.parse(input);
        return useQuery({
            queryKey: queryKeys.tag.catalogue(validatedInput),
            queryFn: async () => {
                const raw = await trpcClient.tag.getTagsCatalogue.query(validatedInput);
                return GetTagsCatalogueTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getTagsCatalogueInfinite(
        input: { filters?: any; sorting?: any; limit?: number },
        options?: { enabled?: boolean }
    ) {
        const limit = input.limit || 6;
        return useInfiniteQuery({
            queryKey: queryKeys.tag.catalogueInfinite({ filters: input.filters, sorting: input.sorting, limit }),
            queryFn: async ({ pageParam }) => {
                const payload = {
                    mode: 'infinite' as const,
                    cursor: pageParam as string | undefined,
                    limit,
                    filters: input.filters,
                    sorting: input.sorting,
                };
                const raw = await trpcClient.tag.getTagsCatalogue.query(payload);
                const parsed = GetTagsCatalogueTRPCOutputSchema.parse(raw);
                if (parsed.mode !== 'infinite') {
                    throw new Error('Expected infinite tags output');
                }
                return parsed;
            },
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleTagProgress(
        input: z.infer<typeof GetSingleTagProgressTRPCInputSchema>,
        options?: { enabled?: boolean }
    ) {
        const validatedInput = GetSingleTagProgressTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.tagSlug || validatedInput.tagId || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.progress(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTagProgress.query(validatedInput);
                return GetSingleTagProgressTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getSingleTag(
        input: z.infer<typeof GetSingleTagTRPCInputSchema>,
        options?: { enabled?: boolean }
    ) {
        const validatedInput = GetSingleTagTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        const hasValidIdentifier = Boolean(validatedInput.slug) || Boolean(validatedInput.id);
        return useQuery({
            queryKey: queryKeys.tag.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getSingleTag.query(validatedInput);
                return GetSingleTagTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? hasValidIdentifier,
            ...CACHE_TIERS.STATIC_CATALOG,
        });
    }

    getTagSuggestions(
        input: z.infer<typeof GetTagSuggestionsTRPCInputSchema>,
        options?: { enabled?: boolean }
    ) {
        const validatedInput = GetTagSuggestionsTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.tagSlug || validatedInput.tagId || 'unknown';
        return useQuery({
            queryKey: queryKeys.tag.suggestions(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.tag.getTagSuggestions.query(validatedInput);
                return GetTagSuggestionsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.STATIC_CATALOG,
        });
    }

    toggleTagBookmark() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (input: z.infer<typeof ToggleTagBookmarkTRPCInputSchema>) => {
                return await trpcClient.tag.toggleTagBookmark.mutate(input);
            },
            onMutate: async (variables) => {
                const key = variables.tagSlug || variables.tagId;
                await queryClient.cancelQueries({ queryKey: ['tag'] });

                const previousSingleTag = key ? queryClient.getQueryData(queryKeys.tag.single(key)) : undefined;

                if (key) {
                    queryClient.setQueryData(queryKeys.tag.single(key), (old: any) => {
                        if (!old) return old;
                        return {
                            ...old,
                            isBookmarked: !old.isBookmarked,
                        };
                    });
                }

                return { previousSingleTag, key };
            },
            onError: (_err, _variables, context) => {
                if (context?.key && context?.previousSingleTag) {
                    queryClient.setQueryData(queryKeys.tag.single(context.key), context.previousSingleTag);
                }
            },
            onSettled: async (_data, _error, variables) => {
                const key = variables.tagSlug || variables.tagId;
                if (key) {
                    await queryClient.invalidateQueries({ queryKey: queryKeys.tag.single(key) });
                }
                await CacheInvalidationService.invalidateOnTagBookmarkChange(queryClient);
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
