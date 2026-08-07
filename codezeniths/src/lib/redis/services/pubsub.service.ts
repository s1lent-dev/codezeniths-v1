import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export class PubSubService {
    constructor(private readonly client: IRedisClient) {}

    /**
     * Publishes a message to a Redis channel.
     * Objects are automatically serialized to JSON.
     */
    async publish(channel: string, message: unknown): Promise<number> {
        try {
            const payload = typeof message === 'string' ? message : JSON.stringify(message);
            return await this.client.publish(channel, payload);
        } catch (error) {
            logger.error(`[redis:pubsub] Publish to channel "${channel}" failed`, error);
            return 0;
        }
    }

    /**
     * Subscribes to a Redis channel.
     * Returns an unsubscribe function.
     */
    async subscribe(channel: string, handler: (message: string) => void): Promise<() => void> {
        try {
            return await this.client.subscribe(channel, handler);
        } catch (error) {
            logger.error(`[redis:pubsub] Subscribe to channel "${channel}" failed`, error);
            return () => {};
        }
    }
}
