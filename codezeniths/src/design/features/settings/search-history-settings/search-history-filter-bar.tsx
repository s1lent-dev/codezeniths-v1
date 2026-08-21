'use client';

import React, { useState } from 'react';
import {
    Search,
    X,
    Layers,
    Code2,
    BookOpen,
    Boxes,
    Tag,
    Users,
    Sparkles,
    Trash2,
    Loader2,
} from 'lucide-react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@codezeniths/modules';
import { searchQueryService } from '@/lib/tanstack/services/search.query-service';
import { cn } from '@codezeniths/design/cn';

export type SearchHistoryCategoryFilter =
    | 'all'
    | 'problem'
    | 'topic'
    | 'module'
    | 'tag'
    | 'user'
    | 'product';

export interface SearchHistoryFilterBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    category: SearchHistoryCategoryFilter;
    onCategoryChange: (cat: SearchHistoryCategoryFilter) => void;
    totalSearches?: number;
}

const CATEGORY_TABS: Array<{
    id: SearchHistoryCategoryFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}> = [
    { id: 'all', label: 'All', icon: Layers },
    { id: 'problem', label: 'Problems', icon: Code2 },
    { id: 'topic', label: 'Topics', icon: BookOpen },
    { id: 'module', label: 'Modules', icon: Boxes },
    { id: 'tag', label: 'Tags', icon: Tag },
    { id: 'user', label: 'Users', icon: Users },
    { id: 'product', label: 'Products', icon: Sparkles },
];

export const SearchHistoryFilterBar: React.FC<SearchHistoryFilterBarProps> = ({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    totalSearches = 0,
}) => {
    const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
    const clearHistoryMutation = searchQueryService.clearHistory();

    const handleConfirmClear = async () => {
        await clearHistoryMutation.mutateAsync();
        setIsClearDialogOpen(false);
    };

    return (
        <div className="w-full space-y-3 sm:space-y-4 font-sans">
            {/* Top Row: Search Input + Clear All Button */}
            <div className="flex items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Filter search history by title, keyword, or username..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-[38px] pl-10 pr-9 text-xs sm:text-sm bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark placeholder:text-muted-light dark:placeholder:text-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark p-0.5 cursor-pointer"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Clear All History Button placed to the right of search bar */}
                {totalSearches > 0 && (
                    <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant={ButtonVariant.ERROR}
                                size={ButtonSize.DEFAULT}
                                className="h-[38px] px-3.5 text-xs font-semibold gap-1.5 shrink-0 rounded-md cursor-pointer"
                            >
                                <Trash2 className="size-3.5" />
                                <span>Clear All</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Clear All Search History?</DialogTitle>
                                <DialogDescription>
                                    This action will permanently delete all your recent searches, problem lookups, and discovery history. This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-0 mt-4">
                                <Button
                                    variant={ButtonVariant.GHOST}
                                    onClick={() => setIsClearDialogOpen(false)}
                                    disabled={clearHistoryMutation.isPending}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant={ButtonVariant.ERROR}
                                    onClick={handleConfirmClear}
                                    disabled={clearHistoryMutation.isPending}
                                    className="gap-2"
                                >
                                    {clearHistoryMutation.isPending ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            <span>Clearing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="size-4" />
                                            <span>Clear History</span>
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Bottom Row: Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                    const isActive = category === tab.id;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onCategoryChange(tab.id)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap cursor-pointer shrink-0',
                                isActive
                                    ? 'bg-primary/10 border-primary text-primary dark:text-primary'
                                    : 'bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 hover:text-heading-light dark:hover:text-heading-dark'
                            )}
                        >
                            <Icon className="size-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
