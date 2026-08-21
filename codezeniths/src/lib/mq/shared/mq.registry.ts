/**
 * @file mq.registry.ts
 * @description Zod schema registry for all domain message queue payloads in CodeZeniths.
 */

import { UserRole, UserType, SearchCollection } from '@prisma/client';
import { z } from 'zod';

const correlationId = z.string().optional();

export const messageRegistry = {
    // ── Auth Email Messages ─────────────────────────────────────────
    'auth.email.welcome': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        name: z.string(),
    }),
    'auth.email.verify': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        token: z.string(),
        url: z.string().optional(),
    }),
    'auth.email.otp': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        code: z.string(),
    }),
    'auth.email.magic_link': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        url: z.string(),
    }),
    'auth.email.reset_password': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        url: z.string(),
        code: z.string().optional(),
    }),
    'auth.email.new_device': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        deviceName: z.string(),
        location: z.string().optional(),
    }),
    'auth.email.oauth_login': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        provider: z.string(),
    }),
    'auth.email.password_changed': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
    }),
    'auth.email.session_revoked': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        sessionId: z.string(),
    }),
    'auth.email.account_deactivated': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
    }),
    'auth.email.account_reactivated': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
    }),
    'auth.email.passwordless_credentials': z.object({
        correlationId,
        userId: z.string(),
        email: z.string(),
        name: z.string(),
        username: z.string().optional(),
        password: z.string(),
    }),

    // ── Auth SMS Messages ───────────────────────────────────────────
    'auth.sms.otp': z.object({
        correlationId,
        userId: z.string(),
        phoneNumber: z.string(),
        code: z.string(),
    }),
    'auth.sms.magic_link': z.object({
        correlationId,
        userId: z.string(),
        phoneNumber: z.string(),
        url: z.string(),
    }),
    'auth.sms.passwordless_credentials': z.object({
        correlationId,
        userId: z.string(),
        phoneNumber: z.string(),
        password: z.string(),
    }),
    'auth.sms.new_device': z.object({
        correlationId,
        userId: z.string(),
        phoneNumber: z.string(),
        deviceName: z.string(),
    }),
    'auth.sms.account_locked': z.object({
        correlationId,
        userId: z.string(),
        phoneNumber: z.string(),
        reason: z.string().optional(),
    }),

    // ── Payment Messages ────────────────────────────────────────────
    'payment.webhook.ingested': z.object({
        correlationId,
        provider: z.string(),
        payload: z.record(z.string(), z.unknown()),
    }),
    'payment.checkout.initiated': z.object({
        correlationId,
        userId: z.string(),
        amount: z.number(),
        currency: z.string(),
        checkoutSessionId: z.string(),
    }),
    'payment.confirmed': z.object({
        correlationId,
        userId: z.string(),
        paymentIntentId: z.string(),
        amount: z.number(),
    }),
    'payment.failed': z.object({
        correlationId,
        userId: z.string(),
        paymentIntentId: z.string().optional(),
        amount: z.number(),
        reason: z.string(),
    }),
    'payment.retry': z.object({
        correlationId,
        userId: z.string(),
        invoiceId: z.string(),
        retryCount: z.number(),
    }),
    'payment.refund': z.object({
        correlationId,
        userId: z.string(),
        paymentIntentId: z.string(),
        amount: z.number(),
    }),
    'payment.subscription.created': z.object({
        correlationId,
        userId: z.string(),
        subscriptionId: z.string(),
        planId: z.string(),
    }),
    'payment.subscription.renewed': z.object({
        correlationId,
        userId: z.string(),
        subscriptionId: z.string(),
        expiryDate: z.string(),
    }),
    'payment.subscription.cancelled': z.object({
        correlationId,
        userId: z.string(),
        subscriptionId: z.string(),
    }),
    'payment.subscription.expired': z.object({
        correlationId,
        userId: z.string(),
        subscriptionId: z.string(),
    }),

    // ── Progress Messages ───────────────────────────────────────────
    'progress.problem.solved': z.object({
        correlationId,
        userId: z.string(),
        problemId: z.string(),
        problemTitle: z.string(),
        difficulty: z.string().optional(),
        module: z.string(),
        isFirstSolve: z.boolean().default(true),
        streakCount: z.number().optional(),
    }),
    'progress.module.mastered': z.object({
        correlationId,
        userId: z.string(),
        moduleSlug: z.string(),
        moduleTitle: z.string(),
    }),
    'progress.streak.milestone': z.object({
        correlationId,
        userId: z.string(),
        streakCount: z.number(),
    }),
    'progress.weekly.digest': z.object({
        correlationId,
        userId: z.string(),
        summaryUrl: z.string().optional(),
        problemsSolvedCount: z.number().optional(),
        streakCount: z.number().optional(),
    }),
    'progress.rank.promoted': z.object({
        correlationId,
        userId: z.string(),
        oldRank: z.string(),
        newRank: z.string(),
        division: z.string().optional(),
    }),

    // ── Social Messages ─────────────────────────────────────────────
    'social.user.followed': z.object({
        correlationId,
        followerId: z.string(),
        followerName: z.string(),
        followerUsername: z.string().nullable().optional(),
        followerImage: z.string().nullable().optional(),
        followingId: z.string(),
    }),
    'social.profile.viewed': z.object({
        correlationId,
        viewerId: z.string(),
        viewerName: z.string(),
        viewerUsername: z.string().nullable().optional(),
        viewedUserId: z.string(),
    }),
    'social.playlist.interacted': z.object({
        correlationId,
        actorId: z.string(),
        actorName: z.string(),
        creatorId: z.string(),
        playlistId: z.string(),
        playlistTitle: z.string(),
        action: z.enum(['starred', 'forked', 'collaborated', 'created']),
    }),

    // ── Notifications ───────────────────────────────────────────────
    'notification.inapp': z.object({
        correlationId,
        userId: z.string().nullable().optional(), // null means global
        type: z.string(),
        title: z.string(),
        message: z.string(),
        link: z.string().optional(),
    }),
    'notification.push': z.object({
        correlationId,
        userId: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.record(z.string(), z.string()).optional(),
    }),
    'notification.admin_broadcast': z.object({
        correlationId,
        title: z.string(),
        message: z.string(),
        senderId: z.string(),
        sendEmail: z.boolean().default(false),
        sendPush: z.boolean().default(false),
    }),
    'notification.user_login': z.object({
        correlationId,
        userId: z.string(),
        timestamp: z.string(),
    }),
    'notification.new_device': z.object({
        correlationId,
        userId: z.string(),
        deviceName: z.string(),
        timestamp: z.string(),
    }),

    // ── Search Messages ─────────────────────────────────────────────
    'search.user.index': z.object({
        correlationId,
        userId: z.string(),
        name: z.string(),
        username: z.string().nullable().optional(),
        email: z.string(),
        image: z.string().nullable().optional(),
        role: z.enum(UserRole).optional(),
        userType: z.enum(UserType).nullable().optional(),
    }),
    'search.history.record': z.object({
        correlationId,
        userId: z.string(),
        collection: z.enum(SearchCollection),
        resultId: z.string(),
        title: z.string(),
        slug: z.string().nullable().optional(),
        document: z.record(z.string(), z.any()),
    }),
} satisfies Record<string, z.ZodType>;

export type MessageRegistry = typeof messageRegistry;
export type PayloadOf<K extends keyof MessageRegistry> = z.infer<MessageRegistry[K]>;
