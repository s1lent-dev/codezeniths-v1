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

    if (filters.topicSlug) {
        where.topic = { slug: filters.topicSlug };
    } else if (filters.moduleSlug) {
        where.topic = { module: { slug: filters.moduleSlug } };
    }

    if (filters.difficulty) {
        where.difficulty = filters.difficulty;
    }

    if (filters.tagSlugs?.length) {
        where.tags = { some: { tag: { slug: { in: filters.tagSlugs } } } };
    }

    if (filters.status && userId) {
        if (filters.status === 'solved') {
            where.progresses = {
                some: {
                    userId,
                    status: 'solved',
                },
            };
        } else if (filters.status === 'revisit') {
            where.progresses = {
                some: {
                    userId,
                    status: 'revisit',
                },
            };
        } else if (filters.status === 'not_solved') {
            where.progresses = {
                none: {
                    userId,
                    status: { in: ['solved', 'revisit'] },
                },
            };
        }
    }

    if (filters.favourite !== undefined && userId) {
        if (filters.favourite) {
            if (where.progresses?.some) {
                where.progresses.some.favourite = true;
            } else {
                where.progresses = {
                    some: {
                        userId,
                        favourite: true,
                    },
                };
            }
        } else {
            where.progresses = {
                none: {
                    userId,
                    favourite: true,
                },
            };
        }
    }

    if (filters.search) {
        where.title = {
            contains: filters.search,
            mode: 'insensitive',
        };
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
