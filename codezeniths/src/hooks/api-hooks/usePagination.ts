'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce as lodashDebounce } from 'lodash';
import type {
    FetchPageFunction,
    PageData, 
    PageParam,
    PaginationConfig,
    PaginationQueryConfig,
    UsePaginationQueryReturn,
    UsePaginationReturn,
} from './types';

const DEFAULT_CONFIG: Required<PaginationConfig> = {
    initialPage: 1,
    pageSize: 20,
    debounceMs: 0,
    enabled: true,
    totalCount: 0,
    maxPages: Infinity,
    keepPreviousData: true,
};

function getPageParam(page: number, pageSize: number): PageParam {
    return {
        page,
        limit: pageSize,
    };
}

function calculateTotalPages(totalCount: number, pageSize: number): number {
    return Math.ceil(totalCount / pageSize);
}

function isValidPage(page: number, totalPages: number): boolean {
    return page >= 1 && page <= totalPages;
}

export function usePagination<TData = unknown>(
    fetchPage: FetchPageFunction<TData>,
    config: PaginationConfig = {},
): UsePaginationReturn {
    const {
        initialPage = DEFAULT_CONFIG.initialPage,
        pageSize = DEFAULT_CONFIG.pageSize,
        debounceMs = DEFAULT_CONFIG.debounceMs,
        enabled = DEFAULT_CONFIG.enabled,
        totalCount: providedTotalCount = DEFAULT_CONFIG.totalCount,
        maxPages = DEFAULT_CONFIG.maxPages,
    } = config;

    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalCount, setTotalCount] = useState(providedTotalCount);
    const [data, setData] = useState<Array<TData>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [pageSizeState, setPageSizeState] = useState(pageSize);

    const debouncedSetCurrentPage = useMemo(
        () =>
            debounceMs > 0
                ? lodashDebounce((page: number) => {
                    if (!enabled || !isValidPage(page, calculateTotalPages(totalCount, pageSizeState))) {
                        return;
                    }
                    setCurrentPage(page);
                }, debounceMs)
                : (page: number) => {
                    if (!enabled || !isValidPage(page, calculateTotalPages(totalCount, pageSizeState))) {
                        return;
                    }
                    setCurrentPage(page);
                },
        [enabled, totalCount, pageSizeState, debounceMs],
    );

    const goToPage = useCallback(
        (page: number) => {
            if (page < 1 || page > maxPages) {
                return;
            }
            debouncedSetCurrentPage(page);
        },
        [debouncedSetCurrentPage, maxPages],
    );

    const nextPage = useCallback(() => {
        const next = currentPage + 1;
        if (next <= calculateTotalPages(totalCount, pageSizeState)) {
            goToPage(next);
        }
    }, [currentPage, totalCount, pageSizeState, goToPage]);

    const prevPage = useCallback(() => {
        const prev = currentPage - 1;
        if (prev >= 1) {
            goToPage(prev);
        }
    }, [currentPage, goToPage]);

    const loadPage = useCallback(async (page: number, size: number) => {
        if (!enabled) {
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const params = getPageParam(page, size);
            const result = await fetchPage(params);
            setData(result.items);
            if (result.totalCount !== undefined) {
                setTotalCount(result.totalCount);
            }
        } catch (err) {
            const e = err instanceof Error ? err : new Error('Failed to fetch page');
            setError(e);
            console.error('Pagination fetch error:', e);
        } finally {
            setIsLoading(false);
        }
    }, [fetchPage, enabled]);

    const setPageSizeInternal = useCallback((size: number) => {
        setPageSizeState(size);
        // Optionally refetch current page with new size
        if (enabled) {
            loadPage(currentPage, size);
        }
    }, [enabled, currentPage, loadPage]);

    // Effect to load page on currentPage change
    useEffect(() => {
        loadPage(currentPage, pageSizeState);
    }, [currentPage, pageSizeState, loadPage]);

    const totalPages = useMemo(() => calculateTotalPages(totalCount, pageSizeState), [totalCount, pageSizeState]);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    const reset = useCallback(() => {
        setCurrentPage(initialPage);
        setPageSizeState(pageSize);
        setData([]);
        setTotalCount(providedTotalCount);
        setIsLoading(false);
        setError(null);
    }, [initialPage, pageSize, providedTotalCount]);

    return {
        currentPage,
        totalPages,
        pageSize: pageSizeState,
        totalCount,
        data,
        isLoading,
        error,
        hasNextPage,
        hasPrevPage,
        goToPage,
        nextPage,
        prevPage,
        setPageSize: setPageSizeInternal,
        reset,
    };
}

