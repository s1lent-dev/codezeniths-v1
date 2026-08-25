import { defaultRedisClient } from './factory';
import { RedisService } from './services/facade';

export * from './interfaces';
export * from './factory';
export * from './client';
export * from './services';
export * from './redis.store';

// Primary facade — the single entry point for all Redis operations
export const redisService = new RedisService(defaultRedisClient);

