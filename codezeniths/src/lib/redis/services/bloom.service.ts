import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export class BloomFilterService {
    constructor(private readonly client: IRedisClient) {}

    private buildKey(namespace: string): string {
        return `bloom:${namespace}`;
    }

    async reserve(namespace: string, errorRate: number, capacity: number): Promise<void> {
        try {
            const script = `return redis.call('BF.RESERVE', KEYS[1], ARGV[1], ARGV[2])`;
            await this.client.eval(script, [this.buildKey(namespace)], [String(errorRate), String(capacity)]);
        } catch (error) {
            // Might throw if it already exists, which is fine
            logger.warn(`[redis:bloom] reserve failed for namespace ${namespace}, it may already exist.`);
        }
    }

    async add(namespace: string, item: string): Promise<boolean> {
        try {
            const script = `return redis.call('BF.ADD', KEYS[1], ARGV[1])`;
            const result = await this.client.eval<number>(script, [this.buildKey(namespace)], [item.toLowerCase()]);
            return result === 1; // 1 if newly added, 0 if already exists
        } catch (error) {
            logger.error(`[redis:bloom] add failed for namespace ${namespace}`, error);
            return false;
        }
    }

    async exists(namespace: string, item: string): Promise<boolean> {
        try {
            const script = `return redis.call('BF.EXISTS', KEYS[1], ARGV[1])`;
            const result = await this.client.eval<number>(script, [this.buildKey(namespace)], [item.toLowerCase()]);
            return result === 1;
        } catch (error) {
            logger.error(`[redis:bloom] exists failed for namespace ${namespace}. Falling back to true.`, error);
            // Fallback to true (taken) if error, forcing DB check
            return true; 
        }
    }
}
