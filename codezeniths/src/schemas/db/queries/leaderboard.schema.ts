import { z } from 'zod';
import { UserRankProgressSchema } from '@/utils/rank.utils';

export const LeaderboardItemSchema = z.object({
    rank: z.number().int(),
    percentile: z.number(),
    userId: z.string().uuid(),
    name: z.string(),
    username: z.string().nullable(),
    image: z.string().nullable(),
    score: z.number().int(),
    totalSolvedCount: z.number().int(),
    easySolved: z.number().int(),
    mediumSolved: z.number().int(),
    hardSolved: z.number().int(),
    rankTier: z.string().optional(),
    rankDivision: z.string().optional(),
    rankTitle: z.string().optional(),
    rankColor: z.string().optional(),
    rankBadgeClass: z.string().optional(),
});
export type LeaderboardItem = z.infer<typeof LeaderboardItemSchema>;

export const LeaderboardScopeEnum = z.enum(['global', 'following', 'followers', 'network']);
export type LeaderboardScope = z.infer<typeof LeaderboardScopeEnum>;

export const GetLeaderboardInputSchema = z.object({
    mode: z.enum(['paginated', 'infinite']).default('infinite'),
    scope: LeaderboardScopeEnum.default('global'),
    moduleId: z.string().uuid().optional().nullable(),
    search: z.string().optional().nullable(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    cursor: z.string().optional().nullable(),
    currentViewerId: z.string().uuid().optional().nullable(),
});

export const GetLeaderboardOutputSchema = z.object({
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

export const GetUserRankAndPercentileInputSchema = z.object({
    userId: z.string().uuid(),
    moduleId: z.string().uuid().optional().nullable(),
});

export const GetUserRankAndPercentileOutputSchema = z.object({
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
