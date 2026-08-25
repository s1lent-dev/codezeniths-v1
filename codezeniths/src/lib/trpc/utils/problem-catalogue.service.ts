import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { createCache } from '@/hooks/performance-hooks/cache/cache';
import { logger } from '@/service/logging';
import { Difficulty, Level, ProgressStatus } from '@prisma/client';
import {
    ProblemFilterInput,
    ProblemSortingInput,
} from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';
import {
    GetProblemsTRPCInputSchema,
    GetProblemsTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';
import { TRPCContext } from '../trpc/trpc.context';

export interface CatalogueProblemTag {
    id: string;
    name: string;
    slug: string;
}

export interface CatalogueProblemItem {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    order: number;
    articleUrl?: string | null;
    problemUrl?: string | null;
    favouriteCount?: number;
    topicId?: string | null;
    topicSlug?: string | null;
    topic?: string | null;
    topicLevel?: Level | string | null;
    moduleId?: string | null;
    moduleSlug?: string | null;
    module?: string | null;
    tags: CatalogueProblemTag[];
    phoneticTitle?: string;
    createdAt?: Date | string;
}

// ─── L1 In-Memory Cache (RAM) ───────────────────────────────────────────────────
const problemCatalogueL1Cache = createCache<CatalogueProblemItem[]>({
    strategy: 'adaptive',
    maxSize: 5,
    ttl: 1000 * 60 * 10, // 10 minutes in RAM
});

const DIFFICULTY_RANK: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
};

const LEVEL_RANK: Record<string, number> = {
    fundamental: 1,
    intermediate: 2,
    advanced: 3,
};

export class ProblemCatalogueService {
    /**
     * Checks if any dynamic user-specific filters or sort criteria are present.
     */
    public hasDynamicProblemFilters(
        filters?: ProblemFilterInput,
        sorting?: ProblemSortingInput
    ): boolean {
        if (!filters && !sorting) return false;

        // Dynamic user-specific filters
        if (
            filters?.playlistSlug ||
            filters?.playlistId ||
            filters?.status ||
            filters?.revisit !== undefined ||
            filters?.favourite !== undefined ||
            filters?.bookmarkedTopics !== undefined
        ) {
            return true;
        }

        // Dynamic sorting
        if (sorting?.sortBy === 'popularity') {
            return true;
        }

        return false;
    }

    /**
     * Retrieves master problem catalogue using L1 RAM -> L2 Redis -> L3 DB Fallback.
     */
    public async getMasterCatalogue(): Promise<CatalogueProblemItem[]> {
        // Tier 1: L1 In-Memory Cache (0ms)
        const l1Data = problemCatalogueL1Cache.get('master_catalogue');
        if (l1Data && l1Data.length > 0) {
            return l1Data;
        }

        // Tier 2: L2 Redis Master Collection (~1-2ms)
        try {
            const rawRedis = await redisService.client.get('search:problems:all');
            if (rawRedis) {
                const parsed: CatalogueProblemItem[] = JSON.parse(rawRedis);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    problemCatalogueL1Cache.set('master_catalogue', parsed);
                    return parsed;
                }
            }
        } catch (error) {
            logger.warn('Failed to retrieve master catalogue from Redis, falling back to database', { error });
        }

        // Tier 3: L3 Prisma Database Fallback
        logger.info('Hydrating Master Problem Catalogue from Database');
        const problems = await prisma.problem.findMany({
            orderBy: { order: 'asc' },
            include: {
                tags: {
                    include: { tag: true },
                },
                topic: {
                    include: { module: true },
                },
            },
        });