export function usePaginationQuery<TData = unknown>(
    config: PaginationQueryConfig<TData>,
): UsePaginationQueryReturn<TData> {
    const {
        queryKey: baseQueryKey,
        queryFn,
        initialPage = DEFAULT_CONFIG.initialPage,
        pageSize = DEFAULT_CONFIG.pageSize,
        enabled = DEFAULT_CONFIG.enabled,
        staleTime = 0,
        refetchOnWindowFocus = false,
        fetchOnMount = true,
        retryConfig = { attempts: 3, delay: 1000, backoff: true },
        keepPreviousData = DEFAULT_CONFIG.keepPreviousData,
        maxPages = DEFAULT_CONFIG.maxPages,
        debounceMs = DEFAULT_CONFIG.debounceMs,
    } = config;

    const [currentPageState, setCurrentPageState] = useState(initialPage);
    const [pageSizeState, setPageSizeState] = useState(pageSize);

    const queryKey = useMemo(
        () => [...baseQueryKey, { page: currentPageState, limit: pageSizeState }],
        [baseQueryKey, currentPageState, pageSizeState],
    );

    const query = useQuery<PageData<TData>, Error>({
        queryKey,
        queryFn: () => queryFn(getPageParam(currentPageState, pageSizeState)),
        enabled: enabled && fetchOnMount,
        staleTime,
        refetchOnWindowFocus,
        ...(keepPreviousData && { keepPreviousData }),
        retry: retryConfig.backoff
            ? (failureCount) => {
                if (failureCount >= retryConfig.attempts) {
                    return false;
                }
                return true;
            }
            : retryConfig.attempts,
    });

    const totalCount = query.data?.totalCount ?? 0;
    const totalPages = useMemo(() => calculateTotalPages(totalCount, pageSizeState), [totalCount, pageSizeState]);

    const goToPage = useCallback(
        (page: number) => {
            if (!enabled || page < 1 || page > totalPages || page > maxPages) {
                return;
            }
            setCurrentPageState(page);
        },
        [enabled, totalPages, maxPages],
    );

    const nextPage = useCallback(() => {
        const next = currentPageState + 1;
        if (next <= totalPages) {
            goToPage(next);
        }
    }, [currentPageState, totalPages, goToPage]);

    const prevPage = useCallback(() => {
        const prev = currentPageState - 1;
        if (prev >= 1) {
            goToPage(prev);
        }
    }, [currentPageState, goToPage]);

    const setPageSizeInternal = useCallback((size: number) => {
        setPageSizeState(size);
        // Page resets to 1 on size change for consistency
        setCurrentPageState(1);
    }, []);

    const refetch = useCallback(() => {
        query.refetch();
    }, [query]);

    const debouncedGoToPage = useMemo(
        () =>
            debounceMs > 0
                ? lodashDebounce(goToPage, debounceMs)
                : goToPage,
        [goToPage, debounceMs],
    );

    // Expose debounced version if debounceMs > 0, else direct
    const exposedGoToPage = debounceMs > 0 ? debouncedGoToPage : goToPage;

    const hasNextPage = currentPageState < totalPages;
    const hasPrevPage = currentPageState > 1;

    const reset = useCallback(() => {
        setCurrentPageState(initialPage);
        setPageSizeState(pageSize);
    }, [initialPage, pageSize]);

    return {
        query,
        data: query.data?.items ?? [],
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error ?? null,
        currentPage: currentPageState,
        totalPages,
        pageSize: pageSizeState,
        totalCount,
        hasNextPage,
        hasPrevPage,
        goToPage: exposedGoToPage,
        nextPage,
        prevPage,
        setPageSize: setPageSizeInternal,
        refetch,
        reset,
    };
}

export function useSimplePaginationQuery<TData = unknown>(
    queryKey: Array<unknown>,
    queryFn: FetchPageFunction<TData>,
    options: Partial<PaginationQueryConfig<TData>> = {},
): Pick<
    UsePaginationQueryReturn<TData>,
    'data' | 'isLoading' | 'error' | 'currentPage' | 'totalPages' | 'goToPage' | 'refetch'
> {
    const result = usePaginationQuery({
        queryKey,
        queryFn,
        initialPage: 1,
        pageSize: 20,
        staleTime: 5 * 60 * 1000,
        debounceMs: 150,
        ...options,
    });

    return {
        data: result.data,
        isLoading: result.isLoading,
        error: result.error,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        goToPage: result.goToPage,
        refetch: result.refetch,
    };
}

export function usePaginatedSearchQuery<TData = unknown>(
    baseQueryKey: string,
    searchTerm: string,
    queryFn: FetchPageFunction<TData>,
    options: Partial<PaginationQueryConfig<TData>> = {},
): UsePaginationQueryReturn<TData> {
    const queryKey = useMemo(
        () => [baseQueryKey, 'search', searchTerm.trim().toLowerCase()],
        [baseQueryKey, searchTerm],
    );

    return usePaginationQuery({
        queryKey,
        queryFn,
        enabled: Boolean(searchTerm.trim()),
        initialPage: 1,
        pageSize: 10,
        staleTime: 2 * 60 * 1000,
        debounceMs: 300,
        ...options,
    });
}

export default usePagination;