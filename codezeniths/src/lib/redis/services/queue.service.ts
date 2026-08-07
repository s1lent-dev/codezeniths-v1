import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export class QueueService {
    constructor(private readonly client: IRedisClient) {}

    private buildQueueKey(key: string): string {
        return `queue:${key}`;
    }

    /**
     * Pushes an item onto the queue (FIFO: left push).
     */
    async enqueue(key: string, item: unknown): Promise<number> {
        try {
            const queueKey = this.buildQueueKey(key);
            const value = typeof item === 'string' ? item : JSON.stringify(item);
            return await this.client.lpush(queueKey, value);
        } catch (error) {
            logger.error(`[redis:queue] Enqueue failed for queue "${key}"`, error);
            return 0;
        }
    }

    /**
     * Pops an item from the queue (FIFO: right pop).
     */
    async dequeue(key: string): Promise<string | null> {
        try {
            const queueKey = this.buildQueueKey(key);
            return await this.client.rpop(queueKey);
        } catch (error) {
            logger.error(`[redis:queue] Dequeue failed for queue "${key}"`, error);
            return null;
        }
    }

    /**
     * Returns the size of the queue.
     */
    async length(key: string): Promise<number> {
        try {
            const queueKey = this.buildQueueKey(key);
            return await this.client.llen(queueKey);
        } catch (error) {
            logger.error(`[redis:queue] Length failed for queue "${key}"`, error);
            return 0;
        }
    }

    /**
     * Deletes the queue.
     */
    async clear(key: string): Promise<void> {
        try {
            const queueKey = this.buildQueueKey(key);
            await this.client.del(queueKey);
        } catch (error) {
            logger.error(`[redis:queue] Clear failed for queue "${key}"`, error);
        }
    }
}
