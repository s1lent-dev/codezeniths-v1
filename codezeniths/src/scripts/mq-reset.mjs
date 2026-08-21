#!/usr/bin/env node
/**
 * @file scripts/mq-reset.mjs
 * @description Deletes all stale CodeZeniths queues and exchanges from RabbitMQ
 *              so the new DLX-backed topology can be asserted cleanly.
 *
 * Usage:
 *   node scripts/mq-reset.mjs
 *   node scripts/mq-reset.mjs --url=amqp://user:pass@host:5672/vhost
 */

import amqp from 'amqplib';

const RABBITMQ_URL = process.env.AMQP_URL
    || process.env.MQ_URL
    || 'amqp://guest:guest@localhost:5672';

const QUEUES_TO_DELETE = [
    // ── Auth Emails ──────────────────────────────────────────────────
    'q.auth.email.welcome',
    'q.auth.email.verify',
    'q.auth.email.otp',
    'q.auth.email.magic_link',
    'q.auth.email.reset_password',
    'q.auth.email.new_device',
    'q.auth.email.oauth_login',
    'q.auth.email.password_changed',
    'q.auth.email.session_revoked',
    'q.auth.email.account_deactivated',
    'q.auth.email.account_reactivated',
    'q.auth.email.passwordless_credentials',
    // ── Auth SMS ─────────────────────────────────────────────────────
    'q.auth.sms.otp',
    'q.auth.sms.magic_link',
    'q.auth.sms.passwordless_credentials',
    'q.auth.sms.new_device',
    'q.auth.sms.account_locked',
    // ── Payment ──────────────────────────────────────────────────────
    'q.payment.webhook.processor',
    'q.payment.checkout',
    'q.payment.confirmed',
    'q.payment.failed',
    'q.payment.retry',
    'q.payment.refund',
    'q.payment.subscription.created',
    'q.payment.subscription.renewed',
    'q.payment.subscription.cancelled',
    'q.payment.subscription.expired',
    // ── Progress ─────────────────────────────────────────────────────
    'q.progress.problem_solved',
    'q.progress.module_mastered',
    'q.progress.streak_milestone',
    'q.progress.weekly_digest',
    'q.progress.rank_promoted',
    'q.progress.event_generic',
    // ── Social ───────────────────────────────────────────────────────
    'q.social.user_followed',
    'q.social.profile_viewed',
    'q.social.playlist_interacted',
    // ── Notification ─────────────────────────────────────────────────
    'q.notification.inapp',
    'q.notification.push',
    'q.notification.admin_broadcast',
    'q.notification.user_login',
    'q.notification.new_device',
    // ── Search ───────────────────────────────────────────────────────
    'q.search.user_index',
    'q.search.history_record',
    'q.search.problem_index',
    // ── Dead Letter Queues ───────────────────────────────────────────
    'q.dlq.auth',
    'q.dlq.payment',
    'q.dlq.payment.webhook',
    'q.dlq.progress',
    'q.dlq.notification',
    // ── Retry Delay Queues ───────────────────────────────────────────
    'q.payment.retry-delay',
    'q.auth.retry-delay',
];

const EXCHANGES_TO_DELETE = [
    // Domain exchanges (from MqExchange enum)
    'auth.direct',
    'payment.direct',
    'progress.topic',
    'social.topic',
    'notification.fanout',
    'search.direct',
    // Dead letter exchanges
    'auth.dlx',
    'payment.dlx',
    'progress.dlx',
    'notification.dlx',
];

async function deleteQueue(channel, name) {
    try {
        await channel.deleteQueue(name, { ifEmpty: false, ifUnused: false });
        return true;
    } catch {
        return false;
    }
}

async function reset() {
    console.log(`\n🐇 Connecting to: ${RABBITMQ_URL.replace(/:([^:@]+)@/, ':****@')}\n`);
    const connection = await amqp.connect(RABBITMQ_URL);

    let deleted = 0;
    let skipped = 0;

    console.log('🗑️  Deleting queues...');
    for (const q of QUEUES_TO_DELETE) {
        // Reopen channel each time — a failed deleteQueue closes the channel
        const ch = await connection.createChannel();
        const ok = await deleteQueue(ch, q);
        try { await ch.close(); } catch { /* ignore */ }
        if (ok) {
            console.log(`   ✅  ${q}`);
            deleted++;
        } else {
            console.log(`   ⏭️   ${q} (not found)`);
            skipped++;
        }
    }

    console.log('\n🗑️  Deleting exchanges...');
    for (const ex of EXCHANGES_TO_DELETE) {
        const ch = await connection.createChannel();
        try {
            await ch.deleteExchange(ex, { ifUnused: false });
            try { await ch.close(); } catch { /* ignore */ }
            console.log(`   ✅  ${ex}`);
            deleted++;
        } catch {
            try { await ch.close(); } catch { /* ignore */ }
            console.log(`   ⏭️   ${ex} (not found)`);
            skipped++;
        }
    }

    console.log(`\n✨ Done — deleted ${deleted}, skipped ${skipped} (not found).`);
    console.log('🚀 Restart your Next.js server — topology will be re-asserted cleanly.\n');

    try { await connection.close(); } catch { /* ignore */ }
    process.exit(0);
}

reset().catch(err => {
    console.error('\n❌ Reset failed:', err.message);
    process.exit(1);
});
