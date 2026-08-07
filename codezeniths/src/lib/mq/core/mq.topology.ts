import type { Channel, ExchangeConfig, QueueConfig, BindingConfig, ExchangeType } from '../shared/mq.types';
import { mqConnectionManager } from './mq.connection';
import { logger } from '@/service/logging';
import { MqExchange, MqQueue, MqRoutingKey } from '../shared/mq.types';

/**
 * Validates the routing key format against exchange type rules.
 */
export function validateRoutingKey(type: ExchangeType, routingKey: string): void {
    if (type === 'direct') {
        if (!routingKey || routingKey.includes('*') || routingKey.includes('#')) {
            throw new Error(`[mq] Invalid direct exchange routing key: "${routingKey}"`);
        }
    }
    // fanout: routing key is ignored (no validation needed)
    // topic: any non-empty string is valid
    if (type === 'topic' && (!routingKey || !routingKey.trim())) {
        throw new Error(`[mq] Topic exchange routing key cannot be empty`);
    }
}

export class TopologyBuilder {
    private readonly exchanges: ExchangeConfig[] = [];
    private readonly queues: QueueConfig[] = [];
    private readonly bindings: BindingConfig[] = [];

    /**
     * Composes an exchange declaration.
     */
    exchange(name: string, type: ExchangeType, options?: ExchangeConfig['options']): this {
        this.exchanges.push({ name, type, options });
        return this;
    }

    /**
     * Composes a queue declaration with parameters like DLX, TTL, and limits.
     */
    queue(name: string, options?: QueueConfig['options']): this {
        this.queues.push({ name, options });
        return this;
    }

    /**
     * Binds a queue to an exchange with a routing key.
     */
    bind(queue: string, exchange: string, routingKey: string, customArgs?: Record<string, unknown>): this {
        this.bindings.push({ queue, exchange, routingKey, arguments: customArgs });
        return this;
    }

    /**
     * Asserts the composed topology on the given channel.
     */
    async assert(channel: Channel): Promise<void> {
        // 1. Assert all exchanges
        for (const ex of this.exchanges) {
            await channel.assertExchange(ex.name, ex.type, ex.options);
        }

        // 2. Assert all queues
        for (const q of this.queues) {
            const amqpArgs: Record<string, unknown> = { ...(q.options?.arguments || {}) };

            if (q.options?.deadLetterExchange) {
                amqpArgs['x-dead-letter-exchange'] = q.options.deadLetterExchange;
            }
            if (q.options?.deadLetterRoutingKey) {
                amqpArgs['x-dead-letter-routing-key'] = q.options.deadLetterRoutingKey;
            }
            if (q.options?.messageTtl !== undefined) {
                amqpArgs['x-message-ttl'] = q.options.messageTtl;
            }
            if (q.options?.maxLength !== undefined) {
                amqpArgs['x-max-length'] = q.options.maxLength;
            }
            if (q.options?.overflow) {
                amqpArgs['x-overflow'] = q.options.overflow;
            }

            const cleanOptions = { ...q.options };
            delete cleanOptions.deadLetterExchange;
            delete cleanOptions.deadLetterRoutingKey;
            delete cleanOptions.messageTtl;
            delete cleanOptions.maxLength;
            delete cleanOptions.overflow;

            await channel.assertQueue(q.name, {
                ...cleanOptions,
                arguments: Object.keys(amqpArgs).length > 0 ? amqpArgs : undefined,
            });
        }

        // 3. Assert all bindings
        for (const b of this.bindings) {
            const ex = this.exchanges.find((e) => e.name === b.exchange);
            if (ex) {
                validateRoutingKey(ex.type, b.routingKey);
                let bindingArgs = b.arguments;
                if (ex.type === 'headers') {
                    bindingArgs = { 'x-match': 'all', ...(b.arguments as Record<string, unknown> || {}) };
                }
                await channel.bindQueue(b.queue, b.exchange, b.routingKey, bindingArgs);
            } else {
                await channel.bindQueue(b.queue, b.exchange, b.routingKey, b.arguments);
            }
        }
    }
}

/**
 * Bootstraps the RabbitMQ topology by creating a temporary channel,
 * asserting all exchanges, queues, and bindings, and then closing the channel.
 */
export async function bootstrapTopology(builder: TopologyBuilder): Promise<void> {
    try {
        logger.info('[mq:topology] Bootstrapping RabbitMQ topology...');
        const channel = await mqConnectionManager.createChannel();
        await builder.assert(channel);
        await channel.close();
        logger.info('[mq:topology] RabbitMQ topology bootstrapped successfully.');
    } catch (err) {
        logger.error('[mq:topology] Failed to bootstrap topology', err);
        throw err;
    }
}

