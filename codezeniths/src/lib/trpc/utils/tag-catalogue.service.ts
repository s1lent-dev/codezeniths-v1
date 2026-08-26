import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { createCache } from '@/hooks/performance-hooks/cache/cache';
import { logger } from '@/service/logging';
import { Level } from '@prisma/client';
import {
    TagFilterSchema,
    TagSortingSchema,
    GetTagsCatalogueInputSchema,
    GetTagsCatalogueOutputSchema,
} from '@/schemas/db';
import { z } from 'zod';
import { TRPCContext } from '../trpc/trpc.context';

export interface CatalogueTagItem {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    level?: Level | null;
    moduleSlug?: string | null;
    module?: {
        title: string;
        slug: string;
    };
    problemIds: string[];
    problemsCount: number;
    createdAt?: Date | string;
}

const REDIS_TAGS_CATALOGUE_KEY = 'search:tags:all';

// ─── L1 In-Memory Cache (RAM) ───────────────────────────────────────────────────
const tagCatalogueL1Cache = createCache<CatalogueTagItem[]>({
    strategy: 'adaptive',
    maxSize: 5,
    ttl: 1000 * 60 * 15, // 15 minutes in RAM
});

const LEVEL_RANK: Record<string, number> = {
    fundamental: 1,
    intermediate: 2,
    advanced: 3,
};

export class TagCatalogueService {
    /**
     * Retrieves master tag catalogue using L1 RAM -> L2 Redis -> L3 DB Fallback.
     */
    public async getMasterCatalogue(): Promise<CatalogueTagItem[]> {
        // Tier 1: L1 In-Memory Cache (0ms)
        const l1Data = tagCatalogueL1Cache.get('master_tag_catalogue');
        if (l1Data && l1Data.length > 0) {
            return l1Data;
        }

        // Tier 2: L2 Redis Master Collection (~1-2ms)
        try {
            const rawRedis = await redisService.client.get(REDIS_TAGS_CATALOGUE_KEY);
            if (rawRedis) {
                const parsed: any[] = typeof rawRedis === 'string' ? JSON.parse(rawRedis) : rawRedis;
                // Verify that parsed items have full problemIds attached
                if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.problemIds !== undefined) {
                    const normalized: CatalogueTagItem[] = parsed.map((item) => {
                        const title = item.title || item.name || item.slug || '';
                        const slug = item.slug || '';
                        const id = item.id || slug;
                        const problemIds: string[] = Array.isArray(item.problemIds) ? item.problemIds : [];
                        const problemsCount =
                            typeof item.problemsCount === 'number'
                                ? item.problemsCount
                                : problemIds.length;

                        return {
                            id,
                            title,
                            slug,
                            description: item.description ?? null,
                            level: (item.level as Level) ?? null,
                            moduleSlug: item.moduleSlug || item.module?.slug || null,
                            module: item.module
                                ? { title: item.module.title || '', slug: item.module.slug || '' }
                                : undefined,
                            problemIds,
                            problemsCount,
                            createdAt: item.createdAt ? new Date(item.createdAt) : undefined,
                        };
                    });

                    tagCatalogueL1Cache.set('master_tag_catalogue', normalized);
                    return normalized;
                }
            }
        } catch (error) {
            logger.warn('Failed to retrieve master tag catalogue from Redis, falling back to database', { error });
        }

