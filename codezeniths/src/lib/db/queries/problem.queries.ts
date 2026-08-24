import { qRPC } from './utils/qrpc.utils';
import { buildProblemWhere, buildProblemOrderBy } from './utils/problem.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import { progressProducer, notificationProducer } from '@/lib/mq';
import {
    GetProblemsInputSchema,
    GetProblemsOutputSchema,
    GetProblemsPaginatedInputSchema,
    GetProblemsPaginatedOutputSchema,
    GetProblemsInfiniteInputSchema,
    GetProblemsInfiniteOutputSchema,
    GetProblemsWithFiltersInputSchema,
    GetProblemsWithFiltersOutputSchema,
    UpdateProblemStatusInputSchema,
    UpdateProblemStatusOutputSchema,
    UpdateProblemNoteInputSchema,
    UpdateProblemNoteOutputSchema,
    UpdateProblemFavouriteInputSchema,
    UpdateProblemFavouriteOutputSchema,
    UpdateProblemRevisitInputSchema,
    UpdateProblemRevisitOutputSchema,
    GetProblemTablePrimitivesInputSchema,
    GetProblemTablePrimitivesOutputSchema,
    GetProblemProgressInputSchema,
    GetProblemProgressOutputSchema,
    GetRecentlySolvedProblemsInputSchema,
    GetRecentlySolvedProblemsOutputSchema,
} from '@codezeniths/schemas/db';
import { IProblemQueries } from './interfaces/problem.queries.interface';
import { Prisma } from '@prisma/client';
import { recordProblemSolvedAndSyncStreak, revertProblemSolvedAndSyncStreak } from './utils/streak.utils';

import { processScoreTransition } from './utils/leaderboard.utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolves and attaches user solved status to problems.
 */
async function attachUserProgress(
    problems: any[],
    userId?: string,
): Promise<any[]> {
    if (!userId || problems.length === 0) {
        return problems.map((problem) => ({
            id: problem.id,
            title: problem.title,
            slug: problem.slug,
            difficulty: problem.difficulty,
            order: problem.order,
            articleUrl: problem.articleUrl ?? null,
            problemUrl: problem.problemUrl ?? null,
            favouriteCount: problem.favouriteCount ?? 0,
            topicId: problem.topicId ?? problem.topic?.id ?? null,
            topicSlug: problem.topic?.slug ?? null,
            tags: problem.tags.map((pt: any) => ({
                id: pt.tag.id,
                name: pt.tag.name,
                slug: pt.tag.slug,
            })),
            status: null,
            revisit: null,
            favourite: null,
        }));
    }

    const problemIds = problems.map((p) => p.id);
    const progresses = await prisma.problemProgress.findMany({
        where: {
            userId,
            problemId: { in: problemIds },
        },
        select: {
            problemId: true,
            status: true,
            revisit: true,
            favourite: true,
        },
    });

    const progressMap = new Map(
        progresses.map((p) => [p.problemId, { status: p.status, revisit: p.revisit, favourite: p.favourite }])
    );

    return problems.map((problem) => {
        const progress = progressMap.get(problem.id);
        return {
            id: problem.id,
            title: problem.title,
            slug: problem.slug,
            difficulty: problem.difficulty,
            order: problem.order,
            articleUrl: problem.articleUrl ?? null,
            problemUrl: problem.problemUrl ?? null,
            favouriteCount: problem.favouriteCount ?? 0,
            topicId: problem.topicId ?? problem.topic?.id ?? null,
            topicSlug: problem.topic?.slug ?? null,
            tags: problem.tags.map((pt: any) => ({
                id: pt.tag.id,
                name: pt.tag.name,
                slug: pt.tag.slug,
            })),
            status: progress?.status || 'not_solved',
            revisit: progress?.revisit ?? false,
            favourite: progress?.favourite ?? false,
        };
    });
}

// ─── ProblemQueries ───────────────────────────────────────────────────────────

export class ProblemQueries implements IProblemQueries {
    getProblems = qRPC()
        .input(GetProblemsInputSchema)
        .output(GetProblemsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getProblems query', { payload });
            const { userId, filters, sorting } = payload;

            const where = buildProblemWhere(filters || {}, userId);
            const orderBy = buildProblemOrderBy(sorting);

            const [total, solvedCount, problems] = await Promise.all([
                prisma.problem.count({ where }),
                userId
                    ? prisma.problemProgress.count({
                          where: {
                              userId,
                              status: 'solved',
                              problem: where,
                          },
                      })
                    : Promise.resolve(0),
                prisma.problem.findMany({
                    where,
                    orderBy,
                    include: {
                        topic: {
                            select: {
                                id: true,
                                slug: true,
                            },
                        },
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                }),
            ]);

            const mappedProblems = await attachUserProgress(problems, userId);

            return {
                problems: mappedProblems,
                total,
                solvedCount,
            };
        })
        .build();

