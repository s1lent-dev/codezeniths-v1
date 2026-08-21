import { createTRPCRouter } from '../trpc';
import { publicProcedure, protectedProcedure } from '../trpc/trpc.procedure';
import {
    GetModulesTRPCOutputSchema,
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleTRPCOutputSchema,
    GetSingleModuleProgressTRPCInputSchema,
    GetSingleModuleProgressTRPCOutputSchema,
    GetRecentlySolvedModuleTRPCOutputSchema,
    GetModulesWithTopicsTRPCInputSchema,
    GetModulesWithTopicsTRPCOutputSchema,
    ToggleModuleBookmarkTRPCInputSchema,
    ToggleModuleBookmarkTRPCOutputSchema,
    ToggleTopicBookmarkTRPCInputSchema,
    ToggleTopicBookmarkTRPCOutputSchema,
} from '@/schemas/trpc';

export const moduleRouter = createTRPCRouter({
    getModules: publicProcedure
        .output(GetModulesTRPCOutputSchema)
        .query(({ ctx }) => ctx.controllers.module.getModules({ ctx })),

    getSingleModule: protectedProcedure
        .input(GetSingleModuleTRPCInputSchema)
        .output(GetSingleModuleTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.module.getSingleModule({ ctx, input })),

    getSingleModuleProgress: protectedProcedure
        .input(GetSingleModuleProgressTRPCInputSchema)
        .output(GetSingleModuleProgressTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.module.getSingleModuleProgress({ ctx, input })),

    getRecentlySolvedModule: publicProcedure
        .output(GetRecentlySolvedModuleTRPCOutputSchema)
        .query(({ ctx }) => ctx.controllers.module.getRecentlySolvedModule({ ctx })),

    getModulesWithTopics: publicProcedure
        .input(GetModulesWithTopicsTRPCInputSchema)
        .output(GetModulesWithTopicsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.module.getModulesWithTopics({ ctx, input })),

    toggleModuleBookmark: protectedProcedure
        .input(ToggleModuleBookmarkTRPCInputSchema)
        .output(ToggleModuleBookmarkTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.module.toggleModuleBookmark({ ctx, input })),

    toggleTopicBookmark: protectedProcedure
        .input(ToggleTopicBookmarkTRPCInputSchema)
        .output(ToggleTopicBookmarkTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.module.toggleTopicBookmark({ ctx, input })),
});
