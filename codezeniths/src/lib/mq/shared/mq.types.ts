/**
 * @file mq.types.ts
 * @description Central AMQP types, topologies, exchanges, queues, and routing keys for CodeZeniths MQ.
 */

import type { Options, Channel, ConfirmChannel, Message, ConsumeMessage } from 'amqplib';

export type { Options, Channel, ConfirmChannel, Message, ConsumeMessage };

export type ExchangeType = 'direct' | 'fanout' | 'topic' | 'headers';

export interface PublishOptions extends Options.Publish {
    /** Per-message TTL in milliseconds (sets RabbitMQ expiration option) */
    expiration?: string | number;
}

export interface MessageContext {
    fields: {
        deliveryTag: number;
        redelivered: boolean;
        exchange: string;
        routingKey: string;
    };
    properties: {
        contentType?: string;
        contentEncoding?: string;
        headers: Record<string, any>;
        deliveryMode?: number;
        priority?: number;
        correlationId?: string;
        replyTo?: string;
        expiration?: string;
        messageId?: string;
        timestamp?: number;
        type?: string;
        userId?: string;
        appId?: string;
        clusterId?: string;
    };
    ack(): void;
    nack(requeue?: boolean): void;
    reject(requeue?: boolean): void;
}

export interface Serializer<T> {
    serialize(data: T): Buffer;
    deserialize(buffer: Buffer): T;
}

/**
 * Pluggable backoff policy interface for consumer failures
 */
export interface BackoffStrategy {
    getDelay(retryCount: number): number;
}

export type MiddlewareNext = () => Promise<void>;

export type ConsumerMiddleware<T> = (
    payload: T,
    context: MessageContext,
    next: MiddlewareNext
) => Promise<void> | void;

// ── Exchanges ──
export const MqExchange = {
    AUTH: 'auth.direct',
    PAYMENT: 'payment.direct',
    PROGRESS: 'progress.topic',
    SOCIAL: 'social.topic',
    NOTIFICATION: 'notification.fanout',
    SEARCH: 'search.direct',

    // Dead letter exchanges
    AUTH_DLX: 'auth.dlx',
    PAYMENT_DLX: 'payment.dlx',
    PROGRESS_DLX: 'progress.dlx',
    NOTIFICATION_DLX: 'notification.dlx',
} as const;

export type MqExchange = (typeof MqExchange)[keyof typeof MqExchange];

// ── Queues ──
export const MqQueue = {
    // ── Auth Queues ───────────────────────────────────────────────
    AUTH_EMAIL_WELCOME:             'q.auth.email.welcome',
    AUTH_EMAIL_VERIFY:              'q.auth.email.verify',
    AUTH_EMAIL_OTP:                 'q.auth.email.otp',
    AUTH_EMAIL_MAGIC_LINK:          'q.auth.email.magic_link',
    AUTH_EMAIL_RESET_PASSWORD:      'q.auth.email.reset_password',
    AUTH_EMAIL_NEW_DEVICE:          'q.auth.email.new_device',
    AUTH_EMAIL_OAUTH_LOGIN:         'q.auth.email.oauth_login',
    AUTH_EMAIL_PASSWORD_CHANGED:    'q.auth.email.password_changed',
    AUTH_EMAIL_SESSION_REVOKED:     'q.auth.email.session_revoked',
    AUTH_EMAIL_ACCOUNT_DEACTIVATED: 'q.auth.email.account_deactivated',
    AUTH_EMAIL_ACCOUNT_REACTIVATED: 'q.auth.email.account_reactivated',
    AUTH_EMAIL_PASSWORDLESS_CREDENTIALS: 'q.auth.email.passwordless_credentials',
    AUTH_SMS_OTP:                   'q.auth.sms.otp',
    AUTH_SMS_MAGIC_LINK:            'q.auth.sms.magic_link',
    AUTH_SMS_PASSWORDLESS_CREDENTIALS: 'q.auth.sms.passwordless_credentials',
    AUTH_SMS_NEW_DEVICE:            'q.auth.sms.new_device',
    AUTH_SMS_ACCOUNT_LOCKED:        'q.auth.sms.account_locked',
    AUTH_ACCOUNT_DELETED:           'q.auth.account.deleted',

    // ── Payment Queues ────────────────────────────────────────────
    PAYMENT_WEBHOOK_PROCESSOR:      'q.payment.webhook.processor',
    PAYMENT_CHECKOUT:               'q.payment.checkout',
    PAYMENT_CONFIRMED:              'q.payment.confirmed',
    PAYMENT_FAILED:                 'q.payment.failed',
    PAYMENT_RETRY:                  'q.payment.retry',
    PAYMENT_REFUND:                 'q.payment.refund',
    PAYMENT_SUB_CREATED:            'q.payment.subscription.created',
    PAYMENT_SUB_RENEWED:            'q.payment.subscription.renewed',
    PAYMENT_SUB_CANCELLED:          'q.payment.subscription.cancelled',
    PAYMENT_SUB_EXPIRED:            'q.payment.subscription.expired',

    // ── Progress Queues ───────────────────────────────────────────
    PROGRESS_PROBLEM_SOLVED:        'q.progress.problem_solved',
    PROGRESS_PROBLEM_UNSOLVED:      'q.progress.problem_unsolved',
    PROGRESS_MODULE_MASTERED:       'q.progress.module_mastered',
    PROGRESS_STREAK_MILESTONE:      'q.progress.streak_milestone',
    PROGRESS_WEEKLY_DIGEST:         'q.progress.weekly_digest',
    PROGRESS_RANK_PROMOTED:         'q.progress.rank_promoted',

    // ── Social Queues ─────────────────────────────────────────────
    SOCIAL_USER_FOLLOWED:           'q.social.user_followed',
    SOCIAL_PROFILE_VIEWED:          'q.social.profile_viewed',
    SOCIAL_PLAYLIST_INTERACTED:     'q.social.playlist_interacted',

    // ── Notification Queues ───────────────────────────────────────
    NOTIFICATION_INAPP:             'q.notification.inapp',
    NOTIFICATION_PUSH:              'q.notification.push',
    NOTIFICATION_ADMIN_BROADCAST:   'q.notification.admin_broadcast',
    NOTIFICATION_USER_LOGIN:        'q.notification.user_login',
    NOTIFICATION_NEW_DEVICE:        'q.notification.new_device',
    NOTIFICATION_CONTACT_RECEIVED:  'q.notification.contact_received',

    // ── Search Queues ─────────────────────────────────────────────
    SEARCH_USER_INDEX:              'q.search.user_index',
    SEARCH_HISTORY_RECORD:          'q.search.history_record',

    // ── Dead Letter Queues ────────────────────────────────────────
    DLQ_AUTH:                       'q.dlq.auth',
    DLQ_PAYMENT:                    'q.dlq.payment',
    DLQ_PROGRESS:                   'q.dlq.progress',
    DLQ_NOTIFICATION:               'q.dlq.notification',
} as const;

