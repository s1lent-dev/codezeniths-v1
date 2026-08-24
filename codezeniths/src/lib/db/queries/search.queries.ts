import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { formatUserProfiles } from '@/utils/user.formatter';
import {
    GetSearchProblemsInputSchema,
    GetSearchProblemsOutputSchema,
    GetSearchTopicsInputSchema,
    GetSearchTopicsOutputSchema,
    GetSearchModulesInputSchema,
    GetSearchModulesOutputSchema,
    GetSearchTagsInputSchema,
    GetSearchTagsOutputSchema,
    GetSearchProductsInputSchema,
    GetSearchProductsOutputSchema,
    GetSearchUsersInputSchema,
    GetSearchUsersOutputSchema,
    RecordSearchSelectionInputSchema,
    RecordSearchSelectionOutputSchema,
    GetRecentSearchHistoryInputSchema,
    GetRecentSearchHistoryOutputSchema,
    DeleteSearchHistoryItemInputSchema,
    DeleteSearchHistoryItemOutputSchema,
    ClearSearchHistoryInputSchema,
    ClearSearchHistoryOutputSchema,
    GetSearchHistoryInfiniteInputSchema,
    GetSearchHistoryInfiniteOutputSchema,
    GetSearchHistoryStatsInputSchema,
    GetSearchHistoryStatsOutputSchema,
} from '@codezeniths/schemas/db';
import { ISearchQueries } from './interfaces/search.queries.interface';


