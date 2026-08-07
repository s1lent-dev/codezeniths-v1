'use client';

import React from 'react';
import { ChevronDown, ChevronUp, Loader2, Filter } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import { useTags } from './useTags';

export interface TagsSectionProps {
    className?: string;
    onTagSelect?: (slug: string) => void;
}

export const TagsSection: React.FC<TagsSectionProps> = ({ className, onTagSelect }) => {
    const {
        visibleTags,
        moduleOptions,
        selectedModuleSlug,
        setSelectedModuleSlug,
        isLoading,
        isExpanded,
        toggleExpanded,
        hasMore,
        isLoadingMore,
        handleLoadMore,
        handleTagClick,
    } = useTags();

    const handleClick = (slug: string) => {
        onTagSelect?.(slug);
        handleTagClick(slug);
    };

    if (isLoading) {
        return (
            <div className={cn('w-full space-y-3 font-sans text-xs', className)}>
                <div className="flex items-center justify-between gap-3">
                    <div className="h-8 w-36 rounded-md bg-foreground-light-shade3/40 dark:bg-foreground-dark-shade3/40 animate-pulse" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="px-6 py-2 rounded-full bg-foreground-light-shade3/40 dark:bg-foreground-dark-shade3/40 animate-pulse h-7 w-20"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={cn('w-full space-y-3 font-sans text-xs', className)}>
            {/* Header Controls: Module Filter & Expand/Collapse Toggle */}
            <div className="flex items-center justify-between gap-3">
                {/* Module Filter Dropdown */}
                <div className="flex items-center gap-2">
                    <Select
                        value={selectedModuleSlug}
                        onValueChange={(val) => setSelectedModuleSlug(val)}
                    >
                        <SelectTrigger className="h-8 text-xs px-3 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark hover:border-primary/50 transition-all cursor-pointer min-w-36">
                            <div className="flex items-center gap-1.5">
                                <Filter className="w-3 h-3 text-muted-light dark:text-muted-dark" />
                                <SelectValue placeholder="All Modules" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 p-1 z-350">
                            <SelectItem value="all" className="cursor-pointer">All Modules</SelectItem>
                            {moduleOptions.map((m) => (
                                <SelectItem key={m.id} value={m.slug} className="cursor-pointer">
                                    {m.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Expand / Collapse Toggle Button */}
                <button
                    type="button"
                    onClick={toggleExpanded}
                    className="p-1.5 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:border-primary/50 transition-all cursor-pointer flex items-center gap-1 px-2.5"
                    title={isExpanded ? 'Show less tags' : 'Show more tags'}
                >
                    <span className="text-[11px] font-medium">
                        {isExpanded ? 'Collapse' : 'Expand Tags'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
            </div>

            {/* Tags Grid (1-line when collapsed, 3-lines when expanded) */}
            <div className="flex items-center gap-2 flex-wrap">
                {visibleTags.length > 0 ? (
                    visibleTags.map((tag) => (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleClick(tag.slug)}
                            className={cn(
                                'px-3 py-1.5 rounded-full border transition-all cursor-pointer font-medium text-xs',
                                'bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark hover:border-primary/50 hover:text-heading-light dark:hover:text-heading-dark'
                            )}
                        >
                            {tag.name}
                        </button>
                    ))
                ) : (
                    <div className="text-muted-light dark:text-muted-dark italic py-1">
                        No tags found for this module.
                    </div>
                )}
            </div>

            {/* Load More Button (Shown when expanded & hasMore is true) */}
            {hasMore && (
                <div className="flex justify-center pt-1">
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="rounded-full text-xs gap-1.5 border-foreground-light-shade3 dark:border-foreground-dark-shade3 hover:border-primary cursor-pointer px-4"
                    >
                        {isLoadingMore ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <>
                                <span>Load More Tags</span>
                                <ChevronDown className="w-3.5 h-3.5" />
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};
