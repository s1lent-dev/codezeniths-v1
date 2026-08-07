import type { Options, Channel, ConfirmChannel, Message, ConsumeMessage } from 'amqplib';

export type { Options, Channel, ConfirmChannel, Message, ConsumeMessage };

export type ExchangeType = 'direct' | 'fanout' | 'topic' | 'headers';

export interface ExchangeConfig {
    name: string;
    type: ExchangeType;
    options?: Options.AssertExchange;
}

export interface QueueConfig {
    name: string;
    options?: Options.AssertQueue & {
        deadLetterExchange?: string;
        deadLetterRoutingKey?: string;
        messageTtl?: number;
        maxLength?: number;
        overflow?: 'drop-head' | 'reject-publish' | 'reject-publish-dlx' | string;
    };
}

export interface BindingConfig {
    queue: string;
    exchange: string;
    routingKey: string;
    arguments?: unknown;
}

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

/**
 * Payload serialization strategy interface
 */
export interface Serializer<T> {
    serialize(value: T): Buffer;
    deserialize(raw: Buffer): T;
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

// ── Enums ──
export const MqExchange = {
    // Auth lifecycle — direct
    AUTH: 'auth.direct',

    // Cross-channel broadcast events (login, new device, admin broadcast) — fanout
    NOTIFICATION: 'notification.fanout',

    // User progress events namespaced by module slug — topic
    PROGRESS: 'progress.topic',

    // Payment lifecycle + webhook ingestion — direct
    PAYMENT: 'payment.direct',

    // Image/file upload pipeline namespaced by asset type + operation — topic
    MEDIA: 'media.topic',

    // New content published to all users — fanout
    CONTENT: 'content.fanout',

    // Dead letter exchanges (one per high-stakes domain)
    AUTH_DLX: 'auth.dlx',
    PAYMENT_DLX: 'payment.dlx',
    MEDIA_DLX: 'media.dlx',
} as const;

export type MqExchange = (typeof MqExchange)[keyof typeof MqExchange];

export const MqQueue = {
    // ── Email queues ──────────────────────────────────────────────
    EMAIL_WELCOME:              'q.email.welcome',
    EMAIL_VERIFY:               'q.email.verify',
    EMAIL_OTP:                  'q.email.otp',
    EMAIL_MAGIC_LINK:           'q.email.magic_link',
    EMAIL_RESET_PASSWORD:       'q.email.reset_password',
    EMAIL_NEW_DEVICE:           'q.email.new_device',
    EMAIL_OAUTH_LOGIN:          'q.email.oauth_login',
    EMAIL_PASSWORD_CHANGED:     'q.email.password_changed',
    EMAIL_ACCOUNT_DEACTIVATED:  'q.email.account_deactivated',
    EMAIL_ACCOUNT_REACTIVATED:  'q.email.account_reactivated',
    EMAIL_SESSION_REVOKED:      'q.email.session_revoked',
    EMAIL_WEEKLY_DIGEST:        'q.email.weekly_digest',
    EMAIL_STREAK_MILESTONE:     'q.email.streak_milestone',
    EMAIL_SUBSCRIPTION_CONFIRMED:   'q.email.subscription_confirmed',
    EMAIL_SUBSCRIPTION_CANCELLED:   'q.email.subscription_cancelled',
    EMAIL_PAYMENT_FAILED:       'q.email.payment_failed',
    EMAIL_PAYMENT_RECEIPT:      'q.email.payment_receipt',
    EMAIL_ADMIN_BROADCAST:      'q.email.admin_broadcast',

    // ── SMS queues ────────────────────────────────────────────────
    SMS_OTP:                    'q.sms.otp',
    SMS_MAGIC_LINK:             'q.sms.magic_link',
    SMS_NEW_DEVICE:             'q.sms.new_device',
    SMS_PAYMENT_FAILED:         'q.sms.payment_failed',
    SMS_SUBSCRIPTION_RENEWAL:   'q.sms.subscription_renewal',
    SMS_ACCOUNT_LOCKED:         'q.sms.account_locked',
    EMAIL_PASSWORDLESS_CREDENTIALS: 'q.email.passwordless_credentials',
    SMS_PASSWORDLESS_CREDENTIALS:   'q.sms.passwordless_credentials',

    // ── Push notification queues ──────────────────────────────────
    PUSH_LOGIN:                 'q.push.login',
    PUSH_NEW_DEVICE:            'q.push.new_device',
    PUSH_STREAK_REMINDER:       'q.push.streak_reminder',
    PUSH_PROBLEM_SOLVED:        'q.push.problem_solved',
    PUSH_MODULE_MASTERED:       'q.push.module_mastered',
    PUSH_NEW_CONTENT:           'q.push.new_content',
    PUSH_PAYMENT_SUCCESS:       'q.push.payment_success',
    PUSH_PAYMENT_FAILED:        'q.push.payment_failed',
    PUSH_ADMIN_ANNOUNCEMENT:    'q.push.admin_announcement',

    // ── In-app notification queues ────────────────────────────────
    INAPP_LOGIN:                'q.inapp.login',
    INAPP_PROBLEM_SOLVED:       'q.inapp.problem_solved',
    INAPP_STREAK_MILESTONE:     'q.inapp.streak_milestone',
    INAPP_NEW_CONTENT:          'q.inapp.new_content',
    INAPP_PROFILE_INCOMPLETE:   'q.inapp.profile_incomplete',
    INAPP_SUBSCRIPTION_STATUS:  'q.inapp.subscription_status',
    INAPP_PAYMENT:              'q.inapp.payment',
    INAPP_ADMIN_BROADCAST:      'q.inapp.admin_broadcast',
    INAPP_SESSION_EXPIRED:      'q.inapp.session_expired',

    // ── Payment queues ────────────────────────────────────────────
    PAYMENT_WEBHOOK_PROCESSOR:  'q.payment.webhook.processor',
    PAYMENT_CHECKOUT:           'q.payment.checkout',
    PAYMENT_CONFIRMED:          'q.payment.confirmed',
    PAYMENT_FAILED:             'q.payment.failed',
    PAYMENT_RETRY:              'q.payment.retry',
    PAYMENT_REFUND:             'q.payment.refund',
    PAYMENT_SUB_CREATED:        'q.payment.subscription.created',
    PAYMENT_SUB_RENEWED:        'q.payment.subscription.renewed',
    PAYMENT_SUB_CANCELLED:      'q.payment.subscription.cancelled',
    PAYMENT_SUB_EXPIRED:        'q.payment.subscription.expired',

    // ── Media/upload queues ───────────────────────────────────────
    MEDIA_AVATAR_PROCESS:       'q.media.avatar.process',
    MEDIA_AVATAR_REFRESH_URL:   'q.media.avatar.refresh_url',
    MEDIA_CONTENT_PROCESS:      'q.media.content.process',
    MEDIA_ALERT:                'q.media.alert',
    MEDIA_AUDIT:                'q.media.audit',

    // ── Progress queues ───────────────────────────────────────────
    PROGRESS_GAMIFICATION:      'q.progress.gamification',
    PROGRESS_STREAK:            'q.progress.streak',
    PROGRESS_EMAIL_MILESTONE:   'q.progress.email_milestone',
    PROGRESS_ANALYTICS:         'q.progress.analytics',
    PROGRESS_PUSH_REMINDER:     'q.progress.push_reminder',

    // ── Content queues ────────────────────────────────────────────
    CONTENT_PUSH:               'q.content.push',
    CONTENT_INAPP:              'q.content.inapp',
    CONTENT_EMAIL:              'q.content.email',
    CONTENT_ADMIN_IMPORT:       'q.content.admin_import',

    // ── Cron / scheduled queues ───────────────────────────────────
    CRON_WEEKLY_DIGEST:         'q.cron.weekly_digest',
    CRON_SESSION_CLEANUP:       'q.cron.session_cleanup',
    CRON_AVATAR_URL_REFRESH:    'q.cron.avatar_url_refresh',

    // ── Audit ─────────────────────────────────────────────────────
    AUDIT_LOG:                  'q.audit.log',

    // ── DLQs (dead letter queues) ─────────────────────────────────
    DLQ_EMAIL:                  'q.dlq.email',
    DLQ_SMS:                    'q.dlq.sms',
    DLQ_PAYMENT:                'q.dlq.payment',
    DLQ_PAYMENT_WEBHOOK:        'q.dlq.payment.webhook',
    DLQ_MEDIA:                  'q.dlq.media',

    // ── Retry delay queues (TTL bounce-back) ──────────────────────
    RETRY_PAYMENT:              'q.payment.retry-delay',
    RETRY_EMAIL:                'q.email.retry-delay',
    RETRY_MEDIA:                'q.media.retry-delay',
} as const;

export type MqQueue = (typeof MqQueue)[keyof typeof MqQueue];

export const MqRoutingKey = {
    // ── auth.direct routing keys ──────────────────────────────────
    AUTH_EMAIL_WELCOME:         'auth.email.welcome',
    AUTH_EMAIL_VERIFY:          'auth.email.verify',
    AUTH_EMAIL_OTP:             'auth.email.otp',
    AUTH_EMAIL_MAGIC_LINK:      'auth.email.magic_link',
    AUTH_EMAIL_RESET_PASSWORD:  'auth.email.reset_password',
    AUTH_EMAIL_NEW_DEVICE:      'auth.email.new_device',
    AUTH_EMAIL_OAUTH_LOGIN:     'auth.email.oauth_login',
    AUTH_EMAIL_PASSWORD_CHANGED:'auth.email.password_changed',
    AUTH_EMAIL_SESSION_REVOKED: 'auth.email.session_revoked',
    AUTH_EMAIL_ACCOUNT_DEACTIVATED: 'auth.email.account_deactivated',
    AUTH_EMAIL_ACCOUNT_REACTIVATED: 'auth.email.account_reactivated',
    AUTH_SMS_OTP:               'auth.sms.otp',
    AUTH_SMS_MAGIC_LINK:        'auth.sms.magic_link',
    AUTH_SMS_NEW_DEVICE:        'auth.sms.new_device',
    AUTH_SMS_ACCOUNT_LOCKED:    'auth.sms.account_locked',
    AUTH_EMAIL_PASSWORDLESS_CREDENTIALS: 'auth.email.passwordless_credentials',
    AUTH_SMS_PASSWORDLESS_CREDENTIALS:   'auth.sms.passwordless_credentials',

    // ── notification.fanout routing keys ──
    NOTIF_USER_LOGIN:           'user.login',
    NOTIF_NEW_DEVICE:           'user.new_device_login',
    NOTIF_ADMIN_BROADCAST:      'admin.broadcast',
    NOTIF_PAYMENT_FAILED:       'payment.failed',

    // ── progress.topic routing keys ──
    PROGRESS_ANY_SOLVED:        'progress.*.solved',
    PROGRESS_ANY_MASTERED:      'progress.*.mastered',
    PROGRESS_ANY_REVISIT:       'progress.*.revisit',
    PROGRESS_ALL:               'progress.#',

    // ── payment.direct routing keys ───────────────────────────────
    PAYMENT_WEBHOOK_INGESTED:   'payment.webhook.ingested',
    PAYMENT_CHECKOUT_INITIATED: 'payment.checkout.initiated',
    PAYMENT_CONFIRMED:          'payment.confirmed',
    PAYMENT_FAILED:             'payment.failed',
    PAYMENT_RETRY:              'payment.retry',
    PAYMENT_REFUND:             'payment.refund',
    PAYMENT_SUB_CREATED:        'payment.subscription.created',
    PAYMENT_SUB_RENEWED:        'payment.subscription.renewed',
    PAYMENT_SUB_CANCELLED:      'payment.subscription.cancelled',
    PAYMENT_SUB_EXPIRED:        'payment.subscription.expired',
    PAYMENT_INVOICE_GENERATED:  'payment.invoice.generated',

    // ── media.topic routing keys ──
    MEDIA_AVATAR_UPLOAD:        'media.avatar.upload',
    MEDIA_AVATAR_REPLACE:       'media.avatar.replace',
    MEDIA_AVATAR_URL_EXPIRY:    'media.avatar.url_expiry',
    MEDIA_CONTENT_UPLOAD:       'media.content.upload',
    MEDIA_ANY_UPLOAD_FAILED:    'media.*.upload_failed',
    MEDIA_ALL:                  'media.#',

    // ── content.fanout routing keys ──
    CONTENT_PUBLISHED:          'content.published',
} as const;

export type MqRoutingKey = (typeof MqRoutingKey)[keyof typeof MqRoutingKey];

export const buildProgressRoutingKey = (moduleSlug: string, event: 'solved' | 'revisit' | 'mastered'): string =>
    `progress.${moduleSlug}.${event}`;

export const buildMediaRoutingKey = (assetType: 'avatar' | 'content', operation: string): string =>
    `media.${assetType}.${operation}`;




