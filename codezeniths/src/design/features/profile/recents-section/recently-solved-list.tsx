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

import { motion } from 'motion/react';

export const RecentlySolvedList: React.FC<RecentlySolvedListProps> = ({
    problems = [],
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return (
            <div
                className={cn(
                    'rounded-lg bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 shadow-xs font-sans w-full space-y-3.5 relative overflow-hidden select-none',
                    className
                )}
            >
                {/* Sweeping Shimmer Beam */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.2,
                    }}
                    className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
                />

                <motion.div
                    animate={{ opacity: [0.35, 0.85, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-5 w-44 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md relative z-10"
                />
                <div className="flex flex-col gap-1.5 relative z-10">
                    {[1, 2, 3, 4, 5].map((i, index) => (
                        <div
                            key={i}
                            className={cn(
                                'py-3.5 px-4 rounded-md flex justify-between items-center',
                                index % 2 === 0
                                    ? 'bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70'
                                    : 'bg-transparent'
                            )}
                        >
                            <motion.div
                                animate={{ opacity: [0.35, 0.8, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.05 }}
                                className="h-4 w-48 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                            <motion.div
                                animate={{ opacity: [0.35, 0.75, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.05 + 0.03 }}
                                className="h-3.5 w-16 bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60 rounded-md"
                            />
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
