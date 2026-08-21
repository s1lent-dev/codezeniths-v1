import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetLeaderboardTRPCInputSchema,
    GetLeaderboardTRPCOutputSchema,
    GetUserRankAndPercentileTRPCInputSchema,
    GetUserRankAndPercentileTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface ILeaderboardController {
    getLeaderboard(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetLeaderboardTRPCInputSchema>;
    }): Promise<z.infer<typeof GetLeaderboardTRPCOutputSchema>>;

    getUserRankAndPercentile(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetUserRankAndPercentileTRPCInputSchema>;
    }): Promise<z.infer<typeof GetUserRankAndPercentileTRPCOutputSchema>>;
}
