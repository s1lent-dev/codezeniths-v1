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

export class TopicQueries implements ITopicQueries {
    getSingleTopic = qRPC()
        .input(GetSingleTopicInputSchema)
        .output(GetSingleTopicOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTopic query', { payload });
            const { id, slug, userId } = payload;

            // Find topic with module and problems
            const topic = await prisma.topic.findFirst({
                where: {
                    OR: [
                        id ? { id } : {},
                        slug ? { slug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                include: {
                    module: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
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

            const allProblems = topic.problems;
            const problemsCount = allProblems.length;
            const allProblemIds = allProblems.map((p) => p.id);

            let problemsSolvedCount = 0;
            let problemsRevisitCount = 0;
            let solvedProgress: Array<{ status: string; problemId: string; problem: { id: string; difficulty: any } | null }> = [];

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
                const activeProblemIdsSet = new Set(allProblemIds);

                // Fetch candidate topics (excluding current topic)
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

                // Score each candidate topic
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

                // Sort by score DESC, then title ASC
                scoredCandidates.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

                top10SimilarTopics = scoredCandidates.slice(0, 10).map(({ score, ...rest }) => rest);

                topicSuggestionsL1Cache.set(suggestionsCacheKey, top10SimilarTopics);
                void topicSuggestionsCache.set(suggestionsCacheKey, top10SimilarTopics);
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
                module: topic.module ? { title: topic.module.title, slug: topic.module.slug } : undefined,
                progress: {
                    problemsCount,
                    problemsSolvedCount,
                    problemsRevisitCount,
                    problemNotSolvedCount,
                    problemsSolvedPercentage,
                    problemsCountByDifficulty,
                    problemsSolvedCountByDifficulty,
                },
                similarTopics: top10SimilarTopics,
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
