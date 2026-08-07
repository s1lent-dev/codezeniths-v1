import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export class ListService {
    constructor(private readonly client: IRedisClient) {}

    private buildKey(key: string): string {
        return `list:${key}`;
    }

    async push(key: string, ...elements: string[]): Promise<number> {
        try {
            return await this.client.lpush(this.buildKey(key), ...elements);
        } catch (error) {
            logger.error(`[redis:list] Push failed for key "${key}"`, error);
            return 0;
        }
    }

    async pop(key: string): Promise<string | null> {
        try {
            return await this.client.rpop(this.buildKey(key));
        } catch (error) {
            logger.error(`[redis:list] Pop failed for key "${key}"`, error);
            return null;
        }
    }

    async range(key: string, start: number, stop: number): Promise<string[]> {
        try {
            return await this.client.lrange(this.buildKey(key), start, stop);
        } catch (error) {
            logger.error(`[redis:list] Range failed for key "${key}"`, error);
            return [];
        }
    }

    async remove(key: string, count: number, element: string): Promise<number> {
        try {
            return await this.client.lrem(this.buildKey(key), count, element);
        } catch (error) {
            logger.error(`[redis:list] Remove failed for key "${key}"`, error);
            return 0;
        }
    }

    async len(key: string): Promise<number> {
        try {
            return await this.client.llen(this.buildKey(key));
        } catch (error) {
            logger.error(`[redis:list] Len failed for key "${key}"`, error);
            return 0;
        }
    }
}
