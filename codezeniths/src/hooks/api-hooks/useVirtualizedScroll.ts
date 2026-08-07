import { useVirtualizer } from '@tanstack/react-virtual';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useInfiniteScrollQuery } from './useInfiniteScroll';
import type {
    InfiniteVirtualScrollConfig,
    UseInfiniteVirtualizedScrollReturn,
    UseVirtualizedScrollReturn,
    VirtualItem,
    VirtualScrollConfig,
} from './types';

function calculateDynamicOverscan(itemCount: number, viewportSize: number, estimateSize: number): number {
    const visibleItems = Math.ceil(viewportSize / estimateSize);
    const baseOverscan = Math.min(10, Math.max(3, Math.ceil(visibleItems * 0.5)));

    if (itemCount > 10000) {
        return Math.max(5, baseOverscan - 2);
    }
    if (itemCount > 1000) {
        return Math.max(8, baseOverscan - 1);
    }

    return baseOverscan;
}

export function useVirtualizedScroll<TData = unknown>(
    data: Array<TData>,
    config: VirtualScrollConfig,
): UseVirtualizedScrollReturn {
    const {
        estimateSize,
        dynamicSizing = false,
        overscan = 5,
        scrollElementRef,
    } = config;

    const containerRef = useRef<HTMLElement | null>(null);
    const scrollElementRefInternal = useRef<HTMLElement | null>(null);
    const scrollRef = scrollElementRef || scrollElementRefInternal;

    const calculatedOverscan = useMemo(() => {
        const viewport = scrollRef.current;
        if (!viewport) {
            return overscan;
        }

        const viewportSize = viewport.clientHeight;
        return calculateDynamicOverscan(data.length, viewportSize, estimateSize);
    }, [overscan, data.length, estimateSize, scrollRef]);

    const virtualizer = useVirtualizer({
        count: data.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => estimateSize,
        overscan: calculatedOverscan,
        ...(dynamicSizing && {
            measureElement: (element) => element.getBoundingClientRect().height,
        }),
    });

    const virtualItems = useMemo<Array<VirtualItem>>(() => {
        return virtualizer.getVirtualItems();
    }, [virtualizer]);

    const scrollToIndex = useCallback(
        (index: number, align: 'start' | 'center' | 'end' | 'auto' = 'auto') => {
            virtualizer.scrollToIndex(index, { align });
        },
        [virtualizer],
    );

    const scrollToOffset = useCallback(
        (offset: number) => {
            virtualizer.scrollToOffset(offset);
        },
        [virtualizer],
    );

    const measureElement = useCallback(
        (element: HTMLElement | null) => {
            if (element && dynamicSizing) {
                virtualizer.measureElement(element);
            }
        },
        [virtualizer, dynamicSizing],
    );

    return {
        virtualItems,
        totalSize: virtualizer.getTotalSize(),
        scrollToIndex,
        scrollToOffset,
        measureElement,
        containerRef,
        scrollElementRef: scrollRef,
    };
}

export function useInfiniteVirtualizedScroll<TData = unknown>(
    config: InfiniteVirtualScrollConfig<TData>,
): UseInfiniteVirtualizedScrollReturn<TData> {
    const {
        queryKey,
        queryFn,
        estimateSize,
        dynamicSizing = false,
        overscan,
        scrollElementRef,
        staleTime = 0,
        refetchOnWindowFocus = false,
        maxPages,
        fetchOnMount = true,
        ...scrollConfig
    } = config;

    const scrollElementRefInternal = useRef<HTMLElement | null>(null);
    const scrollRef = scrollElementRef || scrollElementRefInternal;

    const queryResult = useInfiniteScrollQuery({
        queryKey,
        queryFn,
        staleTime,
        refetchOnWindowFocus,
        ...(maxPages && { maxPages }),
        fetchOnMount,
        threshold: 0,
        useIntersectionObserver: false,
        ...scrollConfig,
    });

    const { data, hasMore, fetchNextPage, isLoading, error, totalCount, reset, refetch, loadMore } = queryResult;

    const virtualScrollResult = useVirtualizedScroll(data, {
        estimateSize,
        dynamicSizing,
        overscan: overscan || 5,
        scrollElementRef: scrollRef as React.RefObject<HTMLElement>,
        ...scrollConfig,
    });

    const items = virtualScrollResult.virtualItems;
    const lastItem = items[items.length - 1];

    useEffect(() => {
        if (
            lastItem &&
            lastItem.index >= data.length - 1 - (overscan || 5) &&
            hasMore &&
            !isLoading
        ) {
            fetchNextPage();
        }
    }, [lastItem?.index, data.length, hasMore, isLoading, fetchNextPage, overscan, lastItem]);

    return {
        ...virtualScrollResult,
        data,
        isLoading,
        error,
        hasMore,
        totalCount,
        loadMore,
        reset,
        refetch,
    };
}

export default useVirtualizedScroll;