export interface RetryTopologyOptions {
    mainQueue: string;
    mainExchange?: string;
    mainRoutingKey?: string;
    deadLetterExchange?: string;
    deadLetterRoutingKey?: string;
    retryQueue?: string;
    delayMs: number;
}

/**
 * Composes a TopologyBuilder configured for the "retry queue + DLX" loop pattern:
 * failed message (in mainQueue) -> DLX -> retryQueue (with TTL) -> back to mainExchange (mainQueue).
 */
export function createRetryTopology(options: RetryTopologyOptions): TopologyBuilder {
    const mainQueue = options.mainQueue;
    const mainExchange = options.mainExchange ?? '';
    const mainRoutingKey = options.mainRoutingKey ?? mainQueue;
    
    const dlx = options.deadLetterExchange ?? `${mainQueue}.dlx`;
    const dlxRoutingKey = options.deadLetterRoutingKey ?? `${mainQueue}.retry`;
    const retryQueue = options.retryQueue ?? `${mainQueue}.retry-delay`;
    
    return new TopologyBuilder()
        .exchange(dlx, 'direct', { durable: true })
        .queue(mainQueue, {
            durable: true,
            deadLetterExchange: dlx,
            deadLetterRoutingKey: dlxRoutingKey,
        })
        .queue(retryQueue, {
            durable: true,
            messageTtl: options.delayMs,
            deadLetterExchange: mainExchange,
            deadLetterRoutingKey: mainRoutingKey,
        })
        .bind(retryQueue, dlx, dlxRoutingKey);
}

export { createRetryTopology as setupRetryTopology };

/**
 * Builds the complete CodeZeniths RabbitMQ topology.
 */
