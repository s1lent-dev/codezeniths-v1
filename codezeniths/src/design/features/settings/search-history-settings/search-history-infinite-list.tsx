'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Button,
    ButtonVariant,
    ButtonSize,
    ScrollArea,
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import {
    Code2,
    BookOpen,
    Boxes,
    Tag,
    User as UserIcon,
    Sparkles,
    Trash2,
    Loader2,
    SearchX,
    ExternalLink,
    Clock,
} from 'lucide-react';
import { searchQueryService } from '@/lib/tanstack/services/search.query-service';
import { SearchHistoryCategoryFilter } from './search-history-filter-bar';
import { cn } from '@codezeniths/design/cn';
import type { UserSearchHistory } from '@codezeniths/schemas/db';

export interface SearchHistoryInfiniteListProps {
    search: string;
    category: SearchHistoryCategoryFilter;
}

function formatRelativeTime(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getCollectionVisuals(collection: string): {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    badgeClass: string;
    iconBgClass: string;
} {
    switch (collection.toLowerCase()) {
        case 'problem':
            return {
                icon: Code2,
                label: 'Problem',
                badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
                iconBgClass: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
            };
        case 'topic':
            return {
                icon: BookOpen,
                label: 'Topic',
                badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
                iconBgClass: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
            };
        case 'module':
            return {
                icon: Boxes,
                label: 'Module',
                badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
                iconBgClass: 'bg-purple-500/10 text-purple-500 border border-purple-500/20',
            };
        case 'tag':
            return {
                icon: Tag,
                label: 'Tag',
                badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
                iconBgClass: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
            };
        case 'user':
            return {
                icon: UserIcon,
                label: 'Profile',
                badgeClass: 'bg-teal/10 text-teal dark:text-teal-400 border-teal/20',
                iconBgClass: 'bg-teal/10 text-teal border border-teal/20',
            };
        case 'product':
            return {
                icon: Sparkles,
                label: 'Product',
                badgeClass: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
                iconBgClass: 'bg-pink-500/10 text-pink-500 border border-pink-500/20',
            };
        default:
            return {
                icon: Code2,
                label: 'Search Item',
                badgeClass: 'bg-secondary/15 text-muted-light dark:text-muted-dark border-secondary/25',
                iconBgClass: 'bg-secondary/15 text-muted-light border border-secondary/25',
            };
    }
}

export const SearchHistoryInfiniteList: React.FC<SearchHistoryInfiniteListProps> = ({
    search,
    category,
}) => {
    const router = useRouter();

    const {
        data: infiniteData,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = searchQueryService.getSearchHistoryInfinite(
        {
            collection: category === 'all' ? undefined : category,
            search: search.trim() || undefined,
        },
        6
    );

    const deleteItemMutation = searchQueryService.deleteHistoryItem();

    const allItems = infiniteData?.pages.flatMap((page) => page.items) || [];
    const totalCount = infiniteData?.pages[0]?.totalCount ?? 0;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!hasNextPage || isFetchingNextPage) return;
        const target = e.currentTarget;
        const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        if (scrollBottom < 60) {
            void fetchNextPage();
        }
    };

    const handleItemClick = (item: UserSearchHistory) => {
        const coll = item.collection.toLowerCase();
        if (coll === 'problem') {
            router.push(`/problemset/${item.slug || item.resultId}`);
        } else if (coll === 'topic') {
            const moduleSlug = item.metadata?.module
                ? item.metadata.module.toLowerCase().trim().replace(/\s+/g, '-')
                : 'general';
            router.push(`/modules/${moduleSlug}/${item.slug || item.resultId}`);
        } else if (coll === 'tag') {
            router.push(`/tags/${item.slug || item.resultId}`);
        } else if (coll === 'module') {
            router.push(`/modules/${item.slug || item.resultId}`);
        } else if (coll === 'user') {
            const username = item.slug || item.metadata?.username || item.resultId;
            router.push(`/profile/${username}`);
        } else if (coll === 'product') {
            router.push(`/${item.slug || item.resultId}`);
        } else {
            router.push(`/problemset/${item.slug || item.resultId}`);
        }
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteItemMutation.mutate({ id });
    };

    if (isLoading) {
        return (
            <div className="w-full space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card
                        key={i}
                        className="w-full p-4 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark animate-pulse"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5 flex-1">
                                <div className="size-10 rounded-md bg-secondary/20 shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-48 rounded bg-secondary/20" />
                                    <div className="h-3 w-28 rounded bg-secondary/15" />
                                </div>
                            </div>
                            <div className="h-6 w-20 rounded bg-secondary/15 shrink-0" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (allItems.length === 0) {
        return (
            <Card className="w-full py-16 px-6 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark font-sans">
                <div className="w-full flex flex-col items-center justify-center text-center gap-3">
                    <div className="size-14 rounded-full bg-secondary/15 text-muted-light dark:text-muted-dark flex items-center justify-center shrink-0 mx-auto">
                        <SearchX className="size-7 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <Typography variant={TypographyVariant.H6} weight={TypographyWeight.SEMIBOLD} className="text-heading-light dark:text-heading-dark text-sm sm:text-base text-center">
                            {search ? `No results found for "${search}"` : 'No search history yet'}
                        </Typography>
                        <Typography variant={TypographyVariant.MUTED} className="text-xs text-muted-light dark:text-muted-dark text-center leading-relaxed">
                            {search
                                ? 'Try searching with different keywords or switch the category filter.'
                                : 'Your searches across problems, topics, tags, modules, and profiles will be automatically tracked here for quick access.'}
                        </Typography>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full space-y-3 font-sans">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs text-muted-light dark:text-muted-dark px-1">
                <span>Showing {allItems.length} of {totalCount} searches</span>
                {hasNextPage && <span className="text-[11px] text-primary">Scroll down to load more</span>}
            </div>

            {/* List */}
            <ScrollArea onScroll={handleScroll} className="w-full max-h-150 overflow-y-auto pr-1">
                <div className="space-y-2.5">
                    {allItems.map((item) => {
                        const visuals = getCollectionVisuals(item.collection);
                        const VisualIcon = visuals.icon;
                        const isUser = item.collection.toLowerCase() === 'user';
                        const isDeleting = deleteItemMutation.isPending && deleteItemMutation.variables?.id === item.id;

                        const userAvatar = item.metadata?.image || '';
                        const username = item.metadata?.username || item.slug;
                        const difficulty = item.metadata?.difficulty;
                        const parentModule = item.metadata?.module;

                        return (
                            <Card
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={cn(
                                    'w-full p-3.5 sm:p-4 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:border-primary/40 hover:bg-foreground-light-shade1/60 dark:hover:bg-foreground-dark-shade1/60 transition-all cursor-pointer shadow-2xs group relative overflow-hidden',
                                    isDeleting && 'opacity-50 pointer-events-none'
                                )}
                            >
                                <div className="flex items-center justify-between gap-3 sm:gap-4">
                                    {/* Left: Icon / Avatar + Details */}
                                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                        {isUser ? (
                                            <Avatar className="size-10 rounded-md shrink-0 border border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                                                <AvatarImage src={userAvatar} alt={item.title} />
                                                <AvatarFallback className="rounded-md bg-teal/10 text-teal text-xs font-bold">
                                                    {item.title.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div
                                                className={cn(
                                                    'size-10 rounded-md flex items-center justify-center shrink-0 shadow-2xs',
                                                    visuals.iconBgClass
                                                )}
                                            >
                                                <VisualIcon className="size-5" />
                                            </div>
                                        )}

                                        <div className="flex flex-col min-w-0 justify-center">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Typography
                                                    variant={TypographyVariant.P}
                                                    weight={TypographyWeight.SEMIBOLD}
                                                    className="text-xs sm:text-sm text-heading-light dark:text-heading-dark truncate group-hover:text-primary transition-colors"
                                                >
                                                    {item.title}
                                                </Typography>

                                                {/* Category Pill */}
                                                <span
                                                    className={cn(
                                                        'text-[10px] font-normal px-2 py-0.5 rounded-full border shrink-0 mb-1',
                                                        visuals.badgeClass
                                                    )}
                                                >
                                                    {visuals.label}
                                                </span>

                                                {/* Optional Difficulty Pill for problems */}
                                                {difficulty && (
                                                    <span
                                                        className={cn(
                                                            'text-[10px] font-medium px-1.5 py-0.2 rounded shrink-0 capitalize',
                                                            difficulty === 'easy' && 'text-emerald-500 bg-emerald-500/10',
                                                            difficulty === 'medium' && 'text-amber-500 bg-amber-500/10',
                                                            difficulty === 'hard' && 'text-red-500 bg-red-500/10'
                                                        )}
                                                    >
                                                        {difficulty}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Subtitle / Context */}
                                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-light dark:text-muted-dark truncate">
                                                {isUser && username && (
                                                    <span className="font-mono text-muted-light/80 dark:text-muted-dark/80">
                                                        @{username}
                                                    </span>
                                                )}
                                                {parentModule && (
                                                    <span className="truncate">in {parentModule}</span>
                                                )}
                                                {!isUser && !parentModule && item.slug && (
                                                    <span className="truncate font-mono text-[10px] opacity-70">
                                                        /{item.slug}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Timestamp & Actions */}
                                    <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                                        <div className="flex items-center gap-1 text-[11px] text-muted-light dark:text-muted-dark font-medium">
                                            <Clock className="size-3 opacity-60" />
                                            <span>{formatRelativeTime(item.updatedAt)}</span>
                                        </div>

                                        {/* Individual Delete Button */}
                                        <Button
                                            variant={ButtonVariant.GHOST}
                                            size={ButtonSize.NONE}
                                            onClick={(e) => handleDelete(e, item.id)}
                                            disabled={isDeleting}
                                            className="p-1.5 text-muted-light dark:text-muted-dark hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
                                            aria-label="Remove search item"
                                        >
                                            {isDeleting ? (
                                                <Loader2 className="size-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="size-3.5" />
                                            )}
                                        </Button>

                                        <ExternalLink className="size-3.5 text-muted-light dark:text-muted-dark opacity-0 group-hover:opacity-100 group-hover:text-primary transition-opacity hidden sm:block" />
                                    </div>
                                </div>
                            </Card>
                        );
                    })}

                    {isFetchingNextPage && (
                        <div className="p-4 text-center flex items-center justify-center gap-2 text-xs text-muted-light dark:text-muted-dark">
                            <Loader2 className="size-4 animate-spin text-primary" />
                            <span>Loading more search history...</span>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};