        const mappedCatalogue: CatalogueProblemItem[] = problems.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            difficulty: p.difficulty,
            order: p.order ?? 0,
            articleUrl: p.articleUrl || null,
            problemUrl: p.problemUrl || null,
            favouriteCount: 0,
            topicId: p.topicId || p.topic?.id || null,
            topicSlug: p.topic?.slug || null,
            topic: p.topic?.title || null,
            topicLevel: p.topic?.level || null,
            moduleId: p.topic?.module?.id || null,
            moduleSlug: p.topic?.module?.slug || null,
            module: p.topic?.module?.title || null,
            tags: p.tags.map((t) => ({
                id: t.tag.id,
                name: t.tag.name,
                slug: t.tag.slug,
            })),
            phoneticTitle: p.title,
            createdAt: p.createdAt,
        }));

        // Populate Redis and L1 Cache asynchronously
        void redisService.client.set('search:problems:all', JSON.stringify(mappedCatalogue));
        problemCatalogueL1Cache.set('master_catalogue', mappedCatalogue);

        return mappedCatalogue;
    }

    /**
     * Executes purely static filtering on the in-memory catalogue.
     */
    public applyStaticFilters(
        items: CatalogueProblemItem[],
        filters?: ProblemFilterInput
    ): CatalogueProblemItem[] {
        if (!filters) return items;

        return items.filter((item) => {
            if (filters.moduleSlug && item.moduleSlug !== filters.moduleSlug) {
                return false;
            }
            if (filters.topicSlug && item.topicSlug !== filters.topicSlug) {
                return false;
            }
            if (filters.topicLevel && item.topicLevel !== filters.topicLevel) {
                return false;
            }
            if (filters.difficulty && item.difficulty !== filters.difficulty) {
                return false;
            }
            if (filters.tagSlugs && filters.tagSlugs.length > 0) {
                const hasTag = item.tags.some((t) => filters.tagSlugs!.includes(t.slug));
                if (!hasTag) return false;
            }
            if (filters.search && filters.search.trim().length > 0) {
                const term = filters.search.toLowerCase().trim();
                if (filters.searchScope === 'topic') {
                    if (!item.topic || !item.topic.toLowerCase().includes(term)) {
                        return false;
                    }
                } else {
                    if (!item.title.toLowerCase().includes(term)) {
                        return false;
                    }
                }
            }
            return true;
        });
    }

    /**
     * Executes deterministic in-memory sorting.
     */
    public applyStaticSorting(
        items: CatalogueProblemItem[],
        sorting?: ProblemSortingInput
    ): CatalogueProblemItem[] {
        const sorted = [...items];
        const sortBy = sorting?.sortBy;
        const order = sorting?.order || 'asc';
        const dir = order === 'desc' ? -1 : 1;

        sorted.sort((a, b) => {
            switch (sortBy) {
                case 'name': {
                    const cmp = a.title.localeCompare(b.title) * dir;
                    return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
                }
                case 'difficulty': {
                    const rankA = DIFFICULTY_RANK[a.difficulty] || 0;
                    const rankB = DIFFICULTY_RANK[b.difficulty] || 0;
                    const cmp = (rankA - rankB) * dir;
                    return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
                }
                case 'createdAt': {
                    const timeA = new Date(a.createdAt || 0).getTime();
                    const timeB = new Date(b.createdAt || 0).getTime();
                    const cmp = (timeA - timeB) * dir;
                    return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
                }
                case 'topicLevel': {
                    const levelA = LEVEL_RANK[a.topicLevel || ''] || 0;
                    const levelB = LEVEL_RANK[b.topicLevel || ''] || 0;
                    const cmp = (levelA - levelB) * dir;
                    if (cmp !== 0) return cmp;
                    const orderCmp = (a.order - b.order);
                    return orderCmp !== 0 ? orderCmp : a.id.localeCompare(b.id);
                }
                default: {
                    const orderCmp = (a.order - b.order);
                    return orderCmp !== 0 ? orderCmp : a.id.localeCompare(b.id);
                }
            }
        });

        return sorted;
    }

    /**
     * Attaches user progress to the sliced page items and calculates solvedCount for the filtered subset.
     */
    private async attachUserProgress(
        pageItems: CatalogueProblemItem[],
        filteredIds: string[],
        userId?: string
    ) {
        if (!userId || pageItems.length === 0) {
            return {
                mappedItems: pageItems.map((p) => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    difficulty: p.difficulty,
                    order: p.order,
                    articleUrl: p.articleUrl ?? null,
                    problemUrl: p.problemUrl ?? null,
                    favouriteCount: p.favouriteCount ?? 0,
                    topicId: p.topicId ?? null,
                    topicSlug: p.topicSlug ?? null,
                    tags: p.tags,
                    status: null,
                    revisit: false,
                    favourite: false,
                })),
                solvedCount: 0,
            };
        }

        const pageProblemIds = pageItems.map((p) => p.id);

        const [progresses, solvedCount] = await Promise.all([
            prisma.problemProgress.findMany({
                where: {
                    userId,
                    problemId: { in: pageProblemIds },
                },
                select: {
                    problemId: true,
                    status: true,
                    revisit: true,
                    favourite: true,
                },
            }),
            filteredIds.length > 0
                ? prisma.problemProgress.count({
                      where: {
                          userId,
                          status: 'solved',
                          problemId: { in: filteredIds },
                      },
                  })
                : Promise.resolve(0),
        ]);

        const progressMap = new Map<string, { status: ProgressStatus; revisit: boolean; favourite: boolean }>();
        for (const prog of progresses) {
            progressMap.set(prog.problemId, prog);
        }

        const mappedItems = pageItems.map((p) => {
            const prog = progressMap.get(p.id);
            return {
                id: p.id,
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
                order: p.order,
                articleUrl: p.articleUrl ?? null,
                problemUrl: p.problemUrl ?? null,
                favouriteCount: p.favouriteCount ?? 0,
                topicId: p.topicId ?? null,
                topicSlug: p.topicSlug ?? null,
                tags: p.tags,
                status: prog?.status ?? (prog ? 'not_solved' : null),
                revisit: prog?.revisit ?? false,
                favourite: prog?.favourite ?? false,
            };
        });

        return { mappedItems, solvedCount };
    }

    /**
     * Main handler for static problem queries.
     */
    public async getProblems({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetProblemsTRPCOutputSchema>> {
        const userId = ctx.user?.id;
        const catalogue = await this.getMasterCatalogue();

        // 1. In-memory static filter
        const filtered = this.applyStaticFilters(catalogue, input.filters);
        const filteredIds = filtered.map((p) => p.id);
        const total = filtered.length;

        // 2. In-memory static sort
        const sorted = this.applyStaticSorting(filtered, input.sorting);

        // 3. Process by mode
        switch (input.mode) {
            case 'paginated': {
                const page = input.page || 1;
                const limit = input.limit || 20;
                const startIndex = (page - 1) * limit;
                const pageSlice = sorted.slice(startIndex, startIndex + limit);

                const { mappedItems, solvedCount } = await this.attachUserProgress(pageSlice, filteredIds, userId);

                return {
                    mode: 'paginated',
                    items: mappedItems,
                    total,
                    solvedCount,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page * limit < total,
                };
            }

            case 'infinite': {
                const limit = input.limit || 20;
                const cursor = input.cursor;

                let startIndex = 0;
                if (cursor) {
                    const cursorIndex = sorted.findIndex((p) => p.id === cursor);
                    startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
                }

                const slice = sorted.slice(startIndex, startIndex + limit + 1);
                const hasNextPage = slice.length > limit;
                const pageSlice = hasNextPage ? slice.slice(0, limit) : slice;
                const nextCursor = hasNextPage ? pageSlice[pageSlice.length - 1].id : null;

                const { mappedItems, solvedCount } = await this.attachUserProgress(pageSlice, filteredIds, userId);

                return {
                    mode: 'infinite',
                    items: mappedItems,
                    total,
                    solvedCount,
                    nextCursor,
                };
            }

            case 'filtered': {
                const { mappedItems, solvedCount } = await this.attachUserProgress(sorted, filteredIds, userId);

                const problemsCountByDifficulty = {
                    easy: 0,
                    medium: 0,
                    hard: 0,
                };
                for (const p of sorted) {
                    if (p.difficulty === 'easy') problemsCountByDifficulty.easy++;
                    else if (p.difficulty === 'medium') problemsCountByDifficulty.medium++;
                    else if (p.difficulty === 'hard') problemsCountByDifficulty.hard++;
                }

                return {
                    mode: 'filtered',
                    problemsCount: sorted.length,
                    solvedCount,
                    problemsCountByDifficulty,
                    problems: mappedItems,
                };
            }
        }
    }

    /**
     * Clears L1 in-memory cache when problems are updated or reindexed.
     */
    public invalidateL1Cache(): void {
        problemCatalogueL1Cache.clear();
    }
}

export const problemCatalogueService = new ProblemCatalogueService();
