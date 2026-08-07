import { TRPCContext } from '../../trpc/trpc.context';
import {
    AutocompleteTRPCInputSchema,
    AutocompleteTRPCOutputSchema,
    MoreLikeThisTRPCInputSchema,
    MoreLikeThisTRPCOutputSchema,
    SearchTRPCInputSchema,
    SearchTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface ISearchController {
    reindexAll(args: {
        ctx: TRPCContext;
    }): Promise<{ success: boolean; message: string; summaries: unknown[] }>;

    autocomplete(args: {
        ctx: TRPCContext;
        input: z.infer<typeof AutocompleteTRPCInputSchema>;
    }): Promise<z.infer<typeof AutocompleteTRPCOutputSchema>>;

    getRecommendations(args: {
        ctx: TRPCContext;
        input: z.infer<typeof MoreLikeThisTRPCInputSchema>;
    }): Promise<z.infer<typeof MoreLikeThisTRPCOutputSchema>>;

    searchQuery(args: {
        ctx: TRPCContext;
        input: z.infer<typeof SearchTRPCInputSchema>;
    }): Promise<z.infer<typeof SearchTRPCOutputSchema>>;
}
