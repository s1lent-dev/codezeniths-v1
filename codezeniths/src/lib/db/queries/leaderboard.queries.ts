import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetLeaderboardInputSchema,
    GetLeaderboardOutputSchema,
    GetUserRankAndPercentileInputSchema,
    GetUserRankAndPercentileOutputSchema,
} from '@codezeniths/schemas/db';
import { ILeaderboardQueries } from './interfaces/leaderboard.queries.interface';
import { calculatePercentile } from './utils/leaderboard.utils';
import { getRankProgress, getRankFromScore } from '@/utils/rank.utils';
import { formatUserProfiles } from '@/utils/user.formatter';

export class LeaderboardQueries implements ILeaderboardQueries {
    getLeaderboard = qRPC()
        .input(GetLeaderboardInputSchema)
        .output(GetLeaderboardOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getLeaderboard query', { payload });
            const {
                mode = 'infinite',
                scope = 'global',
                moduleId,
                search,
                page = 1,
                limit = 20,
                cursor,
                currentViewerId,
            } = payload;

            // 1. Resolve scoped user IDs if scope !== 'global'
            let scopedUserIds: string[] | null = null;
            if (scope !== 'global' && currentViewerId) {
                if (scope === 'following') {
                    const follows = await prisma.userFollow.findMany({
                        where: { followerId: currentViewerId },
                        select: { followingId: true },
                    });
                    scopedUserIds = [currentViewerId, ...follows.map((f) => f.followingId)];
                } else if (scope === 'followers') {
                    const followers = await prisma.userFollow.findMany({
                        where: { followingId: currentViewerId },
                        select: { followerId: true },
                    });
                    scopedUserIds = [currentViewerId, ...followers.map((f) => f.followerId)];
                } else if (scope === 'network') {
                    const [follows, followers] = await Promise.all([
                        prisma.userFollow.findMany({
                            where: { followerId: currentViewerId },
                            select: { followingId: true },
                        }),
                        prisma.userFollow.findMany({
                            where: { followingId: currentViewerId },
                            select: { followerId: true },
                        }),
                    ]);
                    const set = new Set<string>([
                        currentViewerId,
                        ...follows.map((f) => f.followingId),
                        ...followers.map((f) => f.followerId),
                    ]);
                    scopedUserIds = Array.from(set);
                }
            } else if (scope !== 'global' && !currentViewerId) {
                // Not authenticated — empty cohort for network scopes
                scopedUserIds = [];
            }

            const scopeWhere = scopedUserIds !== null ? { userId: { in: scopedUserIds } } : {};

            const searchWhere = search?.trim()
                ? {
                      user: {
                          OR: [
                              { name: { contains: search.trim(), mode: 'insensitive' as const } },
                              { username: { contains: search.trim(), mode: 'insensitive' as const } },
                              { email: { contains: search.trim(), mode: 'insensitive' as const } },
                          ],
                      },
                  }
                : {};

            if (moduleId) {
                // Module Leaderboard Query
                const where = {
                    moduleId,
                    ...searchWhere,
                    ...scopeWhere,
                };

                const total = await prisma.userModuleStats.count({ where });

                let itemsRaw: any[] = [];
                let hasNextPage = false;
                let nextCursor: string | null = null;
                let skip = 0;

                if (mode === 'paginated') {
                    skip = (page - 1) * limit;
                    itemsRaw = await prisma.userModuleStats.findMany({
                        where,
                        orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }],
                        skip,
                        take: limit,
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    image: true,
                                },
                            },
                        },
                    });
                } else {
                    // Infinite mode — cursor is the last item's id
                    itemsRaw = await prisma.userModuleStats.findMany({
                        where,
                        orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }],
                        take: limit + 1,
                        skip: cursor ? 1 : 0,
                        cursor: cursor ? { id: cursor } : undefined,
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    username: true,
                                    image: true,
                                },
                            },
                        },
                    });

                    if (itemsRaw.length > limit) {
                        hasNextPage = true;
                        const nextItem = itemsRaw.pop();
                        nextCursor = nextItem.id;
                    }
                }

                const totalPages = Math.ceil(total / limit);
                const startRank = mode === 'paginated' ? skip + 1 : 1;

                const items = itemsRaw.map((stat, index) => {
                    const rank = startRank + index;
                    const rankMeta = getRankFromScore(stat.score);
                    return {
                        rank,
                        percentile: calculatePercentile(rank, total),
                        userId: stat.userId,
                        name: stat.user.name,
                        username: stat.user.username,
                        image: stat.user.image,
                        score: stat.score,
                        totalSolvedCount: stat.totalSolvedCount,
                        easySolved: stat.easySolved,
                        mediumSolved: stat.mediumSolved,
                        hardSolved: stat.hardSolved,
                        rankTier: rankMeta.tier,
                        rankDivision: rankMeta.division,
                        rankTitle: rankMeta.name,
                        rankColor: rankMeta.color,
                        rankBadgeClass: rankMeta.badgeClass,
                    };
                });

                const formattedItems = await formatUserProfiles(items);

                return {
                    mode,
                    items: formattedItems,
                    total,
                    limit,
                    ...(mode === 'paginated'
                        ? {
                              page,
                              totalPages,
                              hasNextPage: page < totalPages,
                              hasPrevPage: page > 1,
                          }
                        : {
                              nextCursor,
                              hasNextPage,
                          }),
                };
            }

            // Global Leaderboard Query
            const where = {
                ...searchWhere,
                ...scopeWhere,
            };
            const total = await prisma.userGlobalStats.count({ where });

            let itemsRaw: any[] = [];
            let hasNextPage = false;
            let nextCursor: string | null = null;
            let skip = 0;

            if (mode === 'paginated') {
                skip = (page - 1) * limit;
                itemsRaw = await prisma.userGlobalStats.findMany({
                    where,
                    orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }],
                    skip,
                    take: limit,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                            },
                        },
                    },
                });
            } else {
                // Infinite mode
                itemsRaw = await prisma.userGlobalStats.findMany({
                    where,
                    orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }],
                    take: limit + 1,
                    skip: cursor ? 1 : 0,
                    cursor: cursor ? { userId: cursor } : undefined,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                            },
                        },
                    },
                });

                if (itemsRaw.length > limit) {
                    hasNextPage = true;
                    const nextItem = itemsRaw.pop();
                    nextCursor = nextItem.userId;
                }
            }

            const totalPages = Math.ceil(total / limit);
            const startRank = mode === 'paginated' ? skip + 1 : 1;

            const items = itemsRaw.map((stat, index) => {
                const rank = startRank + index;
                const rankMeta = getRankFromScore(stat.score);
                return {
                    rank,
                    percentile: calculatePercentile(rank, total),
                    userId: stat.userId,
                    name: stat.user.name,
                    username: stat.user.username,
                    image: stat.user.image,
                    score: stat.score,
                    totalSolvedCount: stat.totalSolvedCount,
                    easySolved: stat.easySolved,
                    mediumSolved: stat.mediumSolved,
                    hardSolved: stat.hardSolved,
                    rankTier: rankMeta.tier,
                    rankDivision: rankMeta.division,
                    rankTitle: rankMeta.name,
                    rankColor: rankMeta.color,
                    rankBadgeClass: rankMeta.badgeClass,
                };
            });
            const formattedItems = await formatUserProfiles(items);

            return {
                mode,
                items: formattedItems,
                total,
                limit,
                ...(mode === 'paginated'
                    ? {
                          page,
                          totalPages,
                          hasNextPage: page < totalPages,
                          hasPrevPage: page > 1,
                      }
                    : {
                          nextCursor,
                          hasNextPage,
                      }),
            };
        })
        .build();

    getUserRankAndPercentile = qRPC()
        .input(GetUserRankAndPercentileInputSchema)
        .output(GetUserRankAndPercentileOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserRankAndPercentile query', { payload });
            const { userId, moduleId } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true },
            });
            if (!userExists) {
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // 1. Fetch user's global stats from DB
            const userGlobalStats = await prisma.userGlobalStats.findUnique({
                where: { userId },
            });

            // 2. Fetch total ranked users globally
            let globalTotalUsers: number = await redisService.sortedList.len('leaderboard:global');
            if (globalTotalUsers === 0) {
                globalTotalUsers = await prisma.userGlobalStats.count({
                    where: { score: { gt: 0 } },
                });
            }

            // Fetch total ranked users in the requested module if moduleId is provided
            let moduleTotalUsers: number | null = null;
            if (moduleId) {
                const modKey = `leaderboard:module:${moduleId}`;
                let modTotal = await redisService.sortedList.len(modKey);
                if (modTotal === 0) {
                    modTotal = await prisma.userModuleStats.count({
                        where: { moduleId, score: { gt: 0 } },
                    });
                }
                moduleTotalUsers = modTotal;
            }

            // 3. Check if user has not solved any problem yet -> Unranked
            const isUnranked = !userGlobalStats || (userGlobalStats.score <= 0 && userGlobalStats.totalSolvedCount <= 0);

            if (isUnranked) {
                return {
                    userId,
                    isUnranked: true,
                    globalRank: null,
                    globalPercentile: null,
                    globalTotalUsers,
                    globalBestRank: null,
                    globalBestPercentile: null,
                    globalBestScore: 0,
                    moduleRank: null,
                    modulePercentile: null,
                    moduleTotalUsers: moduleId ? moduleTotalUsers : null,
                    moduleBestRank: null,
                    moduleBestPercentile: null,
                    moduleBestScore: 0,
                    score: 0,
                    totalSolvedCount: 0,
                    rankProgress: getRankProgress(0),
                    bestModule: null,
                };
            }

            // 4. User is ranked -> Calculate Global Rank & Percentile
            const score = userGlobalStats.score;
            const totalSolvedCount = userGlobalStats.totalSolvedCount;

            let globalRankZero: number | null = await redisService.sortedList.getRevRank('leaderboard:global', userId);
            if (globalRankZero === null) {
                // Fallback to PostgreSQL
                const higherScoreCount = await prisma.userGlobalStats.count({
                    where: { score: { gt: score } },
                });
                globalRankZero = higherScoreCount;
            }

            // 0-indexed rank to 1-indexed rank
            const globalRankOneIndexed = globalRankZero + 1;
            const globalPercentile = calculatePercentile(globalRankOneIndexed, globalTotalUsers);

            let globalBestRank = userGlobalStats.bestRank ?? null;
            let globalBestPercentile = userGlobalStats.bestPercentile ?? null;
            let globalBestScore = userGlobalStats.bestScore ?? score;

            let hasGlobalImprovement = false;

            if (globalRankOneIndexed > 0 && (globalBestRank === null || globalRankOneIndexed < globalBestRank)) {
                globalBestRank = globalRankOneIndexed;
                hasGlobalImprovement = true;
            }

            if (globalPercentile > 0 && (globalBestPercentile === null || globalPercentile < globalBestPercentile)) {
                globalBestPercentile = globalPercentile;
                hasGlobalImprovement = true;
            }

            if (score > globalBestScore) {
                globalBestScore = score;
                hasGlobalImprovement = true;
            }

            if (hasGlobalImprovement) {
                void prisma.userGlobalStats
                    .update({
                        where: { userId },
                        data: {
                            bestRank: globalBestRank,
                            bestPercentile: globalBestPercentile,
                            bestScore: globalBestScore,
                        },
                    })
                    .catch((err) =>
                        logger.error('Failed to update global best rank/percentile', { err, userId }),
                    );
            }

            // 5. Fetch Module Rank & Percentile if moduleId passed
            let moduleRank: number | null = null;
            let modulePercentile: number | null = null;
            let moduleBestRank: number | null = null;
            let moduleBestPercentile: number | null = null;
            let moduleBestScore: number = 0;

            if (moduleId) {
                const userModStats = await prisma.userModuleStats.findUnique({
                    where: { userId_moduleId: { userId, moduleId } },
                });

                if (userModStats && (userModStats.score > 0 || userModStats.totalSolvedCount > 0)) {
                    const modKey = `leaderboard:module:${moduleId}`;
                    let modRankZero = await redisService.sortedList.getRevRank(modKey, userId);

                    if (modRankZero === null) {
                        const higherModScoreCount = await prisma.userModuleStats.count({
                            where: { moduleId, score: { gt: userModStats.score } },
                        });
                        modRankZero = higherModScoreCount;
                    }

                    moduleRank = modRankZero + 1;
                    modulePercentile = calculatePercentile(moduleRank, moduleTotalUsers ?? 1);
                    moduleBestRank = userModStats.bestRank ?? moduleRank;
                    moduleBestPercentile = userModStats.bestPercentile ?? modulePercentile;
                    moduleBestScore = userModStats.bestScore ?? userModStats.score;

                    let hasModImprovement = false;
                    if (moduleRank && (moduleBestRank === null || moduleRank < moduleBestRank)) {
                        moduleBestRank = moduleRank;
                        hasModImprovement = true;
                    }
                    if (modulePercentile && (moduleBestPercentile === null || modulePercentile < moduleBestPercentile)) {
                        moduleBestPercentile = modulePercentile;
                        hasModImprovement = true;
                    }
                    if (userModStats.score > moduleBestScore) {
                        moduleBestScore = userModStats.score;
                        hasModImprovement = true;
                    }

                    if (hasModImprovement) {
                        void prisma.userModuleStats
                            .update({
                                where: { userId_moduleId: { userId, moduleId } },
                                data: {
                                    bestRank: moduleBestRank,
                                    bestPercentile: moduleBestPercentile,
                                    bestScore: moduleBestScore,
                                },
                            })
                            .catch((err) =>
                                logger.error('Failed to update module best rank/percentile', { err, userId, moduleId }),
                            );
                    }
                }
            }

            // 6. Fetch user's best performing module overall (highest score)
            let bestModule: {
                id: string;
                title: string;
                slug: string;
                rank: number;
                percentile: number;
            } | null = null;

            const topModuleStat = await prisma.userModuleStats.findFirst({
                where: { userId, score: { gt: 0 } },
                orderBy: [{ score: 'desc' }, { updatedAt: 'asc' }],
                include: {
                    module: {
                        select: { id: true, title: true, slug: true },
                    },
                },
            });

            if (topModuleStat && topModuleStat.module) {
                const modTotal = await prisma.userModuleStats.count({ where: { moduleId: topModuleStat.moduleId, score: { gt: 0 } } });
                const higherCount = await prisma.userModuleStats.count({
                    where: { moduleId: topModuleStat.moduleId, score: { gt: topModuleStat.score } },
                });
                const topModRank = higherCount + 1;
                const topModPercentile = calculatePercentile(topModRank, modTotal);
                bestModule = {
                    id: topModuleStat.module.id,
                    title: topModuleStat.module.title,
                    slug: topModuleStat.module.slug,
                    rank: topModRank,
                    percentile: topModPercentile,
                };
            }

            return {
                userId,
                isUnranked: false,
                globalRank: globalRankOneIndexed,
                globalPercentile,
                globalTotalUsers,
                globalBestRank,
                globalBestPercentile,
                globalBestScore,
                moduleRank,
                modulePercentile,
                moduleTotalUsers: moduleId ? moduleTotalUsers : null,
                moduleBestRank,
                moduleBestPercentile,
                moduleBestScore,
                score,
                totalSolvedCount,
                rankProgress: getRankProgress(score),
                bestModule,
            };
        })
        .build();
}

export const leaderboardQueries = new LeaderboardQueries();
