import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { createSmsService } from '@/service/sms/sms.service';
import { SmsTemplate } from '@/service/sms/sms.types';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';

const smsService = createSmsService();

/** JSDoc: Triggered by OTP request via SMS. Targets exchange auth.direct via routing key auth.sms.otp. */
export const smsOtpConsumer = createConsumer(
    'auth.sms.otp',
    async (payload: PayloadOf<'auth.sms.otp'>, context: MessageContext) => {
        try {
            await smsService.sendTemplatedSms(SmsTemplate.OTP, payload.phoneNumber, {
                code: payload.code,
                expiryMinutes: 10,
            });
            context.ack();
        } catch (error) {
            logger.error('[sms:otp] Failed to send SMS OTP', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SMS_OTP }
);

/** JSDoc: Triggered by magic link request via SMS. Targets exchange auth.direct via routing key auth.sms.magic_link. */
export const smsMagicLinkConsumer = createConsumer(
    'auth.sms.magic_link',
    async (payload: PayloadOf<'auth.sms.magic_link'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await smsService.sendTemplatedSms(SmsTemplate.MAGIC_LINK, payload.phoneNumber, {
                name,
                loginUrl: payload.url,
            });
            context.ack();
        } catch (error) {
            logger.error('[sms:magic_link] Failed to send SMS magic link', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SMS_MAGIC_LINK }
);

/** JSDoc: Triggered by new device login. Targets exchange auth.direct via routing key auth.sms.new_device. */
export const smsNewDeviceConsumer = createConsumer(
    'auth.sms.new_device',
    async (payload: PayloadOf<'auth.sms.new_device'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            
            await smsService.sendTemplatedSms(SmsTemplate.NEW_DEVICE, payload.phoneNumber, {
                name,
                deviceName: payload.deviceName,
                time: new Date().toLocaleTimeString(),
            });
            context.ack();
        } catch (error) {
            logger.error('[sms:new_device] Failed to send SMS new device alert', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SMS_NEW_DEVICE }
);

/** JSDoc: Triggered by payment failure. Targets exchange notification.fanout via routing key payment.failed. */
export const smsPaymentFailedConsumer = createConsumer(
    'payment.failed',
    async (payload: PayloadOf<'payment.failed'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true }
            });
            
            // Payment failures are critical billing notifications, send if they have a phone and configured preferences
            if (user && user.phoneNumber && user.preferences?.smsNotifications) {
                const amount = `$${(payload.amount / 100).toFixed(2)}`;
                const retryLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/billing`;
                
                await smsService.sendTemplatedSms(SmsTemplate.PAYMENT_FAILED, user.phoneNumber, {
                    name: user.name,
                    amount,
                    planName: 'Premium Plan',
                    retryLink,
                });
            }
            context.ack();
        } catch (error) {
            logger.error('[sms:payment_failed] Failed to send payment failed SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SMS_PAYMENT_FAILED }
);

/** JSDoc: Triggered by subscription renewal. Targets exchange payment.direct via routing key payment.subscription.renewed. */
export const smsSubscriptionRenewalConsumer = createConsumer(
    'payment.subscription.renewed',
    async (payload: PayloadOf<'payment.subscription.renewed'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { preferences: true }
            });
            
            if (user && user.phoneNumber && user.preferences?.smsNotifications) {
                const renewDate = new Date(payload.expiryDate).toLocaleDateString();
                
                await smsService.sendTemplatedSms(SmsTemplate.SUBSCRIPTION_RENEWAL, user.phoneNumber, {
                    name: user.name,
                    planName: 'Premium Plan',
                    amount: '$29.99',
                    renewDate,
                });
            }
            context.ack();
        } catch (error) {
            logger.error('[sms:subscription_renewal] Failed to send subscription renewal SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SMS_SUBSCRIPTION_RENEWAL }
);

/** JSDoc: Triggered by account lockout. Targets exchange auth.direct via routing key auth.sms.account_locked. */
export const smsAccountLockedConsumer = createConsumer(
    'auth.sms.account_locked',
    async (payload: PayloadOf<'auth.sms.account_locked'>, context: MessageContext) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: payload.userId } });
            const name = user?.name || 'User';
            const unlockLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unlock-account`;
            
            await smsService.sendTemplatedSms(SmsTemplate.ACCOUNT_LOCKED, payload.phoneNumber, {
                name,
                unlockLink,
            });
            context.ack();
        } catch (error) {
            logger.error('[sms:account_locked] Failed to send account locked SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SMS_ACCOUNT_LOCKED }
);

/** JSDoc: Triggered to send passwordless credentials via SMS. Targets exchange auth.direct via routing key auth.sms.passwordless_credentials. */
export const smsPasswordlessCredentialsConsumer = createConsumer(
    'auth.sms.passwordless_credentials',
    async (payload: PayloadOf<'auth.sms.passwordless_credentials'>, context: MessageContext) => {
        try {
            await smsService.sendTemplatedSms(SmsTemplate.PASSWORDLESS_CREDENTIALS, payload.phoneNumber, {
                password: payload.password,
            });
            context.ack();
        } catch (error) {
            logger.error('[sms:passwordless_credentials] Failed to send credentials SMS', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SMS_PASSWORDLESS_CREDENTIALS }
);

export async function startSmsConsumers(): Promise<void> {
    await Promise.all([
        smsOtpConsumer.start(),
        smsMagicLinkConsumer.start(),
        smsNewDeviceConsumer.start(),
        smsPaymentFailedConsumer.start(),
        smsSubscriptionRenewalConsumer.start(),
        smsAccountLockedConsumer.start(),
        smsPasswordlessCredentialsConsumer.start(),
    ]);
}
