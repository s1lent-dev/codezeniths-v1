import { createTRPCRouter } from '../trpc';
import { protectedProcedure, publicProcedure } from '../trpc/trpc.procedure';
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
    ToggleTagBookmarkTRPCOutputSchema,
    GetUserTagProgressByLevelTRPCInputSchema,
    GetUserTagProgressByLevelTRPCOutputSchema,
} from '@/schemas/trpc';

export const tagRouter = createTRPCRouter({
    getTags: publicProcedure
        .output(GetTagsTRPCOutputSchema)
        .query(({ ctx }) => ctx.controllers.tag.getTags({ ctx })),

    getTagsCatalogue: publicProcedure
        .input(GetTagsCatalogueTRPCInputSchema)
        .output(GetTagsCatalogueTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getTagsCatalogue({ ctx, input })),

    getSingleTagProgress: publicProcedure
        .input(GetSingleTagProgressTRPCInputSchema)
        .output(GetSingleTagProgressTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getSingleTagProgress({ ctx, input })),

    getSingleTag: publicProcedure
        .input(GetSingleTagTRPCInputSchema)
        .output(GetSingleTagTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getSingleTag({ ctx, input })),

    getTagSuggestions: publicProcedure
        .input(GetTagSuggestionsTRPCInputSchema)
        .output(GetTagSuggestionsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getTagSuggestions({ ctx, input })),

    toggleTagBookmark: protectedProcedure
        .input(ToggleTagBookmarkTRPCInputSchema)
        .output(ToggleTagBookmarkTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.tag.toggleTagBookmark({ ctx, input })),

    getUserTagProgressByLevel: publicProcedure
        .input(GetUserTagProgressByLevelTRPCInputSchema)
        .output(GetUserTagProgressByLevelTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getUserTagProgressByLevel({ ctx, input })),
});
