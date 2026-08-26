import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetSingleTopicInputSchema,
    GetSingleTopicOutputSchema,
    GetSingleTopicProgressInputSchema,
    GetSingleTopicProgressOutputSchema,
    GetTopicSuggestionsInputSchema,
    GetTopicSuggestionsOutputSchema,
} from '@codezeniths/schemas/db';
import { ITopicQueries } from './interfaces/topic.queries.interface';
import { redisService } from '@codezeniths/lib/redis';
import { z } from 'zod';
import { createCache } from '@/hooks/performance-hooks/cache/cache';

// Multi-Tier Caches for Semantic Topic Suggestions
const topicSuggestionsCache = redisService.cache.createStore<any>({
    namespace: 'topic_suggestions',
    ttlSeconds: 86400, // 24 hours
});

const topicSuggestionsL1Cache = createCache<any>({
    strategy: 'adaptive',
    maxSize: 100,
    ttl: 1000 * 60 * 30, // 30 minutes in RAM
});

// Multi-Tier Caches for Topic Difficulty Totals
const topicDifficultyTotalsCache = redisService.cache.createStore<any>({
    namespace: 'topic_difficulty_totals',
    ttlSeconds: 86400, // 24 hours
});

const topicDifficultyTotalsL1Cache = createCache<any>({
    strategy: 'adaptive',
    maxSize: 100,
    ttl: 1000 * 60 * 30, // 30 minutes in RAM
});