export type MqQueue = (typeof MqQueue)[keyof typeof MqQueue];

// ── Routing Keys ──
export const MqRoutingKey = {
    // ── Auth Routing Keys ─────────────────────────────────────────
    AUTH_EMAIL_WELCOME:             'auth.email.welcome',
    AUTH_EMAIL_VERIFY:              'auth.email.verify',
    AUTH_EMAIL_OTP:                 'auth.email.otp',
    AUTH_EMAIL_MAGIC_LINK:          'auth.email.magic_link',
    AUTH_EMAIL_RESET_PASSWORD:      'auth.email.reset_password',
    AUTH_EMAIL_NEW_DEVICE:          'auth.email.new_device',
    AUTH_EMAIL_OAUTH_LOGIN:         'auth.email.oauth_login',
    AUTH_EMAIL_PASSWORD_CHANGED:    'auth.email.password_changed',
    AUTH_EMAIL_SESSION_REVOKED:     'auth.email.session_revoked',
    AUTH_EMAIL_ACCOUNT_DEACTIVATED: 'auth.email.account_deactivated',
    AUTH_EMAIL_ACCOUNT_REACTIVATED: 'auth.email.account_reactivated',
    AUTH_EMAIL_PASSWORDLESS_CREDENTIALS: 'auth.email.passwordless_credentials',
    AUTH_SMS_OTP:                   'auth.sms.otp',
    AUTH_SMS_MAGIC_LINK:            'auth.sms.magic_link',
    AUTH_SMS_PASSWORDLESS_CREDENTIALS: 'auth.sms.passwordless_credentials',
    AUTH_SMS_NEW_DEVICE:            'auth.sms.new_device',
    AUTH_SMS_ACCOUNT_LOCKED:        'auth.sms.account_locked',
    AUTH_ACCOUNT_DELETED:           'auth.account.deleted',

    // ── Payment Routing Keys ──────────────────────────────────────
    PAYMENT_WEBHOOK_INGESTED:       'payment.webhook.ingested',
    PAYMENT_CHECKOUT_INITIATED:     'payment.checkout.initiated',
    PAYMENT_CONFIRMED:              'payment.confirmed',
    PAYMENT_FAILED:                 'payment.failed',
    PAYMENT_RETRY:                  'payment.retry',
    PAYMENT_REFUND:                 'payment.refund',
    PAYMENT_SUB_CREATED:            'payment.subscription.created',
    PAYMENT_SUB_RENEWED:            'payment.subscription.renewed',
    PAYMENT_SUB_CANCELLED:          'payment.subscription.cancelled',
    PAYMENT_SUB_EXPIRED:            'payment.subscription.expired',

    // ── Progress Routing Keys ─────────────────────────────────────
    PROGRESS_PROBLEM_SOLVED:        'progress.problem.solved',
    PROGRESS_PROBLEM_UNSOLVED:      'progress.problem.unsolved',
    PROGRESS_MODULE_MASTERED:       'progress.module.mastered',
    PROGRESS_STREAK_MILESTONE:      'progress.streak.milestone',
    PROGRESS_WEEKLY_DIGEST:         'progress.weekly.digest',
    PROGRESS_RANK_PROMOTED:         'progress.rank.promoted',

    // ── Social Routing Keys ───────────────────────────────────────
    SOCIAL_USER_FOLLOWED:           'social.user.followed',
    SOCIAL_PROFILE_VIEWED:          'social.profile.viewed',
    SOCIAL_PLAYLIST_INTERACTED:     'social.playlist.interacted',

    // ── Notification Routing Keys ─────────────────────────────────
    NOTIFICATION_INAPP:             'notification.inapp',
    NOTIFICATION_PUSH:              'notification.push',
    NOTIFICATION_ADMIN_BROADCAST:   'notification.admin_broadcast',
    NOTIFICATION_USER_LOGIN:        'notification.user_login',
    NOTIFICATION_NEW_DEVICE:        'notification.new_device',
    NOTIFICATION_CONTACT_RECEIVED:  'notification.contact_received',

    // ── Search Routing Keys ───────────────────────────────────────
    SEARCH_USER_INDEX:              'search.user.index',
    SEARCH_HISTORY_RECORD:          'search.history.record',
} as const;

export type MqRoutingKey = (typeof MqRoutingKey)[keyof typeof MqRoutingKey];


