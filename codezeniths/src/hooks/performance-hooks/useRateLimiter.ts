'use client';

import { useCallback, useRef } from 'react';
import type {
    QueueItem,
    RateLimitedFunction,
    RateLimitOptions,
} from './types';

/**
 * @function useRateLimiter
 * Creates a rate-limited callback that ensures the provided function is invoked no more than `limit` times within the `windowMs` period.
 * Excess calls are queued and processed asynchronously as soon as a slot becomes available, preventing rapid API calls.
 * Useful for rate-limiting requests to external services like serverless functions.
 * @template T The type of the callback function.
 * @param callback The function to rate-limit (should ideally return a Promise for API calls).
 * @param options Configuration options for the rate limit.
 * @param options.limit The maximum number of invocations allowed within the time window (default: 5).
 * @param options.windowMs The time window in milliseconds for the rate limit (default: 1000).
 * @returns A rate-limited version of the callback function that returns a Promise.
 *
 * @example
 * const limitedApiCall = useRateLimiter(async (endpoint: string) => {
 *   const response = await fetch(endpoint);
 *   return response.json();
 * }, { limit: 10, windowMs: 60000 }); // 10 calls per minute
 *
 * // Usage:
 * limitedApiCall('/api/data'); // Returns Promise, queues if over limit
 */

const useRateLimiter = <T extends (...args: Array<unknown>) => unknown>(
    callback: T,
    options: RateLimitOptions = {},
): RateLimitedFunction<T> => {
    const { limit = 5, windowMs = 1000 } = options;
    const callTimesRef = useRef<Array<number>>([]);
    const queueRef = useRef<Array<QueueItem<T>>>([]);
    const isProcessingRef = useRef(false);

    const processQueue = useCallback(async () => {
        if (isProcessingRef.current || queueRef.current.length === 0) {
            return;
        }

        isProcessingRef.current = true;

        while (queueRef.current.length > 0) {
            const now = Date.now();
            callTimesRef.current = callTimesRef.current.filter((time) => now - time < windowMs);

            if (callTimesRef.current.length >= limit) {
                // Wait for the next available slot
                const [oldestTime] = callTimesRef.current;
                if (oldestTime !== undefined) {
                    const waitTime = windowMs - (now - oldestTime) + 1; // Small epsilon for precision
                    setTimeout(processQueue, waitTime);
                }
                break;
            }

            const queueItem = queueRef.current.shift();
            if (!queueItem) {
                break;
            }

            const { args, resolve, reject } = queueItem;
            try {
                callTimesRef.current.push(now);
                const result = await callback(...args);
                resolve(result as Awaited<ReturnType<T>>);
            } catch (error) {
                reject(error);
            }
        }

        isProcessingRef.current = false;
    }, [callback, limit, windowMs]);

    const rateLimitedCallback = useCallback(
        (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
            return new Promise((resolve, reject) => {
                queueRef.current.push({ args, resolve, reject });
                processQueue();
            });
        },
        [processQueue],
    );

    return rateLimitedCallback;
};

export { useRateLimiter };
export default useRateLimiter;