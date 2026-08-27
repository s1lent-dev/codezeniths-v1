import { createTRPCRouter } from '../trpc';
import { publicProcedure, protectedProcedure } from '../trpc/trpc.procedure';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
    GetProblemNoteTRPCInputSchema,
    GetProblemNoteTRPCOutputSchema,
    UpdateProblemTRPCInputSchema,
    UpdateProblemTRPCOutputSchema,
    GetProblemTablePrimitivesTRPCInputSchema,
    GetProblemTablePrimitivesTRPCOutputSchema,
    GetProblemProgressTRPCInputSchema,
    GetProblemProgressTRPCOutputSchema,
    GetRecentlySolvedProblemsTRPCInputSchema,
    GetRecentlySolvedProblemsTRPCOutputSchema,
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

    getProblemNote: publicProcedure
        .input(GetProblemNoteTRPCInputSchema)
        .output(GetProblemNoteTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.problem.getProblemNote({ ctx, input })),

    updateProblem: protectedProcedure
        .input(UpdateProblemTRPCInputSchema)
        .output(UpdateProblemTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.problem.updateProblem({ ctx, input })),

    getProblemProgress: publicProcedure
        .input(GetProblemProgressTRPCInputSchema.optional())
        .output(GetProblemProgressTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.problem.getProblemProgress({ ctx, input })),

    getRecentlySolvedProblems: publicProcedure
        .input(GetRecentlySolvedProblemsTRPCInputSchema)
        .output(GetRecentlySolvedProblemsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.problem.getRecentlySolvedProblems({ ctx, input })),
});
