'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@codezeniths/design/cn';
import { Table, TableBody } from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    ScrollArea,
} from '@codezeniths/components';
import { ChevronLeft, ChevronRight, Trophy, Search, Loader2 } from 'lucide-react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LeaderboardRow } from './leaderboard-row';
import { LeaderboardControls } from './leaderboard-controls';
import { LeaderboardSkeleton } from './leaderboard-skeleton';
import type { LeaderboardItem, LeaderboardScope } from '@codezeniths/schemas/db';

export interface LeaderboardTableProps {
    items: LeaderboardItem[];
    total: number;
    currentViewerId?: string | null;
    viewMode?: 'infinite' | 'paginated';
    onViewModeChange?: (mode: 'infinite' | 'paginated') => void;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number) => void;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
    searchQuery: string;
    onSearchChange: (search: string) => void;
    selectedModuleId: string | null;
    onModuleChange: (moduleId: string | null) => void;
    modulesOptions: Array<{ id: string; title: string; slug: string }>;
    selectedScope: LeaderboardScope;
    onScopeChange: (scope: LeaderboardScope) => void;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    className?: string;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
    items = [],
    total = 0,
    currentViewerId,
    viewMode = 'infinite',
    onViewModeChange,
    page = 1,
    pageSize = 20,
    onPageChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
    searchQuery,
    onSearchChange,
    selectedModuleId,
    onModuleChange,
    modulesOptions = [],
    selectedScope,
    onScopeChange,
    isAuthenticated = false,
    isLoading = false,
    className,
}) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const [scrollMargin, setScrollMargin] = useState(0);

    const totalPages = Math.ceil(total / pageSize) || 1;

    // Reset scroll position on page change
    useEffect(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
        if (viewport) {
            viewport.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [page]);

    // IntersectionObserver sentinel for automatic scroll-based Infinite Loading (matching problem-list.tsx)
    useEffect(() => {
        if (viewMode !== 'infinite' || !hasNextPage || isFetchingNextPage) return;

        const mainViewport =
            sentinelRef.current?.closest('[data-slot="scroll-area-viewport"]') ||
            scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') ||
            null;

        if (!sentinelRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    onLoadMore?.();
                }
            },
            {
                root: mainViewport,
                rootMargin: '200px',
                threshold: 0.1,
            }
        );

        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [viewMode, hasNextPage, isFetchingNextPage, onLoadMore, items.length]);

    // Dynamically calculate the table's offset from the scroll container top
    useEffect(() => {
        const updateScrollMargin = () => {
            if (!tableContainerRef.current) return;
            const scrollViewport =
                sentinelRef.current?.closest('[data-slot="scroll-area-viewport"]') ||
                scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');

            if (scrollViewport) {
                const tableRect = tableContainerRef.current.getBoundingClientRect();
                const viewportRect = scrollViewport.getBoundingClientRect();
                const offset = tableRect.top - viewportRect.top + scrollViewport.scrollTop;
                setScrollMargin(Math.max(0, offset));
            }
        };

        updateScrollMargin();
        window.addEventListener('resize', updateScrollMargin);
        return () => window.removeEventListener('resize', updateScrollMargin);
    }, [items.length, viewMode]);

    // Virtualizer for Virtualized View using @tanstack/react-virtual (matching problem-list.tsx)
    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () =>
            sentinelRef.current?.closest('[data-slot="scroll-area-viewport"]') ||
            scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]') ||
            null,
        estimateSize: () => 58,
        scrollMargin,
        getItemKey: (index) => items[index]?.userId || index,
        overscan: 10,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();
    const paddingTop =
        virtualRows.length > 0 ? Math.max(0, virtualRows[0].start - scrollMargin) : 0;
    const paddingBottom =
        virtualRows.length > 0
            ? Math.max(0, rowVirtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end)
            : 0;

    if (isLoading && items.length === 0) {
        return <LeaderboardSkeleton className={className} />;
    }

    return (
        <div className={cn('w-full space-y-4 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-5 sm:p-6 rounded-lg shadow-xs border border-secondary/20', className)}>
            {/* Top Control Bar */}
            <LeaderboardControls
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                selectedModuleId={selectedModuleId}
                onModuleChange={onModuleChange}
                modulesOptions={modulesOptions}
                selectedScope={selectedScope}
                onScopeChange={onScopeChange}
                viewMode={viewMode}
                onViewModeChange={onViewModeChange || (() => {})}
                totalContenders={total}
                isAuthenticated={isAuthenticated}
            />

            {/* Content Table */}
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-xl border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-center my-4">
                    <div className="size-12 rounded-full bg-secondary/15 text-muted-light dark:text-muted-dark flex items-center justify-center mb-3">
                        <Search className="size-6" />
                    </div>
                    <p className="text-sm font-semibold text-heading-light dark:text-heading-dark mb-1">
                        No contenders found
                    </p>
                    <p className="text-xs text-muted-light dark:text-muted-dark max-w-xs">
                        {searchQuery
                            ? `No contenders matching "${searchQuery}". Try refining your search query.`
                            : selectedScope !== 'global'
                            ? 'No contenders found in this network scope yet. Follow more problem solvers to see them here!'
                            : 'No leaderboard contenders available in this category yet.'}
                    </p>
                </div>
            ) : viewMode === 'paginated' ? (
                /* Paginated View Mode */
                <div className="space-y-4">
                    <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0">
                        <TableBody>
                            {items.map((item, index) => (
                                <LeaderboardRow
                                    key={item.userId}
                                    item={item}
                                    index={index}
                                    isCurrentViewer={Boolean(currentViewerId && currentViewerId === item.userId)}
                                />
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Footer */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-3 px-2 text-xs text-muted-light dark:text-muted-dark border-t border-secondary/15">
                            <span>
                                Page {page} of {totalPages} ({total} contenders)
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.SM}
                                    disabled={page <= 1 || isLoading}
                                    onClick={() => onPageChange?.(page - 1)}
                                    className="h-8 px-2.5 text-xs gap-1 cursor-pointer border-secondary/25"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                                </Button>
                                <Button
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.SM}
                                    disabled={page >= totalPages || isLoading}
                                    onClick={() => onPageChange?.(page + 1)}
                                    className="h-8 px-2.5 text-xs gap-1 cursor-pointer border-secondary/25"
                                >
                                    Next <ChevronRight className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* Infinite Scroll View Mode (Virtualized Table Rows matching problem-list.tsx) */
                <div ref={tableContainerRef} className="space-y-4">
                    <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0">
                        <TableBody>
                            {paddingTop > 0 && (
                                <tr style={{ height: `${paddingTop}px` }} className="border-0 p-0 m-0">
                                    <td className="w-16 min-w-16 max-w-16 p-0 border-0" />
                                    <td className="w-auto p-0 border-0" />
                                    <td className="w-48 min-w-44 max-w-56 p-0 border-0" />
                                    <td className="w-32 min-w-28 max-w-36 p-0 border-0" />
                                    <td className="w-28 min-w-24 max-w-32 p-0 border-0" />
                                </tr>
                            )}
                            {virtualRows.map((virtualRow) => {
                                const item = items[virtualRow.index];
                                if (!item) return null;

                                return (
                                    <LeaderboardRow
                                        key={item.userId}
                                        ref={rowVirtualizer.measureElement}
                                        data-index={virtualRow.index}
                                        item={item}
                                        index={virtualRow.index}
                                        isCurrentViewer={Boolean(currentViewerId && currentViewerId === item.userId)}
                                    />
                                );
                            })}
                            {paddingBottom > 0 && (
                                <tr style={{ height: `${paddingBottom}px` }} className="border-0 p-0 m-0">
                                    <td className="w-16 min-w-16 max-w-16 p-0 border-0" />
                                    <td className="w-auto p-0 border-0" />
                                    <td className="w-48 min-w-44 max-w-56 p-0 border-0" />
                                    <td className="w-32 min-w-28 max-w-36 p-0 border-0" />
                                    <td className="w-28 min-w-24 max-w-32 p-0 border-0" />
                                </tr>
                            )}
                        </TableBody>
                    </Table>

                    {/* Infinite Scroll Sentinel & Loading Indicator */}
                    <div ref={sentinelRef} className="py-2 text-center flex items-center justify-center">
                        {isFetchingNextPage && (
                            <div className="flex items-center gap-2 text-xs text-muted-light dark:text-muted-dark">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                <span>Loading more contenders...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
