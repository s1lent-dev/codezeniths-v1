import { z } from 'zod';
import { Difficulty, UserRole, UserType } from '@prisma/client';

export const GetSearchProblemsInputSchema = z.object({}).optional();
export const GetSearchProblemsOutputSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        difficulty: z.enum(Object.values(Difficulty) as [string, ...string[]]),
        order: z.number().int().default(0),
        articleUrl: z.string().url().nullable().optional(),
        problemUrl: z.string().url().nullable().optional(),
        topicId: z.string().nullable().optional(),
        topicSlug: z.string().nullable().optional(),
        topic: z.string().nullable().optional(),
        topicLevel: z.string().nullable().optional(),
        moduleId: z.string().nullable().optional(),
        moduleSlug: z.string().nullable().optional(),
        module: z.string().nullable().optional(),
        tags: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                slug: z.string(),
            })
        ),
        phoneticTitle: z.string().optional(),
        createdAt: z.coerce.date().or(z.string()).optional(),
    })
);

export const GetSearchTopicsInputSchema = z.object({}).optional();
export const GetSearchTopicsOutputSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable().optional(),
        module: z.string().nullable().optional(),
        level: z.string().nullable().optional(),
        problemsCount: z.number().optional(),
        phoneticTitle: z.string().optional(),
    })
);

export const GetSearchModulesInputSchema = z.object({}).optional();
export const GetSearchModulesOutputSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable().optional(),
        tagsCount: z.number().optional(),
        topicsCount: z.number().optional(),
        problemsCount: z.number().optional(),
        phoneticTitle: z.string().optional(),
    })
);

export const GetSearchTagsInputSchema = z.object({}).optional();
export const GetSearchTagsOutputSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().nullable().optional(),
        level: z.string().nullable().optional(),
        module: z.string().nullable().optional(),
        moduleSlug: z.string().nullable().optional(),
        moduleId: z.string().nullable().optional(),
        problemIds: z.array(z.string()).optional(),
        problemsCount: z.number().optional(),
        phoneticName: z.string().optional(),
        createdAt: z.coerce.date().or(z.string()).optional(),
    })
);

export const GetSearchProductsInputSchema = z.object({}).optional();
export const GetSearchProductsOutputSchema = z.array(
    z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        description: z.string().nullable().optional(),
        phoneticTitle: z.string().optional(),
    })
);

export const GetSearchUsersInputSchema = z.object({}).optional();
export const GetSearchUsersOutputSchema = z.array(
    z.object({
        id: z.string(),
        name: z.string(),
        username: z.string().nullable().optional(),
        email: z.string(),
        image: z.string().nullable().optional(),
        role: z.enum(Object.values(UserRole) as [string, ...string[]]).optional(),
        userType: z.enum(Object.values(UserType) as [string, ...string[]]).nullable().optional(),
        phoneticName: z.string().optional(),
        phoneticUsername: z.string().optional(),
    })
);

// ─── Search History Schemas ───────────────────────────────────────────────────

import { SearchCollectionSchema, UserSearchHistorySchema } from '../db.schema';

export const GetRecentSearchHistoryInputSchema = z.object({
    userId: z.uuidv7(),
    limit: z.number().int().min(1).max(20).default(10),
});

export const GetRecentSearchHistoryOutputSchema = z.array(UserSearchHistorySchema);

export const DeleteSearchHistoryItemInputSchema = z.object({
    id: z.uuidv7(),
    userId: z.uuidv7(),
});

export const DeleteSearchHistoryItemOutputSchema = z.object({
    success: z.boolean(),
});

export const ClearSearchHistoryInputSchema = z.object({
    userId: z.uuidv7(),
});

export const ClearSearchHistoryOutputSchema = z.object({
    success: z.boolean(),
});

export const SearchHistoryCategoryFilterSchema = z.enum([
    'all',
    'problem',
    'topic',
    'module',
    'tag',
    'user',
    'product',
]);

export const GetSearchHistoryInfiniteInputSchema = z.object({
    userId: z.uuidv7(),
    cursor: z.string().optional(),
    limit: z.number().int().min(1).max(50).default(6),
    collection: SearchHistoryCategoryFilterSchema.default('all').optional(),
    search: z.string().optional(),
});

export const GetSearchHistoryInfiniteOutputSchema = z.object({
    items: z.array(UserSearchHistorySchema),
    nextCursor: z.string().nullable().optional(),
    hasNextPage: z.boolean(),
    totalCount: z.number(),
});

export const GetSearchHistoryStatsInputSchema = z.object({
    userId: z.uuidv7(),
});

export const GetSearchHistoryStatsOutputSchema = z.object({
    totalSearches: z.number(),
    todaySearches: z.number(),
    topCategory: z.string().nullable(),
});
