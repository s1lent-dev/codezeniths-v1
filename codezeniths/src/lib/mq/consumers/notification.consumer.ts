/**
 * @file notification.consumer.ts
 * @description Consumer worker for the Notification domain: handles direct in-app alerts, global admin broadcasts, and push notifications.
 */

import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { MailTemplate } from '@/service/mail/mail.types';
import { mailService } from '@/service/mail/mail.service';
import { redisService, RedisStore } from '@/lib/redis';
import { prisma } from '@/lib/db/prisma.client';
import { deviceTokenService } from '@/lib/firebase/devicetoken.service';
import { FcmTemplate } from '@/lib/firebase/types';
import { logger } from '@/service/logging';

async function sendInAppNotification(userId: string | null | undefined, type: string, title: string, message: string) {
    try {
        const dbNotification = await prisma.notification.create({
            data: {
                userId: userId || null,
                type,
                title,
                message,
                read: false,
            },
        });

        const notification = {
            id: dbNotification.id,
            type: dbNotification.type,
            title: dbNotification.title,
            message: dbNotification.message,
            timestamp: dbNotification.createdAt.toISOString(),
            read: dbNotification.read,
        };

        if (userId) {
            const listKey = RedisStore.notifications.userList(userId);
            await redisService.list.push(listKey, JSON.stringify(notification));
            const len = await redisService.list.len(listKey);
            if (len > 50) await redisService.list.pop(listKey);

            const channel = RedisStore.channels.userNotifications(userId);
            await redisService.pubsub.publish(channel, notification);
        } else {
            const listKey = `global:notifications`;
            await redisService.list.push(listKey, JSON.stringify(notification));
            const len = await redisService.list.len(listKey);
            if (len > 100) await redisService.list.pop(listKey);

            const channel = `global:notifications`;
            await redisService.pubsub.publish(channel, notification);
        }
    } catch (error) {
        logger.error('[notification:inapp] Failed to deliver in-app notification', { error, userId });
    }
}

export const notificationInAppConsumer = createConsumer(
    'notification.inapp',
    async (payload: PayloadOf<'notification.inapp'>, context: MessageContext) => {
        try {
            await sendInAppNotification(payload.userId, payload.type, payload.title, payload.message);
            context.ack();
        } catch (error) {
            logger.error('[notification:inapp] Failed to process in-app notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.NOTIFICATION_INAPP }
);

export const notificationPushConsumer = createConsumer(
    'notification.push',
    async (payload: PayloadOf<'notification.push'>, context: MessageContext) => {
        try {
            await deviceTokenService.sendNotificationToUser(payload.userId, {
                title: payload.title,
                body: payload.body,
            });
            context.ack();
        } catch (error) {
            logger.error('[notification:push] Failed to process push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.NOTIFICATION_PUSH }
);

export const notificationAdminBroadcastConsumer = createConsumer(
    'notification.admin_broadcast',
    async (payload: PayloadOf<'notification.admin_broadcast'>, context: MessageContext) => {
        try {
            // 1. Deliver in-app global notification
            await sendInAppNotification(null, 'ADMIN_BROADCAST', payload.title, payload.message);

            // 2. Deliver email if flagged
            if (payload.sendEmail) {
                const users = await prisma.user.findMany({
                    select: { email: true, name: true },
                    take: 500,
                });

                for (const user of users) {
                    if (user.email) {
                        await mailService.sendTemplatedEmail(
                            MailTemplate.ADMIN_BROADCAST,
                            user.email,
                            {
                                name: user.name || 'Developer',
                                title: payload.title,
                                message: payload.message,
                                theme: 'dark',
                            }
                        );
                    }
                }
            }

            context.ack();
        } catch (error) {
            logger.error('[notification:broadcast] Failed to process admin broadcast', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.NOTIFICATION_ADMIN_BROADCAST }
);

export const notificationUserLoginConsumer = createConsumer(
    'notification.user_login',
    async (payload: PayloadOf<'notification.user_login'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.USER_LOGIN,
                    { timestamp: payload.timestamp }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[notification:login] Failed to process login notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.NOTIFICATION_USER_LOGIN }
);

export const notificationNewDeviceConsumer = createConsumer(
    'notification.new_device',
    async (payload: PayloadOf<'notification.new_device'>, context: MessageContext) => {
        try {
            await deviceTokenService.sendTemplatedToUser(
                payload.userId,
                FcmTemplate.NEW_DEVICE,
                {
                    deviceName: payload.deviceName,
                    timestamp: payload.timestamp,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[notification:new_device] Failed to process new device push alert', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.NOTIFICATION_NEW_DEVICE }
);

export const notificationContactReceivedConsumer = createConsumer(
    'notification.contact.received',
    async (payload: PayloadOf<'notification.contact.received'>, context: MessageContext) => {
        try {
            const { name, email, subject, phone, message, userId, theme, submittedAt } = payload;
            const isRegisteredUser = Boolean(userId);

            // 1. Send Inbound Inquiry Email to CodeZeniths support inbox (replyTo set directly to sender's email)
            await mailService.sendTemplatedEmail(
                MailTemplate.CONTACT_INQUIRY,
                'support@codezeniths.in',
                {
                    name,
                    email,
                    subject,
                    phone,
                    message,
                    submittedAt,
                    isRegisteredUser,
                    theme: theme || 'dark',
                },
                {
                    from: { email: 'support@codezeniths.in', name: 'CodeZeniths Inbound Contact' },
                    replyTo: email,
                    subject: `[Contact Form] ${subject} from ${name}`,
                }
            );

            // 2. Send Outbound Auto-Confirmation Email back to the user
            await mailService.sendTemplatedEmail(
                MailTemplate.CONTACT_CONFIRMATION,
                email,
                {
                    name,
                    subject,
                    message,
                    submittedAt,
                    theme: theme || 'dark',
                },
                {
                    from: { email: 'support@codezeniths.in', name: 'CodeZeniths Support' },
                    subject: `We've Received Your Message — CodeZeniths`,
                }
            );

            logger.info('[notification:contact_received] Successfully delivered contact inquiry and confirmation emails', { email, subject });
            context.ack();
        } catch (error) {
            logger.error('[notification:contact_received] Failed to deliver contact notification emails', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.NOTIFICATION_CONTACT_RECEIVED }
);

/**
 * Starts all Notification domain consumers.
 */
export async function startNotificationConsumers(): Promise<void> {
    await Promise.all([
        notificationInAppConsumer.start(),
        notificationPushConsumer.start(),
        notificationAdminBroadcastConsumer.start(),
        notificationUserLoginConsumer.start(),
        notificationNewDeviceConsumer.start(),
        notificationContactReceivedConsumer.start(),
    ]);
    logger.info('[notification:consumers] All 6 Notification consumers initialized successfully.');
}
