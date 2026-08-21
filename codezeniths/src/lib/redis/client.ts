import { Redis } from '@upstash/redis';
import type { IRedisClient, IRedisPipeline } from './interfaces';
import { logger } from '@/service/logging';

export class UpstashRedisPipeline implements IRedisPipeline {
    private readonly pipe: ReturnType<Redis['pipeline']>;

    constructor(client: Redis) {
        this.pipe = client.pipeline();
    }

    set(key: string, value: string, ttlSeconds?: number): this {
        if (ttlSeconds) {
            this.pipe.set(key, value, { ex: ttlSeconds });
        } else {
            this.pipe.set(key, value);
        }
        return this;
    }

    del(...keys: string[]): this {
        if (keys.length > 0) {
            this.pipe.del(...keys);
        }
        return this;
    }

    expire(key: string, seconds: number): this {
        this.pipe.expire(key, seconds);
        return this;
    }

    zadd(key: string, score: number, member: string): this {
        this.pipe.zadd(key, { score, member });
        return this;
    }

    async exec(): Promise<unknown[]> {
        return this.pipe.exec();
    }
}

export class UpstashRedisClient implements IRedisClient {
    private readonly client: Redis;

    constructor(url: string, token: string) {
        this.client = new Redis({
            url,
            token,
        });
    }

    async connect(): Promise<void> {
        // Connectionless REST client
    }

    async disconnect(): Promise<void> {
        // Connectionless REST client
    }

    getClientType(): 'ioredis' | 'upstash' {
        return 'upstash';
    }

    async get(key: string): Promise<string | null> {
        const res = await this.client.get(key);
        if (res === null || res === undefined) return null;
        return typeof res === 'object' ? JSON.stringify(res) : String(res);
    }

    async set(
        key: string,
        value: string,
        ttlSeconds?: number,
        mode?: 'NX' | 'XX'
    ): Promise<'OK' | null> {
        let res;
        if (ttlSeconds && mode === 'NX') {
            res = await this.client.set(key, value, { ex: ttlSeconds, nx: true });
        } else if (ttlSeconds && mode === 'XX') {
            res = await this.client.set(key, value, { ex: ttlSeconds, xx: true });
        } else if (ttlSeconds) {
            res = await this.client.set(key, value, { ex: ttlSeconds });
        } else if (mode === 'NX') {
            res = await this.client.set(key, value, { nx: true });
        } else if (mode === 'XX') {
            res = await this.client.set(key, value, { xx: true });
        } else {
            res = await this.client.set(key, value);
        }
        return res !== null ? 'OK' : null;
    }

    async del(...keys: string[]): Promise<number> {
        if (keys.length === 0) return 0;
        return this.client.del(...keys);
    }

    async exists(...keys: string[]): Promise<number> {
        if (keys.length === 0) return 0;
        return this.client.exists(...keys);
    }

    async expire(key: string, seconds: number): Promise<number> {
        return this.client.expire(key, seconds);
    }

    async eval<T>(script: string, keys: string[], args: unknown[]): Promise<T> {
        const res = await this.client.eval(script, keys, args);
        return res as T;
    }

    pipeline(): IRedisPipeline {
        return new UpstashRedisPipeline(this.client);
    }

    async lpush(key: string, ...elements: string[]): Promise<number> {
        if (elements.length === 0) return 0;
        return this.client.lpush(key, ...elements);
    }

    async rpop(key: string): Promise<string | null> {
        const res = await this.client.rpop(key);
        if (res === null || res === undefined) return null;
        return typeof res === 'object' ? JSON.stringify(res) : String(res);
    }

