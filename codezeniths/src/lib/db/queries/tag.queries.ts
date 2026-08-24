import { qRPC } from './utils/qrpc.utils';
import { countBy } from './utils/problem.utils';
import { buildTagsWhere, buildTagsOrderBy } from './utils/tag.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetTagsOutputSchema,
    GetTagsFilteredInputSchema,
    GetTagsFilteredOutputSchema,
    GetSingleTagProblemsInputSchema,
    GetSingleTagProblemsOutputSchema,
    GetSingleTagProblemProgressInputSchema,
    GetSingleTagProblemProgressOutputSchema,
    GetSingleTagInputSchema,
    GetSingleTagOutputSchema,
    ToggleTagBookmarkInputSchema,
    ToggleTagBookmarkOutputSchema,
    GetUserTagProgressByLevelInputSchema,
    GetUserTagProgressByLevelOutputSchema,
} from '@codezeniths/schemas/db';
import { ITagQueries } from './interfaces/tag.queries.interface';

import { redisService } from '@codezeniths/lib/redis';
import { z } from 'zod';
import { createCache } from '@/hooks/performance-hooks/cache/cache';

const tagsCache = redisService.cache.createStore<z.infer<typeof GetTagsOutputSchema>>({
    namespace: 'tags',
    ttlSeconds: 86400, // 24 hours
    schema: GetTagsOutputSchema,
});

const tagsL1Cache = createCache<z.infer<typeof GetTagsOutputSchema>>({
    strategy: 'adaptive',
    maxSize: 10,
    ttl: 1000 * 60 * 15, // 15 minutes in RAM
});

export class TagQueries implements ITagQueries {
    getTags = qRPC()
        .output(GetTagsOutputSchema)
        .handler(async () => {
            logger.info('Executing getTags query');

            // Tier 1: L1 Adaptive Memory Cache (0ms)
            const l1Cached = tagsL1Cache.get('all_tags');
            if (l1Cached) return l1Cached;

            // Tier 2: L2 Redis CacheStore + DB Fallback
            const data = await tagsCache.getOrSet('all_tags', async () => {
                const tags = await prisma.tag.findMany({
                    include: {
                        module: {
                            select: {
                                title: true,
                                slug: true,
                            },
                        },
                    },
                    orderBy: {
                        name: 'asc',
                    },
                });

                return tags.map((tag) => {
                    return {
                        id: tag.id,
                        title: tag.name,
                        slug: tag.slug,
                        description: tag.description,
                        level: tag.level,
                        module: tag.module || undefined,
                    };
                });
            });

            if (data) tagsL1Cache.set('all_tags', data);
            return data;
        })
        .build();

