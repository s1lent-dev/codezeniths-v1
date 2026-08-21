/**
 * @file payment.consumer.ts
 * @description Consumer worker for the Payment domain: manages billing state transitions and dispatches payment receipts & subscription lifecycle emails.
 */

import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { MailTemplate } from '@/service/mail/mail.types';
import { mailService } from '@/service/mail/mail.service';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';

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
        logger.warn('[payment:consumer] Failed to fetch user email context', { error, userId });
        return { theme: 'dark' };
    }
}

export const paymentWebhookProcessorConsumer = createConsumer(
    'payment.webhook.ingested',
    async (payload: PayloadOf<'payment.webhook.ingested'>, context: MessageContext) => {
        try {
            logger.info('[payment:webhook] Processing ingested gateway webhook', { provider: payload.provider });
            context.ack();
        } catch (error) {
            logger.error('[payment:webhook] Failed to process webhook', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_WEBHOOK_PROCESSOR }
);

export const paymentCheckoutConsumer = createConsumer(
    'payment.checkout.initiated',
    async (payload: PayloadOf<'payment.checkout.initiated'>, context: MessageContext) => {
        try {
            logger.info('[payment:checkout] Checkout initiated', { userId: payload.userId, amount: payload.amount });
            context.ack();
        } catch (error) {
            logger.error('[payment:checkout] Failed to process checkout initiation', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_CHECKOUT }
);

export const paymentConfirmedConsumer = createConsumer(
    'payment.confirmed',
    async (payload: PayloadOf<'payment.confirmed'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.PAYMENT_RECEIPT,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        receiptId: payload.paymentIntentId,
                        amount: `$${(payload.amount / 100).toFixed(2)}`,
                        theme: userCtx.theme,
                    }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[payment:confirmed] Failed to handle confirmed payment', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_CONFIRMED }
);

export const paymentFailedConsumer = createConsumer(
    'payment.failed',
    async (payload: PayloadOf<'payment.failed'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.PAYMENT_FAILED,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        planName: 'CodeZeniths Subscription',
                        amount: `$${(payload.amount / 100).toFixed(2)}`,
                        theme: userCtx.theme,
                    }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[payment:failed] Failed to process payment failure event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_FAILED }
);

export const paymentRetryConsumer = createConsumer(
    'payment.retry',
    async (payload: PayloadOf<'payment.retry'>, context: MessageContext) => {
        try {
            logger.info('[payment:retry] Retrying payment charge', { userId: payload.userId, retryCount: payload.retryCount });
            context.ack();
        } catch (error) {
            logger.error('[payment:retry] Failed to handle payment retry', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_RETRY }
);

export const paymentRefundConsumer = createConsumer(
    'payment.refund',
    async (payload: PayloadOf<'payment.refund'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.PAYMENT_REFUND,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        amount: `$${(payload.amount / 100).toFixed(2)}`,
                        paymentIntentId: payload.paymentIntentId,
                        theme: userCtx.theme,
                    }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[payment:refund] Failed to process payment refund', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_REFUND }
);

export const paymentSubscriptionCreatedConsumer = createConsumer(
    'payment.subscription.created',
    async (payload: PayloadOf<'payment.subscription.created'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.SUBSCRIPTION_CONFIRMED,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        planName: payload.planId,
                        price: '$9.99/mo',
                        theme: userCtx.theme,
                    }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[payment:sub_created] Failed to process subscription creation', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_SUB_CREATED }
);

export const paymentSubscriptionRenewedConsumer = createConsumer(
    'payment.subscription.renewed',
    async (payload: PayloadOf<'payment.subscription.renewed'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.SUBSCRIPTION_RENEWED,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        planName: 'CodeZeniths Pro',
                        amount: '$9.99',
                        nextBillingDate: payload.expiryDate,
                        theme: userCtx.theme,
                    }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[payment:sub_renewed] Failed to process subscription renewal', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_SUB_RENEWED }
);

export const paymentSubscriptionCancelledConsumer = createConsumer(
    'payment.subscription.cancelled',
    async (payload: PayloadOf<'payment.subscription.cancelled'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.SUBSCRIPTION_CANCELLED,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        planName: 'CodeZeniths Pro',
                        expiryDate: 'End of current billing cycle',
                        theme: userCtx.theme,
                    }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[payment:sub_cancelled] Failed to process subscription cancellation', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_SUB_CANCELLED }
);

export const paymentSubscriptionExpiredConsumer = createConsumer(
    'payment.subscription.expired',
    async (payload: PayloadOf<'payment.subscription.expired'>, context: MessageContext) => {
        try {
            const userCtx = await getUserEmailContext(payload.userId);
            if (userCtx.email) {
                await mailService.sendTemplatedEmail(
                    MailTemplate.SUBSCRIPTION_EXPIRED,
                    userCtx.email,
                    {
                        name: userCtx.name || 'Developer',
                        planName: 'CodeZeniths Pro',
                        theme: userCtx.theme,
                    }
                );
            }
            context.ack();
        } catch (error) {
            logger.error('[payment:sub_expired] Failed to process subscription expiration', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.PAYMENT_SUB_EXPIRED }
);

/**
 * Starts all Payment domain consumers.
 */
export async function startPaymentConsumers(): Promise<void> {
    await Promise.all([
        paymentWebhookProcessorConsumer.start(),
        paymentCheckoutConsumer.start(),
        paymentConfirmedConsumer.start(),
        paymentFailedConsumer.start(),
        paymentRetryConsumer.start(),
        paymentRefundConsumer.start(),
        paymentSubscriptionCreatedConsumer.start(),
        paymentSubscriptionRenewedConsumer.start(),
        paymentSubscriptionCancelledConsumer.start(),
        paymentSubscriptionExpiredConsumer.start(),
    ]);
    logger.info('[payment:consumers] All 10 Payment consumers initialized successfully.');
}
