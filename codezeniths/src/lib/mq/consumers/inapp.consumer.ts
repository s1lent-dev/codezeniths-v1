import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { redisService } from '@/lib/redis';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';
import { randomUUID } from 'crypto';

interface InAppNotification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
}

async function sendInAppNotification(userId: string, type: string, title: string, message: string) {
    // 1. Persist to PostgreSQL database
    const dbNotification = await prisma.notification.create({
        data: {
            userId,
            type,
            title,
            message,
            read: false,
        },
    });

    const notification: InAppNotification = {
        id: dbNotification.id,
        type: dbNotification.type,
        title: dbNotification.title,
        message: dbNotification.message,
        timestamp: dbNotification.createdAt.toISOString(),
        read: dbNotification.read,
    };
    
    // 2. Save to user's notification list in Redis (cache)
    const listKey = `user:${userId}:notifications`;
    await redisService.list.push(listKey, JSON.stringify(notification));
    
    // Keep list size within last 50 notifications
    const len = await redisService.list.len(listKey);
    if (len > 50) {
        await redisService.list.pop(listKey);
    }
    
    // 3. Publish to user's real-time channel in Redis (best effort)
    const channel = `user:${userId}:notifications`;
    await redisService.pubsub.publish(channel, notification);
}

async function sendGlobalInAppNotification(type: string, title: string, message: string) {
    // 1. Persist to PostgreSQL database
    const dbNotification = await prisma.notification.create({
        data: {
            userId: null,
            type,
            title,
            message,
            read: false,
        },
    });

    const notification: InAppNotification = {
        id: dbNotification.id,
        type: dbNotification.type,
        title: dbNotification.title,
        message: dbNotification.message,
        timestamp: dbNotification.createdAt.toISOString(),
        read: dbNotification.read,
    };
    
    // 2. Save to global notification list in Redis (cache)
    const listKey = `global:notifications`;
    await redisService.list.push(listKey, JSON.stringify(notification));
    
    // Keep list size within last 100 notifications
    const len = await redisService.list.len(listKey);
    if (len > 100) {
        await redisService.list.pop(listKey);
    }
    
    // 3. Publish to global real-time channel in Redis (best effort)
    const channel = `global:notifications`;
    await redisService.pubsub.publish(channel, notification);
}


