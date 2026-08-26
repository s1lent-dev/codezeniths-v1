import { qRPC } from './utils/qrpc.utils';
import { countBy } from './utils/problem.utils';
import { buildTagsWhere, buildTagsOrderBy } from './utils/tag.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetTagsOutputSchema,
    GetSingleTagProgressInputSchema,
    GetSingleTagProgressOutputSchema,
    GetSingleTagInputSchema,
    GetSingleTagOutputSchema,
    GetTagSuggestionsInputSchema,
    GetTagSuggestionsOutputSchema,
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

// Multi-Tier Caches for Semantic Tag Suggestions
const tagSuggestionsCache = redisService.cache.createStore<any>({
    namespace: 'tag_suggestions',
    ttlSeconds: 86400, // 24 hours
});

const tagSuggestionsL1Cache = createCache<any>({
    strategy: 'adaptive',
    maxSize: 100,
    ttl: 1000 * 60 * 30, // 30 minutes in RAM
});

// Multi-Tier Caches for Tag Difficulty Totals
const tagDifficultyTotalsCache = redisService.cache.createStore<any>({
    namespace: 'tag_difficulty_totals',
    ttlSeconds: 86400, // 24 hours
});

const tagDifficultyTotalsL1Cache = createCache<any>({
    strategy: 'adaptive',
    maxSize: 100,
    ttl: 1000 * 60 * 30, // 30 minutes in RAM
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
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    level: true,
                    module: {
                        select: {
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

            if (!tag) {
                logger.warn('Tag not found', { id, slug });
                throw new AppErrorBuilder('Tag not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

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
                problemsCount: tag._count.problems,
                module: tag.module
                    ? {
                          title: tag.module.title,
                          slug: tag.module.slug,
                      }
                    : undefined,
            };
        })
        .build();

    getSingleTagProgress = qRPC()
        .input(GetSingleTagProgressInputSchema)
        .output(GetSingleTagProgressOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleTagProgress query', { payload });
            const { tagId, tagSlug, userId } = payload;

            // 1. Find tag ID
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
                logger.warn('Tag not found for progress calculation', { tagId, tagSlug });
                throw new AppErrorBuilder('Tag not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const targetTagId = tag.id;

            // 2. Static Tag Difficulty Totals & Problem IDs (L1 Memory -> L2 Redis -> DB Fallback)
            const totalsCacheKey = `tag_difficulty_totals:${targetTagId}`;
            let tagTotals = tagDifficultyTotalsL1Cache.get(totalsCacheKey);
            if (!tagTotals) {
                tagTotals = await tagDifficultyTotalsCache.get(totalsCacheKey);
                if (tagTotals) {
                    tagDifficultyTotalsL1Cache.set(totalsCacheKey, tagTotals);
                }
            }

            if (!tagTotals) {
                const problemTags = await prisma.problemTag.findMany({
                    where: { tagId: targetTagId },
                    select: {
                        problem: {
                            select: {
                                id: true,
                                difficulty: true,
                            },
                        },
                    },
                });

                const problems = problemTags.map((pt) => pt.problem).filter(Boolean);
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

                tagTotals = {
                    problemIds,
                    difficulties,
                    counts,
                    total: problemIds.length,
                };

                tagDifficultyTotalsL1Cache.set(totalsCacheKey, tagTotals);
                void tagDifficultyTotalsCache.set(totalsCacheKey, tagTotals);
            }

            // 3. User Progress: Single Indexed Seek on problem_progress (userId, problemId)
            let problemsSolvedCount = 0;
            let problemsRevisitCount = 0;
            const problemsSolvedCountByDifficulty = { easy: 0, medium: 0, hard: 0 };

            if (userId && tagTotals.problemIds.length > 0) {
                const userProgress = await prisma.problemProgress.findMany({
                    where: {
                        userId,
                        problemId: { in: tagTotals.problemIds },
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
                        const diff = tagTotals.difficulties[p.problemId];
                        if (diff === 'easy') problemsSolvedCountByDifficulty.easy++;
                        else if (diff === 'medium') problemsSolvedCountByDifficulty.medium++;
                        else if (diff === 'hard') problemsSolvedCountByDifficulty.hard++;
                    }
                    if (p.revisit === true) {
                        problemsRevisitCount++;
                    }
                }
            }

            const problemsCount = tagTotals.total;
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
                problemsCountByDifficulty: tagTotals.counts,
                problemsSolvedCountByDifficulty,
            };
        })
        .build();

    getTagSuggestions = qRPC()
        .input(GetTagSuggestionsInputSchema)
        .output(GetTagSuggestionsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getTagSuggestions query', { payload });
            const { tagId, tagSlug } = payload;

            const tag = await prisma.tag.findFirst({
                where: {
                    OR: [
                        tagId ? { id: tagId } : {},
                        tagSlug ? { slug: tagSlug } : {},
                    ].filter((item) => Object.keys(item).length > 0),
                },
                select: {
                    id: true,
                    moduleId: true,
                    level: true,
                    problems: {
                        select: {
                            problemId: true,
                        },
                    },
                },
            });

            if (!tag) {
                logger.warn('Tag not found for suggestions', { tagId, tagSlug });
                return [];
            }

            const targetTagId = tag.id;
            const suggestionsCacheKey = `tag_suggestions:${targetTagId}`;

            // Check Tier 1 & Tier 2 Cache
            let cachedSuggestions = tagSuggestionsL1Cache.get(suggestionsCacheKey);
            if (!cachedSuggestions) {
                cachedSuggestions = await tagSuggestionsCache.get(suggestionsCacheKey);
                if (cachedSuggestions) {
                    tagSuggestionsL1Cache.set(suggestionsCacheKey, cachedSuggestions);
                }
            }

            if (cachedSuggestions) {
                return cachedSuggestions;
            }

            const activeProblemIdsSet = new Set(tag.problems.map((p) => p.problemId));

            // Fetch candidate tags (excluding current tag)
            const candidates = await prisma.tag.findMany({
                where: {
                    id: { not: targetTagId },
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    level: true,
                    moduleId: true,
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
                    moduleSlug: cand.module?.slug,
                    problemsCount: cand.problems.length,
                    score,
                };
            });

            // Sort by score DESC, then title ASC
            scoredCandidates.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

            const top10SimilarTags = scoredCandidates.slice(0, 10).map(({ score, ...rest }) => rest);

            tagSuggestionsL1Cache.set(suggestionsCacheKey, top10SimilarTags);
            void tagSuggestionsCache.set(suggestionsCacheKey, top10SimilarTags);

            return top10SimilarTags;
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
