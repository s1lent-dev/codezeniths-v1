import { qRPC } from './utils/qrpc.utils';
import { countBy } from './utils/problem.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetSingleTopicInputSchema,
    GetSingleTopicOutputSchema,
    GetSingleTopicProgressInputSchema,
    GetSingleTopicProgressOutputSchema,
} from '@codezeniths/schemas/db';
import { ITopicQueries } from './interfaces/topic.queries.interface';

export class TopicQueries implements ITopicQueries {
    getSingleTopic = qRPC()
        .input(GetSingleTopicInputSchema)
        .output(GetSingleTopicOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTopic query', { payload });
            const { id, slug, userId } = payload;

            if (userId) {
                const userExists = await prisma.user.findUnique({
                    where: { id: userId },
                });
                if (!userExists) {
                    logger.warn('User not found while getting single topic', { userId });
                    throw new AppErrorBuilder('User not found')
                        .setCode(ErrorCode.NOT_FOUND)
                        .build();
                }
            }

            // Find topic
            const topic = await prisma.topic.findFirst({
                where: {
                    OR: [
                        id ? { id } : {},
                        slug ? { slug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                include: {
                    problems: {
                        orderBy: {
                            order: 'asc',
                        },
                        include: {
                            tags: {
                                include: {
                                    tag: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!topic) {
                logger.warn('Topic not found', { id, slug });
                throw new AppErrorBuilder('Topic not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Fetch user's progress for all problems in this topic
            const allProblemIds = topic.problems.map((problem) => problem.id);

            const userProgress = await prisma.problemProgress.findMany({
                where: {
                    userId,
                    problemId: { in: allProblemIds },
                },
                select: {
                    problemId: true,
                    status: true,
                    favourite: true,
                },
            });

            const progressMap = new Map(
                userProgress.map((p) => [p.problemId, { status: p.status, favourite: p.favourite }])
            );

            let problemsSolvedCount = 0;

            const mappedProblems = topic.problems.map((problem) => {
                const progress = progressMap.get(problem.id);
                const status = progress?.status || 'not_solved';
                const favourite = progress?.favourite ?? false;

                if (status === 'solved') {
                    problemsSolvedCount++;
                }

                return {
                    id: problem.id,
                    title: problem.title,
                    slug: problem.slug,
                    difficulty: problem.difficulty,
                    order: problem.order,
                    articleUrl: problem.articleUrl ?? null,
                    problemUrl: problem.problemUrl ?? null,
                    favouriteCount: problem.favouriteCount ?? 0,
                    status,
                    favourite,
                    tags: problem.tags.map((pt) => ({
                        id: pt.tag.id,
                        name: pt.tag.name,
                        slug: pt.tag.slug,
                    })),
                };
            });

            const problemsCount = topic.problems.length;
            const problemsSolvedPercentage =
                problemsCount > 0
                    ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2))
                    : 0;

            return {
                id: topic.id,
                title: topic.title,
                description: topic.description,
                slug: topic.slug,
                level: topic.level,
                order: topic.order,
                problemsCount,
                problemsSolvedCount,
                problemsSolvedPercentage,
                problems: mappedProblems,
            };
        })
        .build();

    getSingleTopicProgress = qRPC()
        .input(GetSingleTopicProgressInputSchema)
        .output(GetSingleTopicProgressOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTopicProgress query', { payload });
            const { topicId, topicSlug, userId } = payload;

            // Verify user exists first
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found while getting single topic progress', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Find the topic first to ensure it exists
            const topic = await prisma.topic.findFirst({
                where: {
                    OR: [
                        topicId ? { id: topicId } : {},
                        topicSlug ? { slug: topicSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
            });

            if (!topic) {
                logger.warn('Topic not found for progress calculation', { topicId, topicSlug });
                throw new AppErrorBuilder('Topic not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Fetch all problems under this topic
            const allProblems = await prisma.problem.findMany({
                where: {
                    topicId: topic.id,
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

            // Fetch user's progress records scoped to this topic's problems
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
                problemsCountByTags,
                problemsSolvedCountByTags,
            };
        })
        .build();
}

export const topicQueries = new TopicQueries();
