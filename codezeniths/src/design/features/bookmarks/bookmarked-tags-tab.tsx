'use client';

import React from 'react';
import Link from 'next/link';
import {
    Grid,
    Typography,
    TypographyVariant,
    TypographyWeight,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { Search, Tag, X, Sparkles } from 'lucide-react';
import { BookmarksGridSkeleton } from './bookmarks-card-skeleton';
import { BookmarkCard } from './bookmark-card';
import type { BookmarkedTagItem, BookmarksSortBy, TopicLevelFilter } from './bookmarks-overview.types';
import { cn } from '@codezeniths/design/cn';

export interface BookmarkedTagsTabProps {
    tags: BookmarkedTagItem[];
    isLoading?: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: BookmarksSortBy;
    onSortChange: (sort: BookmarksSortBy) => void;
    levelFilter: TopicLevelFilter;
    onLevelFilterChange: (level: TopicLevelFilter) => void;
    onRemoveBookmark: (tag: BookmarkedTagItem) => void;
    onClearFilters: () => void;
}

export const BookmarkedTagsTab: React.FC<BookmarkedTagsTabProps> = ({
    tags,
    isLoading = false,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    levelFilter,
    onLevelFilterChange,
    onRemoveBookmark,
    onClearFilters,
}) => {
    if (isLoading) {
        return <BookmarksGridSkeleton count={6} />;
    }

    const levelOptions: Array<{ id: TopicLevelFilter; label: string }> = [
        { id: 'all', label: 'All Levels' },
        { id: 'fundamental', label: 'Fundamental' },
        { id: 'intermediate', label: 'Intermediate' },
        { id: 'advanced', label: 'Advanced' },
    ];

    return (
        <div className="w-full space-y-6">
            {/* Controls Bar: Capsule Search Input + Capsule Level Filter Tabber + Capsule Sort Selector */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-1">
                {/* Search Input */}
                <div className="relative w-full max-w-xs sm:max-w-sm">
                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search tags by name, module..."
                        className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-foreground-light dark:bg-foreground-dark text-body-light-shade3 dark:text-body-dark placeholder:text-muted-light dark:placeholder:text-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs h-9.5"
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

                {/* Right: Level Filter Capsule Tabber + Sort Select */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 sm:gap-3 shrink-0">
                    {/* Level Filter Capsule Tabber */}
                    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-2xs overflow-x-auto scrollbar-none">
                        {levelOptions.map((opt) => {
                            const isActive = levelFilter === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => onLevelFilterChange(opt.id)}
                                    className={cn(
                                        'px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer select-none whitespace-nowrap',
                                        isActive
                                            ? 'bg-primary text-white shadow-xs'
                                            : 'text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2'
                                    )}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort Control */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-muted-light dark:text-muted-dark whitespace-nowrap hidden xs:inline">
                            Sort by:
                        </span>
                        <Select
                            value={sortBy}
                            onValueChange={(val) => onSortChange(val as BookmarksSortBy)}
                        >
                            <SelectTrigger className="w-38 sm:w-44 h-9.5 rounded-full text-xs font-medium bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-2xs cursor-pointer focus:ring-1 focus:ring-primary">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent
                                align="end"
                                className="bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 p-1 z-100 rounded-md shadow-lg"
                            >
                                <SelectItem value="recent" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                    Recently Saved
                                </SelectItem>
                                <SelectItem value="progress" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                    Solved Progress (%)
                                </SelectItem>
                                <SelectItem value="problems" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                    Most Problems
                                </SelectItem>
                                <SelectItem value="title" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                    Title (A-Z)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

                {/* Empty State */}
                {tags.length === 0 ? (
                    <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-foreground-light dark:bg-foreground-dark border border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md">
                        <div className="size-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                            <Tag className="size-6" />
                        </div>
                        {searchQuery || levelFilter !== 'all' ? (
                            <>
                                <Typography
                                    variant={TypographyVariant.H4}
                                    weight={TypographyWeight.BOLD}
                                    className="text-base text-body-light-shade3 dark:text-body-dark mb-1"
                                >
                                    No tags match your filters
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.MUTED}
                                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark max-w-sm mb-4"
                                >
                                    Try adjusting your search query or level filters to see more bookmarked tags.
                                </Typography>
                                <Button
                                    variant={ButtonVariant.SECONDARY}
                                    size={ButtonSize.SM}
                                    onClick={onClearFilters}
                                    className="cursor-pointer"
                                >
                                    Reset Filters
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography
                                    variant={TypographyVariant.H4}
                                    weight={TypographyWeight.BOLD}
                                    className="text-base text-body-light-shade3 dark:text-body-dark mb-1"
                                >
                                    No bookmarked tags yet
                                </Typography>
                                <Typography
                                    variant={TypographyVariant.MUTED}
                                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark max-w-md mb-4"
                                >
                                    Bookmark concept tags to practice targeted problem sets like Arrays, Sliding Window, DP, and Backtracking.
                                </Typography>
                                <Link href="/tags">
                                    <Button
                                        variant={ButtonVariant.DEFAULT}
                                        size={ButtonSize.SM}
                                        className="cursor-pointer gap-2"
                                    >
                                        <Sparkles className="size-3.5" />
                                        <span>Explore Tags</span>
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                ) : (
                    /* Tag Cards Grid */
                    <Grid cols={3} gap="lg" className="w-full">
                        {tags.map((tag) => (
                            <BookmarkCard
                                key={tag.id}
                                data={{
                                    id: tag.id,
                                    title: tag.title,
                                    slug: tag.slug,
                                    type: 'tag',
                                    level: tag.level,
                                    moduleSlug: tag.moduleSlug,
                                    moduleTitle: tag.moduleTitle,
                                    problemsCount: tag.problemsCount,
                                    problemsSolvedCount: tag.problemsSolvedCount,
                                    problemsSolvedPercentage: tag.problemsSolvedPercentage,
                                }}
                                onRemoveBookmark={() => onRemoveBookmark(tag)}
                            />
                        ))}
                    </Grid>
                )}
            </div>
    );
};
