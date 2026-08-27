'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
    Grid,
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyAlign,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Button,
    ButtonVariant,
    ButtonSize,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Separator,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import {
    Search,
    Globe,
    RotateCcw,
    X,
    MoreHorizontal,
    Infinity as InfinityIcon,
    Layers,
    Check,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { PlaylistCard } from './playlist-card';
import { PlaylistCardSkeleton, PlaylistCardGridSkeleton } from './playlist-card-skeleton';
import type { PlaylistSummaryItem, PlaylistsSortOption, PlaylistViewMode } from './playlists-overview.types';

export interface CommunityPlaylistsTabProps {
    playlists?: PlaylistSummaryItem[];
    isLoading?: boolean;
    searchQuery: string;
    onSearchChange: (search: string) => void;
    sortBy: PlaylistsSortOption;
    onSortChange: (sort: PlaylistsSortOption) => void;
    onClearFilters?: () => void;
    // View Mode & Pagination Props
    viewMode?: PlaylistViewMode;
    onViewModeChange?: (mode: PlaylistViewMode) => void;
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    // Infinite Scroll Props
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    onLoadMore?: () => void;
}

export const CommunityPlaylistsTab: React.FC<CommunityPlaylistsTabProps> = ({
    playlists = [],
    isLoading = false,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    onClearFilters,
    viewMode = 'infinite',
    onViewModeChange,
    page = 1,
    pageSize = 6,
    total = playlists.length,
    totalPages = Math.ceil(total / pageSize) || 1,
    onPageChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
}) => {
    const [viewOpen, setViewOpen] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);

    // Sentinel Intersection Observer for Infinite Scrolling
    useEffect(() => {
        if (viewMode !== 'infinite' || !hasNextPage || isFetchingNextPage || !onLoadMore) {
            return;
        }

        const el = observerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    onLoadMore();
                }
            },
            { rootMargin: '300px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [viewMode, hasNextPage, isFetchingNextPage, onLoadMore]);

    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="space-y-6 w-full font-sans">
            {/* Control Bar: Search Bar + Sort Dropdown + View Mode Popover */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 pb-1">
                {/* Left: Capsule Search Input */}
                <div className="relative w-full max-w-xs sm:max-w-sm">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search community playlists..."
                        className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark placeholder-muted-light dark:placeholder-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-light hover:text-body-light-shade3 dark:hover:text-body-dark cursor-pointer transition-colors"
                            title="Clear search"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Right: Sort Pill Select & View Mode Options Menu */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-light dark:text-muted-dark whitespace-nowrap">
                            Sort by:
                        </span>
                        <Select
                            value={sortBy}
                            onValueChange={(val) => onSortChange(val as PlaylistsSortOption)}
                        >
                            <SelectTrigger className="w-38 h-9 rounded-full text-xs bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-2xs cursor-pointer focus:ring-primary">
                                <SelectValue placeholder="Sort order" />
                            </SelectTrigger>
                            <SelectContent
                                align="end"
                                className="bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 p-1 z-100 rounded-md shadow-lg"
                            >
                                <SelectItem value="popular" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                    Most Popular
                                </SelectItem>
                                <SelectItem value="recent" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                    Recently Added
                                </SelectItem>
                                <SelectItem value="name" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                    Alphabetical (A-Z)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* View Options Popover (Display Mode: Infinite vs Paginated) */}
                    <Popover open={viewOpen} onOpenChange={setViewOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant={ButtonVariant.OUTLINE}
                                size={ButtonSize.ICON}
                                className="size-9 rounded-full border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 text-body-light dark:text-body-dark transition-colors cursor-pointer shrink-0 shadow-2xs"
                                aria-label="View options"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-3 rounded-md z-150 space-y-2 bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xl">
                            <div className="pb-1.5 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                                <span className="text-xs font-semibold text-body-light dark:text-body-dark">
                                    Display Mode
                                </span>
                            </div>

                            <div className="space-y-1">
                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.SM}
                                    onClick={() => {
                                        onViewModeChange?.('infinite');
                                        setViewOpen(false);
                                    }}
                                    className={`w-full px-2.5 py-2 h-auto rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                                        viewMode === 'infinite'
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-light dark:text-muted-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 hover:text-body-light dark:hover:text-body-dark'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <InfinityIcon className="size-3.5" />
                                        <span>Infinite Scroll</span>
                                    </div>
                                    {viewMode === 'infinite' && <Check className="size-3.5" />}
                                </Button>

                                <Button
                                    type="button"
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.SM}
                                    onClick={() => {
                                        onViewModeChange?.('paginated');
                                        setViewOpen(false);
                                    }}
                                    className={`w-full px-2.5 py-2 h-auto rounded-md text-xs font-medium text-left flex items-center justify-between transition-colors cursor-pointer ${
                                        viewMode === 'paginated'
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-muted-light dark:text-muted-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 hover:text-body-light dark:hover:text-body-dark'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Layers className="size-3.5" />
                                        <span>Paginated (6 / page)</span>
                                    </div>
                                    {viewMode === 'paginated' && <Check className="size-3.5" />}
                                </Button>
                            </div>

                            <Separator className="my-1.5 bg-foreground-light-shade3 dark:bg-foreground-dark-shade1" />

                            <div className="px-2 py-1 text-[11px] text-muted-light dark:text-muted-dark flex items-center justify-between">
                                <span>Total Playlists:</span>
                                <span className="font-semibold text-body-light dark:text-body-dark">{total}</span>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Content View */}
            {isLoading ? (
                <PlaylistCardGridSkeleton count={pageSize} />
            ) : playlists.length === 0 ? (
                <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-10 sm:p-14 text-center max-w-xl mx-auto my-6 shadow-xs flex flex-col items-center justify-center">
                    <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 shrink-0">
                        <Globe className="size-7 opacity-75" />
                    </div>
                    <Typography
                        variant={TypographyVariant.H3}
                        weight={TypographyWeight.BOLD}
                        align={TypographyAlign.CENTER}
                        className="text-lg sm:text-xl text-body-light-shade3 dark:text-body-dark text-center w-full"
                    >
                        No Community Playlists Found
                    </Typography>
                    <Typography
                        variant={TypographyVariant.P}
                        align={TypographyAlign.CENTER}
                        className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-2 max-w-md mx-auto text-center leading-relaxed"
                    >
                        {searchQuery
                            ? `We couldn't find any public playlists matching "${searchQuery}". Try a different keyword or reset filters.`
                            : 'No public community playlists are available right now. Be the first to create one!'}
                    </Typography>
                    {searchQuery && onClearFilters && (
                        <Button
                            onClick={onClearFilters}
                            variant={ButtonVariant.OUTLINE}
                            className="mt-6 gap-2 text-xs font-semibold inline-flex items-center justify-center mx-auto cursor-pointer"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Reset Search</span>
                        </Button>
                    )}
                </Card>
            ) : (
                <div className="w-full space-y-6">
                    <Grid cols={3} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
                        {playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                playlist={playlist}
                                isOwner={false}
                            />
                        ))}

                        {/* Infinite Scroll Next Page Loading Skeletons */}
                        {viewMode === 'infinite' && isFetchingNextPage && (
                            <>
                                <PlaylistCardSkeleton index={0} />
                                <PlaylistCardSkeleton index={1} />
                                <PlaylistCardSkeleton index={2} />
                            </>
                        )}
                    </Grid>

                    {/* Infinite Scroll Intersection Sentinel */}
                    {viewMode === 'infinite' && (
                        <div ref={observerRef} className="w-full py-4 flex items-center justify-center min-h-[40px]">
                            {isFetchingNextPage ? (
                                <div className="flex items-center gap-2 text-xs text-muted-light dark:text-muted-dark font-medium">
                                    <Loader2 className="size-4 animate-spin text-primary" />
                                    <span>Loading more playlists...</span>
                                </div>
                            ) : hasNextPage ? (
                                <Button
                                    variant={ButtonVariant.GHOST}
                                    size={ButtonSize.SM}
                                    onClick={() => onLoadMore?.()}
                                    className="text-xs text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark cursor-pointer"
                                >
                                    Load More Playlists
                                </Button>
                            ) : (
                                playlists.length > 0 && (
                                    <Typography variant={TypographyVariant.MUTED} className="text-xs text-center opacity-60">
                                        You've reached the end of all {total} community playlists.
                                    </Typography>
                                )
                            )}
                        </div>
                    )}

                    {/* Paginated Mode Footer */}
                    {viewMode === 'paginated' && totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                            <Typography variant={TypographyVariant.MUTED} className="text-xs text-muted-light dark:text-muted-dark">
                                Showing <span className="font-semibold text-body-light-shade3 dark:text-body-dark">{startItem}</span> to{' '}
                                <span className="font-semibold text-body-light-shade3 dark:text-body-dark">{endItem}</span> of{' '}
                                <span className="font-semibold text-body-light-shade3 dark:text-body-dark">{total}</span> community playlists
                            </Typography>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.SM}
                                    disabled={page <= 1}
                                    onClick={() => onPageChange?.(Math.max(1, page - 1))}
                                    leftIcon={<ChevronLeft className="size-3.5" />}
                                    className="px-3 py-1.5 h-8 text-xs font-medium rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 disabled:opacity-40 cursor-pointer"
                                >
                                    Previous
                                </Button>

                                <span className="px-3 py-1 text-xs font-medium text-body-light-shade3 dark:text-body-dark">
                                    Page {page} of {totalPages}
                                </span>

                                <Button
                                    type="button"
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.SM}
                                    disabled={page >= totalPages}
                                    onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
                                    rightIcon={<ChevronRight className="size-3.5" />}
                                    className="px-3 py-1.5 h-8 text-xs font-medium rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade1 disabled:opacity-40 cursor-pointer"
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
