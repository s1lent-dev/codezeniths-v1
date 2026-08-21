import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { searchClient } from '@codezeniths/service/search';
import { logger } from '@codezeniths/service/logging';

export const searchUserIndexConsumer = createConsumer(
    'search.user.index',
    async (payload: PayloadOf<'search.user.index'>, context: MessageContext) => {
        logger.info('Processing search.user.index MQ consumer event', { userId: payload.userId });
        const userDoc = {
            id: payload.userId,
            name: payload.name,
            username: payload.username || null,
            email: payload.email,
            image: payload.image || null,
            role: payload.role || 'user',
            userType: payload.userType || null,
        };

        const result = await searchClient.collection('users').addDocument(userDoc);
        if (!result.ok) {
            logger.error('Failed to index user document via MQ consumer', { error: result.error, payload });
            context.nack(true);
            return;
        }

        logger.info('Successfully indexed user document via MQ consumer', { userId: payload.userId });
        context.ack();
    },
    { queue: MqQueue.SEARCH_USER_INDEX }
);

import { prisma } from '@codezeniths/lib/db/prisma.client';

export const searchHistoryRecordConsumer = createConsumer(
    'search.history.record',
    async (payload: PayloadOf<'search.history.record'>, context: MessageContext) => {
        logger.info('Processing search.history.record MQ consumer event', {
            userId: payload.userId,
            collection: payload.collection,
            resultId: payload.resultId,
        });

        try {
            let metadataDoc = (payload.document as Record<string, any>) || {};

            // Ensure user collection history records store the pristine raw S3 storage key
            if (payload.collection === 'user' && payload.resultId) {
                const rawUser = await prisma.user.findUnique({
                    where: { id: payload.resultId },
                    select: { image: true, name: true, username: true, userType: true },
                });
                if (rawUser) {
                    metadataDoc = {
                        ...metadataDoc,
                        image: rawUser.image, // Raw storage key (or null)
                        name: rawUser.name,
                        username: rawUser.username,
                        userType: rawUser.userType,
                    };
                }
            }

            // Upsert UserSearchHistory entry
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
                    metadata: metadataDoc,
                },
                update: {
                    title: payload.title,
                    slug: payload.slug || null,
                    metadata: metadataDoc,
                    updatedAt: new Date(),
                },
            });

            // Asynchronously prune search history if user has > 30 entries
            void (async () => {
                try {
                    const totalCount = await prisma.userSearchHistory.count({
                        where: { userId: payload.userId },
                    });
                    if (totalCount > 30) {
                        const excess = totalCount - 30;
                        const oldestEntries = await prisma.userSearchHistory.findMany({
                            where: { userId: payload.userId },
                            orderBy: { updatedAt: 'asc' },
                            take: excess,
                            select: { id: true },
                        });
                        if (oldestEntries.length > 0) {
                            await prisma.userSearchHistory.deleteMany({
                                where: {
                                    id: { in: oldestEntries.map((e) => e.id) },
                                },
                            });
                        }
                    }
                } catch (pruneErr) {
                    logger.warn('Failed async search history pruning', { pruneErr, userId: payload.userId });
                }
            })();

            logger.info('Successfully saved user search history via MQ consumer', {
                userId: payload.userId,
                collection: payload.collection,
                resultId: payload.resultId,
            });
            context.ack();
        } catch (error: any) {
            logger.error('Failed to record search history via MQ consumer', {
                error: error?.message,
                payload,
            });
            context.nack(false);
        }
    },
    { queue: MqQueue.SEARCH_HISTORY_RECORD }
);

export async function startSearchConsumers(): Promise<void> {
    await Promise.all([
        searchUserIndexConsumer.start(),
        searchHistoryRecordConsumer.start(),
    ]);
}

