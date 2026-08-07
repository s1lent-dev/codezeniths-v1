import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export class SortedListService {
    constructor(private readonly client: IRedisClient) {}

    private buildKey(key: string): string {
        return `zset:${key}`;
    }

    async add(key: string, score: number, member: string): Promise<number> {
        try {
            return await this.client.zadd(this.buildKey(key), score, member);
        } catch (error) {
            logger.error(`[redis:sorted-list] Add failed for key "${key}"`, error);
            return 0;
        }
    }

    async range(
        key: string,
        min: number | string,
        max: number | string,
        options?: { byScore?: boolean; limit?: { offset: number; count: number } }
    ): Promise<string[]> {
        try {
            return await this.client.zrange(this.buildKey(key), min, max, options);
        } catch (error) {
            logger.error(`[redis:sorted-list] Range failed for key "${key}"`, error);
            return [];
        }
    }

    async remove(key: string, ...members: string[]): Promise<number> {
        if (members.length === 0) return 0;
        try {
            return await this.client.zrem(this.buildKey(key), ...members);
        } catch (error) {
            logger.error(`[redis:sorted-list] Remove failed for key "${key}"`, error);
            return 0;
        }
    }

    async len(key: string): Promise<number> {
        try {
            return await this.client.zcard(this.buildKey(key));
        } catch (error) {
            logger.error(`[redis:sorted-list] Len failed for key "${key}"`, error);
            return 0;
        }
    }

    async removeRangeByScore(key: string, min: number | string, max: number | string): Promise<number> {
        try {
            return await this.client.zremrangebyscore(this.buildKey(key), min, max);
        } catch (error) {
            logger.error(`[redis:sorted-list] RemoveRangeByScore failed for key "${key}"`, error);
            return 0;
        }
    }
}
