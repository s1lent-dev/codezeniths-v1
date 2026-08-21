import type { Prisma } from '@prisma/client';
import type { ProblemFilterInput, ProblemSortingInput } from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';

/**
 * Builds the Prisma where input for problem querying based on filters.
 */
export function buildProblemWhere(
    filters: ProblemFilterInput,
    userId?: string,
): Prisma.ProblemWhereInput {
    const where: Prisma.ProblemWhereInput = {};
    const topicWhere: Prisma.TopicWhereInput = {};

    if (filters.topicSlug) {
        topicWhere.slug = filters.topicSlug;
    }
    if (filters.moduleSlug) {
        topicWhere.module = { slug: filters.moduleSlug };
    }

    if (filters.topicLevel) {
        topicWhere.level = filters.topicLevel;
    }

    if (filters.difficulty) {
        where.difficulty = filters.difficulty;
    }

    if (filters.tagSlugs?.length) {
        where.tags = { some: { tag: { slug: { in: filters.tagSlugs } } } };
    }

    if (filters.playlistSlug) {
        where.playlistItems = {
            some: {
                playlist: {
                    slug: filters.playlistSlug,
                },
            },
        };
    } else if (filters.playlistId) {
        where.playlistItems = {
            some: {
                playlistId: filters.playlistId,
            },
        };
    }

    if (filters.search) {
        if (filters.searchScope === 'topic') {
            topicWhere.title = {
                contains: filters.search,
                mode: 'insensitive',
            };
        } else {
            where.title = {
                contains: filters.search,
                mode: 'insensitive',
            };
        }
    }

    if (Object.keys(topicWhere).length > 0) {
        where.topic = topicWhere;
    }

    // ─── User-Specific Progress Filters (Solved status, Revisit, Favourite) ───
    const andConditions: Prisma.ProblemWhereInput[] = [];

    // 1. Status Filter (Solved / Not Solved)
    if (filters.status) {
        if (userId) {
            if (filters.status === 'solved') {
                andConditions.push({
                    progresses: {
                        some: {
                            userId,
                            status: 'solved',
                        },
                    },
                });
            } else if (filters.status === 'not_solved') {
                andConditions.push({
                    progresses: {
                        none: {
                            userId,
                            status: 'solved',
                        },
                    },
                });
            }
        } else {
            // Unauthenticated users have 0 solved problems
            if (filters.status === 'solved') {
                andConditions.push({ id: '00000000-0000-0000-0000-000000000000' });
            }
        }
    }

    // 2. Revisit Filter
    if (filters.revisit !== undefined) {
        if (userId) {
            if (filters.revisit) {
                andConditions.push({
                    progresses: {
                        some: {
                            userId,
                            revisit: true,
                        },
                    },
                });
            } else {
                andConditions.push({
                    progresses: {
                        none: {
                            userId,
                            revisit: true,
                        },
                    },
                });
            }
        } else {
            // Unauthenticated users have 0 revisit marked problems
            if (filters.revisit) {
                andConditions.push({ id: '00000000-0000-0000-0000-000000000000' });
            }
        }
    }

    // 3. Favourite Filter
    if (filters.favourite !== undefined) {
        if (userId) {
            if (filters.favourite) {
                andConditions.push({
                    progresses: {
                        some: {
                            userId,
                            favourite: true,
                        },
                    },
                });
            } else {
                andConditions.push({
                    progresses: {
                        none: {
                            userId,
                            favourite: true,
                        },
                    },
                });
            }
        } else {
            // Unauthenticated users have 0 favourite problems
            if (filters.favourite) {
                andConditions.push({ id: '00000000-0000-0000-0000-000000000000' });
            }
        }
    }

    if (andConditions.length > 0) {
        where.AND = andConditions;
    }

    return where;
}

/**
 * Builds the Prisma orderBy input for problem querying based on sorting options.
 */
export function buildProblemOrderBy(
    sorting?: ProblemSortingInput,
): Prisma.ProblemOrderByWithRelationInput | Prisma.ProblemOrderByWithRelationInput[] {
    if (!sorting?.sortBy) {
        return { order: 'asc' };
    }

    const order = sorting.order || 'asc';

    switch (sorting.sortBy) {
        case 'name':
            return [{ title: order }, { id: 'asc' }];
        case 'difficulty':
            return [{ difficulty: order }, { id: 'asc' }];
        case 'createdAt':
            return [{ createdAt: order }, { id: 'asc' }];
        case 'popularity':
            return [{ favouriteCount: order }, { id: 'asc' }];
        case 'topicLevel':
            return [{ topic: { level: order } }, { order: 'asc' }, { id: 'asc' }];
        default:
            return [{ order: 'asc' }, { id: 'asc' }];
    }
}

/**
 * Generates an aggregated count of items grouped by the output of a key extraction function.
 */
export function countBy<T>(items: T[], keyFn: (item: T) => string | string[]): Record<string, number> {
    const result: Record<string, number> = {};
    for (const item of items) {
        const keys = keyFn(item);
        for (const key of Array.isArray(keys) ? keys : [keys]) {
            result[key] = (result[key] ?? 0) + 1;
        }
    }
    return result;
}
