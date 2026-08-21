'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
    InfiniteScrollConfig,
    InfiniteScrollQueryConfig,
    InfiniteScrollQueryFunction,
    LoadMoreFunction,
    PageData,
    PageParam,
    UseInfiniteScrollQueryReturn,
    UseInfiniteScrollReturn,
} from './types';


export function useInfiniteScroll(
    loadMore: LoadMoreFunction<boolean>,
    config: InfiniteScrollConfig = {},
): UseInfiniteScrollReturn {
    const {
        threshold = 100,
        debounceMs = 200,
        enabled = true,
        rootElement = null,
        rootMargin = '0px',
        useIntersectionObserver = true,
    } = config;

    // State management
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Refs for DOM elements
    const triggerRef = useRef<HTMLElement | null>(null);
    const containerRef = useRef<HTMLElement | null>(null);

    // Internal state refs
    const lastLoadTimeRef = useRef<number>(0);
    const loadingRef = useRef(false);

    const debouncedLoadMore = useCallback(async () => {
        const now = Date.now();

        // Prevent concurrent loads and respect debounce timing
        if (
            loadingRef.current ||
            !enabled ||
            !hasMore ||
            (now - lastLoadTimeRef.current < debounceMs)
        ) {
            return;
        }

        try {
            loadingRef.current = true;
            setIsLoading(true);
            setError(null);
            lastLoadTimeRef.current = now;

            const hasMoreData = await loadMore();
            setHasMore(Boolean(hasMoreData));
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to load more items');
            setError(error);
            console.error('Infinite scroll load error:', error);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [loadMore, enabled, hasMore, debounceMs]);

    useEffect(() => {
        if (!useIntersectionObserver || !triggerRef.current || !enabled) {
            return;
        }

        const trigger = triggerRef.current;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry?.isIntersecting && hasMore && !isLoading) {
                    debouncedLoadMore();
                }
            },
            {
                root: rootElement,
                rootMargin,
                threshold: 0.1,
            },
        );

        observer.observe(trigger);

        return () => {
            observer.unobserve(trigger);
            observer.disconnect();
        };
    }, [
        useIntersectionObserver,
        enabled,
        hasMore,
        isLoading,
        debouncedLoadMore,
        rootElement,
        rootMargin,
    ]);

    useEffect(() => {
        if (useIntersectionObserver || !enabled) {
            return;
        }

        const handleScroll = () => {
            const container = containerRef.current ?? window.document.documentElement;
            const scrollTop = container === window.document.documentElement
                ? window.pageYOffset
                : container.scrollTop;
            const { scrollHeight } = container;
            const clientHeight = container === window.document.documentElement
                ? window.innerHeight
                : container.clientHeight;

            if (
                scrollHeight - (scrollTop + clientHeight) <= threshold &&
                hasMore &&
                !isLoading
            ) {
                debouncedLoadMore();
            }
        };

        const target = containerRef.current || window;
        target.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            target.removeEventListener('scroll', handleScroll);
        };
    }, [
        useIntersectionObserver,
        enabled,
        threshold,
        hasMore,
        isLoading,
        debouncedLoadMore,
    ]);

    const manualLoadMore = useCallback(() => {
        if (!isLoading && hasMore && enabled) {
            debouncedLoadMore();
        }
    }, [debouncedLoadMore, isLoading, hasMore, enabled]);

    const reset = useCallback(() => {
        setIsLoading(false);
        setHasMore(true);
        setError(null);
        lastLoadTimeRef.current = 0;
        loadingRef.current = false;
    }, []);

    return {
        isLoading,
        hasMore,
        error,
        loadMore: manualLoadMore,
        triggerRef,
        containerRef,
        reset,
    };
}

const DEFAULT_INITIAL_PAGE_PARAM: PageParam = {
    page: 1,
    limit: 20,
};

function flattenPages<TData>(pages: Array<PageData<TData>>): Array<TData> {
    return pages.reduce<Array<TData>>((acc, page) => {
        return [...acc, ...page.items];
    }, []);
}

function calculateTotalCount<TData>(pages: Array<PageData<TData>>): number {
    const lastPage = pages[pages.length - 1];
    if (lastPage?.totalCount !== undefined) {
        return lastPage.totalCount;
    }
    return pages.reduce((sum, page) => sum + page.items.length, 0);
}

function getNextPageParam(lastPage: PageData, allPages: Array<PageData>): PageParam | undefined {
    if (!lastPage.hasNextPage) {
        return undefined;
    }

    if (lastPage.nextCursor !== undefined && lastPage.nextCursor !== null) {
        return {
            cursor: String(lastPage.nextCursor),
            limit: lastPage.page?.size ?? 20,
        };
    }

    const currentPage = lastPage.page?.current ?? allPages.length;
    return {
        page: currentPage + 1,
        limit: lastPage.page?.size ?? 20,
    };
}

