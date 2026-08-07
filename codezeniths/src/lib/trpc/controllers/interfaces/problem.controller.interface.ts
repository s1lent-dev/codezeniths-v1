import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
    UpdateProblemTRPCInputSchema,
    UpdateProblemTRPCOutputSchema,
    GetProblemTablePrimitivesTRPCInputSchema,
    GetProblemTablePrimitivesTRPCOutputSchema,
    GetProblemProgressTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IProblemController {
    getProblems(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemsTRPCOutputSchema>>;

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
    }): Promise<z.infer<typeof GetProblemProgressTRPCOutputSchema>>;
}