    async lrange(key: string, start: number, stop: number): Promise<string[]> {
        const res = await this.client.lrange<unknown[]>(key, start, stop);
        return res.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item)));
    }

    async lrem(key: string, count: number, element: string): Promise<number> {
        return this.client.lrem(key, count, element);
    }

    async llen(key: string): Promise<number> {
        const res = await this.client.llen(key);
        return res ?? 0;
    }

    async zadd(key: string, score: number, member: string): Promise<number> {
        const res = await this.client.zadd(key, { score, member });
        return res ?? 0;
    }

    async zaddMany(key: string, entries: Array<{ score: number; member: string }>): Promise<number> {
        if (entries.length === 0) return 0;
        const CHUNK_SIZE = 500;
        let total = 0;
        for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
            const chunk = entries.slice(i, i + CHUNK_SIZE);
            const [first, ...rest] = chunk;
            if (first) {
                const res = await this.client.zadd(key, first, ...rest);
                total += typeof res === 'number' ? res : 0;
            }
        }
        return total;
    }

    async zincrby(key: string, increment: number, member: string): Promise<number> {

        const res = await this.client.zincrby(key, increment, member);
        return typeof res === 'number' ? res : parseFloat(String(res || '0'));
    }

    async zrevrank(key: string, member: string): Promise<number | null> {
        const res = await this.client.zrevrank(key, member);
        return res !== null && res !== undefined ? Number(res) : null;
    }

    async zscore(key: string, member: string): Promise<number | null> {
        const res = await this.client.zscore(key, member);
        return res !== null && res !== undefined ? Number(res) : null;
    }

    async zrange(
        key: string,
        min: number | string,
        max: number | string,
        options?: { byScore?: boolean; byLex?: boolean; limit?: { offset: number; count: number } }
    ): Promise<string[]> {
        let res: unknown[];
        if (options?.byLex) {
            const upstashOpts = options.limit 
                ? { byLex: true as const, limit: options.limit } 
                : { byLex: true as const };
            res = await this.client.zrange<unknown[]>(key, min as any, max as any, upstashOpts);
        } else if (options?.byScore) {
            const upstashOpts = options.limit 
                ? { byScore: true as const, limit: options.limit } 
                : { byScore: true as const };
            res = await this.client.zrange<unknown[]>(key, min as any, max as any, upstashOpts);
        } else {
            res = await this.client.zrange<unknown[]>(key, min as any, max as any);
        }
        return res.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item)));
    }

    async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
        const res = await this.client.zrange<unknown[]>(key, start, stop, { rev: true });
        return res.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item)));
    }

    async zrevrangeWithScores(key: string, start: number, stop: number): Promise<Array<{ member: string; score: number }>> {
        const res = await this.client.zrange<unknown[]>(key, start, stop, { rev: true, withScores: true });
        // @upstash/redis withScores returns array of { member, score } or alternating array
        if (!Array.isArray(res)) return [];
        const result: Array<{ member: string; score: number }> = [];
        for (let i = 0; i < res.length; i++) {
            const item = res[i];
            if (typeof item === 'object' && item !== null && 'member' in item && 'score' in item) {
                result.push({ member: String((item as any).member), score: Number((item as any).score) });
            } else if (typeof item === 'string' && i + 1 < res.length && typeof res[i + 1] === 'number') {
                result.push({ member: item, score: Number(res[i + 1]) });
                i++;
            }
        }
        return result;
    }

    async zrem(key: string, ...members: string[]): Promise<number> {
        if (members.length === 0) return 0;
        return this.client.zrem(key, ...members);
    }

    async zcard(key: string): Promise<number> {
        return this.client.zcard(key);
    }

    async zremrangebyscore(key: string, min: number | string, max: number | string): Promise<number> {
        return this.client.zremrangebyscore(key, min as any, max as any);
    }

    async publish(channel: string, message: string): Promise<number> {
        return this.client.publish(channel, message);
    }

    async subscribe(channel: string, handler: (message: string) => void): Promise<() => void> {
        logger.warn(
            `[redis:upstash] Subscribe called for channel "${channel}". ` +
            'Realtime PubSub subscribe is not supported/recommended in Edge/REST runtime.'
        );
        return () => {};
    }
}
