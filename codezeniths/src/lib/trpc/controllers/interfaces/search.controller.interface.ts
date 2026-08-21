import { TRPCContext } from '../../trpc/trpc.context';
import {
    AutocompleteTRPCInputSchema,
    AutocompleteTRPCOutputSchema,
    MoreLikeThisTRPCInputSchema,
    MoreLikeThisTRPCOutputSchema,
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
import { z } from 'zod';

export interface ISearchController {
    reindexAll(args: {
        ctx: TRPCContext;
    }): Promise<{ success: boolean; message: string; summaries: unknown[] }>;

    autocomplete(args: {
        ctx: TRPCContext;
        input: z.infer<typeof AutocompleteTRPCInputSchema>;
    }): Promise<z.infer<typeof AutocompleteTRPCOutputSchema>>;

    getRecommendations(args: {
        ctx: TRPCContext;
        input: z.infer<typeof MoreLikeThisTRPCInputSchema>;
    }): Promise<z.infer<typeof MoreLikeThisTRPCOutputSchema>>;

    searchQuery(args: {
        ctx: TRPCContext;
        input: z.infer<typeof SearchTRPCInputSchema>;
    }): Promise<z.infer<typeof SearchTRPCOutputSchema>>;

    recordSelection(args: {
        ctx: TRPCContext;
        input: z.infer<typeof RecordSearchSelectionTRPCInputSchema>;
    }): Promise<z.infer<typeof RecordSearchSelectionTRPCOutputSchema>>;

    getRecentHistory(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetRecentSearchHistoryTRPCInputSchema>;
    }): Promise<z.infer<typeof GetRecentSearchHistoryTRPCOutputSchema>>;

    getSearchHistoryInfinite(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetSearchHistoryInfiniteTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSearchHistoryInfiniteTRPCOutputSchema>>;

    getSearchHistoryStats(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetSearchHistoryStatsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSearchHistoryStatsTRPCOutputSchema>>;

    deleteHistoryItem(args: {
        ctx: TRPCContext;
        input: z.infer<typeof DeleteSearchHistoryItemTRPCInputSchema>;
    }): Promise<z.infer<typeof DeleteSearchHistoryItemTRPCOutputSchema>>;

    clearHistory(args: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof ClearSearchHistoryTRPCOutputSchema>>;
}

