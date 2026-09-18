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
import { Search, BookOpen, X, Sparkles } from 'lucide-react';
import { BookmarksGridSkeleton } from './bookmarks-card-skeleton';
import { BookmarkCard } from './bookmark-card';
import type { BookmarkedModuleItem, BookmarksSortBy } from './bookmarks-overview.types';

export interface BookmarkedModulesTabProps {
    modules: BookmarkedModuleItem[];
    isLoading?: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: BookmarksSortBy;
    onSortChange: (sort: BookmarksSortBy) => void;
    onRemoveBookmark: (module: BookmarkedModuleItem) => void;
    onClearFilters: () => void;
}

export const BookmarkedModulesTab: React.FC<BookmarkedModulesTabProps> = ({
    modules,
    isLoading = false,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    onRemoveBookmark,
    onClearFilters,
}) => {
    if (isLoading) {
        return <BookmarksGridSkeleton count={6} />;
    }

    return (
        <div className="w-full space-y-6">
            {/* Controls Bar: Capsule Search Input & Capsule Sort Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-1">
                {/* Search Input */}
                <div className="relative w-full max-w-xs sm:max-w-sm">
                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search bookmarked modules..."
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

                {/* Sort Control */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
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

            {/* Empty State */}
            {modules.length === 0 ? (
                <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-foreground-light dark:bg-foreground-dark border border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md">
                    <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                        <BookOpen className="size-6" />
                    </div>
                    {searchQuery ? (
                        <>
                            <Typography
                                variant={TypographyVariant.H4}
                                weight={TypographyWeight.BOLD}
                                className="text-base text-body-light-shade3 dark:text-body-dark mb-1"
                            >
                                No modules match &quot;{searchQuery}&quot;
                            </Typography>
                            <Typography
                                variant={TypographyVariant.MUTED}
                                className="text-xs sm:text-sm text-muted-light dark:text-muted-dark max-w-sm mb-4"
                            >
                                Try searching for another module title or clear your search term.
                            </Typography>
                            <Button
                                variant={ButtonVariant.SECONDARY}
                                size={ButtonSize.SM}
                                onClick={onClearFilters}
                                className="cursor-pointer"
                            >
                                Clear Search
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography
                                variant={TypographyVariant.H4}
                                weight={TypographyWeight.BOLD}
                                className="text-base text-body-light-shade3 dark:text-body-dark mb-1"
                            >
                                No bookmarked modules yet
                            </Typography>
                            <Typography
                                variant={TypographyVariant.MUTED}
                                className="text-xs sm:text-sm text-muted-light dark:text-muted-dark max-w-md mb-4"
                            >
                                Bookmark modules from the learning tracks to organize your mastery roadmap and track your completion progress.
                            </Typography>
                            <Link href="/modules">
                                <Button
                                    variant={ButtonVariant.DEFAULT}
                                    size={ButtonSize.SM}
                                    className="cursor-pointer gap-2"
                                >
                                    <Sparkles className="size-3.5" />
                                    <span>Explore Modules</span>
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            ) : (
                /* Module Cards Grid */
                <Grid cols={3} gap="lg" className="w-full">
                    {modules.map((module) => (
                        <BookmarkCard
                            key={module.id}
                            data={{
                                id: module.id,
                                title: module.title,
                                slug: module.slug,
                                type: 'module',
                                problemsCount: module.problemsCount,
                                problemsSolvedCount: module.problemsSolvedCount,
                                problemsSolvedPercentage: module.problemsSolvedPercentage,
                            }}
                            onRemoveBookmark={() => onRemoveBookmark(module)}
                        />
                    ))}
                </Grid>
            )}
        </div>
    );
};
