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
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';

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
            logger.info(`[SMS to ${payload.phoneNumber}]: Your CodeZeniths verification code is ${payload.code}. Valid for 10 minutes.`);
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
            logger.info(`[SMS to ${payload.phoneNumber}]: Sign in to CodeZeniths: ${payload.url}`);
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
            logger.info(`[SMS to ${payload.phoneNumber}]: Your temporary CodeZeniths password is: ${payload.password}`);
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
            logger.warn(`[SMS to ${payload.phoneNumber}]: Security Alert - New sign-in from ${payload.deviceName}. If this wasn't you, secure your account immediately.`);
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
            logger.warn(`[SMS to ${payload.phoneNumber}]: Your CodeZeniths account has been temporarily locked due to multiple failed login attempts.`);
            context.ack();
        } catch (error) {
            logger.error('[auth:sms:account_locked] Failed to send account locked SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.AUTH_SMS_ACCOUNT_LOCKED }
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
    ]);
    logger.info('[auth:consumers] All 17 Auth consumers initialized successfully.');
}
