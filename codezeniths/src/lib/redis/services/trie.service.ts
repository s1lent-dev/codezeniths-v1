import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

/**
 * Service to manage a Redis Sorted Set specifically used as a Trie for autocomplete.
 */
export class TrieService {
    constructor(private readonly client: IRedisClient) {}

    /**
     * Adds an array of prefixes to a given Redis Sorted Set.
     * Deduplicates prefixes and bulk-inserts them in efficient batches.
     */
    public async addPrefixes(key: string, prefixes: string[]): Promise<void> {
        try {
            const uniquePrefixes = Array.from(
                new Set(prefixes.map(p => p.toLowerCase().trim()).filter(p => p.length > 0))
            );
            if (uniquePrefixes.length === 0) return;

            const entries = uniquePrefixes.map(p => ({ score: 0, member: p }));
            await this.client.zaddMany(key, entries);
        } catch (error) {
            logger.error(`[redis:trie] Failed to add prefixes to key "${key}"`, error);
        }
    }


    /**
     * Searches the Sorted Set lexicographically for a given prefix.
     */
    public async searchPrefix(key: string, prefix: string, limit: number = 10): Promise<string[]> {
        try {
            return await this.client.zrange(key, `[${prefix}`, `[${prefix}\\xff`, {
                byLex: true,
                limit: { offset: 0, count: limit }
            });
        } catch (error) {
            logger.error(`[redis:trie] Failed to search prefix "${prefix}" in key "${key}"`, error);
            return [];
        }
    }

    /**
     * Removes an array of prefixes from a given Redis Sorted Set.
     */
    public async removePrefixes(key: string, prefixes: string[]): Promise<void> {
        try {
            const uniquePrefixes = Array.from(
                new Set(prefixes.map(p => p.toLowerCase().trim()).filter(p => p.length > 0))
            );
            if (uniquePrefixes.length === 0) return;

            // Remove in batches of 500
            for (let i = 0; i < uniquePrefixes.length; i += 500) {
                const batch = uniquePrefixes.slice(i, i + 500);
                await this.client.zrem(key, ...batch);
            }
        } catch (error) {
            logger.error(`[redis:trie] Failed to remove prefixes from key "${key}"`, error);
        }
    }

    /**
     * Clears the Trie key completely.
     */
    public async clear(key: string): Promise<void> {
        await this.client.del(key);
    }
}
