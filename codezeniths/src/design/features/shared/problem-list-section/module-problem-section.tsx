'use client';

import React, { useState } from 'react';
import { cn } from '@codezeniths/design/cn';
import {
    Search,
    X,
    CheckCircle2,
    MoreHorizontal,
    Maximize2,
    Minimize2,
    RotateCcw,
    Layers,
} from 'lucide-react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Input,
    TooltipProvider,
} from '@codezeniths/components';
import {
    ScopeSelector,
    TopicAccordionItem,
    ModuleProblemFilterPopover,
    ModuleProblemSortPopover,
} from '@codezeniths/design/widgets/problems';
import { useModuleProblems } from './useModuleProblems';

export interface ModuleProblemSectionProps {
    moduleSlug: string;
    topics?: Array<{
        id?: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: any;
        order?: number;
        problemsCount: number;
        problemsSolvedCount: number;
        problemsSolvedPercentage: number;
    }>;
    isLoading?: boolean;
    className?: string;
}

export const ModuleProblemSection: React.FC<ModuleProblemSectionProps> = ({
    moduleSlug,
    topics = [],
    isLoading: isSectionLoading = false,
    className,
}) => {
    const {
        scope,
        setScope,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        sorting,
        setSorting,
        isLoading: isHookLoading,
        processedTopics,
        expandedTopicIds,
        toggleTopic,
        expandAll,
        collapseAll,
        resetFilters,
        handleToggleSolved,
        handleToggleFavourite,
        handleToggleTopicBookmark,
        totalProblemsCount,
        solvedProblemsCount,
    } = useModuleProblems({ moduleSlug, topicsMeta: topics });

    const [menuOpen, setMenuOpen] = useState(false);
    const isLoading = isSectionLoading || isHookLoading;

    return (
        <TooltipProvider delayDuration={100}>
            <div
                className={cn(
                    'w-full font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-2.5 xs:p-3 sm:p-5 md:p-6 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-sm space-y-4 sm:space-y-5',
                    className
                )}
            >
                {/* 1] Top Toolbar Control Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                    {/* Left Controls: Scope Selector + Search Input + Filter + Sort */}
                    <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                        <ScopeSelector scope={scope} onScopeChange={setScope} />

                        {/* Search Input Box */}
                        <div className="relative flex-1 min-w-50 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-light dark:text-muted-dark pointer-events-none" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={
                                    scope === 'topic'
                                        ? 'Search topics by name...'
                                        : 'Search problems by title or tags...'
                                }
                                className="pl-10 pr-8 h-9 text-xs border-foreground-light-shade3 dark:border-foreground-dark-shade3/60 bg-background-light dark:bg-background-dark focus-visible:ring-primary/30 rounded-full"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark p-0.5 cursor-pointer"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Filter Popover */}
                        <ModuleProblemFilterPopover
                            scope={scope}
                            filters={filters}
                            onFilterChange={setFilters}
                            onReset={resetFilters}
                        />

                        {/* Sort Popover */}
                        <ModuleProblemSortPopover
                            scope={scope}
                            sorting={sorting}
                            onSortingChange={setSorting}
                        />
                    </div>

                    {/* Right Controls: Total Module Progress Counter Badge + Three Dot Options */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
                            <CheckCircle2 className="size-4 shrink-0" />
                            <span>
                                {solvedProblemsCount} / {totalProblemsCount} Solved
                            </span>
                        </div>

                        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={ButtonVariant.OUTLINE}
                                    size={ButtonSize.ICON_SM}
                                    className="size-9 rounded-lg border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-heading-light dark:text-heading-dark hover:border-primary transition-all"
                                    aria-label="View Options"
                                >
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                align="end"
                                className="w-48 p-1.5 rounded-xl border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark shadow-lg font-sans"
                            >
                                <div className="space-y-0.5 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            expandAll();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full px-3 py-2 rounded-md flex items-center gap-2 text-heading-light dark:text-heading-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-colors cursor-pointer text-left font-medium"
                                    >
                                        <Maximize2 className="size-3.5 text-primary" />
                                        <span>Expand All Topics</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            collapseAll();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full px-3 py-2 rounded-md flex items-center gap-2 text-heading-light dark:text-heading-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 transition-colors cursor-pointer text-left font-medium"
                                    >
                                        <Minimize2 className="size-3.5 text-primary" />
                                        <span>Collapse All Topics</span>
                                    </button>
                                    <div className="my-1 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetFilters();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full px-3 py-2 rounded-md flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer text-left font-medium"
                                    >
                                        <RotateCcw className="size-3.5" />
                                        <span>Reset All Filters</span>
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* 2] Topic Accordions List inside card */}
                {isLoading ? (
                    <div className="w-full space-y-3">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className="w-full h-16 rounded-xl animate-pulse bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3/60"
                            />
                        ))}
                    </div>
                ) : processedTopics.length > 0 ? (
                    <div className="w-full space-y-3">
                        {processedTopics.map((topic) => (
                            <TopicAccordionItem
                                key={topic.id}
                                topic={topic}
                                isOpen={expandedTopicIds.has(topic.id)}
                                onToggle={() => toggleTopic(topic.id)}
                                onToggleSolved={handleToggleSolved}
                                onToggleFavourite={handleToggleFavourite}
                                onToggleBookmark={handleToggleTopicBookmark}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="w-full p-12 border rounded-xl border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-background-light/40 dark:bg-background-dark/40 text-center font-sans space-y-3">
                        <Layers className="size-10 text-muted-light dark:text-muted-dark mx-auto" />
                        <p className="text-sm font-semibold text-heading-light dark:text-heading-dark">
                            No topics or problems found matching your criteria.
                        </p>
                        <p className="text-xs text-muted-light dark:text-muted-dark">
                            Try adjusting your search query, switching scope, or clearing filters.
                        </p>
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            onClick={resetFilters}
                            className="mt-2 text-xs font-semibold"
                        >
                            Reset Search & Filters
                        </Button>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};

// Export aliases for backward compatibility
export const ModuleProblemListSection = ModuleProblemSection;
export type ModuleProblemListSectionProps = ModuleProblemSectionProps;
