import { z } from 'zod';
import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';
import {
    CreateNotificationInputSchema,
    CreateGlobalNotificationInputSchema,
    GetNotificationsInputSchema,
    GetNotificationsOutputSchema,
    NotificationDBOutputSchema,
    MarkAsReadInputSchema,
    MarkAllAsReadInputSchema,
} from '@/schemas/db';
import { INotificationQueries } from './interfaces/notification.queries.interface';

export class NotificationQueries implements INotificationQueries {
    createNotification = qRPC()
        .input(CreateNotificationInputSchema)
        .output(NotificationDBOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing createNotification query', { payload });
            const { userId, type, title, message } = payload;
            
            const notification = await prisma.notification.create({
                data: {
                    userId,
                    type,
                    title,
                    message,
                    read: false,
                },
            });
            
            return {
                id: notification.id,
                userId: notification.userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                read: notification.read,
                createdAt: notification.createdAt,
            };
        })
        .build();

    createGlobalNotification = qRPC()
        .input(CreateGlobalNotificationInputSchema)
        .output(NotificationDBOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing createGlobalNotification query', { payload });
            const { type, title, message } = payload;

            const notification = await prisma.notification.create({
                data: {
                    userId: null,
                    type,
                    title,
                    message,
                    read: false,
                },
            });

            return {
                id: notification.id,
                userId: notification.userId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                read: notification.read,
                createdAt: notification.createdAt,
            };
        })
        .build();

    getNotifications = qRPC()
        .input(GetNotificationsInputSchema)
        .output(GetNotificationsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getNotifications query', { payload });
            const {
                userId,
                status = 'all',
                category = 'all',
                sort = 'latest',
                search,
                limit = 6,
                cursor,
                offset,
            } = payload;

            // 1. Construct target & status condition
            let targetCondition: any = {
                OR: [{ userId }, { userId: null }],
            };

            if (status === 'unread') {
                targetCondition = {
                    OR: [
                        { userId, read: false },
                        { userId: null, reads: { none: { userId } } },
                    ],
                };
            } else if (status === 'read') {
                targetCondition = {
                    OR: [
                        { userId, read: true },
                        { userId: null, reads: { some: { userId } } },
                    ],
                };
            }

            // 2. Category condition
            let categoryCondition: any = undefined;
            if (category === 'achievements') {
                categoryCondition = {
                    OR: ['rank', 'streak', 'module', 'solve', 'achievement', 'badge', 'tier', 'topic', 'tag'].map((cat) => ({
                        type: { contains: cat, mode: 'insensitive' as const },
                    })),
                };
            } else if (category === 'social') {
                categoryCondition = {
                    OR: ['profile_view', 'viewer', 'follow', 'playlist', 'bookmark', 'star', 'comment', 'like'].map((cat) => ({
                        type: { contains: cat, mode: 'insensitive' as const },
                    })),
                };
            } else if (category === 'system') {
                categoryCondition = {
                    OR: ['welcome', 'payment', 'subscription', 'session', 'device', 'security', 'lock', 'admin', 'broadcast', 'announcement', 'system'].map((cat) => ({
                        type: { contains: cat, mode: 'insensitive' as const },
                    })),
                };
            }

            // 3. Search condition
            let searchCondition: any = undefined;
            if (search && search.trim()) {
                const query = search.trim();
                searchCondition = {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' as const } },
                        { message: { contains: query, mode: 'insensitive' as const } },
                    ],
                };
            }

            const whereClause: any = {
                AND: [
                    targetCondition,
                    ...(categoryCondition ? [categoryCondition] : []),
                    ...(searchCondition ? [searchCondition] : []),
                ],
            };

            // Fetch limit + 1 items to determine hasNextPage
            const takeCount = limit + 1;
            const [rawNotifications, totalCount, personalUnreadCount, globalUnreadCount] = await Promise.all([
                prisma.notification.findMany({
                    where: whereClause,
                    take: takeCount,
                    orderBy: {
                        createdAt: sort === 'oldest' ? 'asc' : 'desc',
                    },
                    cursor: cursor ? { id: cursor } : undefined,
                    skip: cursor ? 1 : typeof offset === 'number' && offset > 0 ? offset : undefined,
                    include: {
                        reads: {
                            where: { userId },
                        },
                    },
                }),
                prisma.notification.count({
                    where: whereClause,
                }),
                prisma.notification.count({
                    where: {
                        userId,
                        read: false,
                    },
                }),
                prisma.notification.count({
                    where: {
                        userId: null,
                        reads: {
                            none: {
                                userId,
                            },
                        },
                    },
                }),
            ]);

            const hasNextPage = rawNotifications.length > limit;
            const items = hasNextPage ? rawNotifications.slice(0, limit) : rawNotifications;
            const nextCursor = hasNextPage && items.length > 0 ? items[items.length - 1].id : null;

            // Map and calculate if notification is read
            const formattedNotifications = items.map((n) => {
                const isRead = n.userId === null
                    ? n.reads.length > 0
                    : n.read;

                return {
                    id: n.id,
                    userId: n.userId,
                    type: n.type,
                    title: n.title,
                    message: n.message,
                    read: isRead,
                    createdAt: n.createdAt,
                };
            });

            const unreadCount = personalUnreadCount + globalUnreadCount;

            return {
                notifications: formattedNotifications,
                unreadCount,
                totalCount,
                nextCursor,
                hasNextPage,
            };
        })
        .build();

    markAsRead = qRPC()
        .input(MarkAsReadInputSchema)
        .output(z.boolean())
        .handler(async (payload) => {
            logger.info('Executing markAsRead query', { payload });
            const { userId, notificationId } = payload;

            const notification = await prisma.notification.findUnique({
                where: { id: notificationId },
            });

            if (!notification) {
                logger.warn('Notification not found', { notificationId });
                return false;
            }

            if (notification.userId === null) {
                // Global notification: Insert record into NotificationRead
                await prisma.notificationRead.upsert({
                    where: {
                        userId_notificationId: {
                            userId,
                            notificationId,
                        },
                    },
                    update: {},
                    create: {
                        userId,
                        notificationId,
                    },
                });
            } else {
                // Personal notification: Update read flag directly
                if (notification.userId !== userId) {
                    logger.warn('Unauthorized attempt to mark notification as read', { userId, notificationId });
                    return false;
                }
                await prisma.notification.update({
                    where: { id: notificationId },
                    data: { read: true },
                });
            }

            return true;
        })
        .build();

    markAllAsRead = qRPC()
        .input(MarkAllAsReadInputSchema)
        .output(z.boolean())
        .handler(async (payload) => {
            logger.info('Executing markAllAsRead query', { payload });
            const { userId } = payload;

            // 1. Mark all personal notifications as read
            await prisma.notification.updateMany({
                where: {
                    userId,
                    read: false,
                },
                data: {
                    read: true,
                },
            });

            // 2. Find all unread global notifications (where userId is null and reads is none for this user)
            const unreadGlobalNotifications = await prisma.notification.findMany({
                where: {
                    userId: null,
                    reads: {
                        none: {
                            userId,
                        },
                    },
                },
                select: {
                    id: true,
                },
            });

            // 3. Insert NotificationRead records for these global notifications
            if (unreadGlobalNotifications.length > 0) {
                const readRecords = unreadGlobalNotifications.map((n) => ({
                    userId,
                    notificationId: n.id,
                }));
                
                await prisma.notificationRead.createMany({
                    data: readRecords,
                    skipDuplicates: true,
                });
            }

            return true;
        })
        .build();
}

export const notificationQueries = new NotificationQueries();
