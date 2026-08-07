import { AppErrorBuilder } from '@/service/error';
import { ErrorCode } from '@/service/error/error.types';
import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    reset: number; // UTC timestamp in milliseconds when the limit resets
}

export class RateLimitService {
    constructor(private readonly client: IRedisClient) {}

    private buildLimitKey(key: string): string {
        return `ratelimit:${key}`;
    }

    /**
     * Checks if a request is allowed under sliding window rate limiting.
     * Evaluates atomically via Lua to prevent race conditions and handle sub-millisecond concurrency.
     */
    async isAllowed(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
        try {
            const limitKey = this.buildLimitKey(key);
            const nowMs = Date.now();
            const windowMs = windowSeconds * 1000;
            const requestId = crypto.randomUUID();

            const script = `
                local key = KEYS[1]
                local now = tonumber(ARGV[1])
                local window = tonumber(ARGV[2])
                local limit = tonumber(ARGV[3])
                local reqId = ARGV[4]
                local clearBefore = now - window

                -- Remove elements outside the sliding window
                redis.call('zremrangebyscore', key, 0, clearBefore)
                
                -- Count current request count in this window
                local currentRequests = redis.call('zcard', key)

                local allowed = 0
                local remaining = limit - currentRequests

                if currentRequests < limit then
                    -- Append a unique request ID to handle sub-millisecond concurrency collisions
                    redis.call('zadd', key, now, now .. ":" .. reqId)
                    redis.call('expire', key, math.ceil(window / 1000))
                    allowed = 1
                    remaining = remaining - 1
                end

                -- Find the oldest request to calculate accurate reset time
                local oldest = redis.call('zrange', key, 0, 0)
                local reset = now + window
                if #oldest > 0 then
                    local sepIdx = string.find(oldest[1], ":")
                    local oldestTimeStr = sepIdx and string.sub(oldest[1], 1, sepIdx - 1) or oldest[1]
                    reset = tonumber(oldestTimeStr) + window
                end

                return { allowed, remaining, reset }
            `;

            const [allowed, remaining, reset] = await this.client.eval<[number, number, number]>(
                script,
                [limitKey],
                [nowMs, windowMs, limit, requestId]
            );

            return {
                allowed: allowed === 1,
                remaining,
                reset,
            };
        } catch (error) {
            logger.error(`[redis:ratelimit] Rate limit check failed for key "${key}"`, error);
            throw new AppErrorBuilder(`Failed to check rate limit for: ${key}`)
                .setCode(ErrorCode.TIMEOUT)
                .setOperational(true)
                .setCause(error instanceof Error ? error : new Error(String(error)))
                .build();
        }
    }
}
