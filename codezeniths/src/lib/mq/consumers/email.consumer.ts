import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { createMailService } from '@/service/mail/mail.service';
import { MailTemplate } from '@/service/mail/mail.types';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';

const mailService = createMailService();

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

/** JSDoc: Triggered by user sign up. Targets exchange auth.direct via routing key auth.email.welcome. */
export const emailWelcomeConsumer = createConsumer(
    'auth.email.welcome',
    async (payload: PayloadOf<'auth.email.welcome'>, context: MessageContext) => {
        try {
            await mailService.sendTemplatedEmail(MailTemplate.WELCOME, payload.email, {
                name: payload.name,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:welcome] Failed to send welcome email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_WELCOME }
);

/** JSDoc: Triggered by verification request. Targets exchange auth.direct via routing key auth.email.verify. */
export const emailVerifyConsumer = createConsumer(
    'auth.email.verify',
    async (payload: PayloadOf<'auth.email.verify'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${payload.token}`;
            
            await mailService.sendTemplatedEmail(MailTemplate.VERIFY, payload.email, {
                name,
                verifyUrl,
                token: payload.token,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:verify] Failed to send verification email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_VERIFY }
);

/** JSDoc: Triggered by OTP request. Targets exchange auth.direct via routing key auth.email.otp. */
export const emailOtpConsumer = createConsumer(
    'auth.email.otp',
    async (payload: PayloadOf<'auth.email.otp'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.OTP, payload.email, {
                name,
                code: payload.code,
                expiryMinutes: 10,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:otp] Failed to send OTP email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_OTP }
);

/** JSDoc: Triggered by magic link request. Targets exchange auth.direct via routing key auth.email.magic_link. */
export const emailMagicLinkConsumer = createConsumer(
    'auth.email.magic_link',
    async (payload: PayloadOf<'auth.email.magic_link'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.MAGIC_LINK, payload.email, {
                name,
                loginUrl: payload.url,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:magic_link] Failed to send magic link email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_MAGIC_LINK }
);

/** JSDoc: Triggered by password reset request. Targets exchange auth.direct via routing key auth.email.reset_password. */
export const emailResetPasswordConsumer = createConsumer(
    'auth.email.reset_password',
    async (payload: PayloadOf<'auth.email.reset_password'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.RESET_PASSWORD, payload.email, {
                name,
                resetUrl: payload.url,
                expiryMinutes: 60,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:reset_password] Failed to send reset password email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_RESET_PASSWORD }
);

/** JSDoc: Triggered by new device login. Targets exchange auth.direct via routing key auth.email.new_device. */
export const emailNewDeviceConsumer = createConsumer(
    'auth.email.new_device',
    async (payload: PayloadOf<'auth.email.new_device'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.NEW_DEVICE, payload.email, {
                name,
                deviceName: payload.deviceName,
                location: payload.location || 'Unknown Location',
                time: new Date().toLocaleString(),
            });
            context.ack();
        } catch (error) {
            logger.error('[email:new_device] Failed to send new device email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_NEW_DEVICE }
);

/** JSDoc: Triggered by OAuth login. Targets exchange auth.direct via routing key auth.email.oauth_login. */
export const emailOauthLoginConsumer = createConsumer(
    'auth.email.oauth_login',
    async (payload: PayloadOf<'auth.email.oauth_login'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.OAUTH_LOGIN, payload.email, {
                name,
                provider: payload.provider,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:oauth_login] Failed to send oauth login email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_OAUTH_LOGIN }
);

/** JSDoc: Triggered by password change. Targets exchange auth.direct via routing key auth.email.password_changed. */
export const emailPasswordChangedConsumer = createConsumer(
    'auth.email.password_changed',
    async (payload: PayloadOf<'auth.email.password_changed'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.PASSWORD_CHANGED, payload.email, {
                name,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:password_changed] Failed to send password changed email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_PASSWORD_CHANGED }
);

/** JSDoc: Triggered by session revocation. Targets exchange auth.direct via routing key auth.email.session_revoked. */
export const emailSessionRevokedConsumer = createConsumer(
    'auth.email.session_revoked',
    async (payload: PayloadOf<'auth.email.session_revoked'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            const session = await prisma.session.findUnique({ where: { id: payload.sessionId } });
            const deviceName = session?.userAgent || 'Unknown Device';
            const location = session?.ipAddress || 'Unknown IP';
            
            await mailService.sendTemplatedEmail(MailTemplate.SESSION_REVOKED, payload.email, {
                name,
                deviceName,
                location,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:session_revoked] Failed to send session revoked email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_SESSION_REVOKED }
);

/** JSDoc: Triggered by account deactivation. Targets exchange auth.direct via routing key auth.email.account_deactivated. */
export const emailAccountDeactivatedConsumer = createConsumer(
    'auth.email.account_deactivated',
    async (payload: PayloadOf<'auth.email.account_deactivated'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.ACCOUNT_DEACTIVATED, payload.email, {
                name,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:account_deactivated] Failed to send account deactivation email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_ACCOUNT_DEACTIVATED }
);

/** JSDoc: Triggered by account reactivation. Targets exchange auth.direct via routing key auth.email.account_reactivated. */
export const emailAccountReactivatedConsumer = createConsumer(
    'auth.email.account_reactivated',
    async (payload: PayloadOf<'auth.email.account_reactivated'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await mailService.sendTemplatedEmail(MailTemplate.ACCOUNT_REACTIVATED, payload.email, {
                name,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:account_reactivated] Failed to send account reactivation email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_ACCOUNT_REACTIVATED }
);

/** JSDoc: Triggered by cron weekly digest event. Targets exchange content.fanout via routing key content.published. */
export const emailWeeklyDigestConsumer = createConsumer(
    'cron.weekly_digest',
    async (payload: PayloadOf<'cron.weekly_digest'>, context: MessageContext) => {
        try {
            const activeUsers = await prisma.user.findMany({
                where: {
                    isActive: true,
                    preferences: {
                        emailNotifications: true,
                    },
                },
            });
            
            for (const user of activeUsers) {
                try {
                    await mailService.sendTemplatedEmail(MailTemplate.WEEKLY_DIGEST, user.email, {
                        name: user.name,
                        summaryUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
                    });
                } catch (err) {
                    logger.error(`[email:weekly_digest] Failed to send to ${user.email}`, err);
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[email:weekly_digest] Failed in weekly digest broadcast', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_WEEKLY_DIGEST }
);

/** JSDoc: Triggered by user streak progress milestone. Targets exchange progress.topic via routing key progress.*.solved. */
export const emailStreakMilestoneConsumer = createConsumer(
    'progress.event',
    async (payload: PayloadOf<'progress.event'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true }
            });
            
            if (user && user.preferences?.emailNotifications) {
                const streakCount = await getUserStreakCount(payload.userId);
                // Only send milestone email if streak is active (greater than 0)
                if (streakCount > 0) {
                    await mailService.sendTemplatedEmail(MailTemplate.STREAK_MILESTONE, user.email, {
                        name: user.name,
                        streakCount,
                    });
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[email:streak_milestone] Failed to process streak progress event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_STREAK_MILESTONE }
);

/** JSDoc: Triggered by subscription creation. Targets exchange payment.direct via routing key payment.subscription.created. */
export const emailSubscriptionConfirmedConsumer = createConsumer(
    'payment.subscription.created',
    async (payload: PayloadOf<'payment.subscription.created'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (user) {
                const planName = payload.planId === 'plan_premium' ? 'Premium Plan' : 'Pro Plan';
                const price = payload.planId === 'plan_premium' ? '$29.99/mo' : '$9.99/mo';
                const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString();
                
                await mailService.sendTemplatedEmail(MailTemplate.SUBSCRIPTION_CONFIRMED, user.email, {
                    name: user.name,
                    planName,
                    price,
                    nextBillingDate,
                });
            }
            context.ack();
        } catch (error) {
            logger.error('[email:subscription_confirmed] Failed to send subscription confirmation email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_SUBSCRIPTION_CONFIRMED }
);

/** JSDoc: Triggered by subscription cancellation. Targets exchange payment.direct via routing key payment.subscription.cancelled. */
export const emailSubscriptionCancelledConsumer = createConsumer(
    'payment.subscription.cancelled',
    async (payload: PayloadOf<'payment.subscription.cancelled'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (user) {
                const expiryDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString();
                
                await mailService.sendTemplatedEmail(MailTemplate.SUBSCRIPTION_CANCELLED, user.email, {
                    name: user.name,
                    planName: 'Premium Plan',
                    expiryDate,
                });
            }
            context.ack();
        } catch (error) {
            logger.error('[email:subscription_cancelled] Failed to send subscription cancellation email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_SUBSCRIPTION_CANCELLED }
);

/** JSDoc: Triggered by payment failure event. Targets exchange notification.fanout via routing key payment.failed. */
export const emailPaymentFailedConsumer = createConsumer(
    'payment.failed',
    async (payload: PayloadOf<'payment.failed'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (user) {
                const amount = `$${(payload.amount / 100).toFixed(2)}`;
                const retryLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing`;
                
                await mailService.sendTemplatedEmail(MailTemplate.PAYMENT_FAILED, user.email, {
                    name: user.name,
                    planName: 'Premium Plan',
                    amount,
                    retryLink,
                });
            }
            context.ack();
        } catch (error) {
            logger.error('[email:payment_failed] Failed to send payment failed email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_PAYMENT_FAILED }
);

/** JSDoc: Triggered by successful payment. Targets exchange payment.direct via routing key payment.confirmed. */
export const emailPaymentReceiptConsumer = createConsumer(
    'payment.confirmed',
    async (payload: PayloadOf<'payment.confirmed'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            if (user) {
                const amount = `$${(payload.amount / 100).toFixed(2)}`;
                const date = new Date().toLocaleDateString();
                
                await mailService.sendTemplatedEmail(MailTemplate.PAYMENT_RECEIPT, user.email, {
                    name: user.name,
                    receiptId: payload.paymentIntentId,
                    amount,
                    date,
                });
            }
            context.ack();
        } catch (error) {
            logger.error('[email:payment_receipt] Failed to send payment receipt email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_PAYMENT_RECEIPT }
);

/** JSDoc: Triggered by admin broadcast event. Targets exchange notification.fanout via routing key admin.broadcast. */
export const emailAdminBroadcastConsumer = createConsumer(
    'notification.admin_broadcast',
    async (payload: PayloadOf<'notification.admin_broadcast'>, context: MessageContext) => {
        try {
            const activeUsers = await prisma.user.findMany({
                where: {
                    isActive: true,
                    preferences: {
                        emailNotifications: true,
                    },
                },
            });
            
            for (const user of activeUsers) {
                try {
                    await mailService.sendTemplatedEmail(MailTemplate.ADMIN_BROADCAST, user.email, {
                        title: payload.title,
                        message: payload.message,
                    });
                } catch (err) {
                    logger.error(`[email:admin_broadcast] Failed to broadcast to ${user.email}`, err);
                }
            }
            context.ack();
        } catch (error) {
            logger.error('[email:admin_broadcast] Failed in admin email broadcast', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_ADMIN_BROADCAST }
);

/** JSDoc: Triggered to send passwordless credentials. Targets exchange auth.direct via routing key auth.email.passwordless_credentials. */
export const emailPasswordlessCredentialsConsumer = createConsumer(
    'auth.email.passwordless_credentials',
    async (payload: PayloadOf<'auth.email.passwordless_credentials'>, context: MessageContext) => {
        try {
            await mailService.sendTemplatedEmail(MailTemplate.PASSWORDLESS_CREDENTIALS, payload.email, {
                name: payload.name,
                password: payload.password,
            });
            context.ack();
        } catch (error) {
            logger.error('[email:passwordless_credentials] Failed to send credentials email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.EMAIL_PASSWORDLESS_CREDENTIALS }
);

export async function startEmailConsumers(): Promise<void> {
    await Promise.all([
        emailWelcomeConsumer.start(),
        emailVerifyConsumer.start(),
        emailOtpConsumer.start(),
        emailMagicLinkConsumer.start(),
        emailResetPasswordConsumer.start(),
        emailNewDeviceConsumer.start(),
        emailOauthLoginConsumer.start(),
        emailPasswordChangedConsumer.start(),
        emailSessionRevokedConsumer.start(),
        emailAccountDeactivatedConsumer.start(),
        emailAccountReactivatedConsumer.start(),
        emailWeeklyDigestConsumer.start(),
        emailStreakMilestoneConsumer.start(),
        emailSubscriptionConfirmedConsumer.start(),
        emailSubscriptionCancelledConsumer.start(),
        emailPaymentFailedConsumer.start(),
        emailPaymentReceiptConsumer.start(),
        emailAdminBroadcastConsumer.start(),
        emailPasswordlessCredentialsConsumer.start(),
    ]);
}
