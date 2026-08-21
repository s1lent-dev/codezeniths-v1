import 'dotenv/config';
import { prisma } from '../lib/db/prisma.client';
import { searchClient } from '../service/search';

/**
 * Reindex script to populate the Redis Search Trie (`search:autocomplete:users`)
 * and the User Search Collection (`search:users:all`).
 * 
 * Usage:
 *   pnpx tsx src/scripts/reindex-users.ts
 *   pnpx tsx src/scripts/reindex-users.ts --completed-only
 */
async function main() {
    const isCompletedOnly = process.argv.includes('--completed-only');
    console.log(`🚀 Starting reindex for Users search collection...`);
    console.log(`📌 Filter mode: ${isCompletedOnly ? 'Only users with completed onboarding (isOnboardingComplete: true)' : 'All active users (isActive: true)'}\n`);

    const startTime = Date.now();

    try {
        const usersLoader = async () => {
            const whereClause: { isActive: boolean; isOnboardingComplete?: boolean } = {
                isActive: true,
            };

            if (isCompletedOnly) {
                whereClause.isOnboardingComplete = true;
            }

            const users = await prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                    image: true,
                    role: true,
                    userType: true,
                    isOnboardingComplete: true,
                },
                orderBy: { createdAt: 'desc' },
            });

            console.log(`📦 Fetched ${users.length} user(s) from database.`);

            return users.map((u) => ({
                id: u.id,
                name: u.name,
                username: u.username || null,
                email: u.email,
                image: u.image || null,
                role: u.role,
                userType: u.userType || null,
                phoneticName: u.name,
                phoneticUsername: u.username || undefined,
            }));
        };

        const collection = searchClient.collection('users' as any);
        const result = await collection.reindex(usersLoader as any);

        if (!result.ok) {
            console.error('❌ Failed to reindex users:', result.error?.message || result.error);
            process.exit(1);
        }

        const summary = result.value;
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n✅ User Reindexing Completed Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👥 Documents Indexed:     ${summary.documentsIndexed}`);
        console.log(`🔤 Trie Autocomplete Keys: ${summary.autocompleteEntries}`);
        console.log(`🔊 Phonetic Fields:        ${summary.phoneticEntries}`);
        console.log(`⚡ Execution Time:         ${summary.tookMs} ms (${totalDuration}s)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('💥 Unexpected error during user reindexing:', error);
        await prisma.$disconnect().catch(() => {});
        process.exit(1);
    }
}

main();
