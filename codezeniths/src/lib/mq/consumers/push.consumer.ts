import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { fcmAdminService } from '@/lib/firebase/admin';
import { deviceTokenService } from '@/lib/firebase/devicetoken.service';
import { FcmTemplate } from '@/lib/firebase/types';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';

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
export const pushLoginConsumer = createConsumer(
    'notification.user_login',
    async (payload: PayloadOf<'notification.user_login'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true }
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
            logger.error('[push:login] Failed to send login push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_LOGIN }
);

/** JSDoc: Triggered on new device login. Targets exchange notification.fanout via routing key user.new_device_login. */
export const pushNewDeviceConsumer = createConsumer(
    'notification.new_device',
    async (payload: PayloadOf<'notification.new_device'>, context: MessageContext) => {
        try {
            // Security notification, send even if marketing push preference is disabled (if token is available)
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
            logger.error('[push:new_device] Failed to send new device push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_NEW_DEVICE }
);

/** JSDoc: Triggered by user streak milestone/reminder. Targets exchange progress.topic via routing key progress.#. */
export const pushStreakReminderConsumer = createConsumer(
    'progress.event',
    async (payload: PayloadOf<'progress.event'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true }
            });
            
            if (user?.preferences?.pushNotifications) {
                const streakCount = await getUserStreakCount(payload.userId);
                if (streakCount > 0) {
                    await deviceTokenService.sendTemplatedToUser(
                        payload.userId,
                        FcmTemplate.STREAK_REMINDER,
                        { days: streakCount }
                    );
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[push:streak_reminder] Failed to process streak push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_STREAK_REMINDER }
);

/** JSDoc: Triggered when a problem is solved. Targets exchange progress.topic via routing key progress.*.solved. */
export const pushProblemSolvedConsumer = createConsumer(
    'progress.event',
    async (payload: PayloadOf<'progress.event'>, context: MessageContext) => {
        try {
            if (payload.problemId) {
                const user = await prisma.user.findUnique({
                    where: { id: payload.userId },
                    include: { preferences: true }
                });
                
                if (user?.preferences?.pushNotifications) {
                    const problem = await prisma.problem.findUnique({
                        where: { id: payload.problemId }
                    });
                    
                    if (problem) {
                        await deviceTokenService.sendTemplatedToUser(
                            payload.userId,
                            FcmTemplate.PROBLEM_SOLVED,
                            { problemName: problem.title }
                        );
                    }
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[push:problem_solved] Failed to process problem solved push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_PROBLEM_SOLVED }
);

/** JSDoc: Triggered when a module is mastered. Targets exchange progress.topic via routing key progress.*.mastered. */
export const pushModuleMasteredConsumer = createConsumer(
    'progress.event',
    async (payload: PayloadOf<'progress.event'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true }
            });
            
            if (user?.preferences?.pushNotifications) {
                const moduleObj = await prisma.module.findUnique({
                    where: { slug: payload.moduleSlug }
                });
                
                const moduleName = moduleObj?.title || payload.moduleSlug;
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.MODULE_MASTERED,
                    { moduleName }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[push:module_mastered] Failed to process module mastered push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_MODULE_MASTERED }
);

/** JSDoc: Triggered when new content is published. Targets exchange content.fanout via routing key content.published. */
export const pushNewContentConsumer = createConsumer(
    'content.published',
    async (payload: PayloadOf<'content.published'>, context: MessageContext) => {
        try {
            const deviceTokens = await prisma.deviceToken.findMany({
                where: {
                    user: {
                        isActive: true,
                        preferences: {
                            pushNotifications: true,
                        },
                    },
                },
                select: { fid: true },
            });
            
            const tokens = deviceTokens.map(d => d.fid);
            if (tokens.length > 0) {
                const result = await fcmAdminService.sendTemplatedNotification(FcmTemplate.NEW_CONTENT, tokens, {
                    title: payload.title,
                    contentType: payload.contentType,
                });
                if (result.status === 'sent' && result.invalidFids?.length) {
                    await deviceTokenService.pruneInvalidFids(result.invalidFids);
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[push:new_content] Failed to send new content push announcement', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_NEW_CONTENT }
);

/** JSDoc: Triggered on successful payment. Targets exchange payment.direct via routing key payment.confirmed. */
export const pushPaymentSuccessConsumer = createConsumer(
    'payment.confirmed',
    async (payload: PayloadOf<'payment.confirmed'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true }
            });
            
            if (user?.preferences?.pushNotifications) {
                const amount = `$${(payload.amount / 100).toFixed(2)}`;
                await deviceTokenService.sendTemplatedToUser(
                    payload.userId,
                    FcmTemplate.PAYMENT_SUCCESS,
                    { amount }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[push:payment_success] Failed to send payment confirmation push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_PAYMENT_SUCCESS }
);

/** JSDoc: Triggered on payment failure. Targets exchange notification.fanout via routing key payment.failed. */
export const pushPaymentFailedConsumer = createConsumer(
    'payment.failed',
    async (payload: PayloadOf<'payment.failed'>, context: MessageContext) => {
        try {
            // Critical payment/billing alert, sent regardless of marketing preference if tokens exist
            const amount = `$${(payload.amount / 100).toFixed(2)}`;
            await deviceTokenService.sendTemplatedToUser(
                payload.userId,
                FcmTemplate.PAYMENT_FAILED,
                {
                    amount,
                    reason: payload.reason,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[push:payment_failed] Failed to send payment failure push notification', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_PAYMENT_FAILED }
);

/** JSDoc: Triggered by admin broadcast event. Targets exchange notification.fanout via routing key admin.broadcast. */
export const pushAdminAnnouncementConsumer = createConsumer(
    'notification.admin_broadcast',
    async (payload: PayloadOf<'notification.admin_broadcast'>, context: MessageContext) => {
        try {
            const deviceTokens = await prisma.deviceToken.findMany({
                where: {
                    user: {
                        isActive: true,
                        preferences: {
                            pushNotifications: true,
                        },
                    },
                },
                select: { fid: true },
            });
            
            const tokens = deviceTokens.map(d => d.fid);
            if (tokens.length > 0) {
                const result = await fcmAdminService.sendTemplatedNotification(FcmTemplate.ADMIN_ANNOUNCEMENT, tokens, {
                    title: payload.title,
                    message: payload.message,
                });
                if (result.status === 'sent' && result.invalidFids?.length) {
                    await deviceTokenService.pruneInvalidFids(result.invalidFids);
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[push:admin_announcement] Failed in admin push broadcast announcement', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PUSH_ADMIN_ANNOUNCEMENT }
);

export async function startPushConsumers(): Promise<void> {
    await Promise.all([
        pushLoginConsumer.start(),
        pushNewDeviceConsumer.start(),
        pushStreakReminderConsumer.start(),
        pushProblemSolvedConsumer.start(),
        pushModuleMasteredConsumer.start(),
        pushNewContentConsumer.start(),
        pushPaymentSuccessConsumer.start(),
        pushPaymentFailedConsumer.start(),
        pushAdminAnnouncementConsumer.start(),
    ]);
}
