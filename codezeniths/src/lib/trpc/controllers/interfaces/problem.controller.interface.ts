import { TRPCContext } from '../../trpc/trpc.context';
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
    GetRecentlySolvedContextTRPCInputSchema,
    GetRecentlySolvedContextTRPCOutputSchema,
    GetTrendingProblemsTRPCInputSchema,
    GetTrendingProblemsTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IProblemController {
    getProblems(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemsTRPCOutputSchema>>;

    getProblemNote(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProblemNoteTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemNoteTRPCOutputSchema>>;

    updateProblem(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdateProblemTRPCInputSchema>;
    }): Promise<z.infer<typeof UpdateProblemTRPCOutputSchema>>;

    getProblemTablePrimitives(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProblemTablePrimitivesTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemTablePrimitivesTRPCOutputSchema>>;

    getProblemProgress(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetProblemProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemProgressTRPCOutputSchema>>;

    getRecentlySolvedProblems(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetRecentlySolvedProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetRecentlySolvedProblemsTRPCOutputSchema>>;

    getRecentlySolvedContext(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetRecentlySolvedContextTRPCInputSchema>;
    }): Promise<z.infer<typeof GetRecentlySolvedContextTRPCOutputSchema>>;

    getTrendingProblems(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetTrendingProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTrendingProblemsTRPCOutputSchema>>;
}
