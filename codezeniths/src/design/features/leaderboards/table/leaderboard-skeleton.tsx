'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Table, TableBody, TableCell } from '@codezeniths/modules';

export interface LeaderboardSkeletonProps {
    rowsCount?: number;
    className?: string;
}

export const LeaderboardSkeleton: React.FC<LeaderboardSkeletonProps> = ({
    rowsCount = 8,
    className,
}) => {
    return (
        <div className={cn('w-full space-y-4 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-6 rounded-lg', className)}>
            {/* Top Control Bar Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
                <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-md">
                    <div className="relative flex-1 h-9 min-w-[180px] rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                    <div className="w-28 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                    <div className="w-48 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-24 h-4 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                    <div className="w-8 h-8 rounded-lg bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                </div>
            </div>

            {/* Table Rows Skeleton */}
            <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0">
                <TableBody>
                    {Array.from({ length: rowsCount }).map((_, index) => (
                        <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className={cn(
                                'rounded-md border-0',
                                index % 2 === 1
                                    ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1'
                                    : 'bg-transparent'
                            )}
                        >
                            {/* Rank Position Skeleton */}
                            <TableCell className="w-16 min-w-16 max-w-16 pl-4 py-3.5 text-center align-middle rounded-l-md border-0">
                                <div className="size-6 mx-auto rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                            </TableCell>

                            {/* User Profile Info Skeleton */}
                            <TableCell className="w-auto py-3.5 px-3 align-middle border-0">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                                    <div className="flex flex-col gap-1.5 flex-1">
                                        <div className="w-28 h-3.5 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                                        <div className="w-20 h-2.5 rounded bg-foreground-light-shade3/40 dark:bg-foreground-dark-shade3/40 animate-pulse" />
                                    </div>
                                </div>
                            </TableCell>

                            {/* Rank Tier Badge Skeleton */}
                            <TableCell className="w-48 min-w-44 max-w-56 py-3.5 px-3 align-middle border-0 hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                                    <div className="w-24 h-3.5 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                                </div>
                            </TableCell>

                            {/* Score Skeleton */}
                            <TableCell className="w-32 min-w-28 max-w-36 py-3.5 px-3 text-right align-middle border-0">
                                <div className="flex flex-col items-end gap-1">
                                    <div className="w-16 h-3.5 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                                    <div className="w-8 h-2 rounded bg-foreground-light-shade3/40 dark:bg-foreground-dark-shade3/40 animate-pulse" />
                                </div>
                            </TableCell>

                            {/* Percentile Skeleton */}
                            <TableCell className="w-28 min-w-24 max-w-32 pr-4 py-3.5 text-right align-middle rounded-r-md border-0">
                                <div className="w-14 h-4 ml-auto rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
