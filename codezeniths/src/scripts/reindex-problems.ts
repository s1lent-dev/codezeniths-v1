import 'dotenv/config';
import { prisma } from '../lib/db/prisma.client';
import { searchClient } from '../service/search';
import { redisService } from '../lib/redis';

/**
 * Reindex script to populate the Redis Search Trie (`search:autocomplete:problems`)
 * and the Master Problem Search Collection (`search:problems:all`).
 * 
 * Usage:
 *   pnpx tsx src/scripts/reindex-problems.ts
 */
async function main() {
    console.log('🚀 Starting reindex for Master Problems search collection...\n');
    const startTime = Date.now();

    try {
        const problemsLoader = async () => {
            const problems = await prisma.problem.findMany({
                orderBy: { order: 'asc' },
                include: {
                    tags: {
                        include: { tag: true },
                    },
                    topic: {
                        include: { module: true },
                    },
                },
            });

            console.log(`📦 Fetched ${problems.length} problem(s) from database.`);

            return problems.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                difficulty: p.difficulty,
                order: p.order ?? 0,
                articleUrl: p.articleUrl || null,
                problemUrl: p.problemUrl || null,
                topicId: p.topicId || p.topic?.id || null,
                topicSlug: p.topic?.slug || null,
                topic: p.topic?.title || null,
                topicLevel: p.topic?.level || null,
                moduleId: p.topic?.module?.id || null,
                moduleSlug: p.topic?.module?.slug || null,
                module: p.topic?.module?.title || null,
                tags: p.tags.map((t) => ({
                    id: t.tag.id,
                    name: t.tag.name,
                    slug: t.tag.slug,
                })),
                phoneticTitle: p.title,
                createdAt: p.createdAt,
            }));
        };

        const collection = searchClient.collection('problems' as any);
        const result = await collection.reindex(problemsLoader as any);

        if (!result.ok) {
            console.error('❌ Failed to reindex problems:', result.error?.message || result.error);
            process.exit(1);
        }

        // Bump the atomic version key in Redis
        const newVersion = Date.now().toString();
        await redisService.client.set('search:problems:version', newVersion);

        const summary = result.value;
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n✅ Problem Reindexing Completed Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📚 Problems Indexed:      ${summary.documentsIndexed}`);
        console.log(`🔤 Trie Autocomplete Keys: ${summary.autocompleteEntries}`);
        console.log(`🔊 Phonetic Entries:       ${summary.phoneticEntries}`);
        console.log(`🏷️ Catalog Version:        ${newVersion}`);
        console.log(`⚡ Execution Time:         ${summary.tookMs} ms (${totalDuration}s)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('💥 Unexpected error during problem reindexing:', error);
        await prisma.$disconnect().catch(() => {});
        process.exit(1);
    }
}

main();
