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
} from '@codezeniths/schemas/db';
import { IModuleQueries } from './interfaces/module.queries.interface';

import { redisService } from '@codezeniths/lib/redis';
import { z } from 'zod';

const modulesCache = redisService.cache.createStore<z.infer<typeof GetModulesOutputSchema>>({
    namespace: 'modules',
    ttlSeconds: 86400, // 24 hours
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

            // Verify user exists first
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found while getting single module', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
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

            // Fetch user's progress for all problems in this module
            const allProblemIds = module.topics.flatMap((topic) =>
                topic.problems.map((problem) => problem.id)
            );

            const userProgress = await prisma.problemProgress.findMany({
                where: {
                    userId,
                    problemId: { in: allProblemIds },
                },
                select: {
                    problemId: true,
                    status: true,
                },
            });

            const solvedProblemIds = new Set(
                userProgress
                    .filter((p) => p.status === 'solved')
                    .map((p) => p.problemId)
            );

            const topics = module.topics.map((topic) => {
                const problems = topic.problems;
                const problemsCount = problems.length;

                const problemsCountByDifficulty = {
                    easy: 0,
                    medium: 0,
                    hard: 0,
                };

                let problemsSolvedCount = 0;

                for (const problem of problems) {
                    if (problem.difficulty === 'easy') problemsCountByDifficulty.easy++;
                    else if (problem.difficulty === 'medium') problemsCountByDifficulty.medium++;
                    else if (problem.difficulty === 'hard') problemsCountByDifficulty.hard++;

                    if (solvedProblemIds.has(problem.id)) {
                        problemsSolvedCount++;
                    }
                }

                const problemsSolvedPercentage =
                    problemsCount > 0
                        ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2))
                        : 0;

                return {
                    title: topic.title,
                    description: topic.description,
                    slug: topic.slug,
                    level: topic.level,
                    order: topic.order,
                    problemsCount,
                    problemsCountByDifficulty,
                    problemsSolvedCount,
                    problemsSolvedPercentage,
                };
            });

            return {
                id: module.id,
                title: module.title,
                description: module.description,
                slug: module.slug,
                topics,
            };
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
                    problemId: { in: allProblemIds },
                },
                select: {
                    status: true,
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
            const problemsRevisitCount = userProgress.filter((p) => p.status === 'revisit').length;
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
}

export const moduleQueries = new ModuleQueries();
