import { ENV_CONFIG } from '@/config/config';
import type { IRedisClient } from './interfaces';
import { UpstashRedisClient } from './client';
import { logger } from '@/service/logging';

export function createRedisClient(): IRedisClient {
    if (!ENV_CONFIG.UPSTASH_REDIS_REST_URL || !ENV_CONFIG.UPSTASH_REDIS_REST_TOKEN) {
        logger.error('[redis:factory] UPSTASH_REDIS_REST_URL or TOKEN are not configured!');
        throw new Error('Upstash Redis is not fully configured.');
    }
    
    logger.info('[redis:factory] Instantiating Upstash HTTP Redis client.');
    return new UpstashRedisClient(
        ENV_CONFIG.UPSTASH_REDIS_REST_URL, 
        ENV_CONFIG.UPSTASH_REDIS_REST_TOKEN
    );
}

// Hot reloading support in development to prevent duplicate connections
const globalForRedis = globalThis as unknown as { __globalRedisClientInstance?: IRedisClient };

export const defaultRedisClient = globalForRedis.__globalRedisClientInstance ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
    globalForRedis.__globalRedisClientInstance = defaultRedisClient;
}