export function buildCodeZenithsTopology(): TopologyBuilder {
    const builder = new TopologyBuilder();

    // 1. Declare all exchanges
    builder.exchange(MqExchange.AUTH, 'direct', { durable: true });
    builder.exchange(MqExchange.NOTIFICATION, 'fanout', { durable: true });
    builder.exchange(MqExchange.PROGRESS, 'topic', { durable: true });
    builder.exchange(MqExchange.PAYMENT, 'direct', { durable: true });
    builder.exchange(MqExchange.MEDIA, 'topic', { durable: true });
    builder.exchange(MqExchange.CONTENT, 'fanout', { durable: true });

    // DLX exchanges
    builder.exchange(MqExchange.AUTH_DLX, 'direct', { durable: true });
    builder.exchange(MqExchange.PAYMENT_DLX, 'direct', { durable: true });
    builder.exchange(MqExchange.MEDIA_DLX, 'direct', { durable: true });

    // 2. Declare all queues and bind them

    // ── Email Queues ──
    const emailQueues = [
        MqQueue.EMAIL_WELCOME,
        MqQueue.EMAIL_VERIFY,
        MqQueue.EMAIL_OTP,
        MqQueue.EMAIL_MAGIC_LINK,
        MqQueue.EMAIL_RESET_PASSWORD,
        MqQueue.EMAIL_NEW_DEVICE,
        MqQueue.EMAIL_OAUTH_LOGIN,
        MqQueue.EMAIL_PASSWORD_CHANGED,
        MqQueue.EMAIL_SESSION_REVOKED,
        MqQueue.EMAIL_ACCOUNT_DEACTIVATED,
        MqQueue.EMAIL_ACCOUNT_REACTIVATED,
        MqQueue.EMAIL_WEEKLY_DIGEST,
        MqQueue.EMAIL_STREAK_MILESTONE,
        MqQueue.EMAIL_SUBSCRIPTION_CONFIRMED,
        MqQueue.EMAIL_SUBSCRIPTION_CANCELLED,
        MqQueue.EMAIL_PAYMENT_FAILED,
        MqQueue.EMAIL_PAYMENT_RECEIPT,
        MqQueue.EMAIL_ADMIN_BROADCAST,
    ];

    for (const q of emailQueues) {
        builder.queue(q, {
            durable: true,
            deadLetterExchange: MqExchange.AUTH_DLX,
            deadLetterRoutingKey: MqQueue.DLQ_EMAIL,
        });
    }

    // Bind email queues to auth.direct
    builder.bind(MqQueue.EMAIL_WELCOME, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_WELCOME);
    builder.bind(MqQueue.EMAIL_VERIFY, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_VERIFY);
    builder.bind(MqQueue.EMAIL_OTP, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_OTP);
    builder.bind(MqQueue.EMAIL_MAGIC_LINK, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_MAGIC_LINK);
    builder.bind(MqQueue.EMAIL_RESET_PASSWORD, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_RESET_PASSWORD);
    builder.bind(MqQueue.EMAIL_NEW_DEVICE, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_NEW_DEVICE);
    builder.bind(MqQueue.EMAIL_OAUTH_LOGIN, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_OAUTH_LOGIN);
    builder.bind(MqQueue.EMAIL_PASSWORD_CHANGED, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_PASSWORD_CHANGED);
    builder.bind(MqQueue.EMAIL_SESSION_REVOKED, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_SESSION_REVOKED);
    builder.bind(MqQueue.EMAIL_ACCOUNT_DEACTIVATED, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_ACCOUNT_DEACTIVATED);
    builder.bind(MqQueue.EMAIL_ACCOUNT_REACTIVATED, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_ACCOUNT_REACTIVATED);

    // Bind notification email queues to notification.fanout
    builder.bind(MqQueue.EMAIL_PAYMENT_FAILED, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.EMAIL_ADMIN_BROADCAST, MqExchange.NOTIFICATION, '');

    // Bind content email queues to content.fanout
    builder.bind(MqQueue.EMAIL_WEEKLY_DIGEST, MqExchange.CONTENT, '');

    // ── SMS Queues ──
    const smsQueues = [
        MqQueue.SMS_OTP,
        MqQueue.SMS_MAGIC_LINK,
        MqQueue.SMS_NEW_DEVICE,
        MqQueue.SMS_PAYMENT_FAILED,
        MqQueue.SMS_SUBSCRIPTION_RENEWAL,
        MqQueue.SMS_ACCOUNT_LOCKED,
        MqQueue.SMS_PASSWORDLESS_CREDENTIALS,
    ];
    for (const q of smsQueues) {
        builder.queue(q, {
            durable: true,
            deadLetterExchange: MqExchange.AUTH_DLX,
            deadLetterRoutingKey: MqQueue.DLQ_SMS,
        });
    }
    builder.bind(MqQueue.SMS_OTP, MqExchange.AUTH, MqRoutingKey.AUTH_SMS_OTP);
    builder.bind(MqQueue.SMS_MAGIC_LINK, MqExchange.AUTH, MqRoutingKey.AUTH_SMS_MAGIC_LINK);
    builder.bind(MqQueue.SMS_NEW_DEVICE, MqExchange.AUTH, MqRoutingKey.AUTH_SMS_NEW_DEVICE);
    builder.bind(MqQueue.SMS_ACCOUNT_LOCKED, MqExchange.AUTH, MqRoutingKey.AUTH_SMS_ACCOUNT_LOCKED);
    builder.bind(MqQueue.SMS_PAYMENT_FAILED, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.SMS_PASSWORDLESS_CREDENTIALS, MqExchange.AUTH, MqRoutingKey.AUTH_SMS_PASSWORDLESS_CREDENTIALS);

    // ── Passwordless Credentials Email Queue (DLX-backed) ──
    builder.queue(MqQueue.EMAIL_PASSWORDLESS_CREDENTIALS, {
        durable: true,
        deadLetterExchange: MqExchange.AUTH_DLX,
        deadLetterRoutingKey: MqQueue.DLQ_EMAIL,
    });
    builder.bind(MqQueue.EMAIL_PASSWORDLESS_CREDENTIALS, MqExchange.AUTH, MqRoutingKey.AUTH_EMAIL_PASSWORDLESS_CREDENTIALS);

    // ── Push Notification Queues ──
    const pushQueues = [
        MqQueue.PUSH_LOGIN,
        MqQueue.PUSH_NEW_DEVICE,
        MqQueue.PUSH_STREAK_REMINDER,
        MqQueue.PUSH_PROBLEM_SOLVED,
        MqQueue.PUSH_MODULE_MASTERED,
        MqQueue.PUSH_NEW_CONTENT,
        MqQueue.PUSH_PAYMENT_SUCCESS,
        MqQueue.PUSH_PAYMENT_FAILED,
        MqQueue.PUSH_ADMIN_ANNOUNCEMENT,
    ];
    for (const q of pushQueues) {
        builder.queue(q, { durable: true });
    }
    builder.bind(MqQueue.PUSH_LOGIN, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.PUSH_NEW_DEVICE, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.PUSH_ADMIN_ANNOUNCEMENT, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.PUSH_PAYMENT_FAILED, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.PUSH_NEW_CONTENT, MqExchange.CONTENT, '');
    builder.bind(MqQueue.PUSH_PROBLEM_SOLVED, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_ANY_SOLVED);
    builder.bind(MqQueue.PUSH_MODULE_MASTERED, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_ANY_MASTERED);

    // ── In-App Notification Queues ──
    const inAppQueues = [
        MqQueue.INAPP_LOGIN,
        MqQueue.INAPP_PROBLEM_SOLVED,
        MqQueue.INAPP_STREAK_MILESTONE,
        MqQueue.INAPP_NEW_CONTENT,
        MqQueue.INAPP_PROFILE_INCOMPLETE,
        MqQueue.INAPP_SUBSCRIPTION_STATUS,
        MqQueue.INAPP_PAYMENT,
        MqQueue.INAPP_ADMIN_BROADCAST,
        MqQueue.INAPP_SESSION_EXPIRED,
    ];
    for (const q of inAppQueues) {
        builder.queue(q, { durable: true });
    }
    builder.bind(MqQueue.INAPP_LOGIN, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.INAPP_ADMIN_BROADCAST, MqExchange.NOTIFICATION, '');
    builder.bind(MqQueue.INAPP_NEW_CONTENT, MqExchange.CONTENT, '');
    builder.bind(MqQueue.INAPP_PROBLEM_SOLVED, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_ANY_SOLVED);

    // ── Payment Queues ──
    const paymentQueues = [
        MqQueue.PAYMENT_WEBHOOK_PROCESSOR,
        MqQueue.PAYMENT_CHECKOUT,
        MqQueue.PAYMENT_CONFIRMED,
        MqQueue.PAYMENT_FAILED,
        MqQueue.PAYMENT_RETRY,
        MqQueue.PAYMENT_REFUND,
        MqQueue.PAYMENT_SUB_CREATED,
        MqQueue.PAYMENT_SUB_RENEWED,
        MqQueue.PAYMENT_SUB_CANCELLED,
        MqQueue.PAYMENT_SUB_EXPIRED,
    ];
    for (const q of paymentQueues) {
        builder.queue(q, {
            durable: true,
            deadLetterExchange: MqExchange.PAYMENT_DLX,
            deadLetterRoutingKey: q === MqQueue.PAYMENT_WEBHOOK_PROCESSOR ? MqQueue.DLQ_PAYMENT_WEBHOOK : MqQueue.DLQ_PAYMENT,
        });
    }
    builder.bind(MqQueue.PAYMENT_WEBHOOK_PROCESSOR, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_WEBHOOK_INGESTED);
    builder.bind(MqQueue.PAYMENT_CHECKOUT, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_CHECKOUT_INITIATED);
    builder.bind(MqQueue.PAYMENT_CONFIRMED, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_CONFIRMED);
    builder.bind(MqQueue.PAYMENT_FAILED, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_FAILED);
    builder.bind(MqQueue.PAYMENT_RETRY, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_RETRY);
    builder.bind(MqQueue.PAYMENT_REFUND, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_REFUND);
    builder.bind(MqQueue.PAYMENT_SUB_CREATED, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_SUB_CREATED);
    builder.bind(MqQueue.PAYMENT_SUB_RENEWED, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_SUB_RENEWED);
    builder.bind(MqQueue.PAYMENT_SUB_CANCELLED, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_SUB_CANCELLED);
    builder.bind(MqQueue.PAYMENT_SUB_EXPIRED, MqExchange.PAYMENT, MqRoutingKey.PAYMENT_SUB_EXPIRED);

    // ── Media Queues ──
    const mediaQueues = [
        MqQueue.MEDIA_AVATAR_PROCESS,
        MqQueue.MEDIA_AVATAR_REFRESH_URL,
        MqQueue.MEDIA_CONTENT_PROCESS,
        MqQueue.MEDIA_ALERT,
        MqQueue.MEDIA_AUDIT,
    ];
    for (const q of mediaQueues) {
        builder.queue(q, {
            durable: true,
            deadLetterExchange: MqExchange.MEDIA_DLX,
            deadLetterRoutingKey: MqQueue.DLQ_MEDIA,
        });
    }
    builder.bind(MqQueue.MEDIA_AVATAR_PROCESS, MqExchange.MEDIA, MqRoutingKey.MEDIA_AVATAR_UPLOAD);
    builder.bind(MqQueue.MEDIA_AVATAR_PROCESS, MqExchange.MEDIA, MqRoutingKey.MEDIA_AVATAR_REPLACE);
    builder.bind(MqQueue.MEDIA_AVATAR_REFRESH_URL, MqExchange.MEDIA, MqRoutingKey.MEDIA_AVATAR_URL_EXPIRY);
    builder.bind(MqQueue.MEDIA_CONTENT_PROCESS, MqExchange.MEDIA, MqRoutingKey.MEDIA_CONTENT_UPLOAD);
    builder.bind(MqQueue.MEDIA_ALERT, MqExchange.MEDIA, MqRoutingKey.MEDIA_ANY_UPLOAD_FAILED);

    // ── Progress Queues ──
    const progressQueues = [
        MqQueue.PROGRESS_GAMIFICATION,
        MqQueue.PROGRESS_STREAK,
        MqQueue.PROGRESS_EMAIL_MILESTONE,
        MqQueue.PROGRESS_ANALYTICS,
        MqQueue.PROGRESS_PUSH_REMINDER,
    ];
    for (const q of progressQueues) {
        builder.queue(q, { durable: true });
    }
    builder.bind(MqQueue.PROGRESS_GAMIFICATION, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_ALL);
    builder.bind(MqQueue.PROGRESS_STREAK, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_ANY_SOLVED);
    builder.bind(MqQueue.PROGRESS_ANALYTICS, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_ALL);

    // ── Content Queues ──
    const contentQueues = [
        MqQueue.CONTENT_PUSH,
        MqQueue.CONTENT_INAPP,
        MqQueue.CONTENT_EMAIL,
        MqQueue.CONTENT_ADMIN_IMPORT,
    ];
    for (const q of contentQueues) {
        builder.queue(q, { durable: true });
    }
    builder.bind(MqQueue.CONTENT_PUSH, MqExchange.CONTENT, '');
    builder.bind(MqQueue.CONTENT_INAPP, MqExchange.CONTENT, '');
    builder.bind(MqQueue.CONTENT_EMAIL, MqExchange.CONTENT, '');

    // ── Cron Queues ──
    builder.queue(MqQueue.CRON_WEEKLY_DIGEST, { durable: true });
    builder.queue(MqQueue.CRON_SESSION_CLEANUP, { durable: true });
    builder.queue(MqQueue.CRON_AVATAR_URL_REFRESH, { durable: true });

    // ── Audit Queue ──
    builder.queue(MqQueue.AUDIT_LOG, { durable: true });

    // ── Dead Letter Queues (DLQs) ──
    builder.queue(MqQueue.DLQ_EMAIL, { durable: true });
    builder.queue(MqQueue.DLQ_SMS, { durable: true });
    builder.queue(MqQueue.DLQ_PAYMENT, { durable: true });
    builder.queue(MqQueue.DLQ_PAYMENT_WEBHOOK, { durable: true });
    builder.queue(MqQueue.DLQ_MEDIA, { durable: true });

    // Bind DLQs to their DLX
    builder.bind(MqQueue.DLQ_EMAIL, MqExchange.AUTH_DLX, MqQueue.DLQ_EMAIL);
    builder.bind(MqQueue.DLQ_SMS, MqExchange.AUTH_DLX, MqQueue.DLQ_SMS);
    builder.bind(MqQueue.DLQ_PAYMENT, MqExchange.PAYMENT_DLX, MqQueue.DLQ_PAYMENT);
    builder.bind(MqQueue.DLQ_PAYMENT_WEBHOOK, MqExchange.PAYMENT_DLX, MqQueue.DLQ_PAYMENT_WEBHOOK);
    builder.bind(MqQueue.DLQ_MEDIA, MqExchange.MEDIA_DLX, MqQueue.DLQ_MEDIA);

    // ── Retry delay queues (TTL bounce-back) ──
    builder.queue(MqQueue.RETRY_PAYMENT, {
        durable: true,
        messageTtl: 10000, // 10s retry delay
        deadLetterExchange: MqExchange.PAYMENT,
        deadLetterRoutingKey: MqRoutingKey.PAYMENT_RETRY,
    });
    builder.bind(MqQueue.RETRY_PAYMENT, MqExchange.PAYMENT_DLX, MqQueue.RETRY_PAYMENT);

    builder.queue(MqQueue.RETRY_EMAIL, {
        durable: true,
        messageTtl: 5000, // 5s retry delay
        deadLetterExchange: MqExchange.AUTH,
        deadLetterRoutingKey: MqRoutingKey.AUTH_EMAIL_WELCOME,
    });
    builder.bind(MqQueue.RETRY_EMAIL, MqExchange.AUTH_DLX, MqQueue.RETRY_EMAIL);

    return builder;
}
