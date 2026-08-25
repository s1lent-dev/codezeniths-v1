/**
 * @file auth.consumer.ts
 * @description Consumer worker for the Auth domain: renders React Email templates and dispatches OTP/security SMS.
 */

import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { MailTemplate } from '@/service/mail/mail.types';
import { mailService } from '@/service/mail/mail.service';
import { SmsTemplate, smsService } from '@/service/sms';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';
import { searchClient } from '@/service/search';
import { storageService } from '@/service/storage';
import { redisService, RedisStore } from '@/lib/redis';

async function getUserEmailContext(userId: string): Promise<{ name?: string; theme?: 'dark' | 'light' }> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
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
            theme,
        };
    } catch (error) {
        logger.warn('[auth:consumer] Failed to fetch user preferences, falling back to dark theme', { error, userId });
        return { theme: 'dark' };
    }
}

async function getUserSmsContext(userId: string): Promise<{ name?: string }> {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
            },
        });
        return {
            name: user?.name || undefined,
        };
    } catch (error) {
        logger.warn('[auth:consumer] Failed to fetch user context for SMS', { error, userId });
        return {};
    }
}

// ── Auth Email Consumers ──────────────────────────────────────────

export const authWelcomeEmailConsumer = createConsumer(
    'auth.email.welcome',
    async (payload: PayloadOf<'auth.email.welcome'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.WELCOME,
                payload.email,
                {
                    name: payload.name || userCtx.name || 'Developer',
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:welcome] Failed to send welcome email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_WELCOME }
);

export const authVerifyEmailConsumer = createConsumer(
    'auth.email.verify',
    async (payload: PayloadOf<'auth.email.verify'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';
            const verifyUrl = payload.url || `${appUrl}/api/auth/verify-email?token=${payload.token}&callbackURL=${appUrl}/verify-email`;

            await mailService.sendTemplatedEmail(
                MailTemplate.VERIFY,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    verifyUrl,
                    token: payload.token,
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:verify] Failed to send verify email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_VERIFY }
);

export const authOtpEmailConsumer = createConsumer(
    'auth.email.otp',
    async (payload: PayloadOf<'auth.email.otp'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.OTP,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    code: payload.code,
                    expiryMinutes: 10,
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:otp] Failed to send OTP email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_OTP }
);

export const authMagicLinkEmailConsumer = createConsumer(
    'auth.email.magic_link',
    async (payload: PayloadOf<'auth.email.magic_link'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.MAGIC_LINK,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    loginUrl: payload.url,
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:magic_link] Failed to send magic link email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_MAGIC_LINK }
);

export const authResetPasswordEmailConsumer = createConsumer(
    'auth.email.reset_password',
    async (payload: PayloadOf<'auth.email.reset_password'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.RESET_PASSWORD,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    resetUrl: payload.url,
                    code: payload.code,
                    expiryMinutes: 60,
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:reset_password] Failed to send reset password email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_RESET_PASSWORD }
);

export const authNewDeviceEmailConsumer = createConsumer(
    'auth.email.new_device',
    async (payload: PayloadOf<'auth.email.new_device'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.NEW_DEVICE,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    deviceName: payload.deviceName,
                    location: payload.location,
                    time: new Date().toLocaleString(),
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:new_device] Failed to send new device alert email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_NEW_DEVICE }
);

export const authOauthLoginEmailConsumer = createConsumer(
    'auth.email.oauth_login',
    async (payload: PayloadOf<'auth.email.oauth_login'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.OAUTH_LOGIN,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    provider: payload.provider,
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:oauth_login] Failed to send OAuth login email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_OAUTH_LOGIN }
);

export const authPasswordChangedEmailConsumer = createConsumer(
    'auth.email.password_changed',
    async (payload: PayloadOf<'auth.email.password_changed'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.PASSWORD_CHANGED,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:password_changed] Failed to send password changed email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_PASSWORD_CHANGED }
);

export const authSessionRevokedEmailConsumer = createConsumer(
    'auth.email.session_revoked',
    async (payload: PayloadOf<'auth.email.session_revoked'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.SESSION_REVOKED,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:session_revoked] Failed to send session revoked email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_SESSION_REVOKED }
);

