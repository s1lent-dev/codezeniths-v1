'use client';

import React from 'react';
import Link from 'next/link';
import { History, ArrowUpRight } from 'lucide-react';
import { Typography } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export interface RecentlySolvedProblemItem {
    id: string;
    title: string;
    slug: string;
    solvedAt?: string | Date | null;
}

export interface RecentlySolvedListProps {
    problems?: RecentlySolvedProblemItem[];
    isLoading?: boolean;
    className?: string;
}

export function formatTimeAgo(dateInput?: string | Date | null): string {
    if (!dateInput) return 'Recently';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

export const RecentlySolvedList: React.FC<RecentlySolvedListProps> = ({
    problems = [],
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return (
            <div
                className={cn(
                    'rounded-lg bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 shadow-xs font-sans w-full space-y-3.5',
                    className
                )}
            >
                <div className="h-5 w-44 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md animate-pulse" />
                <div className="flex flex-col gap-1.5">
                    {[1, 2, 3, 4, 5].map((i, index) => (
                        <div
                            key={i}
                            className={cn(
                                'py-3.5 px-4 rounded-md flex justify-between items-center animate-pulse',
                                index % 2 === 0
                                    ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1'
                                    : 'bg-transparent'
                            )}
                        >
                            <div className="h-4 w-48 bg-foreground-dark-shade1/60 dark:bg-foreground-dark-shade1/60 rounded-md" />
                            <div className="h-3.5 w-16 bg-foreground-dark-shade1/60 dark:bg-foreground-dark-shade1/60 rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'rounded-lg bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 shadow-xs font-sans w-full flex flex-col gap-3.5',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-secondary/15">
                <History className="size-4 text-primary" />
                <Typography className="text-sm font-bold text-heading-light dark:text-heading-dark">
                    Recently Solved
                </Typography>
                <span className="text-xs text-muted-light dark:text-muted-dark">
                    ({problems.length})
                </span>
            </div>

            {/* Problem List */}
            {problems.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-light/80 dark:text-muted-dark/80 italic">
                    No recently solved problems found.
                </div>
            ) : (
                <div className="flex flex-col gap-1.5">
                    {problems.map((problem, index) => {
                        const isOddZebra = index % 2 === 0;
                        return (
                            <div
                                key={problem.id}
                                className={cn(
                                    'py-3.5 px-4 flex items-center justify-between gap-4 rounded-md transition-colors group select-none',
                                    isOddZebra
                                        ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 hover:bg-foreground-light-shade2/70 dark:hover:bg-foreground-dark-shade2/70'
                                        : 'bg-transparent hover:bg-foreground-light-shade1/40 dark:hover:bg-foreground-dark-shade1/40'
                                )}
                            >
                                {/* Left: Problem Title Link */}
                                <Link
                                    href={`/problems/${problem.slug}`}
                                    className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-body-light dark:text-body-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors min-w-0 flex-1 truncate"
                                >
                                    <span className="truncate">{problem.title}</span>
                                    <ArrowUpRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-light dark:text-muted-dark" />
                                </Link>

                                {/* Right: Human Readable Timestamp */}
                                <span className="text-[11px] sm:text-xs text-muted-light dark:text-muted-dark shrink-0 font-medium">
                                    {formatTimeAgo(problem.solvedAt)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
