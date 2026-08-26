import type { Prisma } from '@prisma/client';
import { Level } from '@prisma/client';

export interface TagFilterInput {
    search?: string;
    moduleSlug?: string;
    level?: Level;
}

export interface TagSortingInput {
    sortBy?: 'name' | 'level' | 'createdAt' | 'problemsCount';
    order?: 'asc' | 'desc';
}

/**
 * Builds the Prisma where input for tag querying based on filters.
 */
export function buildTagsWhere(filters: TagFilterInput): Prisma.TagWhereInput {
    const where: Prisma.TagWhereInput = {};

    if (filters.search) {
        where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    if (filters.moduleSlug) {
        where.module = { slug: filters.moduleSlug };
    }

    if (filters.level) {
        where.level = filters.level;
    }

    return where;
}

/**
 * Builds the Prisma orderBy input for tag querying based on sorting options.
 */
export function buildTagsOrderBy(
    sorting?: TagSortingInput,
): Prisma.TagOrderByWithRelationInput | Prisma.TagOrderByWithRelationInput[] {
    if (!sorting?.sortBy) {
        return [{ name: 'asc' }, { id: 'asc' }];
    }

    const order = sorting.order || 'asc';

    switch (sorting.sortBy) {
        case 'name':
            return [{ name: order }, { id: 'asc' }];
        case 'level':
            return [{ level: order }, { id: 'asc' }];
        case 'createdAt':
            return [{ createdAt: order }, { id: 'asc' }];
        case 'problemsCount':
            return [{ problems: { _count: order } }, { id: 'asc' }];
        default:
            return [{ name: 'asc' }, { id: 'asc' }];
    }
}