export class SearchQueries implements ISearchQueries {
    getSearchProblems = qRPC()
        .input(GetSearchProblemsInputSchema)
        .output(GetSearchProblemsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchProblems query', { payload });
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

            return problems.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
                order: p.order ?? 0,
                articleUrl: p.articleUrl || null,
                problemUrl: p.problemUrl || null,
                favouriteCount: p.favouriteCount ?? 0,
                topicId: p.topicId || p.topic?.id || null,
                topicSlug: p.topic?.slug || null,
                topic: p.topic?.title || null,
                moduleId: p.topic?.module?.id || null,
                moduleSlug: p.topic?.module?.slug || null,
                module: p.topic?.module?.title || null,
                tags: p.tags.map((t) => ({
                    id: t.tag.id,
                    name: t.tag.name,
                    slug: t.tag.slug,
                })),
                phoneticTitle: p.title,
            }));
        })
        .build();

    getSearchTopics = qRPC()
        .input(GetSearchTopicsInputSchema)
        .output(GetSearchTopicsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchTopics query', { payload });
            const topics = await prisma.topic.findMany({
                include: {
                    module: true,
                    _count: {
                        select: { problems: true },
                    },
                },
            });

            return topics.map((t) => ({
                id: t.id,
                title: t.title,
                slug: t.slug,
                description: t.description || null,
                module: t.module?.title || null,
                level: t.level || null,
                problemsCount: t._count.problems || 0,
                phoneticTitle: t.title,
            }));
        })
        .build();

    getSearchModules = qRPC()
        .input(GetSearchModulesInputSchema)
        .output(GetSearchModulesOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchModules query', { payload });
            const modules = await prisma.module.findMany({
                include: {
                    _count: {
                        select: {
                            tags: true,
                            topics: true,
                        },
                    },
                    topics: {
                        select: {
                            _count: {
                                select: { problems: true },
                            },
                        },
                    },
                },
            });

            return modules.map((m) => {
                const problemsCount = m.topics.reduce((acc, top) => acc + (top._count.problems || 0), 0);
                return {
                    id: m.id,
                    title: m.title,
                    slug: m.slug,
                    description: m.description || null,
                    tagsCount: m._count.tags || 0,
                    topicsCount: m._count.topics || 0,
                    problemsCount,
                    phoneticTitle: m.title,
                };
            });
        })
        .build();

    getSearchTags = qRPC()
        .input(GetSearchTagsInputSchema)
        .output(GetSearchTagsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchTags query', { payload });
            const tags = await prisma.tag.findMany({
                include: {
                    module: true,
                    _count: {
                        select: { problems: true },
                    },
                },
            });

            return tags.map((t) => ({
                id: t.id,
                name: t.name,
                slug: t.slug,
                description: t.description || null,
                level: t.level || null,
                module: t.module?.title || null,
                problemsCount: t._count.problems || 0,
                phoneticName: t.name,
            }));
        })
        .build();


    getSearchProducts = qRPC()
        .input(GetSearchProductsInputSchema)
        .output(GetSearchProductsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchProducts query', { payload });
            const products = await prisma.product.findMany({
                where: { isActive: true },
            });

            return products.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                description: p.description || null,
                phoneticTitle: p.title,
            }));
        })
        .build();

    getSearchUsers = qRPC()
        .input(GetSearchUsersInputSchema)
        .output(GetSearchUsersOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchUsers query', { payload });
            const users = await prisma.user.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    image: true,
                    role: true,
                    userType: true,
                },
            });

            return users.map((u) => ({
                id: u.id,
                name: u.name,
                username: u.username || null,
                email: u.email,
                image: u.image || null, // Raw Cloudflare R2 storage path
                role: u.role,
                userType: u.userType || null,
                phoneticName: u.name,
                phoneticUsername: u.username || undefined,
            }));
        })
        .build();

    recordSearchHistory = qRPC()

        .input(RecordSearchSelectionInputSchema)
        .output(RecordSearchSelectionOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing recordSearchHistory query', {
                userId: payload.userId,
                collection: payload.collection,
                resultId: payload.resultId,
            });

            await prisma.userSearchHistory.upsert({
                where: {
                    userId_collection_resultId: {
                        userId: payload.userId,
                        collection: payload.collection,
                        resultId: payload.resultId,
                    },
                },
                create: {
                    userId: payload.userId,
                    collection: payload.collection,
                    resultId: payload.resultId,
                    title: payload.title,
                    slug: payload.slug || null,
                    metadata: payload.document,
                },
                update: {
                    title: payload.title,
                    slug: payload.slug || null,
                    metadata: payload.document,
                    updatedAt: new Date(),
                },
            });

            return { success: true };
        })
        .build();

    getRecentSearchHistory = qRPC()
        .input(GetRecentSearchHistoryInputSchema)
        .output(GetRecentSearchHistoryOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getRecentSearchHistory query', { userId: payload.userId, limit: payload.limit });
            const histories = await prisma.userSearchHistory.findMany({
                where: { userId: payload.userId },
                orderBy: { updatedAt: 'desc' },
                take: payload.limit,
            });

            return histories.map((h) => ({
                id: h.id,
                userId: h.userId,
                collection: h.collection,
                resultId: h.resultId,
                title: h.title,
                slug: h.slug,
                metadata: (typeof h.metadata === 'object' && h.metadata !== null) ? (h.metadata as Record<string, any>) : {},
                createdAt: h.createdAt,
                updatedAt: h.updatedAt,
            }));
        })
        .build();

    getSearchHistoryInfinite = qRPC()
        .input(GetSearchHistoryInfiniteInputSchema)
        .output(GetSearchHistoryInfiniteOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchHistoryInfinite query', { payload });
            const { userId, cursor, limit, collection, search } = payload;

            const where: any = {
                userId,
            };

            if (collection && collection !== 'all') {
                where.collection = collection;
            }

            if (search && search.trim()) {
                const searchTerm = search.trim();
                where.OR = [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { slug: { contains: searchTerm, mode: 'insensitive' } },
                ];
            }

            const [totalCount, rawItems] = await Promise.all([
                prisma.userSearchHistory.count({ where }),
                prisma.userSearchHistory.findMany({
                    where,
                    orderBy: { updatedAt: 'desc' },
                    cursor: cursor ? { id: cursor } : undefined,
                    skip: cursor ? 1 : 0,
                    take: limit + 1,
                }),
            ]);

            const hasNextPage = rawItems.length > limit;
            const items = hasNextPage ? rawItems.slice(0, limit) : rawItems;
            const nextCursor = hasNextPage ? items[items.length - 1].id : null;

            const mappedItems = items.map((h) => ({
                id: h.id,
                userId: h.userId,
                collection: h.collection,
                resultId: h.resultId,
                title: h.title,
                slug: h.slug,
                metadata: (typeof h.metadata === 'object' && h.metadata !== null) ? (h.metadata as Record<string, any>) : {},
                createdAt: h.createdAt,
                updatedAt: h.updatedAt,
            }));

            return {
                items: mappedItems,
                nextCursor,
                hasNextPage,
                totalCount,
            };
        })
        .build();

    getSearchHistoryStats = qRPC()
        .input(GetSearchHistoryStatsInputSchema)
        .output(GetSearchHistoryStatsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSearchHistoryStats query', { userId: payload.userId });
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            const [totalSearches, todaySearches, collectionGroups] = await Promise.all([
                prisma.userSearchHistory.count({
                    where: { userId: payload.userId },
                }),
                prisma.userSearchHistory.count({
                    where: {
                        userId: payload.userId,
                        createdAt: { gte: startOfToday },
                    },
                }),
                prisma.userSearchHistory.groupBy({
                    by: ['collection'],
                    where: { userId: payload.userId },
                    _count: { collection: true },
                    orderBy: {
                        _count: { collection: 'desc' },
                    },
                    take: 1,
                }),
            ]);

            const topCategory = collectionGroups[0]?.collection ?? null;

            return {
                totalSearches,
                todaySearches,
                topCategory,
            };
        })
        .build();

    deleteSearchHistoryItem = qRPC()
        .input(DeleteSearchHistoryItemInputSchema)
        .output(DeleteSearchHistoryItemOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing deleteSearchHistoryItem query', { id: payload.id, userId: payload.userId });
            await prisma.userSearchHistory.deleteMany({
                where: {
                    id: payload.id,
                    userId: payload.userId,
                },
            });
            return { success: true };
        })
        .build();

    clearSearchHistory = qRPC()
        .input(ClearSearchHistoryInputSchema)
        .output(ClearSearchHistoryOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing clearSearchHistory query', { userId: payload.userId });
            await prisma.userSearchHistory.deleteMany({
                where: { userId: payload.userId },
            });
            return { success: true };
        })
        .build();

}



export const searchQueries = new SearchQueries();

