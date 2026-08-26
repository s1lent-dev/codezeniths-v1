import { createTRPCRouter } from '../trpc';
import { publicProcedure } from '../trpc/trpc.procedure';
import {
    GetSingleTopicTRPCInputSchema,
    GetSingleTopicTRPCOutputSchema,
    GetSingleTopicProgressTRPCInputSchema,
    GetSingleTopicProgressTRPCOutputSchema,
    GetTopicSuggestionsTRPCInputSchema,
    GetTopicSuggestionsTRPCOutputSchema,
} from '@/schemas/trpc';

export const topicRouter = createTRPCRouter({
    getSingleTopic: publicProcedure
        .input(GetSingleTopicTRPCInputSchema)
        .output(GetSingleTopicTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.topic.getSingleTopic({ ctx, input })),

    getSingleTopicProgress: publicProcedure
        .input(GetSingleTopicProgressTRPCInputSchema)
        .output(GetSingleTopicProgressTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.topic.getSingleTopicProgress({ ctx, input })),

    getTopicSuggestions: publicProcedure
        .input(GetTopicSuggestionsTRPCInputSchema)
        .output(GetTopicSuggestionsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.topic.getTopicSuggestions({ ctx, input })),
});
