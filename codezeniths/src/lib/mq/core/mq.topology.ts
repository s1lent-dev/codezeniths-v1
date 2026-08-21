/**
 * @file mq.topology.ts
 * @description Declares all RabbitMQ exchanges, queues, and bindings.
 *
 * Design principles:
 *   - assertExchange and assertQueue are ALWAYS idempotent when called with the
 *     same arguments. The ONLY thing that causes 406 PRECONDITION_FAILED is
 *     calling assertQueue with DIFFERENT x-arguments on an existing queue.
 *   - Solution: declare all queues as plain { durable: true } — no x-dead-letter
 *     arguments. This makes every assertion unconditionally idempotent.
 *   - Dead-letter routing (if needed) can be configured via CloudAMQP policy UI
 *     without touching queue arguments at all.
 */

import amqp from 'amqplib';
import { mqConnectionManager } from './mq.connection';
import { logger } from '@/service/logging';
import { MqExchange, MqQueue, MqRoutingKey } from '../shared/mq.types';

const DURABLE = { durable: true } as const;

/**
 * Asserts the full 6-domain topology on the given channel.
 * Safe to call multiple times — every assertion is idempotent.
 */
export async function assertTopology(channel: amqp.Channel): Promise<void> {

    // ── Exchanges ─────────────────────────────────────────────────────────
    await channel.assertExchange(MqExchange.AUTH,         'direct',  DURABLE);
    await channel.assertExchange(MqExchange.PAYMENT,      'direct',  DURABLE);
    await channel.assertExchange(MqExchange.PROGRESS,     'topic',   DURABLE);
    await channel.assertExchange(MqExchange.SOCIAL,       'topic',   DURABLE);
    await channel.assertExchange(MqExchange.NOTIFICATION, 'fanout',  DURABLE);
    await channel.assertExchange(MqExchange.SEARCH,       'direct',  DURABLE);

    // DLX exchanges (plain — queue-arg wiring is done via CloudAMQP policy)
    await channel.assertExchange(MqExchange.AUTH_DLX,         'fanout', DURABLE);
    await channel.assertExchange(MqExchange.PAYMENT_DLX,      'fanout', DURABLE);
    await channel.assertExchange(MqExchange.PROGRESS_DLX,     'fanout', DURABLE);
    await channel.assertExchange(MqExchange.NOTIFICATION_DLX, 'fanout', DURABLE);

    // ── Dead-letter queues ────────────────────────────────────────────────
    await channel.assertQueue(MqQueue.DLQ_AUTH,         DURABLE);
    await channel.assertQueue(MqQueue.DLQ_PAYMENT,      DURABLE);
    await channel.assertQueue(MqQueue.DLQ_PROGRESS,     DURABLE);
    await channel.assertQueue(MqQueue.DLQ_NOTIFICATION, DURABLE);

    await channel.bindQueue(MqQueue.DLQ_AUTH,         MqExchange.AUTH_DLX,         '');
    await channel.bindQueue(MqQueue.DLQ_PAYMENT,      MqExchange.PAYMENT_DLX,      '');
    await channel.bindQueue(MqQueue.DLQ_PROGRESS,     MqExchange.PROGRESS_DLX,     '');
    await channel.bindQueue(MqQueue.DLQ_NOTIFICATION, MqExchange.NOTIFICATION_DLX, '');

    // ── Auth queues ───────────────────────────────────────────────────────
    const authQueues: [string, string][] = [
        [MqQueue.AUTH_EMAIL_WELCOME,               MqRoutingKey.AUTH_EMAIL_WELCOME],
        [MqQueue.AUTH_EMAIL_VERIFY,                MqRoutingKey.AUTH_EMAIL_VERIFY],
        [MqQueue.AUTH_EMAIL_OTP,                   MqRoutingKey.AUTH_EMAIL_OTP],
        [MqQueue.AUTH_EMAIL_MAGIC_LINK,            MqRoutingKey.AUTH_EMAIL_MAGIC_LINK],
        [MqQueue.AUTH_EMAIL_RESET_PASSWORD,        MqRoutingKey.AUTH_EMAIL_RESET_PASSWORD],
        [MqQueue.AUTH_EMAIL_NEW_DEVICE,            MqRoutingKey.AUTH_EMAIL_NEW_DEVICE],
        [MqQueue.AUTH_EMAIL_OAUTH_LOGIN,           MqRoutingKey.AUTH_EMAIL_OAUTH_LOGIN],
        [MqQueue.AUTH_EMAIL_PASSWORD_CHANGED,      MqRoutingKey.AUTH_EMAIL_PASSWORD_CHANGED],
        [MqQueue.AUTH_EMAIL_SESSION_REVOKED,       MqRoutingKey.AUTH_EMAIL_SESSION_REVOKED],
        [MqQueue.AUTH_EMAIL_ACCOUNT_DEACTIVATED,   MqRoutingKey.AUTH_EMAIL_ACCOUNT_DEACTIVATED],
        [MqQueue.AUTH_EMAIL_ACCOUNT_REACTIVATED,   MqRoutingKey.AUTH_EMAIL_ACCOUNT_REACTIVATED],
        [MqQueue.AUTH_EMAIL_PASSWORDLESS_CREDENTIALS, MqRoutingKey.AUTH_EMAIL_PASSWORDLESS_CREDENTIALS],
        [MqQueue.AUTH_SMS_OTP,                     MqRoutingKey.AUTH_SMS_OTP],
        [MqQueue.AUTH_SMS_MAGIC_LINK,              MqRoutingKey.AUTH_SMS_MAGIC_LINK],
        [MqQueue.AUTH_SMS_PASSWORDLESS_CREDENTIALS, MqRoutingKey.AUTH_SMS_PASSWORDLESS_CREDENTIALS],
        [MqQueue.AUTH_SMS_NEW_DEVICE,              MqRoutingKey.AUTH_SMS_NEW_DEVICE],
        [MqQueue.AUTH_SMS_ACCOUNT_LOCKED,          MqRoutingKey.AUTH_SMS_ACCOUNT_LOCKED],
    ];
    for (const [q, rk] of authQueues) {
        await channel.assertQueue(q, DURABLE);
        await channel.bindQueue(q, MqExchange.AUTH, rk);
    }

    // ── Payment queues ────────────────────────────────────────────────────
    const paymentQueues: [string, string][] = [
        [MqQueue.PAYMENT_WEBHOOK_PROCESSOR, MqRoutingKey.PAYMENT_WEBHOOK_INGESTED],
        [MqQueue.PAYMENT_CHECKOUT,          MqRoutingKey.PAYMENT_CHECKOUT_INITIATED],
        [MqQueue.PAYMENT_CONFIRMED,         MqRoutingKey.PAYMENT_CONFIRMED],
        [MqQueue.PAYMENT_FAILED,            MqRoutingKey.PAYMENT_FAILED],
        [MqQueue.PAYMENT_RETRY,             MqRoutingKey.PAYMENT_RETRY],
        [MqQueue.PAYMENT_REFUND,            MqRoutingKey.PAYMENT_REFUND],
        [MqQueue.PAYMENT_SUB_CREATED,       MqRoutingKey.PAYMENT_SUB_CREATED],
        [MqQueue.PAYMENT_SUB_RENEWED,       MqRoutingKey.PAYMENT_SUB_RENEWED],
        [MqQueue.PAYMENT_SUB_CANCELLED,     MqRoutingKey.PAYMENT_SUB_CANCELLED],
        [MqQueue.PAYMENT_SUB_EXPIRED,       MqRoutingKey.PAYMENT_SUB_EXPIRED],
    ];
    for (const [q, rk] of paymentQueues) {
        await channel.assertQueue(q, DURABLE);
        await channel.bindQueue(q, MqExchange.PAYMENT, rk);
    }

    // ── Progress queues (topic exchange — declare once, bind to multiple patterns) ──
    await channel.assertQueue(MqQueue.PROGRESS_PROBLEM_SOLVED,   DURABLE);
    await channel.assertQueue(MqQueue.PROGRESS_PROBLEM_UNSOLVED, DURABLE);
    await channel.assertQueue(MqQueue.PROGRESS_MODULE_MASTERED,  DURABLE);
    await channel.assertQueue(MqQueue.PROGRESS_STREAK_MILESTONE, DURABLE);
    await channel.assertQueue(MqQueue.PROGRESS_WEEKLY_DIGEST,    DURABLE);
    await channel.assertQueue(MqQueue.PROGRESS_RANK_PROMOTED,    DURABLE);

    // Exact bindings — each queue receives only its own routing key
    await channel.bindQueue(MqQueue.PROGRESS_PROBLEM_SOLVED,   MqExchange.PROGRESS, MqRoutingKey.PROGRESS_PROBLEM_SOLVED);
    await channel.bindQueue(MqQueue.PROGRESS_PROBLEM_UNSOLVED, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_PROBLEM_UNSOLVED);
    await channel.bindQueue(MqQueue.PROGRESS_MODULE_MASTERED,  MqExchange.PROGRESS, MqRoutingKey.PROGRESS_MODULE_MASTERED);
    await channel.bindQueue(MqQueue.PROGRESS_STREAK_MILESTONE, MqExchange.PROGRESS, MqRoutingKey.PROGRESS_STREAK_MILESTONE);
    await channel.bindQueue(MqQueue.PROGRESS_WEEKLY_DIGEST,    MqExchange.PROGRESS, MqRoutingKey.PROGRESS_WEEKLY_DIGEST);
    await channel.bindQueue(MqQueue.PROGRESS_RANK_PROMOTED,    MqExchange.PROGRESS, MqRoutingKey.PROGRESS_RANK_PROMOTED);

    // ── Social queues ─────────────────────────────────────────────────────
    const socialQueues: [string, string][] = [
        [MqQueue.SOCIAL_USER_FOLLOWED,       MqRoutingKey.SOCIAL_USER_FOLLOWED],
        [MqQueue.SOCIAL_PROFILE_VIEWED,      MqRoutingKey.SOCIAL_PROFILE_VIEWED],
        [MqQueue.SOCIAL_PLAYLIST_INTERACTED, MqRoutingKey.SOCIAL_PLAYLIST_INTERACTED],
    ];
    for (const [q, rk] of socialQueues) {
        await channel.assertQueue(q, DURABLE);
        await channel.bindQueue(q, MqExchange.SOCIAL, rk);
    }

    // ── Notification queues (fanout — routing key ignored by broker) ───────
    const notificationQueues = [
        MqQueue.NOTIFICATION_INAPP,
        MqQueue.NOTIFICATION_PUSH,
        MqQueue.NOTIFICATION_ADMIN_BROADCAST,
        MqQueue.NOTIFICATION_USER_LOGIN,
        MqQueue.NOTIFICATION_NEW_DEVICE,
    ];
    for (const q of notificationQueues) {
        await channel.assertQueue(q, DURABLE);
        await channel.bindQueue(q, MqExchange.NOTIFICATION, '');
    }

    // ── Search queues ─────────────────────────────────────────────────────
    const searchQueues: [string, string][] = [
        [MqQueue.SEARCH_USER_INDEX,     MqRoutingKey.SEARCH_USER_INDEX],
        [MqQueue.SEARCH_HISTORY_RECORD, MqRoutingKey.SEARCH_HISTORY_RECORD],
    ];
    for (const [q, rk] of searchQueues) {
        await channel.assertQueue(q, DURABLE);
        await channel.bindQueue(q, MqExchange.SEARCH, rk);
    }
}

/**
 * Asserts the full topology on a fresh channel, then closes that channel.
 * Called once at startup from mq.bootstrap.ts.
 */
export async function bootstrapTopology(): Promise<void> {
    logger.info('[mq:topology] Asserting topology...');
    const channel = await mqConnectionManager.createChannel();
    try {
        await assertTopology(channel);
        logger.info('[mq:topology] Topology asserted successfully.');
    } finally {
        try { await channel.close(); } catch { /* ignore */ }
    }
}
