import 'dotenv/config';
import { prisma } from '../lib/db/prisma.client';
import { searchClient } from '../service/search';
import { redisService } from '../lib/redis';

/**
 * Reindex script to populate the Redis Search Trie (`search:autocomplete:tags`)
 * and the Master Tag Collection (`search:tags:all`).
 * 
 * Usage:
 *   pnpm exec tsx src/scripts/reindex-tags.ts
 */
async function main() {
    console.log('🚀 Starting reindex for Master Tags search collection...\n');
    const startTime = Date.now();

    try {
        const tagsLoader = async () => {
            const tags = await prisma.tag.findMany({
                orderBy: { name: 'asc' },
                include: {
                    module: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                    problems: {
                        select: {
                            problemId: true,
                        },
                    },
                },
            });

            console.log(`📦 Fetched ${tags.length} tag(s) from database.`);

            return tags.map((t) => {
                const problemIds = t.problems.map((p) => p.problemId);
                return {
                    id: t.id,
                    name: t.name,
                    slug: t.slug,
                    description: t.description || null,
                    level: t.level || null,
                    module: t.module?.title || null,
                    moduleSlug: t.module?.slug || null,
                    moduleId: t.module?.id || null,
                    problemIds,
                    problemsCount: problemIds.length,
                    phoneticName: t.name,
                    createdAt: t.createdAt,
                };
            });
        };

        const collection = searchClient.collection('tags' as any);
        const result = await collection.reindex(tagsLoader as any);

        if (!result.ok) {
            console.error('❌ Failed to reindex tags:', result.error?.message || result.error);
            process.exit(1);
        }

        // Bump atomic version key in Redis
        const newVersion = Date.now().toString();
        await redisService.client.set('search:tags:version', newVersion);

        const summary = result.value;
        const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log('\n✅ Tag Reindexing Completed Successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🏷️  Tags Indexed:           ${summary.documentsIndexed}`);
        console.log(`🔤 Trie Autocomplete Keys: ${summary.autocompleteEntries}`);
        console.log(`🔊 Phonetic Entries:       ${summary.phoneticEntries}`);
        console.log(`📌 Catalog Version:        ${newVersion}`);
        console.log(`⚡ Execution Time:         ${summary.tookMs} ms (${totalDuration}s)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        await prisma.$disconnect();
        process.exit(0);
    } catch (error) {
        console.error('💥 Unexpected error during tag reindexing:', error);
        await prisma.$disconnect().catch(() => {});
        process.exit(1);
    }
}

main();
