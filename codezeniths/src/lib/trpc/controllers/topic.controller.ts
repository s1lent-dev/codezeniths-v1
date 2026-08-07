import { TRPCContext } from '../trpc/trpc.context';
import { ITopicController } from './interfaces';
import {
    GetSingleTopicTRPCInputSchema,
    GetSingleTopicTRPCOutputSchema,
    GetSingleTopicProgressTRPCInputSchema,
    GetSingleTopicProgressTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { z } from 'zod';

export class TopicController implements ITopicController {
    async getSingleTopic({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTopicTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTopicTRPCOutputSchema>> {
        logger.info('Executing getSingleTopic controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch single topic details');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            // TODO: [Redis] Check cache for single topic structure

            const result = await ctx.queries.topic.getSingleTopic({
                id: input.id,
                slug: input.slug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleTopic controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching topic details.',
                cause: error,
            });
        }
    }

    async getSingleTopicProgress({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetSingleTopicProgressTRPCInputSchema>;
    }): Promise<z.infer<typeof GetSingleTopicProgressTRPCOutputSchema>> {
        logger.info('Executing getSingleTopicProgress controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch single topic progress');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            // TODO: [Redis] Check cache for single topic progress statistics

            const result = await ctx.queries.topic.getSingleTopicProgress({
                topicId: input.topicId,
                topicSlug: input.topicSlug,
                userId,
            });

            return result;
        } catch (error: any) {
            logger.error('Error in getSingleTopicProgress controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while fetching topic progress statistics.',
                cause: error,
            });
        }
    }
}
