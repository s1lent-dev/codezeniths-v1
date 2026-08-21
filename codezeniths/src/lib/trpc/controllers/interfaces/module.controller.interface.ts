import { TRPCContext } from '../../trpc/trpc.context';
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

    getRecentlySolvedModule(args: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetRecentlySolvedModuleTRPCOutputSchema>>;

    getModulesWithTopics(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetModulesWithTopicsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetModulesWithTopicsTRPCOutputSchema>>;

    toggleModuleBookmark(args: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleModuleBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleModuleBookmarkTRPCOutputSchema>>;

    toggleTopicBookmark(args: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleTopicBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleTopicBookmarkTRPCOutputSchema>>;
}
