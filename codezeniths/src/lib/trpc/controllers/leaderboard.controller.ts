import { TRPCContext } from '../trpc/trpc.context';
import { TRPCError } from '@trpc/server';
import { logger } from '@codezeniths/service/logging';
import {
    GetLeaderboardTRPCInputSchema,
    GetLeaderboardTRPCOutputSchema,
    GetUserRankAndPercentileTRPCInputSchema,
    GetUserRankAndPercentileTRPCOutputSchema,
} from '@/schemas/trpc';
import { ILeaderboardController } from './interfaces/leaderboard.controller.interface';
import { leaderboardQueries } from '@/lib/db/queries/leaderboard.queries';
import { formatUserProfiles } from '@/utils/user.formatter';
import { z } from 'zod';

export class LeaderboardController implements ILeaderboardController {
    async getLeaderboard({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetLeaderboardTRPCInputSchema>;
    }): Promise<z.infer<typeof GetLeaderboardTRPCOutputSchema>> {
        logger.info('Executing getLeaderboard controller', { input, userId: ctx.user?.id });
        try {
            const result = await leaderboardQueries.getLeaderboard({
                ...input,
                currentViewerId: ctx.user?.id,
            });
            result.items = await formatUserProfiles(result.items);
            return result;
        } catch (error: any) {
            logger.error('Error in getLeaderboard controller', { error: error?.message, input });
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to fetch leaderboard.',
            });
        }
    }

    async getUserRankAndPercentile({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserRankAndPercentileTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserRankAndPercentileTRPCOutputSchema>> {
        logger.info('Executing getUserRankAndPercentile controller', { input, userId: ctx.user?.id });
        const targetUserId = input.userId || ctx.user?.id;
        if (!targetUserId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Target userId or user authentication required.',
            });
        }

        try {
            return await leaderboardQueries.getUserRankAndPercentile({
                userId: targetUserId,
                moduleId: input.moduleId,
            });
        } catch (error: any) {
            logger.error('Error in getUserRankAndPercentile controller', { error: error?.message, targetUserId });
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error?.message || 'Failed to fetch user rank & percentile.',
            });
        }
    }
}

export const leaderboardController = new LeaderboardController();
