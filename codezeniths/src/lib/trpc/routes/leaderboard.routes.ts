import { createTRPCRouter } from '../trpc';
import { publicProcedure } from '../trpc/trpc.procedure';
import {
    GetLeaderboardTRPCInputSchema,
    GetLeaderboardTRPCOutputSchema,
    GetUserRankAndPercentileTRPCInputSchema,
    GetUserRankAndPercentileTRPCOutputSchema,
} from '@/schemas/trpc';

export const leaderboardRouter = createTRPCRouter({
    getLeaderboard: publicProcedure
        .input(GetLeaderboardTRPCInputSchema)
        .output(GetLeaderboardTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.leaderboard.getLeaderboard({ ctx, input })),

    getUserRankAndPercentile: publicProcedure
        .input(GetUserRankAndPercentileTRPCInputSchema)
        .output(GetUserRankAndPercentileTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.leaderboard.getUserRankAndPercentile({ ctx, input })),
});
