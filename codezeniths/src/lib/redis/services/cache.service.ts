import type { ZodType } from 'zod';
import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export interface CacheStoreOptions<T> {
    namespace: string;
    ttlSeconds?: number;
    schema?: ZodType<T>;
}

const DEFAULT_TTL_SECONDS = 60 * 5;
const TTL_JITTER_RATIO = 0.1; // +/-10%

function withJitter(ttlSeconds: number): number {
    const jitter = ttlSeconds * TTL_JITTER_RATIO;
    const delta = Math.floor(Math.random() * jitter * 2) - jitter;
    return Math.max(1, Math.round(ttlSeconds + delta));
}

export class CacheStore<T> {
    private readonly namespace: string;
    private readonly defaultTtl?: number;
    private readonly schema?: ZodType<T>;

    constructor(
        private readonly client: IRedisClient,
        options: CacheStoreOptions<T>
    ) {
        this.namespace = options.namespace;
        this.defaultTtl = options.ttlSeconds;
        this.schema = options.schema;
    }

    private buildKey(key: string): string {
        return `${this.namespace}:${key}`;
    }

    private decode(raw: string): T | null {
        try {
            const parsed = JSON.parse(raw);
            if (!this.schema) return parsed as T;
            const result = this.schema.safeParse(parsed);
            if (result.success) return result.data;
            
            logger.warn(
                `[redis:cache:${this.namespace}] Zod validation failed for cached data. ` +
                'Data format is outdated or corrupted. Triggering eviction.'
            );
            return null;
        } catch {
            return null;
        }
    }

    private serialize(value: T): string {
        return JSON.stringify(value);
    }

    async get(key: string): Promise<T | null> {
        try {
            const raw = await this.client.get(this.buildKey(key));
            if (raw === null) return null;
            const decoded = this.decode(raw);
            if (decoded === null) {
                void this.del(key); // Evict corrupted payload
            }
            return decoded;
        } catch (error) {
            logger.error(`[redis:cache:${this.namespace}] Get failed for key "${key}". Failing open.`, error);
            return null;
        }
    }

    async set(key: string, value: T, ttlSeconds?: number): Promise<void> {
        try {
            const ttl = ttlSeconds !== undefined ? ttlSeconds : (this.defaultTtl ?? DEFAULT_TTL_SECONDS);
            const raw = this.serialize(value);
            if (ttl <= 0) {
                // Unlimited TTL
                await this.client.set(this.buildKey(key), raw);
            } else {
                await this.client.set(this.buildKey(key), raw, withJitter(ttl));
            }
        } catch (error) {
            logger.error(`[redis:cache:${this.namespace}] Set failed for key "${key}"`, error);
        }
    }

    async getOrSet(key: string, fetcher: () => Promise<T>, ttlSeconds?: number): Promise<T> {
        const cached = await this.get(key);
        logger.info(`[redis:cache:${this.namespace}] Cache hit for key "${key}"`, { ttlSeconds });
        
        if (cached !== null) return cached;
        
        const fresh = await fetcher();
        void this.set(key, fresh, ttlSeconds);
        return fresh;
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(this.buildKey(key));
        } catch (error) {
            logger.error(`[redis:cache:${this.namespace}] Del failed for key "${key}"`, error);
        }
    }

    async has(key: string): Promise<boolean> {
        try {
            const count = await this.client.exists(this.buildKey(key));
            return count > 0;
        } catch {
            return false;
        }
    }

    async mget(keys: string[]): Promise<Array<T | null>> {
        if (keys.length === 0) return [];
        try {
            return await Promise.all(keys.map((key) => this.get(key)));
        } catch (error) {
            logger.error(`[redis:cache:${this.namespace}] Mget failed`, error);
            return keys.map(() => null);
        }
    }

    async mset(entries: Array<{ key: string; value: T }>, ttlSeconds?: number): Promise<void> {
        if (entries.length === 0) return;
        try {
            const pipeline = this.client.pipeline();
            const ttl = ttlSeconds ?? this.defaultTtl ?? DEFAULT_TTL_SECONDS;
            for (const { key, value } of entries) {
                pipeline.set(this.buildKey(key), this.serialize(value), withJitter(ttl));
            }
            await pipeline.exec();
        } catch (error) {
            logger.error(`[redis:cache:${this.namespace}] Mset failed`, error);
        }
    }

    async touch(key: string, ttlSeconds?: number): Promise<void> {
        try {
            const ttl = ttlSeconds ?? this.defaultTtl ?? DEFAULT_TTL_SECONDS;
            await this.client.expire(this.buildKey(key), withJitter(ttl));
        } catch (error) {
            logger.error(`[redis:cache:${this.namespace}] Touch failed for key "${key}"`, error);
        }
    }

    async invalidateNamespace(): Promise<void> {
        try {
            const pattern = `${this.namespace}:*`;
            const script = `
                local keys = redis.call('keys', ARGV[1])
                if #keys > 0 then
                    for i=1,#keys,5000 do
                        redis.call('del', unpack(keys, i, math.min(i+4999, #keys)))
                    end
                end
                return #keys
            `;
            await this.client.eval(script, [], [pattern]);
        } catch (error) {
            logger.error(`[redis:cache:${this.namespace}] Invalidate namespace failed`, error);
        }
    }
}

export class CacheService {
    constructor(private readonly client: IRedisClient) {}

    createStore<T>(options: CacheStoreOptions<T>): CacheStore<T> {
        return new CacheStore<T>(this.client, options);
    }
}
