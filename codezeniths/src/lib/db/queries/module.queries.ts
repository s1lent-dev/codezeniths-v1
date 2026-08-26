import { qRPC } from './utils/qrpc.utils';
import { countBy } from './utils/problem.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetModulesOutputSchema,
    GetSingleModuleInputSchema,
    GetSingleModuleOutputSchema,
    GetSingleModuleProgressInputSchema,
    GetSingleModuleProgressOutputSchema,
    GetRecentlySolvedModuleInputSchema,
    GetRecentlySolvedModuleOutputSchema,
    GetModulesWithTopicsInputSchema,
    GetModulesWithTopicsOutputSchema,
    ToggleModuleBookmarkInputSchema,
    ToggleModuleBookmarkOutputSchema,
    ToggleTopicBookmarkInputSchema,
    ToggleTopicBookmarkOutputSchema,
} from '@codezeniths/schemas/db';
import { IModuleQueries } from './interfaces/module.queries.interface';

import { redisService } from '@codezeniths/lib/redis';
import { z } from 'zod';
import { createCache } from '@/hooks/performance-hooks/cache/cache';

const modulesCache = redisService.cache.createStore<z.infer<typeof GetModulesOutputSchema>>({
    namespace: 'modules',
    ttlSeconds: 86400, // 24 hours
    schema: GetModulesOutputSchema,
});

const modulesL1Cache = createCache<z.infer<typeof GetModulesOutputSchema>>({
    strategy: 'adaptive',
    maxSize: 10,
    ttl: 1000 * 60 * 15, // 15 minutes in RAM
});

const modulesWithTopicsCache = redisService.cache.createStore<any>({
    namespace: 'modules_with_topics',
    ttlSeconds: 86400, // 24 hours
});

const modulesWithTopicsL1Cache = createCache<any>({
    strategy: 'adaptive',
    maxSize: 10,
    ttl: 1000 * 60 * 15, // 15 minutes in RAM
});

const moduleDifficultyTotalsCache = redisService.cache.createStore<any>({
    namespace: 'module_difficulty_totals',
    ttlSeconds: 86400, // 24 hours
});

const moduleDifficultyTotalsL1Cache = createCache<any>({
    strategy: 'adaptive',
    maxSize: 50,
    ttl: 1000 * 60 * 30, // 30 minutes in RAM
});

