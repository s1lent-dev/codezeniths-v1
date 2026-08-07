import { createTRPCRouter } from '../trpc';
import { publicProcedure, protectedProcedure } from '../trpc/trpc.procedure';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
    UpdateProblemTRPCInputSchema,
    UpdateProblemTRPCOutputSchema,
    GetProblemTablePrimitivesTRPCInputSchema,
    GetProblemTablePrimitivesTRPCOutputSchema,
    GetProblemProgressTRPCOutputSchema,
} from '@/schemas/trpc';

export const problemRouter = createTRPCRouter({
    getProblemTablePrimitives: publicProcedure
        .input(GetProblemTablePrimitivesTRPCInputSchema)
        .output(GetProblemTablePrimitivesTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.problem.getProblemTablePrimitives({ ctx, input })),

    getProblems: publicProcedure
        .input(GetProblemsTRPCInputSchema)
        .output(GetProblemsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.problem.getProblems({ ctx, input })),

    updateProblem: protectedProcedure
        .input(UpdateProblemTRPCInputSchema)
        .output(UpdateProblemTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.problem.updateProblem({ ctx, input })),

    getProblemProgress: protectedProcedure
        .output(GetProblemProgressTRPCOutputSchema)
        .query(({ ctx }) => ctx.controllers.problem.getProblemProgress({ ctx })),
});
