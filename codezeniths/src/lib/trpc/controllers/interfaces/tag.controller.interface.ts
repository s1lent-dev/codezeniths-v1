import { TRPCContext } from '../../trpc/trpc.context';
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
import { z } from 'zod';

export interface ITagController {
    getTags(args: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof GetTagsTRPCOutputSchema>>;

    getTagsFiltered(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTagsFilteredTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTagsFilteredTRPCOutputSchema>>;

    getSingleTagProblems(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagProblemsTRPCOutputSchema>>;

    getSingleTagProblemProgress(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagProblemProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagProblemProgressTRPCOutputSchema>>;

    getSingleTag(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagTRPCOutputSchema>>;

    toggleTagBookmark(args: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleTagBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleTagBookmarkTRPCOutputSchema>>;

    getUserTagProgressByLevel(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserTagProgressByLevelTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserTagProgressByLevelTRPCOutputSchema>>;
}
