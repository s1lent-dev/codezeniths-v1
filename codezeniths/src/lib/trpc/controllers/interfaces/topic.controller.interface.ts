import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetSingleTopicTRPCInputSchema,
    GetSingleTopicTRPCOutputSchema,
    GetSingleTopicProgressTRPCInputSchema,
    GetSingleTopicProgressTRPCOutputSchema,
    GetTopicSuggestionsTRPCInputSchema,
    GetTopicSuggestionsTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface ITopicController {
    getSingleTopic(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTopicTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTopicTRPCOutputSchema>>;

    getSingleTopicProgress(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTopicProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTopicProgressTRPCOutputSchema>>;

    getTopicSuggestions(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTopicSuggestionsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTopicSuggestionsTRPCOutputSchema>>;
}

