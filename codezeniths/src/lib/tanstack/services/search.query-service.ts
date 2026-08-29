import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CacheInvalidationService } from '../cache-invalidation.service';
import type { ISearchQueryService } from '../interfaces';
import { z } from 'zod';
import {
    SearchTRPCInputSchema,
    SearchTRPCOutputSchema,
    RecordSearchSelectionTRPCInputSchema,
    RecordSearchSelectionTRPCOutputSchema,
    GetRecentSearchHistoryTRPCInputSchema,
    GetRecentSearchHistoryTRPCOutputSchema,
    DeleteSearchHistoryItemTRPCInputSchema,
    DeleteSearchHistoryItemTRPCOutputSchema,
    ClearSearchHistoryTRPCOutputSchema,
    GetSearchHistoryInfiniteTRPCInputSchema,
    GetSearchHistoryInfiniteTRPCOutputSchema,
    GetSearchHistoryStatsTRPCInputSchema,
    GetSearchHistoryStatsTRPCOutputSchema,
} from '@/schemas/trpc';

type SearchInput = Omit<z.infer<typeof SearchTRPCInputSchema>, 'collection'>;

export class SearchQueryService implements ISearchQueryService {
    search(collectionName: string, input: SearchInput, enabled: boolean = true) {
        const fullInput = { ...input, collection: collectionName };
        const validatedInput = SearchTRPCInputSchema.parse(fullInput);
        
        return useQuery({
            queryKey: queryKeys.search.query(collectionName, validatedInput),
            queryFn: async () => {
                if (!validatedInput.query && !validatedInput.autocomplete) return null;
                const raw = await trpcClient.search.query.query(validatedInput);
                return SearchTRPCOutputSchema.parse(raw);
            },
            enabled,
            staleTime: 1000 * 60 * 5, // 5 minutes cache
            placeholderData: (previousData) => previousData,
        });
    }

    getRecentHistory(options?: { enabled?: boolean; limit?: number }) {
        const limit = options?.limit ?? 10;
        return useQuery({
            queryKey: queryKeys.search.history(),
            queryFn: async () => {
                const raw = await trpcClient.search.getRecentHistory.query({ limit });
                return GetRecentSearchHistoryTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            staleTime: 1000 * 60 * 2, // 2 minutes cache
        });
    }

    getSearchHistoryInfinite(
        filters?: { collection?: string; search?: string },
        limit = 6
    ) {
        return useInfiniteQuery({
            queryKey: queryKeys.search.historyInfinite(filters, limit),
            queryFn: async ({ pageParam }) => {
                const input: any = {
                    cursor: pageParam,
                    limit,
                    collection: filters?.collection || 'all',
                    search: filters?.search || undefined,
                };
                const validatedInput = GetSearchHistoryInfiniteTRPCInputSchema.parse(input);
                const raw = await trpcClient.search.getSearchHistoryInfinite.query(validatedInput);
                return GetSearchHistoryInfiniteTRPCOutputSchema.parse(raw);
            },
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (lastPage) => {
                return lastPage.nextCursor ?? undefined;
            },
            staleTime: 1000 * 60 * 2,
        });
    }

    getSearchHistoryStats() {
        return useQuery({
            queryKey: queryKeys.search.historyStats(),
            queryFn: async () => {
                const raw = await trpcClient.search.getSearchHistoryStats.query({});
                return GetSearchHistoryStatsTRPCOutputSchema.parse(raw);
            },
            staleTime: 1000 * 60 * 2,
        });
    }

    recordSelection() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof RecordSearchSelectionTRPCInputSchema>) => {
                const validatedInput = RecordSearchSelectionTRPCInputSchema.parse(variables);
                const raw = await trpcClient.search.recordSelection.mutate(validatedInput);
                return RecordSearchSelectionTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateSearchHistory(queryClient);
            },
        });
    }

    deleteHistoryItem() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof DeleteSearchHistoryItemTRPCInputSchema>) => {
                const validatedInput = DeleteSearchHistoryItemTRPCInputSchema.parse(variables);
                const raw = await trpcClient.search.deleteHistoryItem.mutate(validatedInput);
                return DeleteSearchHistoryItemTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateSearchHistory(queryClient);
            },
        });
    }

    clearHistory() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async () => {
                const raw = await trpcClient.search.clearHistory.mutate();
                return ClearSearchHistoryTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateSearchHistory(queryClient);
            },
        });
    }
}

export const searchQueryService = new SearchQueryService();
