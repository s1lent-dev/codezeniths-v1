import { qRPC } from './utils/qrpc.utils';
import { buildProblemWhere, buildProblemOrderBy } from './utils/problem.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
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
    GetProblemTablePrimitivesInputSchema,
    GetProblemTablePrimitivesOutputSchema,
    GetProblemProgressInputSchema,
    GetProblemProgressOutputSchema,
} from '@codezeniths/schemas/db';
import { IProblemQueries } from './interfaces/problem.queries.interface';
import { Prisma } from '@prisma/client';
import { countBy } from 'lodash';

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
            ...problem,
            tags: problem.tags.map((pt: any) => ({
                id: pt.tag.id,
                name: pt.tag.name,
                slug: pt.tag.slug,
            })),
            status: null,
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
            favourite: true,
        },
    });

    const progressMap = new Map(
        progresses.map((p) => [p.problemId, { status: p.status, favourite: p.favourite }])
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
            tags: problem.tags.map((pt: any) => ({
                id: pt.tag.id,
                name: pt.tag.name,
                slug: pt.tag.slug,
            })),
            status: progress?.status || 'not_solved',
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

            const isTransitioningToSolved =
                status === 'solved' && (!existingProgress || existingProgress.status !== 'solved');

            const solvedAt = status === 'solved' ? new Date() : null;

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
                    favourite: true,
                    problem: {
                        select: {
                            slug: true
                        }
                    }
                }
            });

            if (isTransitioningToSolved) {
                const today = new Date();
                today.setUTCHours(0, 0, 0, 0);

                await prisma.userActivity.upsert({
                    where: {
                        userId_date: { userId, date: today },
                    },
                    update: {
                        count: { increment: 1 },
                    },
                    create: {
                        userId,
                        date: today,
                        count: 1,
                    },
                });
                logger.info('Incremented user activity count', { userId, date: today });
            }

            logger.info('Successfully updated user problem status', { userId, problemId, status });
            return {
                id: progress.id,
                userId: progress.userId,
                problemId: progress.problemId,
                problemSlug: progress.problem.slug,
                status: progress.status,
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
            });
            if (!userExists) {
                logger.warn('User not found while getting problem progress', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // Fetch all problems
            const allProblems = await prisma.problem.findMany({
                select: {
                    id: true,
                    difficulty: true,
                },
            });

            const problemsCount = allProblems.length;
            const allProblemIds = allProblems.map((p) => p.id);

            // Fetch user progress for these problems
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
                        },
                    },
                },
            });

            const problemsSolvedCount = userProgress.filter((p) => p.status === 'solved').length;
            const problemsRevisitCount = userProgress.filter((p) => p.status === 'revisit').length;
            const problemNotSolvedCount = Math.max(0, problemsCount - (problemsSolvedCount + problemsRevisitCount));
            const problemsSolvedPercentage =
                problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

            const solvedProgress = userProgress.filter((p) => p.status === 'solved' && p.problem);

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
}

export const problemQueries = new ProblemQueries();
