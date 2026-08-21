import { z } from 'zod';
import {
    GetLeaderboardInputSchema,
    GetLeaderboardOutputSchema,
    GetUserRankAndPercentileInputSchema,
    GetUserRankAndPercentileOutputSchema,
} from '@codezeniths/schemas/db';

export interface ILeaderboardQueries {
    getLeaderboard: (
        payload: z.infer<typeof GetLeaderboardInputSchema>
    ) => Promise<z.infer<typeof GetLeaderboardOutputSchema>>;

    getUserRankAndPercentile: (
        payload: z.infer<typeof GetUserRankAndPercentileInputSchema>
    ) => Promise<z.infer<typeof GetUserRankAndPercentileOutputSchema>>;
}
