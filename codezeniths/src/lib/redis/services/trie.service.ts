import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

/**
 * Service to manage a Redis Sorted Set specifically used as a Trie for autocomplete.
 */
export class TrieService {
    constructor(private readonly client: IRedisClient) {}

    /**
     * Adds an array of prefixes to a given Redis Sorted Set.
     */
    public async addPrefixes(key: string, prefixes: string[]): Promise<void> {
        try {
            const pipeline = this.client.pipeline();
            for (const p of prefixes) {
                pipeline.zadd(key, 0, p);
            }
            await pipeline.exec();
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
     * Clears the Trie key completely.
     */
    public async clear(key: string): Promise<void> {
        await this.client.del(key);
    }
}
