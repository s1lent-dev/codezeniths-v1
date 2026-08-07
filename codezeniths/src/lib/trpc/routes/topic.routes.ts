import { createTRPCRouter } from '../trpc';
import { protectedProcedure, publicProcedure } from '../trpc/trpc.procedure';
import {
    GetSingleTopicTRPCInputSchema,
    GetSingleTopicTRPCOutputSchema,
    GetSingleTopicProgressTRPCInputSchema,
    GetSingleTopicProgressTRPCOutputSchema,
} from '@/schemas/trpc';

export const topicRouter = createTRPCRouter({
    getSingleTopic: publicProcedure
        .input(GetSingleTopicTRPCInputSchema)
        .output(GetSingleTopicTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.topic.getSingleTopic({ ctx, input })),

    getSingleTopicProgress: protectedProcedure
        .input(GetSingleTopicProgressTRPCInputSchema)
        .output(GetSingleTopicProgressTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.topic.getSingleTopicProgress({ ctx, input })),
});