        // Tier 3: L3 Prisma Database Fallback
        logger.info('Hydrating Master Tag Catalogue from Database with full Problem Relations');
        const tags = await prisma.tag.findMany({
            orderBy: { name: 'asc' },
            include: {
                module: {
                    select: {
                        id: true,
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

        const mappedCatalogue: CatalogueTagItem[] = tags.map((t) => {
            const problemIds = t.problems.map((p) => p.problemId);
            return {
                id: t.id,
                title: t.name || t.slug,
                slug: t.slug,
                description: t.description,
                level: t.level,
                moduleSlug: t.module?.slug || null,
                module: t.module ? { title: t.module.title, slug: t.module.slug } : undefined,
                problemIds,
                problemsCount: problemIds.length,
                createdAt: t.createdAt,
            };
        });

        // Populate Redis and L1 Cache asynchronously
        void redisService.client.set(REDIS_TAGS_CATALOGUE_KEY, JSON.stringify(mappedCatalogue));
        tagCatalogueL1Cache.set('master_tag_catalogue', mappedCatalogue);

        return mappedCatalogue;
    }

    /**
     * Executes static filtering on the in-memory tag catalogue.
     */
    public applyStaticFilters(
        items: CatalogueTagItem[],
        filters?: z.infer<typeof TagFilterSchema>
    ): CatalogueTagItem[] {
        if (!filters) return items;

        return items.filter((item) => {
            if (filters.moduleSlug && filters.moduleSlug !== 'all' && item.moduleSlug !== filters.moduleSlug) {
                return false;
            }
            if (filters.level && item.level !== filters.level) {
                return false;
            }
            if (filters.search && filters.search.trim().length > 0) {
                const term = filters.search.toLowerCase().trim();
                const title = (item.title || item.slug || '').toLowerCase();
                const slug = (item.slug || '').toLowerCase();
                const matchTitle = title.includes(term);
                const matchSlug = slug.includes(term);
                const matchDesc = item.description?.toLowerCase().includes(term) ?? false;
                if (!matchTitle && !matchSlug && !matchDesc) {
                    return false;
                }
            }
            return true;
        });
    }

    /**
     * Executes deterministic in-memory sorting.
     */
    public applyStaticSorting(
        items: CatalogueTagItem[],
        sorting?: z.infer<typeof TagSortingSchema>
    ): CatalogueTagItem[] {
        const sorted = [...items];
        const sortBy = sorting?.sortBy || 'name';
        const order = sorting?.order || 'asc';
        const dir = order === 'desc' ? -1 : 1;

        sorted.sort((a, b) => {
            const titleA = a.title || (a as any).name || a.slug || '';
            const titleB = b.title || (b as any).name || b.slug || '';
            const idA = a.id || a.slug || '';
            const idB = b.id || b.slug || '';

            switch (sortBy) {
                case 'name': {
                    const cmp = titleA.localeCompare(titleB) * dir;
                    return cmp !== 0 ? cmp : idA.localeCompare(idB);
                }
                case 'level': {
                    const rankA = LEVEL_RANK[a.level || ''] || 0;
                    const rankB = LEVEL_RANK[b.level || ''] || 0;
                    const cmp = (rankA - rankB) * dir;
                    return cmp !== 0 ? cmp : titleA.localeCompare(titleB);
                }
                case 'createdAt': {
                    const timeA = new Date(a.createdAt || 0).getTime();
                    const timeB = new Date(b.createdAt || 0).getTime();
                    const cmp = (timeA - timeB) * dir;
                    return cmp !== 0 ? cmp : idA.localeCompare(idB);
                }
                case 'problemsCount': {
                    const countA = typeof a.problemsCount === 'number' ? a.problemsCount : 0;
                    const countB = typeof b.problemsCount === 'number' ? b.problemsCount : 0;
                    const cmp = (countA - countB) * dir;
                    return cmp !== 0 ? cmp : titleA.localeCompare(titleB);
                }
                default: {
                    const cmp = titleA.localeCompare(titleB) * dir;
                    return cmp !== 0 ? cmp : idA.localeCompare(idB);
                }
            }
        });

        return sorted;
    }

    /**
     * Attaches user progress to the requested tag slice.
     * Computes distinct problems solved by the active user that have each tag associated.
     */
    private async attachUserProgress(pageItems: CatalogueTagItem[], userId?: string) {
        if (!userId || pageItems.length === 0) {
            return pageItems.map((tag) => ({
                id: tag.id,
                title: tag.title || (tag as any).name || tag.slug || '',
                slug: tag.slug,
                description: tag.description,
                level: tag.level,
                module: tag.module,
                problemsCount: tag.problemsCount ?? 0,
                problemsSolvedCount: 0,
                problemsSolvedPercentage: 0,
                isBookmarked: false,
                createdAt: tag.createdAt ? new Date(tag.createdAt) : undefined,
            }));
        }

        // Collect all distinct problem IDs across the requested tags
        const sliceProblemIds = Array.from(new Set(pageItems.flatMap((t) => t.problemIds || [])));
        const sliceTagIds = pageItems.map((t) => t.id);

        const [userSolved, userBookmarks] = await Promise.all([
            sliceProblemIds.length > 0
                ? prisma.problemProgress.findMany({
                      where: {
                          userId,
                          status: 'solved',
                          problemId: { in: sliceProblemIds },
                      },
                      select: {
                          problemId: true,
                      },
                  })
                : Promise.resolve([]),
            sliceTagIds.length > 0
                ? prisma.tagBookmark.findMany({
                      where: {
                          userId,
                          tagId: { in: sliceTagIds },
                      },
                      select: {
                          tagId: true,
                      },
                  })
                : Promise.resolve([]),
        ]);

        const solvedProblemIdsSet = new Set(userSolved.map((p) => p.problemId));
        const bookmarkedTagIdsSet = new Set(userBookmarks.map((b) => b.tagId));

        return pageItems.map((tag) => {
            const problemIds = tag.problemIds || [];
            const problemsCount = tag.problemsCount ?? problemIds.length;
            // Count how many problems linked to this tag have been solved by this user
            const problemsSolvedCount = problemIds.filter((pId) => solvedProblemIdsSet.has(pId)).length;
            const problemsSolvedPercentage =
                problemsCount > 0
                    ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2))
                    : 0;

            return {
                id: tag.id,
                title: tag.title || (tag as any).name || tag.slug || '',
                slug: tag.slug,
                description: tag.description,
                level: tag.level,
                module: tag.module,
                problemsCount,
                problemsSolvedCount,
                problemsSolvedPercentage,
                isBookmarked: bookmarkedTagIdsSet.has(tag.id),
                createdAt: tag.createdAt ? new Date(tag.createdAt) : undefined,
            };
        });
    }

    /**
     * Main handler for static tag queries.
     */
    public async getTagsCatalogue({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetTagsCatalogueInputSchema>;
    }): Promise<z.infer<typeof GetTagsCatalogueOutputSchema>> {
        const userId = ctx.user?.id || input.userId;
        const catalogue = await this.getMasterCatalogue();

        // 1. In-memory static filter
        const filtered = this.applyStaticFilters(catalogue, input.filters);
        const total = filtered.length;

        // 2. In-memory static sort
        const sorted = this.applyStaticSorting(filtered, input.sorting);

        // 3. Process by mode
        switch (input.mode) {
            case 'paginated': {
                const page = input.page || 1;
                const limit = input.limit || 6;
                const startIndex = (page - 1) * limit;
                const pageSlice = sorted.slice(startIndex, startIndex + limit);

                const mappedItems = await this.attachUserProgress(pageSlice, userId);

                return {
                    mode: 'paginated',
                    items: mappedItems,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit) || 1,
                    hasNextPage: page * limit < total,
                };
            }

            case 'infinite': {
                const limit = input.limit || 6;
                const cursor = input.cursor;

                let startIndex = 0;
                if (cursor) {
                    const cursorIndex = sorted.findIndex((t) => t.id === cursor || t.slug === cursor);
                    startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
                }

                const slice = sorted.slice(startIndex, startIndex + limit + 1);
                const hasNextPage = slice.length > limit;
                const pageSlice = hasNextPage ? slice.slice(0, limit) : slice;
                const nextCursor = hasNextPage ? pageSlice[pageSlice.length - 1].id : null;

                const mappedItems = await this.attachUserProgress(pageSlice, userId);

                return {
                    mode: 'infinite',
                    items: mappedItems,
                    total,
                    nextCursor,
                };
            }

            case 'filtered': {
                const mappedItems = await this.attachUserProgress(sorted, userId);

                return {
                    mode: 'filtered',
                    items: mappedItems,
                    total,
                };
            }
        }
    }

    /**
     * Clears L1 in-memory cache when tags are updated or reindexed.
     */
    public invalidateL1Cache(): void {
        tagCatalogueL1Cache.clear();
    }
}

export const tagCatalogueService = new TagCatalogueService();
