import type { SecondaryStorage } from 'better-auth';
import type { IRedisClient } from '@/lib/redis/interfaces';


const AUTH_NAMESPACE = 'auth:kv';

function buildKey(key: string): string {
    return `${AUTH_NAMESPACE}:${key}`;
}

export function createAuthRedisStorage(client: IRedisClient): SecondaryStorage {
    return {
        async get(key: string): Promise<string | null> {
            return client.get(buildKey(key));
        },
        async set(key: string, value: string, ttl?: number): Promise<void> {
            await client.set(buildKey(key), value, ttl);
        },
        async delete(key: string): Promise<void> {
            await client.del(buildKey(key));
        },
        async getAndDelete(key: string): Promise<string | null> {
            const nsKey = buildKey(key);
            const script = `
                local val = redis.call("get", KEYS[1])
                if val then
                    redis.call("del", KEYS[1])
                end
                return val
            `;
            const result = await client.eval<string | null>(script, [nsKey], []);
            return result ?? null;
        },
        async increment(key: string, ttl: number): Promise<number> {
            const nsKey = buildKey(key);
            const script = `
                local current = redis.call("incr", KEYS[1])
                if current == 1 then
                    redis.call("expire", KEYS[1], ARGV[1])
                end
                return current
            `;
            const result = await client.eval<number>(script, [nsKey], [ttl]);
            return result;
        },
    };
}

export type AuthRedisStorage = ReturnType<typeof createAuthRedisStorage>;