export class ModuleQueries implements IModuleQueries {
    getModules = qRPC()
        .output(GetModulesOutputSchema)
        .handler(async () => {
            logger.info('Executing getModules query');

            // Tier 1: L1 Adaptive Memory Cache (0ms)
            const l1Cached = modulesL1Cache.get('all_modules');
            if (l1Cached) return l1Cached;

            // Tier 2: L2 Redis CacheStore + DB Fallback
            const data = await modulesCache.getOrSet('all_modules', async () => {
                const modules = await prisma.module.findMany({
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        description: true,
                    },
                    orderBy: {
                        title: 'asc',
                    },
                });
                return modules;
            });

            if (data) modulesL1Cache.set('all_modules', data);
            return data;
        })
        .build();

    getSingleModule = qRPC()
        .input(GetSingleModuleInputSchema)
        .output(GetSingleModuleOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleModule query', { payload });
            const { id, slug, userId } = payload;

            const module = await prisma.module.findFirst({
                where: {
                    OR: [
                        id ? { id } : {},
                        slug ? { slug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    topics: {
                        orderBy: { order: 'asc' },
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                            description: true,
                            level: true,
                            order: true,
                            problems: {
                                select: { id: true },
                            },
                        },
                    },
                },
            });

            if (!module) {
                logger.warn('Module not found', { id, slug });
                throw new AppErrorBuilder('Module not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Count tags associated with this module
            const tagCount = await prisma.tag.count({
                where: {
                    moduleId: module.id,
                },
            });

            const topicCount = module.topics.length;
            const allProblemIds = module.topics.flatMap((topic) => topic.problems.map((p) => p.id));
            const problemsCount = allProblemIds.length;

            // Fetch bookmarks and solved status for user if userId is provided
            let isModuleBookmarked = false;
            const bookmarkedTopicIds = new Set<string>();
            let solvedProblemIds = new Set<string>();

            if (userId) {
                const [modBm, topicBms, userSolvedProgress] = await Promise.all([
                    prisma.moduleBookmark.findUnique({
                        where: {
                            userId_moduleId: {
                                userId,
                                moduleId: module.id,
                            },
                        },
                    }),
                    prisma.topicBookmark.findMany({
                        where: {
                            userId,
                            topicId: { in: module.topics.map((t) => t.id) },
                        },
                        select: {
                            topicId: true,
                        },
                    }),
                    allProblemIds.length > 0
                        ? prisma.problemProgress.findMany({
                              where: {
                                  userId,
                                  status: 'solved',
                                  problemId: { in: allProblemIds },
                              },
                              select: { problemId: true },
                          })
                        : [],
                ]);
                isModuleBookmarked = !!modBm;
                topicBms.forEach((tb) => bookmarkedTopicIds.add(tb.topicId));
                solvedProblemIds = new Set(userSolvedProgress.map((p) => p.problemId));
            }

            const topics = module.topics.map((topic) => {
                const tpProblemsCount = topic.problems.length;
                let tpProblemsSolvedCount = 0;

                for (const problem of topic.problems) {
                    if (solvedProblemIds.has(problem.id)) {
                        tpProblemsSolvedCount++;
                    }
                }

                const tpProblemsSolvedPercentage =
                    tpProblemsCount > 0
                        ? parseFloat(((tpProblemsSolvedCount / tpProblemsCount) * 100).toFixed(2))
                        : 0;

                return {
                    id: topic.id,
                    title: topic.title,
                    description: topic.description,
                    slug: topic.slug,
                    level: topic.level,
                    order: topic.order,
                    isBookmarked: bookmarkedTopicIds.has(topic.id),
                    problemsCount: tpProblemsCount,
                    problemsSolvedCount: tpProblemsSolvedCount,
                    problemsSolvedPercentage: tpProblemsSolvedPercentage,
                };
            });

            return {
                id: module.id,
                title: module.title,
                description: module.description,
                slug: module.slug,
                isBookmarked: isModuleBookmarked,
                tagCount,
                topicCount,
                problemsCount,
                topics,
            };
        })
        .build();

    toggleModuleBookmark = qRPC()
        .input(ToggleModuleBookmarkInputSchema)
        .output(ToggleModuleBookmarkOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing toggleModuleBookmark query', { payload });
            const { moduleId, moduleSlug, userId } = payload;

            const module = await prisma.module.findFirst({
                where: {
                    OR: [
                        moduleId ? { id: moduleId } : {},
                        moduleSlug ? { slug: moduleSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                select: { id: true },
            });

            if (!module) {
                throw new AppErrorBuilder('Module not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const existing = await prisma.moduleBookmark.findUnique({
                where: {
                    userId_moduleId: {
                        userId,
                        moduleId: module.id,
                    },
                },
            });

            if (existing) {
                await prisma.moduleBookmark.delete({
                    where: {
                        id: existing.id,
                    },
                });
                return { isBookmarked: false, moduleId: module.id };
            } else {
                await prisma.moduleBookmark.create({
                    data: {
                        userId,
                        moduleId: module.id,
                    },
                });
                return { isBookmarked: true, moduleId: module.id };
            }
        })
        .build();

    toggleTopicBookmark = qRPC()
        .input(ToggleTopicBookmarkInputSchema)
        .output(ToggleTopicBookmarkOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing toggleTopicBookmark query', { payload });
            const { topicId, topicSlug, userId } = payload;

            const topic = await prisma.topic.findFirst({
                where: {
                    OR: [
                        topicId ? { id: topicId } : {},
                        topicSlug ? { slug: topicSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                select: { id: true },
            });

            if (!topic) {
                throw new AppErrorBuilder('Topic not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const existing = await prisma.topicBookmark.findUnique({
                where: {
                    userId_topicId: {
                        userId,
                        topicId: topic.id,
                    },
                },
            });

            if (existing) {
                await prisma.topicBookmark.delete({
                    where: {
                        id: existing.id,
                    },
                });
                return { isBookmarked: false, topicId: topic.id };
            } else {
                await prisma.topicBookmark.create({
                    data: {
                        userId,
                        topicId: topic.id,
                    },
                });
                return { isBookmarked: true, topicId: topic.id };
            }
        })
        .build();

    getSingleModuleProgress = qRPC()
        .input(GetSingleModuleProgressInputSchema)
        .output(GetSingleModuleProgressOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleModuleProgress query', { payload });
            const { moduleId, moduleSlug, userId } = payload;

            // 1. Find module ID
            const module = await prisma.module.findFirst({
                where: {
                    OR: [
                        moduleId ? { id: moduleId } : {},
                        moduleSlug ? { slug: moduleSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                select: { id: true },
            });

            if (!module) {
                logger.warn('Module not found for progress calculation', { moduleId, moduleSlug });
                throw new AppErrorBuilder('Module not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const targetModuleId = module.id;

            // 2. Static difficulty totals for this module (L1 Memory -> L2 Redis -> DB Fallback)
            const totalsCacheKey = `module_difficulty_totals:${targetModuleId}`;
            let difficultyGroupCounts = moduleDifficultyTotalsL1Cache.get(totalsCacheKey);
            if (!difficultyGroupCounts) {
                difficultyGroupCounts = await moduleDifficultyTotalsCache.get(totalsCacheKey);
                if (difficultyGroupCounts) {
                    moduleDifficultyTotalsL1Cache.set(totalsCacheKey, difficultyGroupCounts);
                }
            }

            if (!difficultyGroupCounts) {
                difficultyGroupCounts = await prisma.problem.groupBy({
                    by: ['difficulty'],
                    where: {
                        topic: {
                            moduleId: targetModuleId,
                        },
                    },
                    _count: { _all: true },
                });
                moduleDifficultyTotalsL1Cache.set(totalsCacheKey, difficultyGroupCounts);
                void moduleDifficultyTotalsCache.set(totalsCacheKey, difficultyGroupCounts);
            }

            // 3. Parallel O(1) user stats: UserModuleStats PK seek + Indexed Revisit Count
            const [userModuleStats, problemsRevisitCount] = await Promise.all([
                userId
                    ? prisma.userModuleStats.findUnique({
                          where: {
                              userId_moduleId: {
                                  userId,
                                  moduleId: targetModuleId,
                              },
                          },
                          select: {
                              totalSolvedCount: true,
                              easySolved: true,
                              mediumSolved: true,
                              hardSolved: true,
                          },
                      })
                    : null,
                userId
                    ? prisma.problemProgress.count({
                          where: {
                              userId,
                              revisit: true,
                              problem: {
                                  topic: {
                                      moduleId: targetModuleId,
                                  },
                              },
                          },
                      })
                    : 0,
            ]);

            const problemsCountByDifficulty = {
                easy: 0,
                medium: 0,
                hard: 0,
            };

            for (const item of difficultyGroupCounts) {
                if (item.difficulty === 'easy') problemsCountByDifficulty.easy = item._count._all;
                else if (item.difficulty === 'medium') problemsCountByDifficulty.medium = item._count._all;
                else if (item.difficulty === 'hard') problemsCountByDifficulty.hard = item._count._all;
            }

            const problemsCount =
                problemsCountByDifficulty.easy +
                problemsCountByDifficulty.medium +
                problemsCountByDifficulty.hard;

            const problemsSolvedCountByDifficulty = {
                easy: userModuleStats?.easySolved ?? 0,
                medium: userModuleStats?.mediumSolved ?? 0,
                hard: userModuleStats?.hardSolved ?? 0,
            };

            const problemsSolvedCount = userModuleStats?.totalSolvedCount ?? 0;
            const problemNotSolvedCount = Math.max(0, problemsCount - problemsSolvedCount);
            const problemsSolvedPercentage =
                problemsCount > 0
                    ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2))
                    : 0;

            return {
                problemsCount,
                problemsSolvedCount,
                problemsRevisitCount,
                problemNotSolvedCount,
                problemsSolvedPercentage,
                problemsCountByDifficulty,
                problemsSolvedCountByDifficulty,
            };
        })
        .build();

    getRecentlySolvedModule = qRPC()
        .input(GetRecentlySolvedModuleInputSchema)
        .output(GetRecentlySolvedModuleOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getRecentlySolvedModule query', { payload });
            const { userId } = payload;

            const latestProgress = await prisma.problemProgress.findFirst({
                where: { userId, status: 'solved' },
                orderBy: { updatedAt: 'desc' },
                select: {
                    problem: {
                        select: {
                            title: true,
                            slug: true,
                            topic: {
                                select: {
                                    module: {
                                        select: {
                                            id: true,
                                            title: true,
                                            slug: true,
                                            description: true,
                                            topics: {
                                                select: {
                                                    problems: {
                                                        select: { id: true },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!latestProgress || !latestProgress.problem?.topic?.module) {
                return { module: null, lastProblem: null };
            }

            const targetModule = latestProgress.problem.topic.module;
            const allModuleProblemIds = targetModule.topics.flatMap((t) => t.problems.map((p) => p.id));
            const problemsCount = allModuleProblemIds.length;

            const solvedCount = await prisma.problemProgress.count({
                where: {
                    userId,
                    problemId: { in: allModuleProblemIds },
                    status: 'solved',
                },
            });

            const problemsSolvedPercentage =
                problemsCount > 0 ? parseFloat(((solvedCount / problemsCount) * 100).toFixed(2)) : 0;

            return {
                module: {
                    id: targetModule.id,
                    title: targetModule.title,
                    slug: targetModule.slug,
                    description: targetModule.description,
                    problemsCount,
                    problemsSolvedCount: solvedCount,
                    problemsSolvedPercentage,
                },
                lastProblem: {
                    title: latestProgress.problem.title,
                    slug: latestProgress.problem.slug,
                },
            };
        })
        .build();

    getModulesWithTopics = qRPC()
        .input(GetModulesWithTopicsInputSchema)
        .output(GetModulesWithTopicsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getModulesWithTopics query', { payload });
            const { userId } = payload;

            const catalogCacheKey = 'catalog_with_topics';

            // Tier 1: L1 Adaptive Memory Cache (0ms)
            let catalog = modulesWithTopicsL1Cache.get(catalogCacheKey);

            // Tier 2: L2 Redis CacheStore (~15ms)
            if (!catalog) {
                catalog = await modulesWithTopicsCache.get(catalogCacheKey);
                if (catalog) {
                    modulesWithTopicsL1Cache.set(catalogCacheKey, catalog);
                }
            }

            // Tier 3: Database Query Fallback
            if (!catalog) {
                const modules = await prisma.module.findMany({
                    orderBy: { title: 'asc' },
                    include: {
                        topics: {
                            orderBy: { order: 'asc' },
                            include: {
                                problems: {
                                    select: { id: true },
                                },
                            },
                        },
                    },
                });

                catalog = modules.map((m) => ({
                    id: m.id,
                    title: m.title,
                    slug: m.slug,
                    description: m.description,
                    topics: m.topics.map((t) => ({
                        id: t.id,
                        title: t.title,
                        slug: t.slug,
                        description: t.description,
                        level: t.level,
                        order: t.order,
                        problemIds: t.problems.map((p) => p.id),
                    })),
                }));

                modulesWithTopicsL1Cache.set(catalogCacheKey, catalog);
                void modulesWithTopicsCache.set(catalogCacheKey, catalog);
            }

            // If public / unauthenticated user: Return immediately in 0.01ms (0 DB queries)
            if (!userId) {
                return catalog.map((m: any) => {
                    const topics = m.topics.map((t: any) => ({
                        id: t.id,
                        title: t.title,
                        slug: t.slug,
                        description: t.description,
                        level: t.level,
                        order: t.order,
                        problemsCount: t.problemIds.length,
                        problemsSolvedCount: 0,
                        problemsSolvedPercentage: 0,
                    }));

                    return {
                        id: m.id,
                        title: m.title,
                        slug: m.slug,
                        description: m.description,
                        topicsCount: topics.length,
                        topics,
                    };
                });
            }

            // For authenticated user: 1 fast indexed query for solved problem IDs
            const userProgress = await prisma.problemProgress.findMany({
                where: { userId, status: 'solved' },
                select: { problemId: true },
            });
            const solvedProblemIds = new Set(userProgress.map((p) => p.problemId));

            return catalog.map((m: any) => {
                const topics = m.topics.map((t: any) => {
                    const problemsCount = t.problemIds.length;
                    const problemsSolvedCount = t.problemIds.filter((id: string) => solvedProblemIds.has(id)).length;
                    const problemsSolvedPercentage =
                        problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

                    return {
                        id: t.id,
                        title: t.title,
                        slug: t.slug,
                        description: t.description,
                        level: t.level,
                        order: t.order,
                        problemsCount,
                        problemsSolvedCount,
                        problemsSolvedPercentage,
                    };
                });

                return {
                    id: m.id,
                    title: m.title,
                    slug: m.slug,
                    description: m.description,
                    topicsCount: topics.length,
                    topics,
                };
            });
        })
        .build();
}

export const moduleQueries = new ModuleQueries();
