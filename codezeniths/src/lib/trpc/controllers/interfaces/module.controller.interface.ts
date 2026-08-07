import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetModulesTRPCOutputSchema,
    GetSingleModuleTRPCInputSchema,
    GetSingleModuleTRPCOutputSchema,
    GetSingleModuleProgressTRPCInputSchema,
    GetSingleModuleProgressTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IModuleController {
    getModules(args: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetModulesTRPCOutputSchema>>;

    getSingleModule(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleModuleTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleModuleTRPCOutputSchema>>;

    getSingleModuleProgress(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleModuleProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleModuleProgressTRPCOutputSchema>>;
}
