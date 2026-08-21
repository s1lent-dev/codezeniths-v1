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

const modulesCache = redisService.cache.createStore<z.infer<typeof GetModulesOutputSchema>>({
    namespace: 'modules',
    ttlSeconds: 86400, // 24 hours
    schema: GetModulesOutputSchema,
});

export class ModuleQueries implements IModuleQueries {
    getModules = qRPC()
        .output(GetModulesOutputSchema)
        .handler(async () => {
            logger.info('Executing getModules query');
            return await modulesCache.getOrSet('all_modules', async () => {
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
        })
        .build();

    getSingleModule = qRPC()
        .input(GetSingleModuleInputSchema)
        .output(GetSingleModuleOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleModule query', { payload });
            const { id, slug, userId } = payload;

            if (userId) {
                const userExists = await prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!userExists) {
                    logger.warn('User not found while getting single module', { userId });
                    throw new AppErrorBuilder('User not found')
                        .setCode(ErrorCode.NOT_FOUND)
                        .build();
                }
            }

            // Find module
            const module = await prisma.module.findFirst({
                where: {
                    OR: [
                        id ? { id } : {},
                        slug ? { slug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                include: {
                    topics: {
                        orderBy: {
                            order: 'asc',
                        },
                        include: {
                            problems: true,
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

            // Fetch all problems in this module across topics
            const allProblems = module.topics.flatMap((topic) => topic.problems);
            const problemsCount = allProblems.length;
            const allProblemIds = allProblems.map((p) => p.id);

            let problemsSolvedCount = 0;
            let problemsRevisitCount = 0;
            let solvedProgress: Array<{ status: string; problemId: string; problem: { id: string; difficulty: any } | null }> = [];

            if (userId && allProblemIds.length > 0) {
                const userProgress = await prisma.problemProgress.findMany({
                    where: {
                        userId,
                        ...(allProblemIds.length <= 100 ? { problemId: { in: allProblemIds } } : {}),
                    },
                    select: {
                        status: true,
                        revisit: true,
                        problemId: true,
                        problem: {
                            select: {
                                id: true,
                                difficulty: true,
                            },
                        },
                    },
                });

                problemsSolvedCount = userProgress.filter((p) => p.status === 'solved').length;
                problemsRevisitCount = userProgress.filter((p) => p.revisit === true).length;
                solvedProgress = userProgress.filter((p) => p.status === 'solved' && p.problem);
            }

            const problemNotSolvedCount = Math.max(0, problemsCount - problemsSolvedCount);
            const problemsSolvedPercentage =
                problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

            const problemsCountByDifficultyRaw = countBy(allProblems, (p) => p.difficulty);
            const problemsCountByDifficulty = {
                easy: problemsCountByDifficultyRaw.easy || 0,
                medium: problemsCountByDifficultyRaw.medium || 0,
                hard: problemsCountByDifficultyRaw.hard || 0,
            };

            const problemsSolvedCountByDifficultyRaw = countBy(solvedProgress, (p) => p.problem!.difficulty);
            const problemsSolvedCountByDifficulty = {
                easy: problemsSolvedCountByDifficultyRaw.easy || 0,
                medium: problemsSolvedCountByDifficultyRaw.medium || 0,
                hard: problemsSolvedCountByDifficultyRaw.hard || 0,
            };

            const solvedProblemIds = new Set(solvedProgress.map((p) => p.problemId));

            // Fetch bookmarks for module & topics if userId is present
            let isModuleBookmarked = false;
            const bookmarkedTopicIds = new Set<string>();

            if (userId) {
                const [modBm, topicBms] = await Promise.all([
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
                ]);
                isModuleBookmarked = !!modBm;
                topicBms.forEach((tb) => bookmarkedTopicIds.add(tb.topicId));
            }

            const topics = module.topics.map((topic) => {
                const problems = topic.problems;
                const tpProblemsCount = problems.length;

                const tpProblemsCountByDifficulty = {
                    easy: 0,
                    medium: 0,
                    hard: 0,
                };

                let tpProblemsSolvedCount = 0;

                for (const problem of problems) {
                    if (problem.difficulty === 'easy') tpProblemsCountByDifficulty.easy++;
                    else if (problem.difficulty === 'medium') tpProblemsCountByDifficulty.medium++;
                    else if (problem.difficulty === 'hard') tpProblemsCountByDifficulty.hard++;

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
                    problemsCountByDifficulty: tpProblemsCountByDifficulty,
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
                progress: {
                    problemsCount,
                    problemsSolvedCount,
                    problemsRevisitCount,
                    problemNotSolvedCount,
                    problemsSolvedPercentage,
                    problemsCountByDifficulty,
                    problemsSolvedCountByDifficulty,
                },
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

            // Verify user exists first
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found while getting single module progress', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Find the module first to ensure it exists
            const module = await prisma.module.findFirst({
                where: {
                    OR: [
                        moduleId ? { id: moduleId } : {},
                        moduleSlug ? { slug: moduleSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
            });

            if (!module) {
                logger.warn('Module not found for progress calculation', { moduleId, moduleSlug });
                throw new AppErrorBuilder('Module not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Fetch all problems under this module
            const allProblems = await prisma.problem.findMany({
                where: {
                    topic: {
                        moduleId: module.id,
                    },
                },
                select: {
                    id: true,
                    difficulty: true,
                    topic: {
                        select: {
                            title: true,
                        },
                    },
                    tags: {
                        select: {
                            tag: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });

            const allProblemIds = allProblems.map((p) => p.id);

            // Fetch user's progress records scoped to this module's problems
            const userProgress = await prisma.problemProgress.findMany({
                where: {
                    userId,
                    ...(allProblemIds.length <= 100 ? { problemId: { in: allProblemIds } } : {}),
                },
                select: {
                    status: true,
                    revisit: true,
                    problem: {
                        select: {
                            id: true,
                            difficulty: true,
                            topic: {
                                select: {
                                    title: true,
                                },
                            },
                            tags: {
                                select: {
                                    tag: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            const problemsCount = allProblems.length;
            const problemsSolvedCount = userProgress.filter((p) => p.status === 'solved').length;
            const problemsRevisitCount = userProgress.filter((p) => p.revisit === true).length;
            const problemsAttemptedCount = userProgress.length;
            const problemsSolvedPercentage = problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

            // Filter solved progress records
            const solvedProgress = userProgress.filter((p) => p.status === 'solved' && p.problem);

            // Group overall problems by difficulty using countBy
            const problemsCountByDifficultyRaw = countBy(allProblems, (p) => p.difficulty);
            const problemsCountByDifficulty = {
                easy: problemsCountByDifficultyRaw.easy || 0,
                medium: problemsCountByDifficultyRaw.medium || 0,
                hard: problemsCountByDifficultyRaw.hard || 0,
            };

            // Group solved problems by difficulty using countBy
            const problemsSolvedCountByDifficultyRaw = countBy(solvedProgress, (p) => p.problem!.difficulty);
            const problemsSolvedCountByDifficulty = {
                easy: problemsSolvedCountByDifficultyRaw.easy || 0,
                medium: problemsSolvedCountByDifficultyRaw.medium || 0,
                hard: problemsSolvedCountByDifficultyRaw.hard || 0,
            };

            // Group overall problems by topic using countBy
            const problemsCountByTopic = countBy(allProblems, (p) => p.topic?.title || 'Unknown');

            // Group solved problems by topic (seeded to match all topics from problemsCountByTopic)
            const problemsSolvedCountByTopicRaw = countBy(solvedProgress, (p) => p.problem!.topic?.title || 'Unknown');
            const problemsSolvedCountByTopic: Record<string, number> = {};
            Object.keys(problemsCountByTopic).forEach((topicTitle) => {
                problemsSolvedCountByTopic[topicTitle] = problemsSolvedCountByTopicRaw[topicTitle] || 0;
            });

            // Group overall problems by tags using countBy
            const problemsCountByTags = countBy(allProblems, (p) => {
                return p.tags.map((t) => t.tag?.name).filter(Boolean) as string[];
            });

            // Group solved problems by tags (seeded to match all tags from problemsCountByTags)
            const problemsSolvedCountByTagsRaw = countBy(solvedProgress, (p) => {
                return p.problem!.tags.map((t) => t.tag?.name).filter(Boolean) as string[];
            });
            const problemsSolvedCountByTags: Record<string, number> = {};
            Object.keys(problemsCountByTags).forEach((tagName) => {
                problemsSolvedCountByTags[tagName] = problemsSolvedCountByTagsRaw[tagName] || 0;
            });

            return {
                problemsCount,
                problemsSolvedCount,
                problemsRevisitCount,
                problemsAttemptedCount,
                problemsSolvedPercentage,
                problemsCountByDifficulty,
                problemsSolvedCountByDifficulty,
                problemsCountByTopic,
                problemsSolvedCountByTopic,
                problemsCountByTags,
                problemsSolvedCountByTags,
            };
        })
        .build();

    getRecentlySolvedModule = qRPC()
        .input(GetRecentlySolvedModuleInputSchema)
        .output(GetRecentlySolvedModuleOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getRecentlySolvedModule query', { payload });
            const { userId } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const latestProgress = await prisma.problemProgress.findFirst({
                where: { userId },
                orderBy: { updatedAt: 'desc' },
                include: {
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

            const allModuleProblems = await prisma.problem.findMany({
                where: {
                    topic: {
                        moduleId: targetModule.id,
                    },
                },
                select: { id: true },
            });

            const allModuleProblemIds = allModuleProblems.map((p) => p.id);

            const solvedCount = await prisma.problemProgress.count({
                where: {
                    userId,
                    problemId: { in: allModuleProblemIds },
                    status: 'solved',
                },
            });

            const problemsCount = allModuleProblemIds.length;
            const problemsSolvedPercentage = problemsCount > 0 ? parseFloat(((solvedCount / problemsCount) * 100).toFixed(2)) : 0;

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

            let solvedProblemIds = new Set<string>();
            if (userId) {
                const userProgress = await prisma.problemProgress.findMany({
                    where: { userId, status: 'solved' },
                    select: { problemId: true },
                });
                solvedProblemIds = new Set(userProgress.map((p) => p.problemId));
            }

            return modules.map((m) => {
                const topics = m.topics.map((t) => {
                    const problemsCount = t.problems.length;
                    const problemsSolvedCount = t.problems.filter((p) => solvedProblemIds.has(p.id)).length;
                    const problemsSolvedPercentage = problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

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