    getTagsFiltered = qRPC()
        .input(GetTagsFilteredInputSchema)
        .output(GetTagsFilteredOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getTagsFiltered query', { payload });
            const { userId, filters, sorting } = payload;

            const where = buildTagsWhere(filters || {});
            const orderBy = buildTagsOrderBy(sorting);

            const tags = await prisma.tag.findMany({
                where,
                orderBy,
                include: {
                    module: {
                        select: {
                            title: true,
                            slug: true,
                        },
                    },
                    problems: {
                        select: {
                            problemId: true,
                        },
                    },
                },
            });

            let solvedProblemIds = new Set<string>();
            let bookmarkedTagIds = new Set<string>();
            if (userId) {
                const [userSolved, userBookmarks] = await Promise.all([
                    prisma.problemProgress.findMany({
                        where: {
                            userId,
                            status: 'solved',
                        },
                        select: {
                            problemId: true,
                        },
                    }),
                    prisma.tagBookmark.findMany({
                        where: {
                            userId,
                            tagId: { in: tags.map((t) => t.id) },
                        },
                        select: {
                            tagId: true,
                        },
                    }),
                ]);
                solvedProblemIds = new Set(userSolved.map((p) => p.problemId));
                bookmarkedTagIds = new Set(userBookmarks.map((b) => b.tagId));
            }

            return tags.map((tag) => {
                const problemsCount = tag.problems.length;
                const problemsSolvedCount = tag.problems.filter((p) => solvedProblemIds.has(p.problemId)).length;
                const problemsSolvedPercentage =
                    problemsCount > 0
                        ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2))
                        : 0;

                return {
                    id: tag.id,
                    title: tag.name,
                    slug: tag.slug,
                    description: tag.description,
                    level: tag.level,
                    module: tag.module ? { title: tag.module.title, slug: tag.module.slug } : undefined,
                    problemsCount,
                    problemsSolvedCount,
                    problemsSolvedPercentage,
                    isBookmarked: bookmarkedTagIds.has(tag.id),
                    createdAt: tag.createdAt,
                };
            });
        })
        .build();



    getSingleTagProblems = qRPC()
        .input(GetSingleTagProblemsInputSchema)
        .output(GetSingleTagProblemsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTagProblems query', { payload });
            const { id, slug, userId } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found while getting single tag problems', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const tag = await prisma.tag.findFirst({
                where: {
                    OR: [
                        id ? { id } : {},
                        slug ? { slug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                include: {
                    problems: {
                        include: {
                            problem: {
                                include: {
                                    tags: {
                                        include: {
                                            tag: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!tag) {
                logger.warn('Tag not found', { id, slug });
                throw new AppErrorBuilder('Tag not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const problems = tag.problems.map((pt) => pt.problem).filter(Boolean);
            const problemsCount = problems.length;
            const problemIds = problems.map((p) => p.id);

            const userProgress = await prisma.problemProgress.findMany({
                where: {
                    userId,
                    ...(problemIds.length <= 100 ? { problemId: { in: problemIds } } : {}),
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

            const mappedProblems = problems.map((problem) => {
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

            mappedProblems.sort((a, b) => a.order - b.order);

            const problemsSolvedPercentage =
                problemsCount > 0
                    ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2))
                    : 0;

            return {
                id: tag.id,
                title: tag.name,
                slug: tag.slug,
                description: tag.description,
                level: tag.level,
                problemsCount,
                problemsSolvedCount,
                problemsSolvedPercentage,
                problems: mappedProblems,
            };
        })
        .build();

    getSingleTagProblemProgress = qRPC()
        .input(GetSingleTagProblemProgressInputSchema)
        .output(GetSingleTagProblemProgressOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTagProblemProgress query', { payload });
            const { tagId, tagSlug, userId } = payload;

            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!userExists) {
                logger.warn('User not found while getting tag progress', { userId });
                throw new AppErrorBuilder('User not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const tag = await prisma.tag.findFirst({
                where: {
                    OR: [
                        tagId ? { id: tagId } : {},
                        tagSlug ? { slug: tagSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
            });

            if (!tag) {
                logger.warn('Tag not found for progress calculation', { tagId, tagSlug });
                throw new AppErrorBuilder('Tag not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const tagProblemsRelation = await prisma.problemTag.findMany({
                where: {
                    tagId: tag.id,
                },
                include: {
                    problem: {
                        select: {
                            id: true,
                            difficulty: true,
                        },
                    },
                },
            });

            const allProblems = tagProblemsRelation.map((pt) => pt.problem).filter(Boolean);
            const allProblemIds = allProblems.map((p) => p.id);

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
                        },
                    },
                },
            });

            const problemsCount = allProblems.length;
            const problemsSolvedCount = userProgress.filter((p) => p.status === 'solved').length;
            const problemsRevisitCount = userProgress.filter((p) => p.revisit === true).length;
            const problemNotSolvedCount = Math.max(0, problemsCount - problemsSolvedCount);
            const problemsSolvedPercentage = problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;

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

    getSingleTag = qRPC()
        .input(GetSingleTagInputSchema)
        .output(GetSingleTagOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTag query', { payload });
            const { id, slug, userId } = payload;

            const tag = await prisma.tag.findFirst({
                where: {
                    OR: [
                        id ? { id } : {},
                        slug ? { slug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                include: {
                    module: {
                        select: {
                            title: true,
                            slug: true,
                        },
                    },
                    problems: {
                        include: {
                            problem: {
                                select: {
                                    id: true,
                                    difficulty: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!tag) {
                logger.warn('Tag not found in getSingleTag', { id, slug });
                throw new AppErrorBuilder('Tag not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const allProblems = tag.problems.map((pt) => pt.problem).filter(Boolean);
            const problemsCount = allProblems.length;
            const allProblemIds = allProblems.map((p) => p.id);

            let problemsSolvedCount = 0;
            let problemsRevisitCount = 0;
            let solvedProgress: typeof userProgress = [];

            let userProgress: Array<{ status: string; revisit: boolean; problemId: string; problem: { id: string; difficulty: any } | null }> = [];
            if (userId) {
                userProgress = await prisma.problemProgress.findMany({
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

            // ── Semantic Similarity Ranking for Top 10 Similar Tags ────────────
            const activeProblemIdsSet = new Set(allProblemIds);

            // Fetch candidate tags (excluding current tag)
            const candidates = await prisma.tag.findMany({
                where: {
                    id: { not: tag.id },
                },
                include: {
                    module: {
                        select: {
                            title: true,
                        },
                    },
                    problems: {
                        select: {
                            problemId: true,
                        },
                    },
                },
            });

            // Score each candidate tag
            const scoredCandidates = candidates.map((cand) => {
                let score = 0;

                // 1. Same Module match (+40)
                if (tag.moduleId && cand.moduleId === tag.moduleId) {
                    score += 40;
                }

                // 2. Shared problem co-occurrence (+10 per shared problem, max 30)
                const sharedCount = cand.problems.filter((p) => activeProblemIdsSet.has(p.problemId)).length;
                score += Math.min(30, sharedCount * 10);

                // 3. Same Proficiency Level match (+20)
                if (tag.level && cand.level === tag.level) {
                    score += 20;
                }

                // 4. Popularity bonus based on problem count (+10 max)
                score += Math.min(10, cand.problems.length);

                return {
                    id: cand.id,
                    title: cand.name,
                    slug: cand.slug,
                    level: cand.level,
                    moduleTitle: cand.module?.title,
                    problemsCount: cand.problems.length,
                    score,
                };
            });

            // Sort by score DESC, then name ASC
            scoredCandidates.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

            const top10SimilarTags = scoredCandidates.slice(0, 10).map(({ score, ...rest }) => rest);

            let isBookmarked = false;
            if (userId) {
                const bm = await prisma.tagBookmark.findUnique({
                    where: {
                        userId_tagId: {
                            userId,
                            tagId: tag.id,
                        },
                    },
                });
                isBookmarked = !!bm;
            }

            return {
                id: tag.id,
                title: tag.name,
                slug: tag.slug,
                description: tag.description,
                level: tag.level,
                isBookmarked,
                module: tag.module ? { title: tag.module.title, slug: tag.module.slug } : undefined,
                progress: {
                    problemsCount,
                    problemsSolvedCount,
                    problemsRevisitCount,
                    problemNotSolvedCount,
                    problemsSolvedPercentage,
                    problemsCountByDifficulty,
                    problemsSolvedCountByDifficulty,
                },
                similarTags: top10SimilarTags,
            };
        })
        .build();

    toggleTagBookmark = qRPC()
        .input(ToggleTagBookmarkInputSchema)
        .output(ToggleTagBookmarkOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing toggleTagBookmark query', { payload });
            const { tagId, tagSlug, userId } = payload;

            const tag = await prisma.tag.findFirst({
                where: {
                    OR: [
                        tagId ? { id: tagId } : {},
                        tagSlug ? { slug: tagSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                select: { id: true },
            });

            if (!tag) {
                throw new AppErrorBuilder('Tag not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const existing = await prisma.tagBookmark.findUnique({
                where: {
                    userId_tagId: {
                        userId,
                        tagId: tag.id,
                    },
                },
            });

            if (existing) {
                await prisma.tagBookmark.delete({
                    where: {
                        id: existing.id,
                    },
                });
                return { isBookmarked: false, tagId: tag.id };
            } else {
                await prisma.tagBookmark.create({
                    data: {
                        userId,
                        tagId: tag.id,
                    },
                });
                return { isBookmarked: true, tagId: tag.id };
            }
        })
        .build();

    getUserTagProgressByLevel = qRPC()
        .input(GetUserTagProgressByLevelInputSchema)
        .output(GetUserTagProgressByLevelOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getUserTagProgressByLevel query', { payload });
            const { userId, moduleSlug, moduleId } = payload;

            const solvedRecords = await prisma.problemProgress.findMany({
                where: {
                    userId,
                    status: 'solved',
                },
                select: {
                    problemId: true,
                },
            });

            const solvedProblemIds = new Set(solvedRecords.map((r) => r.problemId));

            const isModuleFilter = moduleSlug && moduleSlug !== 'all';
            const tags = await prisma.tag.findMany({
                where: {
                    level: {
                        in: ['fundamental', 'intermediate', 'advanced'],
                    },
                    ...(isModuleFilter
                        ? { module: { slug: moduleSlug } }
                        : moduleId
                        ? { moduleId }
                        : {}),
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    level: true,
                    problems: {
                        select: {
                            problemId: true,
                        },
                    },
                },
            });

            const processedTags = tags.map((t) => {
                const totalProblems = t.problems.length;
                let solvedCount = 0;
                for (const p of t.problems) {
                    if (solvedProblemIds.has(p.problemId)) {
                        solvedCount++;
                    }
                }
                return {
                    id: t.id,
                    name: t.name,
                    slug: t.slug,
                    level: t.level,
                    solvedCount,
                    totalProblems,
                };
            });

            const sortBySolvedDesc = (a: (typeof processedTags)[number], b: (typeof processedTags)[number]) =>
                b.solvedCount - a.solvedCount || b.totalProblems - a.totalProblems || a.name.localeCompare(b.name);

            const fundamental = processedTags
                .filter((t) => t.level === 'fundamental')
                .sort(sortBySolvedDesc)
                .slice(0, 10);

            const intermediate = processedTags
                .filter((t) => t.level === 'intermediate')
                .sort(sortBySolvedDesc)
                .slice(0, 10);

            const advanced = processedTags
                .filter((t) => t.level === 'advanced')
                .sort(sortBySolvedDesc)
                .slice(0, 10);

            return {
                fundamental,
                intermediate,
                advanced,
            };
        })
        .build();
}


export const tagQueries = new TagQueries();
