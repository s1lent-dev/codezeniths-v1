import { createTRPCRouter } from '../trpc';
import { publicProcedure, protectedProcedure } from '../trpc/trpc.procedure';
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

export const searchRouter = createTRPCRouter({
    reindexAll: publicProcedure
        .mutation(async ({ ctx }) => {
            return ctx.controllers.search.reindexAll({ ctx });
        }),

    autocomplete: publicProcedure
        .input(AutocompleteTRPCInputSchema)
        .output(AutocompleteTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.search.autocomplete({ ctx, input })),

    recommendations: publicProcedure
        .input(MoreLikeThisTRPCInputSchema)
        .output(MoreLikeThisTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.search.getRecommendations({ ctx, input })),

    query: publicProcedure
        .input(SearchTRPCInputSchema)
        .output(SearchTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.search.searchQuery({ ctx, input })),

    recordSelection: protectedProcedure
        .input(RecordSearchSelectionTRPCInputSchema)
        .output(RecordSearchSelectionTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.search.recordSelection({ ctx, input })),

    getRecentHistory: protectedProcedure
        .input(GetRecentSearchHistoryTRPCInputSchema)
        .output(GetRecentSearchHistoryTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.search.getRecentHistory({ ctx, input })),

    getSearchHistoryInfinite: protectedProcedure
        .input(GetSearchHistoryInfiniteTRPCInputSchema)
        .output(GetSearchHistoryInfiniteTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.search.getSearchHistoryInfinite({ ctx, input })),

    getSearchHistoryStats: protectedProcedure
        .input(GetSearchHistoryStatsTRPCInputSchema)
        .output(GetSearchHistoryStatsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.search.getSearchHistoryStats({ ctx, input })),

    deleteHistoryItem: protectedProcedure
        .input(DeleteSearchHistoryItemTRPCInputSchema)
        .output(DeleteSearchHistoryItemTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.search.deleteHistoryItem({ ctx, input })),

    clearHistory: protectedProcedure
        .output(ClearSearchHistoryTRPCOutputSchema)
        .mutation(({ ctx }) => ctx.controllers.search.clearHistory({ ctx })),
});