async function getUserStreakCount(userId: string): Promise<number> {
    const activities = await prisma.userActivity.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 365,
    });
    if (activities.length === 0) return 0;
    
    let streak = 0;
    let expectedDate = new Date();
    expectedDate.setHours(0, 0, 0, 0);
    
    const latestActivity = activities[0];
    const latestDate = new Date(latestActivity.date);
    latestDate.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(expectedDate.getTime() - latestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
        return 0; // Streak broken
    }
    
    expectedDate = latestDate;
    
    for (const act of activities) {
        const actDate = new Date(act.date);
        actDate.setHours(0, 0, 0, 0);
        if (actDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

/** JSDoc: Triggered on user login. Targets exchange notification.fanout via routing key user.login. */
export const inAppLoginConsumer = createConsumer(
    'notification.user_login',
    async (payload: PayloadOf<'notification.user_login'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'login',
                'New Login Detected',
                `You successfully logged into your account at ${payload.timestamp}.`
            );
            context.ack();
        } catch (error) {
            logger.error('[inapp:login] Failed to process login event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_LOGIN }
);

/** JSDoc: Triggered when a problem is solved. Targets exchange progress.topic via routing key progress.*.solved. */
export const inAppProblemSolvedConsumer = createConsumer(
    'progress.event',
    async (payload: PayloadOf<'progress.event'>, context: MessageContext) => {
        try {
            if (payload.problemId) {
                const problem = await prisma.problem.findUnique({
                    where: { id: payload.problemId }
                });
                if (problem) {
                    await sendInAppNotification(
                        payload.userId,
                        'solved',
                        'Problem Solved! 🎉',
                        `Congratulations! You solved: "${problem.title}".`
                    );
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[inapp:problem_solved] Failed to process problem solved event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_PROBLEM_SOLVED }
);

/** JSDoc: Triggered on user streak progress milestone. Targets exchange progress.topic via routing key progress.#. */
export const inAppStreakMilestoneConsumer = createConsumer(
    'progress.event',
    async (payload: PayloadOf<'progress.event'>, context: MessageContext) => {
        try {
            const streakCount = await getUserStreakCount(payload.userId);
            if (streakCount > 0) {
                await sendInAppNotification(
                    payload.userId,
                    'streak_milestone',
                    'Streak Milestone! 🔥',
                    `You are on a streak of ${streakCount} days. Keep it up!`
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[inapp:streak_milestone] Failed to process streak progress event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_STREAK_MILESTONE }
);

/** JSDoc: Triggered when new content is published. Targets exchange content.fanout via routing key content.published. */
export const inAppNewContentConsumer = createConsumer(
    'content.published',
    async (payload: PayloadOf<'content.published'>, context: MessageContext) => {
        try {
            await sendGlobalInAppNotification(
                'new_content',
                'New Content Available 📚',
                `A new ${payload.contentType} has been published: "${payload.title}".`
            );
            context.ack();
        } catch (error) {
            logger.error('[inapp:new_content] Failed to process new content published event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_NEW_CONTENT }
);

/** JSDoc: Triggered when a user profile is detected incomplete. Targets exchange progress.topic via routing key progress.#. */
export const inAppProfileIncompleteConsumer = createConsumer(
    'progress.event',
    async (payload: PayloadOf<'progress.event'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (user && (!user.image || !user.about || !user.location)) {
                await sendInAppNotification(
                    payload.userId,
                    'profile_incomplete',
                    'Complete Your Profile 👤',
                    'Please fill out your about info, location, and avatar to complete your profile.'
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[inapp:profile_incomplete] Failed to process profile incomplete check', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_PROFILE_INCOMPLETE }
);

/** JSDoc: Triggered when user subscription status changes. Targets exchange payment.direct via routing key payment.subscription.created. */
export const inAppSubscriptionStatusConsumer = createConsumer(
    'payment.subscription.created',
    async (payload: PayloadOf<'payment.subscription.created'>, context: MessageContext) => {
        try {
            const planName = payload.planId === 'plan_premium' ? 'Premium Plan' : 'Pro Plan';
            await sendInAppNotification(
                payload.userId,
                'subscription_status',
                'Subscription Activated! 💳',
                `Your subscription to ${planName} has been successfully activated.`
            );
            context.ack();
        } catch (error) {
            logger.error('[inapp:subscription_status] Failed to process subscription status event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_SUBSCRIPTION_STATUS }
);

/** JSDoc: Triggered on successful payment. Targets exchange payment.direct via routing key payment.confirmed. */
export const inAppPaymentConsumer = createConsumer(
    'payment.confirmed',
    async (payload: PayloadOf<'payment.confirmed'>, context: MessageContext) => {
        try {
            const amount = `$${(payload.amount / 100).toFixed(2)}`;
            await sendInAppNotification(
                payload.userId,
                'payment',
                'Payment Confirmed 💳',
                `We have successfully received your payment of ${amount}.`
            );
            context.ack();
        } catch (error) {
            logger.error('[inapp:payment] Failed to process payment event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_PAYMENT }
);

/** JSDoc: Triggered by admin broadcast event. Targets exchange notification.fanout via routing key admin.broadcast. */
export const inAppAdminBroadcastConsumer = createConsumer(
    'notification.admin_broadcast',
    async (payload: PayloadOf<'notification.admin_broadcast'>, context: MessageContext) => {
        try {
            await sendGlobalInAppNotification(
                'admin_broadcast',
                payload.title,
                payload.message
            );
            context.ack();
        } catch (error) {
            logger.error('[inapp:admin_broadcast] Failed to process admin broadcast event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_ADMIN_BROADCAST }
);

/** JSDoc: Triggered on session expiry or revocation. Targets exchange auth.direct via routing key auth.email.session_revoked. */
export const inAppSessionExpiredConsumer = createConsumer(
    'auth.email.session_revoked',
    async (payload: PayloadOf<'auth.email.session_revoked'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'session_revoked',
                'Session Revoked ⚠️',
                `Your active session (ID: ${payload.sessionId}) has been terminated or expired.`
            );
            context.ack();
        } catch (error) {
            logger.error('[inapp:session_expired] Failed to process session revoked event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.INAPP_SESSION_EXPIRED }
);

export async function startInAppConsumers(): Promise<void> {
    await Promise.all([
        inAppLoginConsumer.start(),
        inAppProblemSolvedConsumer.start(),
        inAppStreakMilestoneConsumer.start(),
        inAppNewContentConsumer.start(),
        inAppProfileIncompleteConsumer.start(),
        inAppSubscriptionStatusConsumer.start(),
        inAppPaymentConsumer.start(),
        inAppAdminBroadcastConsumer.start(),
        inAppSessionExpiredConsumer.start(),
    ]);
}
