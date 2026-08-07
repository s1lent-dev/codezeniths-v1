import { AppErrorBuilder } from '@/service/error';
import { ErrorCode } from '@/service/error/error.types';
import type { IRedisClient } from '../interfaces';
import { logger } from '@/service/logging';

export class LockService {
    constructor(private readonly client: IRedisClient) {}

    private buildLockKey(key: string): string {
        return `lock:${key}`;
    }

    /**
     * Acquires a distributed lock.
     * Returns a random UUID token string on success, or null if the lock is already held.
     */
    async acquire(key: string, ttlSeconds: number): Promise<string | null> {
        try {
            const token = crypto.randomUUID();
            const lockKey = this.buildLockKey(key);
            const res = await this.client.set(lockKey, token, ttlSeconds, 'NX');
            return res === 'OK' ? token : null;
        } catch (error) {
            logger.error(`[redis:lock] Acquire failed for key "${key}"`, error);
            throw new AppErrorBuilder(`Failed to acquire distributed lock for key: ${key}`)
                .setCode(ErrorCode.TIMEOUT)
                .setOperational(true)
                .setCause(error instanceof Error ? error : new Error(String(error)))
                .build();
        }
    }

    /**
     * Releases a distributed lock only if the token matches the lock owner.
     * Returns true if released, or false if not matching/already released.
     */
    async release(key: string, token: string): Promise<boolean> {
        try {
            const lockKey = this.buildLockKey(key);
            const script = `
                if redis.call("get", KEYS[1]) == ARGV[1] then
                    return redis.call("del", KEYS[1])
                else
                    return 0
                end
            `;
            const result = await this.client.eval<number>(script, [lockKey], [token]);
            return result === 1;
        } catch (error) {
            logger.error(`[redis:lock] Release failed for key "${key}"`, error);
            throw new AppErrorBuilder(`Failed to release distributed lock for key: ${key}`)
                .setCode(ErrorCode.INTERNAL_SERVER_ERROR)
                .setOperational(true)
                .setCause(error instanceof Error ? error : new Error(String(error)))
                .build();
        }
    }
}