    getProblemsPaginated = qRPC()
        .input(GetProblemsPaginatedInputSchema)
        .output(GetProblemsPaginatedOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getProblemsPaginated query', { payload });
            const { userId, page, limit, sorting, ...filterFields } = payload;

            const where = buildProblemWhere(filterFields, userId);
            const orderBy = buildProblemOrderBy(sorting);

            const [total, solvedCount, problems] = await Promise.all([
                prisma.problem.count({ where }),
                userId
                    ? prisma.problemProgress.count({
                          where: {
                              userId,
                              status: 'solved',
                              problem: where,
                          },
                      })
                    : Promise.resolve(0),
                prisma.problem.findMany({
                    where,
                    orderBy,
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        topic: {
                            select: {
                                id: true,
                                slug: true,
                            },
                        },
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                }),
            ]);

            const mappedProblems = await attachUserProgress(problems, userId);

            return {
                items: mappedProblems,
                total,
                solvedCount,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
            };
        })
        .build();

    getProblemsInfinite = qRPC()
        .input(GetProblemsInfiniteInputSchema)
        .output(GetProblemsInfiniteOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getProblemsInfinite query', { payload });
            const { userId, cursor, limit, sorting, ...filterFields } = payload;

            const where = buildProblemWhere(filterFields, userId);
            const orderBy = buildProblemOrderBy(sorting);

            const [total, solvedCount, problems] = await Promise.all([
                prisma.problem.count({ where }),
                userId
                    ? prisma.problemProgress.count({
                          where: {
                              userId,
                              status: 'solved',
                              problem: where,
                          },
                      })
                    : Promise.resolve(0),
                prisma.problem.findMany({
                    where,
                    orderBy,
                    cursor: cursor ? { id: cursor } : undefined,
                    skip: cursor ? 1 : 0,
                    take: limit + 1,
                    include: {
                        topic: {
                            select: {
                                id: true,
                                slug: true,
                            },
                        },
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                }),
            ]);

            const hasNextPage = problems.length > limit;
            const items = hasNextPage ? problems.slice(0, limit) : problems;
            const nextCursor = hasNextPage ? items[items.length - 1].id : null;

            const mappedItems = await attachUserProgress(items, userId);

            return {
                items: mappedItems,
                total,
                solvedCount,
                nextCursor,
            };
        })
        .build();

    getProblemsWithFilters = qRPC()
        .input(GetProblemsWithFiltersInputSchema)
        .output(GetProblemsWithFiltersOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getProblemsWithFilters query', { payload });
            const { userId, filters, sorting } = payload;

            const where = buildProblemWhere(filters || {}, userId);
            const orderBy = buildProblemOrderBy(sorting);

            const [solvedCount, problems] = await Promise.all([
                userId
                    ? prisma.problemProgress.count({
                          where: {
                              userId,
                              status: 'solved',
                              problem: where,
                          },
                      })
                    : Promise.resolve(0),
                prisma.problem.findMany({
                    where,
                    orderBy,
                    include: {
                        tags: {
                            include: {
                                tag: true,
                            },
                        },
                    },
                }),
            ]);

            const mappedProblems = await attachUserProgress(problems, userId);
            const problemsCount = mappedProblems.length;

            const problemsCountByDifficulty = {
                easy: 0,
                medium: 0,
                hard: 0,
            };

            for (const p of mappedProblems) {
                if (p.difficulty === 'easy') problemsCountByDifficulty.easy++;
                else if (p.difficulty === 'medium') problemsCountByDifficulty.medium++;
                else if (p.difficulty === 'hard') problemsCountByDifficulty.hard++;
            }

            return {
                problemsCount,
                solvedCount,
                problemsCountByDifficulty,
                problems: mappedProblems,
            };
        })
        .build();

    updateProblemStatus = qRPC()
        .input(UpdateProblemStatusInputSchema)
        .output(UpdateProblemStatusOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateProblemStatus mutation', { payload });
            const { userId, problemId, status } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found for problem status update', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const problemExists = await prisma.problem.findUnique({
                where: { id: problemId },
                include: {
                    topic: {
                        select: {
                            moduleId: true,
                            module: {
                                select: {
                                    title: true
                                }
                            }
                        },
                    },
                },
            });
            if (!problemExists) {
                logger.warn('Problem not found for status update', { problemId });
                throw new AppErrorBuilder('Problem not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const existingProgress = await prisma.problemProgress.findUnique({
                where: {
                    userId_problemId: { userId, problemId },
                },
            });

            const previousStatus = existingProgress?.status ?? 'not_solved';

            const isTransitioningToSolved =
                status === 'solved' && (!existingProgress || existingProgress.status !== 'solved');

            const isTransitioningFromSolved =
                previousStatus === 'solved' && status !== 'solved';

            // If solving: assign new timestamp if transitioning to solved or missing timestamp, else preserve existing.
            // If unsolving (not_solved, in_progress, etc.): explicitly reset solvedAt to null.
            const solvedAt = status === 'solved'
                ? (isTransitioningToSolved ? new Date() : (existingProgress?.solvedAt ?? new Date()))
                : null;

            const progress = await prisma.problemProgress.upsert({
                where: {
                    userId_problemId: { userId, problemId }
                },
                update: {
                    status,
                    solvedAt,
                },
                create: {
                    userId,
                    problemId,
                    status,
                    solvedAt,
                    favourite: false,
                },
                select: {
                    id: true,
                    userId: true,
                    problemId: true,
                    status: true,
                    revisit: true,
                    favourite: true,
                    solvedAt: true,
                    problem: {
                        select: {
                            slug: true
                        }
                    }
                }
            });

            if (isTransitioningToSolved) {
                const points = problemExists.difficulty === 'easy' ? 10 : problemExists.difficulty === 'medium' ? 20 : 30;
                await recordProblemSolvedAndSyncStreak({ userId, pointsEarned: points, problemsSolved: 1 });
                logger.info('Recorded user problem solved activity and synced streak', { userId, points });

                // Publish domain events to MQ for asynchronous notification & push delivery
                void (async () => {
                    try {
                        const module = problemExists.topic?.module?.title || 'algorithms';
                        await progressProducer.problemSolved({
                            userId,
                            problemId,
                            problemTitle: problemExists.title,
                            difficulty: problemExists.difficulty,
                            module,
                            isFirstSolve: previousStatus !== 'solved',
                        });

                        // 1. Topic completion check
                        if (problemExists.topicId) {
                            const topicId = problemExists.topicId;
                            const [topic, topicTotal, topicSolved] = await Promise.all([
                                prisma.topic.findUnique({
                                    where: { id: topicId },
                                    select: { title: true, slug: true },
                                }),
                                prisma.problem.count({
                                    where: { topicId },
                                }),
                                prisma.problemProgress.count({
                                    where: {
                                        userId,
                                        status: 'solved',
                                        problem: { topicId },
                                    },
                                }),
                            ]);

                            if (topicTotal > 0 && topicSolved === topicTotal) {
                                await notificationProducer.publishInApp({
                                    userId,
                                    type: 'topic_completed',
                                    title: 'Topic Completed! 🚀',
                                    message: `You have solved all problems in "${topic?.title || 'the topic'}".`,
                                    link: `/problems?topic=${topic?.slug || topicId}`,
                                });
                            }
                        }

                        // 2. Module completion check
                        const moduleId = problemExists.topic?.moduleId;
                        if (moduleId) {
                            const [moduleData, modTotal, modSolved] = await Promise.all([
                                prisma.module.findUnique({
                                    where: { id: moduleId },
                                    select: { title: true, slug: true },
                                }),
                                prisma.problem.count({
                                    where: { topic: { moduleId } },
                                }),
                                prisma.problemProgress.count({
                                    where: {
                                        userId,
                                        status: 'solved',
                                        problem: { topic: { moduleId } },
                                    },
                                }),
                            ]);

                            if (modTotal > 0 && modSolved === modTotal) {
                                await progressProducer.moduleMastered({
                                    userId,
                                    moduleSlug: moduleData?.slug || moduleId,
                                    moduleTitle: moduleData?.title || 'Module',
                                });
                            }
                        }
                    } catch (notifErr) {
                        logger.error('Failed to publish problem/module completion MQ events', { error: notifErr, userId });
                    }
                })();
            } else if (isTransitioningFromSolved) {
                const points = problemExists.difficulty === 'easy' ? 10 : problemExists.difficulty === 'medium' ? 20 : 30;
                await revertProblemSolvedAndSyncStreak({ userId, pointsEarned: points, problemsSolved: 1 });
                logger.info('Reverted user problem solved activity and synced streak', { userId, points });

                // Publish problem-unsolved domain event to MQ
                void (async () => {
                    try {
                        const module = problemExists.topic?.module?.title || 'algorithms';
                        await progressProducer.problemUnsolved({
                            userId,
                            problemId,
                            problemTitle: problemExists.title,
                            difficulty: problemExists.difficulty,
                            module,
                            unsolvedAt: new Date().toISOString(),
                        });
                    } catch (unsolveErr) {
                        logger.error('Failed to publish problem unsolved MQ event', { error: unsolveErr, userId });
                    }
                })();
            }


            if (previousStatus !== status) {
                await processScoreTransition({
                    userId,
                    problemId,
                    previousStatus,
                    newStatus: status,
                    difficulty: problemExists.difficulty,
                    moduleId: problemExists.topic?.moduleId ?? null,
                });
            }

            logger.info('Successfully updated user problem status', { userId, problemId, status });
            return {
                id: progress.id,
                userId: progress.userId,
                problemId: progress.problemId,
                problemSlug: progress.problem.slug,
                status: progress.status,
                revisit: progress.revisit,
                favourite: progress.favourite,
            };
        })
        .build();

    updateProblemNote = qRPC()
        .input(UpdateProblemNoteInputSchema)
        .output(UpdateProblemNoteOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateProblemNote mutation', { payload });
            const { userId, problemId, notes } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found for problem note update', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const problemExists = await prisma.problem.findUnique({
                where: { id: problemId },
            });
            if (!problemExists) {
                logger.warn('Problem not found for note update', { problemId });
                throw new AppErrorBuilder('Problem not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const progress = await prisma.problemProgress.upsert({
                where: {
                    userId_problemId: { userId, problemId }
                },
                update: {
                    notes: notes ?? null
                },
                create: {
                    userId,
                    problemId,
                    notes: notes ?? null,
                    status: 'not_solved'
                },
                select: {
                    id: true,
                    userId: true,
                    problemId: true,
                    notes: true,
                    problem: {
                        select: {
                            slug: true
                        }
                    }
                }
            });

            logger.info('Successfully updated user problem note', { userId, problemId });
            return {
                id: progress.id,
                problemId: progress.problemId,
                userId: progress.userId,
                notes: progress.notes,
                problemSlug: progress.problem.slug
            };
        })
        .build();

    updateProblemFavourite = qRPC()
    .input(UpdateProblemFavouriteInputSchema)
    .output(UpdateProblemFavouriteOutputSchema)
    .handler(async (payload) => {
        logger.info('Executing updateProblemFavourite mutation', { payload });
        const { userId, problemId, favourite } = payload;

        try {
            const progress = await prisma.$transaction(async (tx) => {
                const existing = await tx.problemProgress.findUnique({
                    where: { userId_problemId: { userId, problemId } },
                    select: { favourite: true },
                });

                // no-op guard: only touch the counter if the value is actually changing
                const delta = favourite === (existing?.favourite ?? false)
                    ? 0
                    : favourite ? 1 : -1;

                const updated = await tx.problemProgress.upsert({
                    where: { userId_problemId: { userId, problemId } },
                    update: { favourite },
                    create: { userId, problemId, favourite, status: 'not_solved' },
                    select: {
                        id: true,
                        userId: true,
                        problemId: true,
                        status: true,
                        revisit: true,
                        favourite: true,
                        problem: { select: { slug: true } },
                    },
                });

                if (delta !== 0) {
                    await tx.problem.update({
                        where: { id: problemId },
                        data: { favouriteCount: { increment: delta } },
                    });
                }

                return updated;
            });

            logger.info('Successfully updated user problem favourite status', { userId, problemId, favourite });
            return {
                id: progress.id,
                userId: progress.userId,
                problemId: progress.problemId,
                problemSlug: progress.problem.slug,
                status: progress.status,
                revisit: progress.revisit,
                favourite: progress.favourite,
            };
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
                const field = err.meta?.field_name as string | undefined;
                logger.warn('FK violation on problem favourite update', { userId, problemId, field });
                throw new AppErrorBuilder(
                    field?.includes('user') ? 'User not found' : 'Problem not found'
                ).setCode(ErrorCode.NOT_FOUND).build();
            }
            throw err;
        }
    })
    .build();

    updateProblemRevisit = qRPC()
        .input(UpdateProblemRevisitInputSchema)
        .output(UpdateProblemRevisitOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updateProblemRevisit mutation', { payload });
            const { userId, problemId, revisit } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found for problem revisit update', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const problemExists = await prisma.problem.findUnique({
                where: { id: problemId },
            });
            if (!problemExists) {
                logger.warn('Problem not found for revisit update', { problemId });
                throw new AppErrorBuilder('Problem not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const progress = await prisma.problemProgress.upsert({
                where: {
                    userId_problemId: { userId, problemId },
                },
                update: {
                    revisit,
                },
                create: {
                    userId,
                    problemId,
                    revisit,
                    status: 'not_solved',
                },
                select: {
                    id: true,
                    userId: true,
                    problemId: true,
                    status: true,
                    revisit: true,
                    favourite: true,
                    problem: {
                        select: {
                            slug: true,
                        },
                    },
                },
            });

            logger.info('Successfully updated user problem revisit status', { userId, problemId, revisit });
            return {
                id: progress.id,
                userId: progress.userId,
                problemId: progress.problemId,
                problemSlug: progress.problem.slug,
                status: progress.status,
                revisit: progress.revisit,
                favourite: progress.favourite,
            };
        })
        .build();

    getProblemTablePrimitives = qRPC()
        .input(GetProblemTablePrimitivesInputSchema)
        .output(GetProblemTablePrimitivesOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getProblemTablePrimitives query', { payload });
            const { userId } = payload;

            const [modules, tags, totalProblems, userSolvedCount] = await Promise.all([
                prisma.module.findMany({
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        topics: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                            orderBy: { order: 'asc' },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                }),

                prisma.tag.findMany({
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                    orderBy: { name: 'asc' },
                }),

                prisma.problem.count(),

                userId
                    ? prisma.problemProgress.count({
                          where: { userId, status: 'solved' },
                      })
                    : Promise.resolve(0),
            ]);

            return {
                modules,
                tags,
                totalProblems,
                solvedProblems: userSolvedCount,
            };
        })
        .build();

    getProblemProgress = qRPC()
        .input(GetProblemProgressInputSchema)
        .output(GetProblemProgressOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getProblemProgress query', { payload });
            const { userId } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
                select: { id: true },
            });
            if (!userExists) {
                logger.warn('User not found while getting problem progress', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // High-performance parallel queries leveraging native database aggregation and indexes
            const [difficultyGroupCounts, userSolvedProgress, problemsRevisitCount] = await Promise.all([
                // 1. Total problem counts grouped by difficulty directly in PostgreSQL
                prisma.problem.groupBy({
                    by: ['difficulty'],
                    _count: { _all: true },
                }),
                // 2. User's solved problems (indexed on [userId, status])
                prisma.problemProgress.findMany({
                    where: {
                        userId,
                        status: 'solved',
                    },
                    select: {
                        problem: {
                            select: {
                                difficulty: true,
                            },
                        },
                    },
                }),
                // 3. User's revisit count (indexed on [userId, revisit])
                prisma.problemProgress.count({
                    where: {
                        userId,
                        revisit: true,
                    },
                }),
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
                easy: 0,
                medium: 0,
                hard: 0,
            };

            for (const p of userSolvedProgress) {
                if (p.problem?.difficulty === 'easy') problemsSolvedCountByDifficulty.easy++;
                else if (p.problem?.difficulty === 'medium') problemsSolvedCountByDifficulty.medium++;
                else if (p.problem?.difficulty === 'hard') problemsSolvedCountByDifficulty.hard++;
            }

            const problemsSolvedCount = userSolvedProgress.length;
            const problemNotSolvedCount = Math.max(0, problemsCount - problemsSolvedCount);
            const problemsSolvedPercentage =
                problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

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

    getRecentlySolvedProblems = qRPC()
        .input(GetRecentlySolvedProblemsInputSchema)
        .output(GetRecentlySolvedProblemsOutputSchema)
        .handler(async ({ userId, limit }) => {
            logger.info('Executing getRecentlySolvedProblems query', { userId, limit });

            const solvedProgress = await prisma.problemProgress.findMany({
                where: {
                    userId,
                    status: 'solved',
                    solvedAt: { not: null },
                },
                orderBy: { solvedAt: 'desc' },
                take: limit,
                select: {
                    solvedAt: true,
                    problem: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                },
            });

            return solvedProgress
                .filter((p) => p.problem !== null && p.solvedAt !== null)
                .map((p) => ({
                    id: p.problem.id,
                    title: p.problem.title,
                    slug: p.problem.slug,
                    solvedAt: p.solvedAt,
                }));
        })
        .build();
}

export const problemQueries = new ProblemQueries();
