'use client';

import React from 'react';
import { SlidersHorizontal, Check, X } from 'lucide-react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { useNavigationStore } from '../store/navigation.store';

export const SearchFilterPopover = () => {
    const {
        isSearchFilterOpen,
        setSearchFilterOpen,
        searchFilters,
        setSearchFilters,
        resetSearchFilters,
    } = useNavigationStore();

    const activeFilterCount =
        (searchFilters.difficulty && searchFilters.difficulty !== 'all' ? 1 : 0) +
        (searchFilters.type && searchFilters.type !== 'all' ? 1 : 0);

    return (
        <Popover open={isSearchFilterOpen} onOpenChange={setSearchFilterOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="p-1.5 rounded-sm hover:bg-primary/15 dark:hover:bg-primary/15 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors relative cursor-pointer"
                    title="Search Filters"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-72 p-4 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-xl shadow-xl z-999 space-y-4"
            >
                <div className="flex items-center justify-between border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 m-2 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark flex items-center gap-2">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                        Search Filters
                    </span>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={resetSearchFilters}
                            className="text-xs text-primary hover:underline font-medium cursor-pointer"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-light dark:text-muted-dark">
                        Difficulty
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                        {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => {
                            const isSelected = (searchFilters.difficulty || 'all') === diff;
                            return (
                                <button
                                    key={diff}
                                    type="button"
                                    onClick={() => setSearchFilters({ difficulty: diff })}
                                    className={`px-2 py-1 text-xs font-medium rounded-md capitalize transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-body-light dark:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2'
                                    }`}
                                >
                                    {diff}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Category Type Filter */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-light dark:text-muted-dark">
                        Category
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {(['all', 'problems', 'modules', 'tags'] as const).map((cat) => {
                            const isSelected = (searchFilters.type || 'all') === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSearchFilters({ type: cat })}
                                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md capitalize flex items-center justify-between transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-primary/10 text-primary border border-primary/30 font-semibold'
                                            : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-body-light dark:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2'
                                    }`}
                                >
                                    <span>{cat}</span>
                                    {isSelected && <Check className="w-3 h-3 text-primary" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="pt-1 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                    <Button
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.NONE}
                        onClick={() => setSearchFilterOpen(false)}
                        className="w-full py-1.5 text-xs font-medium bg-primary text-white hover:bg-primary-shade2 rounded-lg"
                    >
                        Apply Filters
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
