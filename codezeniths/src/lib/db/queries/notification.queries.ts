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
            const { userId, limit = 50, offset = 0 } = payload;

            // Fetch notifications that are personal OR global (userId is null)
            const notifications = await prisma.notification.findMany({
                where: {
                    OR: [
                        { userId },
                        { userId: null },
                    ],
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
                skip: offset,
                include: {
                    reads: {
                        where: { userId },
                    },
                },
            });

            // Map and calculate if notification is read
            const formattedNotifications = notifications.map((n) => {
                const isRead = n.userId === null 
                    ? n.reads.length > 0 // For global notifications, check NotificationRead join
                    : n.read; // For personal notifications, check read column
                
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

            // Count unread notifications
            // We need to count personal unread + global unread
            const personalUnreadCount = await prisma.notification.count({
                where: {
                    userId,
                    read: false,
                },
            });

            // For global notifications, find notifications where userId is null,
            // and no read record exists for this user in NotificationRead.
            const globalUnreadCount = await prisma.notification.count({
                where: {
                    userId: null,
                    reads: {
                        none: {
                            userId,
                        },
                    },
                },
            });

            const unreadCount = personalUnreadCount + globalUnreadCount;

            return {
                notifications: formattedNotifications,
                unreadCount,
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
