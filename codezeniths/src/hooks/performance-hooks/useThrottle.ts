'use client';

import { useCallback, useEffect, useRef } from 'react';
import throttle from 'lodash/throttle';

/**
 * @function useThrottle
 * Creates a throttled callback that invokes the provided function at most once per specified delay period.
 * Useful for optimizing performance in scenarios like scroll events or mouse movements.
 * @param callback The function to throttle.
 * @param delay The number of milliseconds to throttle the callback invocation (default: 300ms).
 * @param options Configuration options for the throttle behavior.
 * @param options.leading Whether to invoke the callback on the leading edge of the timeout (default: true).
 * @param options.trailing Whether to invoke the callback on the trailing edge of the timeout (default: true).
 * @returns A throttled version of the callback function.
 *
 * @example
 * const throttledScroll = useThrottle((event: Event) => {
 *   console.log('Scrolling:', event);
 * }, 500);
 */
interface UseThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

type ThrottledFunction<T extends (...args: Array<any>) => any> = (...args: Parameters<T>) => void;

const useThrottle = <T extends (...args: Array<any>) => any>(
    callback: T,
    delay: number = 300,
    options: UseThrottleOptions = {},
): ThrottledFunction<T> => {
    const { leading = true, trailing = true } = options;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastArgsRef = useRef<Parameters<T> | null>(null);
    const lastThisRef = useRef<unknown>(null);
    const lastInvokeTimeRef = useRef<number>(0);
    const resultRef = useRef<ReturnType<T> | undefined>(undefined);

    const throttledCallback = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastInvoke = now - lastInvokeTimeRef.current;
            const remaining = delay - timeSinceLastInvoke;

            lastArgsRef.current = args;
            lastThisRef.current = this;

            if (remaining <= 0 || remaining > delay) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                if (leading && timeSinceLastInvoke > 0) {
                    lastInvokeTimeRef.current = now;
                    resultRef.current = callback.apply(lastThisRef.current, lastArgsRef.current);
                }
            } else if (!timeoutRef.current && trailing) {
                timeoutRef.current = setTimeout(() => {
                    lastInvokeTimeRef.current = Date.now();
                    timeoutRef.current = null;
                    resultRef.current = callback.apply(lastThisRef.current, lastArgsRef.current as Parameters<T>);
                }, remaining);
            }

            return resultRef.current;
        },
        [callback, delay, leading, trailing],
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return throttledCallback;
};

/**
 * @function useThrottleLodash
 * Creates a throttled callback using lodash's throttle function for more advanced throttling options.
 * A lodash-based version of useThrottle for consistency and additional features.
 * @param callback The function to throttle.
 * @param delay The number of milliseconds to throttle the callback invocation (default: 300ms).
 * @param options Lodash throttle options (e.g., leading, trailing).
 * @returns A throttled version of the callback function.
 *
 * @example
 * const throttledResize = useThrottleLodash((event: Event) => {
 *   console.log('Resizing:', event);
 * }, 500, { leading: true, trailing: false });
 */
interface UseThrottleLodashOptions {
    leading?: boolean;
    trailing?: boolean;
}

const useThrottleLodash = <T extends (...args: Array<any>) => any>(
    callback: T,
    delay: number = 300,
    options: UseThrottleLodashOptions = {},
): ThrottledFunction<T> => {
    // Use lodash.throttle to create the throttled function
    const throttledCallback = useCallback(
        throttle(callback, delay, options),
        [callback, delay, options],
    );

    // Cleanup the throttled function on unmount or dependency change
    useEffect(() => {
        return () => {
            throttledCallback.cancel();
        };
    }, [throttledCallback]);

    return throttledCallback;
};

export { useThrottle, useThrottleLodash };