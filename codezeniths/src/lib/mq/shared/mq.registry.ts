import { z } from 'zod';

// ── Registry Zod Schemas ──
const correlationId = z.string().optional();

export const messageRegistry = {
    // ── Auth Email Messages ─────────────────────────────────────────
    'auth.email.welcome': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        name: z.string(),
    }),
    'auth.email.verify': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        token: z.string(),
    }),
    'auth.email.otp': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        code: z.string(),
    }),
    'auth.email.magic_link': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        url: z.url(),
    }),
    'auth.email.reset_password': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        url: z.url(),
    }),
    'auth.email.new_device': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        deviceName: z.string(),
        location: z.string().optional(),
    }),
    'auth.email.oauth_login': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        provider: z.string(),
    }),
    'auth.email.password_changed': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
    }),
    'auth.email.session_revoked': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        sessionId: z.string(),
    }),
    'auth.email.account_deactivated': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
    }),
    'auth.email.account_reactivated': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
    }),

    // ── Auth SMS Messages ───────────────────────────────────────────
    'auth.sms.otp': z.object({
        correlationId,
        userId: z.uuidv7(),
        phoneNumber: z.string(),
        code: z.string(),
    }),
    'auth.sms.magic_link': z.object({
        correlationId,
        userId: z.uuidv7(),
        phoneNumber: z.string(),
        url: z.url(),
    }),
    'auth.sms.new_device': z.object({
        correlationId,
        userId: z.uuidv7(),
        phoneNumber: z.string(),
        deviceName: z.string(),
    }),
    'auth.sms.account_locked': z.object({
        correlationId,
        userId: z.uuidv7(),
        phoneNumber: z.string(),
        reason: z.string().optional(),
    }),
    'auth.email.passwordless_credentials': z.object({
        correlationId,
        userId: z.uuidv7(),
        email: z.email(),
        name: z.string(),
        password: z.string(),
    }),
    'auth.sms.passwordless_credentials': z.object({
        correlationId,
        userId: z.uuidv7(),
        phoneNumber: z.string(),
        password: z.string(),
    }),

    // ── Notifications ───────────────────────────────────────────────
    'notification.user_login': z.object({
        correlationId,
        userId: z.uuidv7(),
        timestamp: z.string(),
    }),
    'notification.new_device': z.object({
        correlationId,
        userId: z.uuidv7(),
        deviceName: z.string(),
        timestamp: z.string(),
    }),
    'notification.admin_broadcast': z.object({
        correlationId,
        title: z.string(),
        message: z.string(),
        senderId: z.uuidv7(),
    }),

    // ── Progress Event ──────────────────────────────────────────────
    'progress.event': z.object({
        correlationId,
        userId: z.uuidv7(),
        moduleSlug: z.string(),
        eventType: z.enum(['solved', 'revisit', 'mastered']),
        problemId: z.uuidv7().optional(),
    }),

    // ── Payment Messages ────────────────────────────────────────────
    'payment.webhook.ingested': z.object({
        correlationId,
        provider: z.string(),
        payload: z.record(z.string(), z.unknown()),
    }),
    'payment.checkout.initiated': z.object({
        correlationId,
        userId: z.uuidv7(),
        amount: z.number(),
        currency: z.string(),
        checkoutSessionId: z.string(),
    }),
    'payment.confirmed': z.object({
        correlationId,
        userId: z.uuidv7(),
        paymentIntentId: z.string(),
        amount: z.number(),
    }),
    'payment.failed': z.object({
        correlationId,
        userId: z.uuidv7(),
        paymentIntentId: z.string().optional(),
        amount: z.number(),
        reason: z.string(),
    }),
    'payment.retry': z.object({
        correlationId,
        userId: z.uuidv7(),
        invoiceId: z.string(),
        retryCount: z.number(),
    }),
    'payment.refund': z.object({
        correlationId,
        userId: z.uuidv7(),
        paymentIntentId: z.string(),
        amount: z.number(),
    }),
    'payment.subscription.created': z.object({
        correlationId,
        userId: z.uuidv7(),
        subscriptionId: z.string(),
        planId: z.string(),
    }),
    'payment.subscription.renewed': z.object({
        correlationId,
        userId: z.uuidv7(),
        subscriptionId: z.string(),
        expiryDate: z.string(),
    }),
    'payment.subscription.cancelled': z.object({
        correlationId,
        userId: z.uuidv7(),
        subscriptionId: z.string(),
    }),
    'payment.subscription.expired': z.object({
        correlationId,
        userId: z.uuidv7(),
        subscriptionId: z.string(),
    }),

    // ── Media Messages ──────────────────────────────────────────────
    'media.avatar.upload': z.object({
        correlationId,
        userId: z.uuidv7(),
        key: z.string(),
        size: z.number(),
    }),
    'media.avatar.replace': z.object({
        correlationId,
        userId: z.uuidv7(),
        oldKey: z.string(),
        newKey: z.string(),
    }),
    'media.avatar.url_expiry': z.object({
        correlationId,
        userId: z.uuidv7(),
        key: z.string(),
        expiresAt: z.string(),
    }),
    'media.content.upload': z.object({
        correlationId,
        userId: z.uuidv7(),
        contentId: z.uuidv7(),
        key: z.string(),
    }),
    'media.upload_failed': z.object({
        correlationId,
        userId: z.uuidv7(),
        key: z.string(),
        error: z.string(),
    }),

    // ── Content Messages ────────────────────────────────────────────
    'content.published': z.object({
        correlationId,
        contentId: z.uuidv7(),
        title: z.string(),
        contentType: z.string(),
    }),

    // ── Cron Messages ───────────────────────────────────────────────
    'cron.weekly_digest': z.object({
        correlationId,
        timestamp: z.string(),
    }),
    'cron.session_cleanup': z.object({
        correlationId,
        timestamp: z.string(),
    }),
    'cron.avatar_url_refresh': z.object({
        correlationId,
        timestamp: z.string(),
    }),
} satisfies Record<string, z.ZodType>;

export type MessageRegistry = typeof messageRegistry;
export type PayloadOf<K extends keyof MessageRegistry> = z.infer<MessageRegistry[K]>;