import { createTRPCRouter } from '../trpc';
import { publicProcedure, protectedProcedure } from '../trpc/trpc.procedure';
import {
    GetModulesTRPCOutputSchema,
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleTRPCOutputSchema,
    GetSingleModuleProgressTRPCInputSchema,
    GetSingleModuleProgressTRPCOutputSchema,
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
});
