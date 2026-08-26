'use client';

import React, { useEffect, useRef } from 'react';
import {
    Button,
    ButtonSize,
    ButtonVariant,
    Grid,
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Tag, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
    CategoryCard,
    CategoryCardSkeleton,
    CategoryCardGridSkeleton,
} from '@codezeniths/design/widgets/shared';
import { Level } from '@prisma/client';
import type { TagViewMode } from './useTags';

export interface TagCardItem {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    level?: Level | string | null;
    module?: {
        title: string;
        slug: string;
    };
    problemsCount: number;
    problemsSolvedCount: number;
    problemsSolvedPercentage: number;
    isBookmarked?: boolean;
}

export interface TagsGridProps {
    tags?: TagCardItem[];
    isLoading?: boolean;
    activeFilterCount?: number;
    onClearFilters?: () => void;
    // View Mode & Pagination Props
    viewMode?: TagViewMode;
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

export const TagsGrid: React.FC<TagsGridProps> = ({
    tags = [],
    isLoading = false,
    activeFilterCount = 0,
    onClearFilters,
    viewMode = 'infinite',
    page = 1,
    pageSize = 6,
    total = tags.length,
    totalPages = Math.ceil(total / pageSize) || 1,
    onPageChange,
    hasNextPage = false,
    isFetchingNextPage = false,
    onLoadMore,
}) => {
    // ─── Sentinel for Infinite Scrolling ───
    const observerRef = useRef<HTMLDivElement | null>(null);

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

    // Initial Full Grid Loading (Tier 2/3)
    if (isLoading) {
        return <CategoryCardGridSkeleton count={pageSize} />;
    }

    // Empty State
    if (!tags || tags.length === 0) {
        return (
            <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-16 text-center">
                <Tag className="size-14 text-muted-light dark:text-muted-dark mx-auto mb-4 opacity-50" />
                <Typography
                    variant={TypographyVariant.H3}
                    weight={TypographyWeight.BOLD}
                    className="text-xl text-body-light-shade3 dark:text-body-dark"
                >
                    No tags found
                </Typography>
                <Typography
                    variant={TypographyVariant.P}
                    className="text-base text-muted-light dark:text-muted-dark mt-2 max-w-md mx-auto"
                >
                    We couldn't find any tags matching your current search or filter criteria. Try adjusting your filters.
                </Typography>
                {activeFilterCount > 0 && onClearFilters && (
                    <Button
                        onClick={onClearFilters}
                        className="mt-6 px-5 py-2.5 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary-shade2 transition-colors cursor-pointer"
                    >
                        Clear Filters
                    </Button>
                )}
            </Card>
        );
    }

    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);

    return (
        <div className="w-full space-y-6">
            {/* Primary 3-Column Responsive Grid */}
            <Grid cols={3} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {tags.map((tag) => (
                    <CategoryCard
                        key={tag.id}
                        data={{
                            id: tag.id,
                            title: tag.title,
                            slug: tag.slug,
                            href: `/tags/${tag.slug}`,
                            description: tag.description,
                            level: tag.level,
                            moduleSlug: tag.module?.slug,
                            problemsCount: tag.problemsCount,
                            problemsSolvedCount: tag.problemsSolvedCount,
                            problemsSolvedPercentage: tag.problemsSolvedPercentage,
                            type: 'tag',
                        }}
                    />
                ))}

                {/* Tier 3: Infinite Scroll Next Page Loading Skeletons */}
                {viewMode === 'infinite' && isFetchingNextPage && (
                    <>
                        <CategoryCardSkeleton index={0} />
                        <CategoryCardSkeleton index={1} />
                        <CategoryCardSkeleton index={2} />
                    </>
                )}
            </Grid>

            {/* Infinite Scroll Intersection Sentinel */}
            {viewMode === 'infinite' && (
                <div ref={observerRef} className="w-full py-4 flex items-center justify-center min-h-[40px]">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-2 text-xs text-muted-light dark:text-muted-dark font-medium">
                            <Loader2 className="size-4 animate-spin text-primary" />
                            <span>Loading more tags...</span>
                        </div>
                    ) : hasNextPage ? (
                        <Button
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.SM}
                            onClick={() => onLoadMore?.()}
                            className="text-xs text-muted-light dark:text-muted-dark hover:text-body-light dark:hover:text-body-dark cursor-pointer"
                        >
                            Load More Tags
                        </Button>
                    ) : (
                        tags.length > 0 && (
                            <Typography variant={TypographyVariant.MUTED} className="text-xs text-center opacity-60">
                                You've reached the end of all {total} tags.
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
                        <span className="font-semibold text-body-light-shade3 dark:text-body-dark">{total}</span> tags
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
    );
};