export const authAccountDeactivatedEmailConsumer = createConsumer(
    'auth.email.account_deactivated',
    async (payload: PayloadOf<'auth.email.account_deactivated'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.ACCOUNT_DEACTIVATED,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:account_deactivated] Failed to send account deactivation email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_ACCOUNT_DEACTIVATED }
);

export const authAccountReactivatedEmailConsumer = createConsumer(
    'auth.email.account_reactivated',
    async (payload: PayloadOf<'auth.email.account_reactivated'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.ACCOUNT_REACTIVATED,
                payload.email,
                {
                    name: userCtx.name || 'Developer',
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:account_reactivated] Failed to send account reactivation email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_ACCOUNT_REACTIVATED }
);

export const authPasswordlessCredentialsEmailConsumer = createConsumer(
    'auth.email.passwordless_credentials',
    async (payload: PayloadOf<'auth.email.passwordless_credentials'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            await mailService.sendTemplatedEmail(
                MailTemplate.PASSWORDLESS_CREDENTIALS,
                payload.email,
                {
                    name: payload.name || userCtx.name || 'Developer',
                    username: payload.username,
                    password: payload.password,
                    theme: userCtx.theme,
                }
            );
            context.ack();
        } catch (error) {
            logger.error('[auth:passwordless_credentials] Failed to send credentials email', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_EMAIL_PASSWORDLESS_CREDENTIALS }
);

// ── Auth SMS Consumers ────────────────────────────────────────────

export const authOtpSmsConsumer = createConsumer(
    'auth.sms.otp',
    async (payload: PayloadOf<'auth.sms.otp'>, context: MessageContext) => {
        try {
            const result = await smsService.sendTemplatedSms(
                SmsTemplate.OTP,
                payload.phoneNumber,
                {
                    code: payload.code,
                    expiryMinutes: 10,
                },
                { dedupeKey: payload.correlationId }
            );

            if (result.status === 'failed') {
                throw result.error;
            }

            context.ack();
        } catch (error) {
            logger.error('[auth:sms:otp] Failed to send OTP SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_SMS_OTP }
);

export const authMagicLinkSmsConsumer = createConsumer(
    'auth.sms.magic_link',
    async (payload: PayloadOf<'auth.sms.magic_link'>, context: MessageContext) => {
        try {
            const userCtx = await getUserSmsContext(payload.userId);
            const result = await smsService.sendTemplatedSms(
                SmsTemplate.MAGIC_LINK,
                payload.phoneNumber,
                {
                    name: userCtx.name || 'Developer',
                    loginUrl: payload.url,
                },
                { dedupeKey: payload.correlationId }
            );

            if (result.status === 'failed') {
                throw result.error;
            }

            context.ack();
        } catch (error) {
            logger.error('[auth:sms:magic_link] Failed to send magic link SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_SMS_MAGIC_LINK }
);

export const authPasswordlessCredentialsSmsConsumer = createConsumer(
    'auth.sms.passwordless_credentials',
    async (payload: PayloadOf<'auth.sms.passwordless_credentials'>, context: MessageContext) => {
        try {
            const result = await smsService.sendTemplatedSms(
                SmsTemplate.PASSWORDLESS_CREDENTIALS,
                payload.phoneNumber,
                {
                    password: payload.password,
                },
                { dedupeKey: payload.correlationId }
            );

            if (result.status === 'failed') {
                throw result.error;
            }

            context.ack();
        } catch (error) {
            logger.error('[auth:sms:credentials] Failed to send credentials SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_SMS_PASSWORDLESS_CREDENTIALS }
);

export const authNewDeviceSmsConsumer = createConsumer(
    'auth.sms.new_device',
    async (payload: PayloadOf<'auth.sms.new_device'>, context: MessageContext) => {
        try {
            const userCtx = await getUserSmsContext(payload.userId);
            const result = await smsService.sendTemplatedSms(
                SmsTemplate.NEW_DEVICE,
                payload.phoneNumber,
                {
                    name: userCtx.name || 'Developer',
                    deviceName: payload.deviceName,
                    time: new Date().toLocaleString(),
                },
                { dedupeKey: payload.correlationId }
            );

            if (result.status === 'failed') {
                throw result.error;
            }

            context.ack();
        } catch (error) {
            logger.error('[auth:sms:new_device] Failed to send new device SMS alert', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_SMS_NEW_DEVICE }
);

export const authAccountLockedSmsConsumer = createConsumer(
    'auth.sms.account_locked',
    async (payload: PayloadOf<'auth.sms.account_locked'>, context: MessageContext) => {
        try {
            const userCtx = await getUserSmsContext(payload.userId);
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://codezeniths.com';
            const result = await smsService.sendTemplatedSms(
                SmsTemplate.ACCOUNT_LOCKED,
                payload.phoneNumber,
                {
                    name: userCtx.name || 'Developer',
                    unlockLink: `${appUrl}/forgot-password`,
                },
                { dedupeKey: payload.correlationId }
            );

            if (result.status === 'failed') {
                throw result.error;
            }

            context.ack();
        } catch (error) {
            logger.error('[auth:sms:account_locked] Failed to send account locked SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_SMS_ACCOUNT_LOCKED }
);

export const authAccountDeletedConsumer = createConsumer(
    'auth.account.deleted',
    async (payload: PayloadOf<'auth.account.deleted'>, context: MessageContext) => {
        const { userId, image, resume } = payload;
        try {
            logger.info('[auth:account_deleted] Processing background cleanup for deleted user', { userId });

            // 1. Remove user from Redis search collection AND remove all orphaned autocomplete prefixes from Trie
            await searchClient.collection('users' as any).removeDocument(userId).catch((err) => {
                logger.warn('[auth:account_deleted] Failed to remove user from search collection', { userId, err });
            });

            // 2. Remove user from Global Leaderboard ZSET (zset:leaderboard:global)
            await redisService.sortedList.remove(RedisStore.leaderboards.global(), userId).catch(() => {});

            // 3. Remove user from ALL Module Leaderboards (zset:leaderboard:module:<moduleId>)
            const allModules = await prisma.module.findMany({ select: { id: true } }).catch(() => []);
            if (allModules.length > 0) {
                await Promise.all(
                    allModules.map((m) =>
                        redisService.sortedList.remove(RedisStore.leaderboards.module(m.id), userId).catch(() => {})
                    )
                );
            }

            // 4. Remove user notifications list (list:user:<userId>:notifications)
            await redisService.client.del(RedisStore.notifications.userListRawKey(userId)).catch(() => {});

            // 5. Remove user cache keys
            await redisService.client.del(
                RedisStore.user.profile(userId),
                RedisStore.user.details(userId)
            ).catch(() => {});

            // 6. Delete uploaded files from Cloudflare R2 / S3 storage
            if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
                await storageService.delete(image).catch((err) => {
                    logger.warn('[auth:account_deleted] Failed to delete user avatar from storage', { image, err });
                });
            }

            if (resume) {
                await storageService.delete(resume).catch((err) => {
                    logger.warn('[auth:account_deleted] Failed to delete user resume from storage', { resume, err });
                });
            }

            logger.info('[auth:account_deleted] Successfully completed background cleanup for user', { userId });
            context.ack();
        } catch (error) {
            logger.error('[auth:account_deleted] Error during deleted user background cleanup', error);
            context.ack();
        }
    },
    { queue: MqQueue.AUTH_ACCOUNT_DELETED }
);

/**
 * Starts all Auth domain consumers.
 */
export async function startAuthConsumers(): Promise<void> {
    await Promise.all([
        authWelcomeEmailConsumer.start(),
        authVerifyEmailConsumer.start(),
        authOtpEmailConsumer.start(),
        authMagicLinkEmailConsumer.start(),
        authResetPasswordEmailConsumer.start(),
        authNewDeviceEmailConsumer.start(),
        authOauthLoginEmailConsumer.start(),
        authPasswordChangedEmailConsumer.start(),
        authSessionRevokedEmailConsumer.start(),
        authAccountDeactivatedEmailConsumer.start(),
        authAccountReactivatedEmailConsumer.start(),
        authPasswordlessCredentialsEmailConsumer.start(),
        authOtpSmsConsumer.start(),
        authMagicLinkSmsConsumer.start(),
        authPasswordlessCredentialsSmsConsumer.start(),
        authNewDeviceSmsConsumer.start(),
        authAccountLockedSmsConsumer.start(),
        authAccountDeletedConsumer.start(),
    ]);
    logger.info('[auth:consumers] All 18 Auth consumers initialized successfully.');
}
