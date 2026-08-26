import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetTagsTRPCOutputSchema,
    GetTagsCatalogueTRPCInputSchema,
    GetTagsCatalogueTRPCOutputSchema,
    GetSingleTagProgressTRPCInputSchema,
    GetSingleTagProgressTRPCOutputSchema,
    GetSingleTagTRPCInputSchema,
    GetSingleTagTRPCOutputSchema,
    GetTagSuggestionsTRPCInputSchema,
    GetTagSuggestionsTRPCOutputSchema,
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

    getTagsCatalogue(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTagsCatalogueTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTagsCatalogueTRPCOutputSchema>>;

    getSingleTagProgress(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagProgressTRPCOutputSchema>>;

    getSingleTag(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTagTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTagTRPCOutputSchema>>;

    getTagSuggestions(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTagSuggestionsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTagSuggestionsTRPCOutputSchema>>;

    toggleTagBookmark(args: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleTagBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleTagBookmarkTRPCOutputSchema>>;

    getUserTagProgressByLevel(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserTagProgressByLevelTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserTagProgressByLevelTRPCOutputSchema>>;
}
