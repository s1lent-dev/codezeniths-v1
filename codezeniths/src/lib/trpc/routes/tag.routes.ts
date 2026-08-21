import { createTRPCRouter } from '../trpc';
import { protectedProcedure, publicProcedure } from '../trpc/trpc.procedure';
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
    ToggleTagBookmarkTRPCOutputSchema,
    GetUserTagProgressByLevelTRPCInputSchema,
    GetUserTagProgressByLevelTRPCOutputSchema,
} from '@/schemas/trpc';

export const tagRouter = createTRPCRouter({
    getTags: publicProcedure
        .output(GetTagsTRPCOutputSchema)
        .query(({ ctx }) => ctx.controllers.tag.getTags({ ctx })),

    getTagsFiltered: publicProcedure
        .input(GetTagsFilteredTRPCInputSchema)
        .output(GetTagsFilteredTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getTagsFiltered({ ctx, input })),

    getSingleTagProblems: protectedProcedure
        .input(GetSingleTagProblemsTRPCInputSchema)
        .output(GetSingleTagProblemsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getSingleTagProblems({ ctx, input })),

    getSingleTagProblemProgress: protectedProcedure
        .input(GetSingleTagProblemProgressTRPCInputSchema)
        .output(GetSingleTagProblemProgressTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getSingleTagProblemProgress({ ctx, input })),

    getSingleTag: publicProcedure
        .input(GetSingleTagTRPCInputSchema)
        .output(GetSingleTagTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getSingleTag({ ctx, input })),

    toggleTagBookmark: protectedProcedure
        .input(ToggleTagBookmarkTRPCInputSchema)
        .output(ToggleTagBookmarkTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.tag.toggleTagBookmark({ ctx, input })),

    getUserTagProgressByLevel: publicProcedure
        .input(GetUserTagProgressByLevelTRPCInputSchema)
        .output(GetUserTagProgressByLevelTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.tag.getUserTagProgressByLevel({ ctx, input })),
});

