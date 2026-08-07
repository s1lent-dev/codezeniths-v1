import { useCallback, useEffect, useRef, useState } from 'react';
import debounce from 'lodash/debounce';
import type {
    DebouncedFunction,
    UseDebounceLodashOptions,
    UseDebounceOptions,
} from './types';


/**
 * @function useDebounce
 * Creates a debounced callback that delays invoking the provided function until after the specified delay has elapsed since the last time it was invoked.
 * Useful for optimizing performance in scenarios like search inputs or resize events.
 * @param callback The function to debounce.
 * @param delay The number of milliseconds to delay the callback invocation (default: 300ms).
 * @param options Configuration options for the debounce behavior.
 * @param options.leading Whether to invoke the callback on the leading edge of the timeout (default: false).
 * @param options.trailing Whether to invoke the callback on the trailing edge of the timeout (default: true).
 * @param options.maxWait The maximum time the callback is allowed to be delayed before it's invoked (optional).
 * @returns A debounced version of the callback function.
 *
 * @example
 * const debouncedSearch = useDebounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 500);
 */


const useDebounce = <T extends (...args: Array<any>) => any>(
    callback: T,
    delay: number = 300,
    options: UseDebounceOptions = {},
): DebouncedFunction<T> => {
    const { leading = false, trailing = true, maxWait } = options;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastCallTimeRef = useRef<number | null>(null);
    const lastInvokeTimeRef = useRef<number>(Date.now());

    const debouncedCallback = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastCall = now - (lastCallTimeRef.current ?? now);
            const timeSinceLastInvoke = now - lastInvokeTimeRef.current;

            const shouldInvoke =
                (lastCallTimeRef.current === null) ||
                (timeSinceLastCall >= delay) ||
                (maxWait && timeSinceLastInvoke >= maxWait);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (shouldInvoke && leading) {
                lastInvokeTimeRef.current = now;
                callback(...args);
            } else if (trailing) {
                timeoutRef.current = setTimeout(() => {
                    lastInvokeTimeRef.current = Date.now();
                    callback(...args);
                }, delay);
            }

            lastCallTimeRef.current = now;
        },
        [callback, delay, leading, trailing, maxWait],
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};

/**
 * @function useDebouncedValue
 * Returns a debounced version of the provided value, updating only after the specified delay has elapsed since the last change.
 * A flavor of useDebounce for debouncing state values rather than functions.
 * Useful for delaying updates to avoid frequent re-renders or API calls.
 * @template T The type of the value to debounce.
 * @param value The value to debounce.
 * @param delay The number of milliseconds to delay the value update (default: 300ms).
 * @returns The debounced value.
 *
 * @example
 * const [searchQuery, setSearchQuery] = useState('');
 * const debouncedQuery = useDebouncedValue(searchQuery, 500);
 */

const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return debouncedValue;
};


/**
 * @function useDebounceLodash
 * Creates a debounced callback using lodash's debounce function for more advanced debouncing options.
 * A lodash-based version of useDebounce for consistency and additional features.
 * @param callback The function to debounce.
 * @param delay The number of milliseconds to delay the callback invocation (default: 300ms).
 * @param options Lodash debounce options (e.g., leading, trailing, maxWait).
 * @returns A debounced version of the callback function.
 *
 * @example
 * const debouncedSearch = useDebounceLodash((query: string) => {
 *   console.log('Searching for:', query);
 * }, 500, { leading: true });
 */


const useDebounceLodash = <T extends (...args: Array<any>) => any>(
    callback: T,
    delay: number = 300,
    options: UseDebounceLodashOptions = {},
): DebouncedFunction<T> => {
    // Use lodash.debounce to create the debounced function
    const debouncedCallback = useCallback(
        debounce(callback, delay, options),
        [callback, delay, options],
    );

    // Cleanup the debounced function on unmount or dependency change
    useEffect(() => {
        return () => {
            debouncedCallback.cancel();
        };
    }, [debouncedCallback]);

    return debouncedCallback;
};

export { useDebounce, useDebouncedValue, useDebounceLodash };