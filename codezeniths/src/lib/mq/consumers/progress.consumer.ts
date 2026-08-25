/**
 * @file progress.consumer.ts
 * @description Consumer worker for the Progress domain: handles in-app notifications, WebSocket broadcasts, push notifications, and streak/digest emails.
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

async function sendInAppNotification(userId: string, type: string, title: string, message: string) {
    try {
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

        const notification = {
            id: dbNotification.id,
            type: dbNotification.type,
            title: dbNotification.title,
            message: dbNotification.message,
            timestamp: dbNotification.createdAt.toISOString(),
            read: dbNotification.read,
        };

        // 2. Save to user's notification list in Redis (cache)
        const listKey = RedisStore.notifications.userList(userId);
        await redisService.list.push(listKey, JSON.stringify(notification));

        // Limit list size to latest 50 items
        const len = await redisService.list.len(listKey);
        if (len > 50) {
            await redisService.list.pop(listKey);
        }

        // 3. Publish to user's real-time WebSocket channel in Redis
        const channel = RedisStore.channels.userNotifications(userId);
        await redisService.pubsub.publish(channel, notification);
    } catch (error) {
        logger.error('[progress:inapp] Failed to deliver in-app notification', { error, userId });
    }
}

async function getUserEmailContext(userId: string): Promise<{ name?: string; email?: string; theme?: 'dark' | 'light' }> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                preferences: {
                    select: {
                        theme: true,
                    },
                },
            },
        });

        const theme = user?.preferences?.theme?.toLowerCase() === 'light' ? 'light' : 'dark';
        return {
            name: user?.name || undefined,
            email: user?.email || undefined,
            theme,
        };
    } catch (error) {
        logger.warn('[progress:consumer] Failed to fetch user email context', { error, userId });
        return { theme: 'dark' };
    }
}

export const progressProblemSolvedConsumer = createConsumer(
    'progress.problem.solved',
    async (payload: PayloadOf<'progress.problem.solved'>, context: MessageContext) => {
        try {

            logger.info("Payload in Problem Solved: ", payload);

            await sendInAppNotification(
                payload.userId,
                'PROBLEM_SOLVED',
                'Problem Solved! 🎉',
                `You successfully solved "${payload.problemTitle}" in ${payload.module}.`
            );

            // // Optional Push Notification
            // const user = await prisma.user.findUnique({
            //     where: { id: payload.userId },
            //     include: { preferences: true },
            // });

            // logger.info("User in Problem Solved: ", { user });

            // if (user?.preferences?.pushNotifications) {
            //     logger.info('[progress:problem_solved] Sending push notification');
            //     await deviceTokenService.sendTemplatedToUser(
            //         payload.userId,
            //         FcmTemplate.PROBLEM_SOLVED,
            //         {
            //             problemName: payload.problemTitle,
            //         }
            //     );
            // }

            context.ack();
        } catch (error) {
            logger.error('[progress:problem_solved] Failed to process problem solved event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_PROBLEM_SOLVED }
);

export const progressProblemUnsolvedConsumer = createConsumer(
    'progress.problem.unsolved',
    async (payload: PayloadOf<'progress.problem.unsolved'>, context: MessageContext) => {
        try {
            logger.info('Processing problem unsolved event', { payload });

            // Publish to user's real-time WebSocket channel in Redis
            const channel = `user:${payload.userId}:progress`;
            await redisService.pubsub.publish(channel, {
                type: 'PROBLEM_UNSOLVED',
                problemId: payload.problemId,
                timestamp: payload.unsolvedAt || new Date().toISOString(),
            });

            context.ack();
        } catch (error) {
            logger.error('[progress:problem_unsolved] Failed to process problem unsolved event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_PROBLEM_UNSOLVED }
);

export const progressModuleMasteredConsumer = createConsumer(
    'progress.module.mastered',
    async (payload: PayloadOf<'progress.module.mastered'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'MODULE_MASTERED',
                'Module Mastered! 🎓',
                `Congratulations! You have mastered the entire ${payload.moduleTitle} module.`
            );

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.MODULE_MASTERED,
                    {
                        moduleName: payload.moduleTitle,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:module_mastered] Failed to process module mastered event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_MODULE_MASTERED }
);

export const progressStreakMilestoneConsumer = createConsumer(
    'progress.streak.milestone',
    async (payload: PayloadOf<'progress.streak.milestone'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'STREAK_MILESTONE',
                `${payload.streakCount}-Day Streak Milestone! 🔥`,
                `You reached a consecutive streak of ${payload.streakCount} days on CodeZeniths.`
            );

            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.STREAK_MILESTONE,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        streakCount: payload.streakCount,
                        theme: userCtx.theme,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:streak_milestone] Failed to process streak milestone event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_STREAK_MILESTONE }
);

export const progressWeeklyDigestConsumer = createConsumer(
    'progress.weekly.digest',
    async (payload: PayloadOf<'progress.weekly.digest'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.WEEKLY_DIGEST,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        summaryUrl: payload.summaryUrl,
                        theme: userCtx.theme,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[progress:weekly_digest] Failed to process weekly digest event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_WEEKLY_DIGEST }
);

export const progressRankPromotedConsumer = createConsumer(
    'progress.rank.promoted',
    async (payload: PayloadOf<'progress.rank.promoted'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.userId,
                'RANK_PROMOTED',
                'Rank Promotion! 🎖️',
                `Congratulations! You were promoted to ${payload.newRank}${payload.division ? ` (${payload.division})` : ''}.`
            );
            context.ack();
        } catch (error) {
            logger.error('[progress:rank_promoted] Failed to process rank promotion event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PROGRESS_RANK_PROMOTED }
);



/**
 * Starts all Progress domain consumers.
 */
export async function startProgressConsumers(): Promise<void> {
    await Promise.all([
        progressProblemSolvedConsumer.start(),
        progressProblemUnsolvedConsumer.start(),
        progressModuleMasteredConsumer.start(),
        progressStreakMilestoneConsumer.start(),
        progressWeeklyDigestConsumer.start(),
        progressRankPromotedConsumer.start(),
    ]);
    logger.info('[progress:consumers] All 6 Progress consumers initialized successfully.');
}
