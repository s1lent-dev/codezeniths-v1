'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@codezeniths/components';
import { ProblemFilterInput } from '@codezeniths/schemas/db/queries/shared/problem-filter.schema';
import { SearchScope } from './scope-selector';

export interface ModuleProblemFilterPopoverProps {
    scope: SearchScope;
    filters: ProblemFilterInput;
    onFilterChange: (filters: ProblemFilterInput) => void;
    onReset: () => void;
}

export const ModuleProblemFilterPopover: React.FC<ModuleProblemFilterPopoverProps> = ({
    scope,
    filters,
    onFilterChange,
    onReset,
}) => {
    const [open, setOpen] = React.useState(false);

    const activeCount = React.useMemo(() => {
        let count = 0;
        if (scope === 'topic') {
            if (filters.topicLevel) count++;
            if (filters.bookmarkedTopics) count++;
        } else {
            if (filters.difficulty) count++;
            if (filters.status) count++;
            if (filters.favourite !== undefined) count++;
        }
        return count;
    }, [scope, filters]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.SM}
                    className="h-9 px-3 gap-2 border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-heading-light dark:text-heading-dark hover:border-primary transition-all relative shrink-0 cursor-pointer"
                >
                    <Filter className="size-4 text-muted-light dark:text-muted-dark" />
                    <span className="hidden sm:inline text-xs font-semibold">Filter</span>
                    {activeCount > 0 && (
                        <span className="size-4.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="w-72 p-4 space-y-4 rounded-xl border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark shadow-lg font-sans"
            >
                <div className="flex items-center justify-between border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1 pb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-heading-light dark:text-heading-dark flex items-center gap-2">
                        <Filter className="size-3.5 text-primary" />
                        {scope === 'topic' ? 'Topic Filters' : 'Problem Filters'}
                    </span>

                    {activeCount > 0 && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <RotateCcw className="size-3" />
                            Reset
                        </button>
                    )}
                </div>

                {scope === 'topic' ? (
                    /* Topic Scope Filters */
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Topic Level
                            </label>
                            <Select
                                value={filters.topicLevel || 'all'}
                                onValueChange={(val) =>
                                    onFilterChange({
                                        ...filters,
                                        topicLevel: val === 'all' ? undefined : (val as any),
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="All Levels" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">All Levels</SelectItem>
                                    <SelectItem value="fundamental" className="cursor-pointer">Fundamental</SelectItem>
                                    <SelectItem value="intermediate" className="cursor-pointer">Intermediate</SelectItem>
                                    <SelectItem value="advanced" className="cursor-pointer">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Bookmarked Topics
                            </label>
                            <Select
                                value={filters.bookmarkedTopics ? 'bookmarked' : 'all'}
                                onValueChange={(val) =>
                                    onFilterChange({
                                        ...filters,
                                        bookmarkedTopics: val === 'bookmarked' ? true : undefined,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="All Topics" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">All Topics</SelectItem>
                                    <SelectItem value="bookmarked" className="cursor-pointer">Bookmarked Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    /* Problem Scope Filters */
                    <div className="space-y-3">
                        {/* Difficulty */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Difficulty
                            </label>
                            <Select
                                value={filters.difficulty || 'all'}
                                onValueChange={(val) =>
                                    onFilterChange({
                                        ...filters,
                                        difficulty: val === 'all' ? undefined : (val as any),
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="All Difficulties" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">All Difficulties</SelectItem>
                                    <SelectItem value="easy" className="cursor-pointer">Easy</SelectItem>
                                    <SelectItem value="medium" className="cursor-pointer">Medium</SelectItem>
                                    <SelectItem value="hard" className="cursor-pointer">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Status
                            </label>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(val) =>
                                    onFilterChange({
                                        ...filters,
                                        status: val === 'all' ? undefined : (val as any),
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
                                    <SelectItem value="solved" className="cursor-pointer">Solved</SelectItem>
                                    <SelectItem value="revisit" className="cursor-pointer">Revisit</SelectItem>
                                    <SelectItem value="not_solved" className="cursor-pointer">Not Solved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Favourites Only Toggle */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-light dark:text-muted-dark">
                                Favourites
                            </label>
                            <Select
                                value={
                                    filters.favourite === undefined
                                        ? 'all'
                                        : filters.favourite
                                        ? 'favourite'
                                        : 'all'
                                }
                                onValueChange={(val) =>
                                    onFilterChange({
                                        ...filters,
                                        favourite: val === 'favourite' ? true : undefined,
                                    })
                                }
                            >
                                <SelectTrigger className="w-full h-9 text-xs cursor-pointer">
                                    <SelectValue placeholder="All Problems" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all" className="cursor-pointer">All Problems</SelectItem>
                                    <SelectItem value="favourite" className="cursor-pointer">Starred / Favourites Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
};
