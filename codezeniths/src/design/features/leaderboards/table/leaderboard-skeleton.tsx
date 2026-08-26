'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Table, TableBody, TableCell } from '@codezeniths/modules';

const NAME_WIDTHS = ['w-28', 'w-36', 'w-32', 'w-40', 'w-24'];

export interface LeaderboardRowSkeletonProps {
    index?: number;
    className?: string;
}

export const LeaderboardRowSkeleton: React.FC<LeaderboardRowSkeletonProps> = ({
    index = 0,
    className,
}) => {
    const baseDelay = (index % 10) * 0.04;
    const nameWidth = NAME_WIDTHS[index % NAME_WIDTHS.length];

    return (
        <tr
            className={cn(
                'rounded-md border-0 transition-colors',
                index % 2 === 1
                    ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1'
                    : 'bg-transparent',
                className
            )}
        >
            {/* Rank Position Skeleton */}
            <TableCell className="w-16 min-w-16 max-w-16 pl-4 py-3.5 text-center align-middle rounded-l-md border-0">
                <motion.div
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay }}
                    className="size-6 mx-auto rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                />
            </TableCell>

            {/* User Profile Info Skeleton */}
            <TableCell className="w-auto py-3.5 px-3 align-middle border-0">
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.05 }}
                        className="size-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 shrink-0"
                    />
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <motion.div
                            animate={{ opacity: [0.35, 0.8, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.1 }}
                            className={cn('h-3.5 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60', nameWidth)}
                        />
                        <motion.div
                            animate={{ opacity: [0.35, 0.8, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.15 }}
                            className="h-2.5 w-20 rounded bg-foreground-light-shade3/40 dark:bg-foreground-dark-shade3/40"
                        />
                    </div>
                </div>
            </TableCell>

            {/* Rank Tier Badge Skeleton */}
            <TableCell className="w-48 min-w-44 max-w-56 py-3.5 px-3 align-middle border-0 hidden sm:table-cell">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.05 }}
                        className="size-6 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 shrink-0"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.1 }}
                        className="w-24 h-3.5 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                    />
                </div>
            </TableCell>

            {/* Score Skeleton */}
            <TableCell className="w-32 min-w-28 max-w-36 py-3.5 px-3 text-right align-middle border-0">
                <div className="flex flex-col items-end gap-1">
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.1 }}
                        className="w-16 h-3.5 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.15 }}
                        className="w-8 h-2 rounded bg-foreground-light-shade3/40 dark:bg-foreground-dark-shade3/40"
                    />
                </div>
            </TableCell>

            {/* Percentile Skeleton */}
            <TableCell className="w-28 min-w-24 max-w-32 pr-4 py-3.5 text-right align-middle rounded-r-md border-0">
                <motion.div
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.2 }}
                    className="w-14 h-4 ml-auto rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                />
            </TableCell>
        </tr>
    );
};

export interface LeaderboardSkeletonProps {
    rowsCount?: number;
    className?: string;
}

export const LeaderboardSkeleton: React.FC<LeaderboardSkeletonProps> = ({
    rowsCount = 8,
    className,
}) => {
    return (
        <div className={cn('w-full space-y-4 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-5 sm:p-6 rounded-lg shadow-xs border border-secondary/20 relative overflow-hidden select-none', className)}>
            {/* Motion Sweeping Gradient Shimmer Beam */}
            <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 0.25,
                }}
                className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
            />

            {/* Top Control Bar Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 z-10 relative">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-md">
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="relative flex-1 h-9 min-w-[180px] rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                        className="w-28 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 shrink-0"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="w-48 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 shrink-0"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="w-24 h-4 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="w-8 h-8 rounded-lg bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                    />
                </div>
            </div>

            {/* Table Rows Skeleton */}
            <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0 z-10 relative">
                <TableBody>
                    {Array.from({ length: rowsCount }).map((_, index) => (
                        <LeaderboardRowSkeleton key={index} index={index} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
