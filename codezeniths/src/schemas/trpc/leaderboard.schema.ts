import { z } from 'zod';
import { LeaderboardItemSchema } from '../db/queries/leaderboard.schema';
import { UserRankProgressSchema } from '@/utils/rank.utils';

export const LeaderboardScopeTRPCEnum = z.enum(['global', 'following', 'followers', 'network']);
export type LeaderboardScopeTRPC = z.infer<typeof LeaderboardScopeTRPCEnum>;

export const GetLeaderboardTRPCInputSchema = z.object({
    mode: z.enum(['paginated', 'infinite']).default('infinite'),
    scope: LeaderboardScopeTRPCEnum.default('global'),
    moduleId: z.string().uuid().optional().nullable(),
    search: z.string().optional().nullable(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    cursor: z.string().optional().nullable(),
});

export const GetLeaderboardTRPCOutputSchema = z.object({
    mode: z.enum(['paginated', 'infinite']),
    items: z.array(LeaderboardItemSchema),
    total: z.number().int(),
    page: z.number().int().optional(),
    limit: z.number().int(),
    totalPages: z.number().int().optional(),
    hasNextPage: z.boolean().optional(),
    hasPrevPage: z.boolean().optional(),
    nextCursor: z.string().nullable().optional(),
});

export const GetUserRankAndPercentileTRPCInputSchema = z.object({
    userId: z.string().uuid().optional(),
    moduleId: z.string().uuid().optional().nullable(),
});

export const GetUserRankAndPercentileTRPCOutputSchema = z.object({
    userId: z.string().uuid(),
    isUnranked: z.boolean().default(false),
    globalRank: z.number().int().nullable().optional(),
    globalPercentile: z.number().nullable().optional(),
    globalTotalUsers: z.number().int().default(0),
    globalBestRank: z.number().int().nullable().optional(),
    globalBestPercentile: z.number().nullable().optional(),
    globalBestScore: z.number().int().default(0),
    moduleRank: z.number().int().nullable().optional(),
    modulePercentile: z.number().nullable().optional(),
    moduleTotalUsers: z.number().int().nullable().optional(),
    moduleBestRank: z.number().int().nullable().optional(),
    moduleBestPercentile: z.number().nullable().optional(),
    moduleBestScore: z.number().int().default(0),
    score: z.number().int().default(0),
    totalSolvedCount: z.number().int().default(0),
    rankProgress: UserRankProgressSchema.optional(),
    bestModule: z
        .object({
            id: z.string().uuid(),
            title: z.string(),
            slug: z.string(),
            rank: z.number().int(),
            percentile: z.number(),
        })
        .nullable()
        .optional(),
});
