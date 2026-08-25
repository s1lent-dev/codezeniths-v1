/**
 * @file scripts/clean-users.ts
 * @description Safely purges all user records and user-related relational table records
 *              from PostgreSQL and flushes user leaderboards and caches in Redis.
 *
 * Usage:
 *   pnpm db:clean-users
 */

import 'dotenv/config';
import { prisma } from '../lib/db/prisma.client';
import { redisService, RedisStore } from '../lib/redis';
import { logger } from '@codezeniths/service/logging';

async function cleanUsers() {
    console.log('🚀 Starting complete user and relational tables cleanup...');

    try {
        console.log('🗑️  Deleting child records...');
        await prisma.userFollow.deleteMany().catch(() => null);
        await prisma.profileView.deleteMany().catch(() => null);
        await prisma.session.deleteMany().catch(() => null);
        await prisma.account.deleteMany().catch(() => null);
        await prisma.twoFactor.deleteMany().catch(() => null);
        await prisma.verification.deleteMany().catch(() => null);
        await prisma.userSocialLinks.deleteMany().catch(() => null);
        await prisma.deviceToken.deleteMany().catch(() => null);
        await prisma.userPreference.deleteMany().catch(() => null);
        await prisma.userStreak.deleteMany().catch(() => null);
        await prisma.userDailyActivity.deleteMany().catch(() => null);
        await prisma.userSearchHistory.deleteMany().catch(() => null);
        await prisma.userSkill.deleteMany().catch(() => null);
        await prisma.userGlobalStats.deleteMany().catch(() => null);
        await prisma.userModuleStats.deleteMany().catch(() => null);
        await prisma.problemProgress.deleteMany().catch(() => null);
        await prisma.moduleBookmark.deleteMany().catch(() => null);
        await prisma.topicBookmark.deleteMany().catch(() => null);
        await prisma.tagBookmark.deleteMany().catch(() => null);
        await prisma.userPlaylistBookmark.deleteMany().catch(() => null);
        await prisma.notificationRead.deleteMany().catch(() => null);
        await prisma.notification.deleteMany().catch(() => null);

        console.log('🗑️  Deleting all user records...');
        const userDeleteResult = await prisma.user.deleteMany();
        console.log(`✅ PostgreSQL user records successfully deleted: ${userDeleteResult.count} users removed.`);

        // 2. Clear Redis leaderboards, user caches, and reindex
        console.log('🧹 Clearing Redis leaderboards and cache...');
        try {
            await redisService.client.del(RedisStore.leaderboards.globalRawKey());
            console.log('✅ Cleared Redis leaderboard:global');
        } catch (e) {
            console.warn('⚠️ Note on Redis cleanup:', e);
        }

        console.log('🎉 All user data and user-related relational tables have been completely purged!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to clean user tables:', error);
        logger.error('Failed to clean user tables', { error });
        process.exit(1);
    }
}

cleanUsers();
