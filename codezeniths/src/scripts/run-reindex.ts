import 'dotenv/config';
import { searchClient } from '../service/search';
import { searchQueries } from '../lib/db/queries/search.queries';
import { redisService } from '../lib/redis';


async function main() {
    console.log('🚀 Starting reindex for all search collections...\n');
    const startAll = Date.now();
    const staticLoaders = {
        problems: async () => searchQueries.getSearchProblems({}),
        topics: async () => searchQueries.getSearchTopics({}),
        modules: async () => searchQueries.getSearchModules({}),
        tags: async () => searchQueries.getSearchTags({}),
        products: async () => searchQueries.getSearchProducts({}),
        users: async () => searchQueries.getSearchUsers({}),
    };

    const summary: Record<string, { ok: boolean; docs?: number; autocomplete?: number; tookMs?: number; error?: string }> = {};

    for (const [name, loader] of Object.entries(staticLoaders)) {
        const startColl = Date.now();
        try {
            process.stdout.write(`⏳ Reindexing collection "${name}"... `);
            const collection = searchClient.collection(name as any);
            const result = await collection.reindex(loader as any);

            if (result.ok) {
                const data = result.value;
                if (name === 'problems') {
                    await redisService.client.set('search:problems:version', Date.now().toString()).catch(() => {});
                }
                console.log(`✅ OK (${data.documentsIndexed} docs, ${data.autocompleteEntries} prefixes, ${data.tookMs}ms)`);
                summary[name] = {
                    ok: true,
                    docs: data.documentsIndexed,
                    autocomplete: data.autocompleteEntries,
                    tookMs: data.tookMs,
                };
            } else {

                console.log(`❌ FAILED`);
                summary[name] = {
                    ok: false,
                    tookMs: Date.now() - startColl,
                    error: result.error?.message || result.error?.name,
                };
            }
        } catch (error) {
            console.log(`❌ ERROR`);
            summary[name] = {
                ok: false,
                tookMs: Date.now() - startColl,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }

    const totalDuration = ((Date.now() - startAll) / 1000).toFixed(2);
    console.log('\n📊 Reindexing Summary:');
    console.table(summary);
    console.log(`✨ Total time elapsed: ${totalDuration}s\n`);
    process.exit(0);
}

main().catch((err) => {
    console.error('💥 Fatal error during reindex script:', err);
    process.exit(1);
});

