import { createTRPCRouter } from '../trpc';
import { publicProcedure } from '../trpc/trpc.procedure';
import {
    AutocompleteTRPCInputSchema,
    AutocompleteTRPCOutputSchema,
    MoreLikeThisTRPCInputSchema,
    MoreLikeThisTRPCOutputSchema,
    SearchTRPCInputSchema,
    SearchTRPCOutputSchema,
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
});
