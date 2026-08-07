import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import type { ISearchQueryService } from '../interfaces';
import { z } from 'zod';
import {
    SearchTRPCInputSchema,
    SearchTRPCOutputSchema,
    AutocompleteTRPCInputSchema,
    AutocompleteTRPCOutputSchema,
    MoreLikeThisTRPCInputSchema,
    MoreLikeThisTRPCOutputSchema,
} from '@/schemas/trpc';

type SearchInput = Omit<z.infer<typeof SearchTRPCInputSchema>, 'collection'>;
type AutocompleteInput = Omit<z.infer<typeof AutocompleteTRPCInputSchema>, 'collection'>;
type RecommendationsInput = Omit<z.infer<typeof MoreLikeThisTRPCInputSchema>, 'collection'>;

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
        });
    }

    autocomplete(collectionName: string, input: AutocompleteInput, enabled: boolean = true) {
        const fullInput = { ...input, collection: collectionName };
        const validatedInput = AutocompleteTRPCInputSchema.parse(fullInput);
        
        return useQuery({
            queryKey: queryKeys.search.autocomplete(collectionName, validatedInput),
            queryFn: async () => {
                if (!validatedInput.prefix) return [];
                const raw = await trpcClient.search.autocomplete.query(validatedInput);
                return AutocompleteTRPCOutputSchema.parse(raw);
            },
            enabled,
            staleTime: 1000 * 60 * 5,
        });
    }

    getRecommendations(collectionName: string, input: RecommendationsInput, enabled: boolean = true) {
        const fullInput = { ...input, collection: collectionName };
        const validatedInput = MoreLikeThisTRPCInputSchema.parse(fullInput);
        
        return useQuery({
            queryKey: queryKeys.search.recommendations(collectionName, validatedInput),
            queryFn: async () => {
                if (!validatedInput.id) return [];
                const raw = await trpcClient.search.recommendations.query(validatedInput);
                return MoreLikeThisTRPCOutputSchema.parse(raw);
            },
            enabled,
            staleTime: 1000 * 60 * 5,
        });
    }
}

export const searchQueryService = new SearchQueryService();