export function useInfiniteScrollQuery<TData = unknown>(
    config: InfiniteScrollQueryConfig & {
        queryFn: InfiniteScrollQueryFunction<TData>;
    },
): UseInfiniteScrollQueryReturn<TData> {
    const {
        queryKey,
        queryFn,
        initialPageParam = DEFAULT_INITIAL_PAGE_PARAM,
        maxPages,
        fetchOnMount = true,
        enabled = true,
        staleTime = 0,
        refetchOnWindowFocus = false,
        retryConfig = { attempts: 3, delay: 1000, backoff: true },
        threshold = 100,
        debounceMs = 200,
        useIntersectionObserver = true,
        rootElement = null,
        rootMargin = '0px',
    } = config;

    const query = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = initialPageParam }) => queryFn(pageParam),
        getNextPageParam,
        initialPageParam,
        enabled: enabled && fetchOnMount,
        staleTime,
        refetchOnWindowFocus,
        retry: retryConfig.backoff
            ? (failureCount) => {
                if (failureCount >= retryConfig.attempts) {
                    return false;
                }
                setTimeout(() => { }, retryConfig.delay * Math.pow(2, failureCount));
                return true;
            }
            : retryConfig.attempts,
    });

    const data = useMemo(() => {
        if (!query.data?.pages) {
            return [];
        }
        return flattenPages(query.data.pages);
    }, [query.data?.pages]);

    const totalCount = useMemo(() => {
        if (!query.data?.pages) {
            return 0;
        }
        return calculateTotalCount(query.data.pages);
    }, [query.data?.pages]);

    const pageInfo = useMemo(() => {
        const pages = query.data?.pages ?? [];
        const lastPage = pages[pages.length - 1];

        return {
            current: lastPage?.page?.current ?? pages.length,
            total: lastPage?.page?.total ?? 0,
            size: lastPage?.page?.size ?? initialPageParam.limit ?? 20,
            loaded: pages.length,
        };
    }, [query.data?.pages, initialPageParam.limit]);

    const hasReachedMaxPages = maxPages ? pageInfo.loaded >= maxPages : false;

    const fetchNextPage = useCallback(async () => {
        if (
            query.hasNextPage &&
            !query.isFetchingNextPage &&
            !hasReachedMaxPages &&
            enabled
        ) {
            await query.fetchNextPage();
            return true;
        }
        return false;
    }, [query, hasReachedMaxPages, enabled]);

    const scrollConfig: InfiniteScrollConfig = {
        threshold,
        debounceMs,
        enabled: enabled && !hasReachedMaxPages,
        useIntersectionObserver,
        rootElement,
        rootMargin,
    };

    const infiniteScroll = useInfiniteScroll(fetchNextPage, scrollConfig);

    const refetch = useCallback(() => {
        query.refetch();
    }, [query]);

    return {
        query,
        data,
        isLoading: query.isLoading || query.isFetchingNextPage,
        isInitialLoading: query.isLoading,
        isFetchingNextPage: query.isFetchingNextPage,
        error: query.error,
        totalCount,
        pageInfo,
        hasMore: Boolean(query.hasNextPage && !hasReachedMaxPages),
        triggerRef: infiniteScroll.triggerRef,
        containerRef: infiniteScroll.containerRef,
        loadMore: infiniteScroll.loadMore,
        reset: () => {
            infiniteScroll.reset();
        },
        refetch,
        fetchNextPage: query.fetchNextPage,
    };
}

export function useSimpleInfiniteQuery<TData = unknown>(
    queryKey: Array<unknown>,
    queryFn: InfiniteScrollQueryFunction<TData>,
    options: Partial<InfiniteScrollQueryConfig> = {},
): Pick<
    UseInfiniteScrollQueryReturn<TData>,
    'data' | 'isLoading' | 'error' | 'hasMore' | 'triggerRef' | 'refetch'
> {
    const result = useInfiniteScrollQuery({
        queryKey,
        queryFn,
        threshold: 200,
        debounceMs: 300,
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    return {
        data: result.data,
        isLoading: result.isLoading,
        error: result.error,
        hasMore: result.hasMore,
        triggerRef: result.triggerRef,
        refetch: result.refetch,
    };
}

export function useInfiniteSearchQuery<TData = unknown>(
    baseQueryKey: string,
    searchTerm: string,
    queryFn: InfiniteScrollQueryFunction<TData>,
    options: Partial<InfiniteScrollQueryConfig> = {},
): UseInfiniteScrollQueryReturn<TData> {
    const queryKey = useMemo(
        () => [baseQueryKey, 'search', searchTerm.trim().toLowerCase()],
        [baseQueryKey, searchTerm],
    );

    return useInfiniteScrollQuery({
        queryKey,
        queryFn,
        enabled: searchTerm.trim().length > 0,
        threshold: 150,
        debounceMs: 500,
        staleTime: 2 * 60 * 1000,
        ...options,
    });
}

export default useInfiniteScroll;