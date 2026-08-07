import type { InfiniteData, UseInfiniteQueryResult, UseQueryResult } from '@tanstack/react-query';
import type { VirtualItem } from '@tanstack/react-virtual';


/**
 * @types for useInfiniteScroll
 */
interface InfiniteScrollConfig {
    threshold?: number;
    debounceMs?: number;
    enabled?: boolean;
    rootElement?: Element | null;
    rootMargin?: string;
    useIntersectionObserver?: boolean;
}

type LoadMoreFunction<TData = unknown> = () => Promise<TData> | TData;

interface UseInfiniteScrollReturn {
    isLoading: boolean;
    hasMore: boolean;
    error: Error | null;
    loadMore: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
    containerRef: React.RefObject<HTMLElement | null>;
    reset: () => void;
}

interface PageParam {
    page?: number;
    cursor?: string;
    limit?: number;
    [key: string]: unknown;
}

interface PageData<TData = unknown> {
    items: Array<TData>;
    nextCursor?: string | number | null;
    hasNextPage: boolean;
    totalCount?: number;
    page?: {
        current: number;
        size: number;
        total?: number;
    };
}

type InfiniteScrollQueryFunction<TData = unknown> = (
    params: PageParam,
) => Promise<PageData<TData>>;

interface InfiniteScrollQueryConfig extends InfiniteScrollConfig {
    queryKey: Array<unknown>;
    refetchOnWindowFocus?: boolean;
    staleTime?: number;
    initialPageParam?: PageParam;
    maxPages?: number;
    fetchOnMount?: boolean;
    retryConfig?: {
        attempts: number;
        delay: number;
        backoff?: boolean;
    };
}

interface UseInfiniteScrollQueryReturn<TData = unknown>
    extends Omit<UseInfiniteScrollReturn, 'isLoading' | 'error'> {
    query: UseInfiniteQueryResult<InfiniteData<PageData<TData>, unknown>, Error>;
    data: Array<TData>;
    isLoading: boolean;
    isInitialLoading: boolean;
    isFetchingNextPage: boolean;
    error: Error | null;
    totalCount: number;
    pageInfo: {
        current: number;
        total: number;
        size: number;
        loaded: number;
    };
    refetch: () => void;
    fetchNextPage: () => void;
}


/**
 * @types for usePagination
*/

interface PaginationConfig {
    initialPage?: number;
    pageSize?: number;
    debounceMs?: number;
    enabled?: boolean;
    totalCount?: number; // Optional if not known upfront
    maxPages?: number;
    keepPreviousData?: boolean; // For smoother UX in query wrapper
}

type FetchPageFunction<TData = unknown> = (params: PageParam) => Promise<PageData<TData>>;

interface UsePaginationReturn {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    data: Array<unknown>; // Placeholder; will be typed in wrapper
    isLoading: boolean;
    error: Error | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    setPageSize: (size: number) => void;
    reset: () => void;
}

interface PaginationQueryConfig<TData = unknown> extends PaginationConfig {
    queryKey: Array<unknown>;
    queryFn: FetchPageFunction<TData>;
    refetchOnWindowFocus?: boolean;
    staleTime?: number;
    fetchOnMount?: boolean;
    retryConfig?: {
        attempts: number;
        delay: number;
        backoff?: boolean;
    };
    enabled?: boolean;
}

interface UsePaginationQueryReturn<TData = unknown>
    extends Omit<UsePaginationReturn, 'data' | 'isLoading' | 'error'> {
    query: UseQueryResult<PageData<TData>, Error>;
    data: Array<TData>;
    isLoading: boolean;
    isFetching: boolean;
    error: Error | null;
    totalCount: number;
    refetch: () => void;
}


/**
 * @types for useVirtualizedScroll
*/

interface VirtualScrollConfig extends InfiniteScrollConfig {
    estimateSize: number;
    dynamicSizing?: boolean;
    overscan?: number;
    scrollElementRef?: React.RefObject<HTMLElement>;
}

interface UseVirtualizedScrollReturn {
    virtualItems: Array<VirtualItem>;
    totalSize: number;
    scrollToIndex: (index: number, align?: 'start' | 'center' | 'end' | 'auto') => void;
    scrollToOffset: (offset: number) => void;
    measureElement: (element: HTMLElement | null) => void;
    containerRef: React.RefObject<HTMLElement | null>;
    scrollElementRef: React.RefObject<HTMLElement | null>;
}

interface UseInfiniteVirtualizedScrollReturn<TData = unknown> extends UseVirtualizedScrollReturn {
    data: Array<TData>;
    isLoading: boolean;
    error: Error | null;
    hasMore: boolean;
    totalCount: number;
    loadMore: () => void;
    reset: () => void;
    refetch: () => void;
}

interface InfiniteVirtualScrollConfig<TData = unknown> extends VirtualScrollConfig {
    queryKey: Array<unknown>;
    queryFn: InfiniteScrollQueryFunction<TData>;
    staleTime?: number;
    refetchOnWindowFocus?: boolean;
    maxPages?: number;
    fetchOnMount?: boolean;
}


export type {
    InfiniteScrollConfig,
    LoadMoreFunction,
    UseInfiniteScrollReturn,
    PageParam,
    PageData,
    InfiniteScrollQueryFunction,
    InfiniteScrollQueryConfig,
    UseInfiniteScrollQueryReturn,
    PaginationConfig,
    FetchPageFunction,
    UsePaginationReturn,
    PaginationQueryConfig,
    UsePaginationQueryReturn,
    VirtualScrollConfig,
    UseVirtualizedScrollReturn,
    UseInfiniteVirtualizedScrollReturn,
    InfiniteVirtualScrollConfig,
    VirtualItem,
};