export class TopicQueries implements ITopicQueries {
    getSingleTopic = qRPC()
        .input(GetSingleTopicInputSchema)
        .output(GetSingleTopicOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTopic query', { payload });
            const { id, slug, userId } = payload;

            const topic = await prisma.topic.findFirst({
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
                    level: true,
                    order: true,
                    module: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                    _count: {
                        select: {
                            problems: true,
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

            let isBookmarked = false;
            if (userId) {
                const bm = await prisma.topicBookmark.findUnique({
                    where: {
                        userId_topicId: {
                            userId,
                            topicId: topic.id,
                        },
                    },
                });
                isBookmarked = !!bm;
            }

            return {
                id: topic.id,
                title: topic.title,
                slug: topic.slug,
                description: topic.description,
                level: topic.level,
                order: topic.order,
                isBookmarked,
                problemsCount: topic._count.problems,
                module: topic.module
                    ? {
                          title: topic.module.title,
                          slug: topic.module.slug,
                      }
                    : undefined,
            };
        })
        .build();

    getSingleTopicProgress = qRPC()
        .input(GetSingleTopicProgressInputSchema)
        .output(GetSingleTopicProgressOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTopicProgress query', { payload });
            const { topicId, topicSlug, userId } = payload;

            // 1. Find topic ID
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
                logger.warn('Topic not found for progress calculation', { topicId, topicSlug });
                throw new AppErrorBuilder('Topic not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const targetTopicId = topic.id;

            // 2. Static Topic Difficulty Totals & Problem IDs (L1 Memory -> L2 Redis -> DB Fallback)
            const totalsCacheKey = `topic_difficulty_totals:${targetTopicId}`;
            let topicTotals = topicDifficultyTotalsL1Cache.get(totalsCacheKey);
            if (!topicTotals) {
                topicTotals = await topicDifficultyTotalsCache.get(totalsCacheKey);
                if (topicTotals) {
                    topicDifficultyTotalsL1Cache.set(totalsCacheKey, topicTotals);
                }
            }

            if (!topicTotals) {
                const problems = await prisma.problem.findMany({
                    where: { topicId: targetTopicId },
                    select: { id: true, difficulty: true },
                });

                const difficulties: Record<string, 'easy' | 'medium' | 'hard'> = {};
                const counts = { easy: 0, medium: 0, hard: 0 };
                const problemIds: string[] = [];

                for (const p of problems) {
                    problemIds.push(p.id);
                    const diff = p.difficulty as 'easy' | 'medium' | 'hard';
                    difficulties[p.id] = diff;
                    if (diff === 'easy') counts.easy++;
                    else if (diff === 'medium') counts.medium++;
                    else if (diff === 'hard') counts.hard++;
                }

                topicTotals = {
                    problemIds,
                    difficulties,
                    counts,
                    total: problemIds.length,
                };

                topicDifficultyTotalsL1Cache.set(totalsCacheKey, topicTotals);
                void topicDifficultyTotalsCache.set(totalsCacheKey, topicTotals);
            }

            // 3. User Progress: Single Indexed Seek on problem_progress (userId, problemId)
            let problemsSolvedCount = 0;
            let problemsRevisitCount = 0;
            const problemsSolvedCountByDifficulty = { easy: 0, medium: 0, hard: 0 };

            if (userId && topicTotals.problemIds.length > 0) {
                const userProgress = await prisma.problemProgress.findMany({
                    where: {
                        userId,
                        problemId: { in: topicTotals.problemIds },
                    },
                    select: {
                        problemId: true,
                        status: true,
                        revisit: true,
                    },
                });

                for (const p of userProgress) {
                    if (p.status === 'solved') {
                        problemsSolvedCount++;
                        const diff = topicTotals.difficulties[p.problemId];
                        if (diff === 'easy') problemsSolvedCountByDifficulty.easy++;
                        else if (diff === 'medium') problemsSolvedCountByDifficulty.medium++;
                        else if (diff === 'hard') problemsSolvedCountByDifficulty.hard++;
                    }
                    if (p.revisit === true) {
                        problemsRevisitCount++;
                    }
                }
            }

            const problemsCount = topicTotals.total;
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
                problemsCountByDifficulty: topicTotals.counts,
                problemsSolvedCountByDifficulty,
            };
        })
        .build();

    getTopicSuggestions = qRPC()
        .input(GetTopicSuggestionsInputSchema)
        .output(GetTopicSuggestionsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getTopicSuggestions query', { payload });
            const { topicId, topicSlug } = payload;

            const topic = await prisma.topic.findFirst({
                where: {
                    OR: [
                        topicId ? { id: topicId } : {},
                        topicSlug ? { slug: topicSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                select: {
                    id: true,
                    moduleId: true,
                    level: true,
                    problems: { select: { id: true } },
                },
            });

            if (!topic) {
                return [];
            }

            // ── Semantic Similarity Ranking for Top 10 Similar Topics (Multi-Tier Cached) ──
            const suggestionsCacheKey = `sim:${topic.id}`;
            let top10SimilarTopics = topicSuggestionsL1Cache.get(suggestionsCacheKey);

            if (!top10SimilarTopics) {
                top10SimilarTopics = await topicSuggestionsCache.get(suggestionsCacheKey);
                if (top10SimilarTopics) {
                    topicSuggestionsL1Cache.set(suggestionsCacheKey, top10SimilarTopics);
                }
            }

            if (!top10SimilarTopics) {
                const activeProblemIdsSet = new Set(topic.problems.map((p) => p.id));

                const candidates = await prisma.topic.findMany({
                    where: {
                        id: { not: topic.id },
                    },
                    include: {
                        module: {
                            select: {
                                title: true,
                                slug: true,
                            },
                        },
                        problems: {
                            select: {
                                id: true,
                            },
                        },
                    },
                });

                const scoredCandidates = candidates.map((cand) => {
                    let score = 0;

                    // 1. Same Module match (+40)
                    if (topic.moduleId && cand.moduleId === topic.moduleId) {
                        score += 40;
                    }

                    // 2. Shared problem co-occurrence (+10 per shared problem, max 30)
                    const sharedCount = cand.problems.filter((p) => activeProblemIdsSet.has(p.id)).length;
                    score += Math.min(30, sharedCount * 10);

                    // 3. Same Proficiency Level match (+20)
                    if (topic.level && cand.level === topic.level) {
                        score += 20;
                    }

                    // 4. Popularity bonus based on problem count (+10 max)
                    score += Math.min(10, cand.problems.length);

                    return {
                        id: cand.id,
                        title: cand.title,
                        slug: cand.slug,
                        level: cand.level,
                        moduleTitle: cand.module?.title,
                        moduleSlug: cand.module?.slug,
                        problemsCount: cand.problems.length,
                        score,
                    };
                });

                scoredCandidates.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
                top10SimilarTopics = scoredCandidates.slice(0, 10).map(({ score, ...rest }) => rest);

                topicSuggestionsL1Cache.set(suggestionsCacheKey, top10SimilarTopics);
                void topicSuggestionsCache.set(suggestionsCacheKey, top10SimilarTopics);
            }

            return top10SimilarTopics;
        })
        .build();
}

export const topicQueries = new TopicQueries();
