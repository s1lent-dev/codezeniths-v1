'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { createCache } from './cache';
import type {
    UseCacheOptions,
    UseCacheReturn,
} from '../types';

export default function useCache<T>({
    key,
    fetcher,
    enabled = true,
    ttl,
    maxSize = 50,
    staleTime = 0,
    gcInterval = 60000,
    debounceMs = 0,
    strategy = 'lru',
}: UseCacheOptions<T>): UseCacheReturn<T> {
    const cache = useMemo(
        () => createCache<T>({ maxSize, ttl, strategy }),
        [maxSize, ttl, strategy],
    );
    const [data, setData] = useState<T | undefined>(() => cache.get(key));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [lastFetchTime, setLastFetchTime] = useState<number>(0);

    const isStale = useMemo(
        () =>
            !!staleTime && Date.now() - lastFetchTime > staleTime,
        [staleTime, lastFetchTime],
    );

    const debouncedFetcher = useMemo(
        () => (fetcher && debounceMs ? debounce(fetcher, debounceMs) : fetcher),
        [fetcher, debounceMs],
    );

    const fetchData = useCallback(async () => {
        if (!fetcher || !enabled) {return;}
        setIsLoading(true);
        setError(null);

        try {
            const result = await (debouncedFetcher || fetcher)();
            if (result !== undefined) {
                cache.set(key, result, ttl);
                setData(result);
                setLastFetchTime(Date.now());
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Fetch failed'));
        } finally {
            setIsLoading(false);
        }
    }, [cache, key, fetcher, debouncedFetcher, enabled, ttl, setLastFetchTime]);

    useEffect(() => {
        const cachedData = cache.get(key);
        if (cachedData) {
            setData(cachedData);
        } else if (enabled && fetcher) {
            fetchData();
        }
    }, [key, enabled, fetchData, cache, fetcher]);

    useEffect(() => {
        if (!gcInterval) {return;}
        const interval = setInterval(() => cache.cleanup(), gcInterval);
        return () => clearInterval(interval);
    }, [cache, gcInterval]);

    const set = useCallback(
        (value: T, valueTtl?: number) => {
            cache.set(key, value, valueTtl);
            setData(value);
            setLastFetchTime(Date.now());
        },
        [cache, key, setLastFetchTime],
    );

    const remove = useCallback(() => {
        cache.delete(key);
        setData(undefined);
        setLastFetchTime(0);
    }, [cache, key, setLastFetchTime]);

    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        error,
        isStale,
        refetch,
        set,
        remove,
        stats: cache.getStats(),
    };
}