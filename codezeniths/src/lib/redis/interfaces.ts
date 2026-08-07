export interface IRedisPipeline {
    set(key: string, value: string, ttlSeconds?: number): this;
    del(...keys: string[]): this;
    expire(key: string, seconds: number): this;
    exec(): Promise<unknown[]>;
    zadd(key: string, score: number, member: string): this;
}

export interface IRedisClient {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getClientType(): 'ioredis' | 'upstash';
    
    // Core Key-Value
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttlSeconds?: number, mode?: 'NX' | 'XX'): Promise<'OK' | null>;
    del(...keys: string[]): Promise<number>;
    exists(...keys: string[]): Promise<number>;
    expire(key: string, seconds: number): Promise<number>;
    eval<T>(script: string, keys: string[], args: unknown[]): Promise<T>;
    pipeline(): IRedisPipeline;

    // List Operations
    lpush(key: string, ...elements: string[]): Promise<number>;
    rpop(key: string): Promise<string | null>;
    lrange(key: string, start: number, stop: number): Promise<string[]>;
    lrem(key: string, count: number, element: string): Promise<number>;
    llen(key: string): Promise<number>;

    // Sorted Set (ZSet) Operations
    zadd(key: string, score: number, member: string): Promise<number>;
    zrange(
        key: string, 
        min: number | string, 
        max: number | string, 
        options?: { byScore?: boolean; byLex?: boolean; limit?: { offset: number; count: number } }
    ): Promise<string[]>;
    zrem(key: string, ...members: string[]): Promise<number>;
    zcard(key: string): Promise<number>;
    zremrangebyscore(key: string, min: number | string, max: number | string): Promise<number>;

    // PubSub Operations
    publish(channel: string, message: string): Promise<number>;
    subscribe(channel: string, handler: (message: string) => void): Promise<() => void>;
}
