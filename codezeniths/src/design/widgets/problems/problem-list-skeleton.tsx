'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Table, TableBody, TableCell } from '@codezeniths/modules';

export interface ProblemListSkeletonProps {
    rowsCount?: number;
    className?: string;
}

export const ProblemListSkeleton: React.FC<ProblemListSkeletonProps> = ({
    rowsCount = 6,
    className,
}) => {
    const titleWidths = ['w-2/5', 'w-3/5', 'w-1/2', 'w-4/5', 'w-1/3', 'w-2/3'];

    return (
        <div className={cn('w-full space-y-4 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-6', className)}>
            {/* Top Control Bar Skeleton */}
            <div className="flex items-center justify-between gap-4 pb-2">
                {/* Left controls: Search input & buttons */}
                <div className="flex items-center gap-2.5 flex-1 max-w-md">
                    <div className="relative flex-1 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                    <div className="w-9 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                    <div className="w-9 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                </div>

                {/* Right controls: Solved counter & menu */}
                <div className="flex items-center gap-4">
                    <div className="w-24 h-4 rounded-md bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                    <div className="w-8 h-8 rounded-lg bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                </div>
            </div>

            {/* Problem Table Rows Skeleton */}
            <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0">
                <TableBody>
                    {Array.from({ length: rowsCount }).map((_, index) => (
                        <motion.tr
                            key={index}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.05 }}
                            className={cn(
                                'rounded-md border-0',
                                index % 2 === 0
                                    ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1'
                                    : 'bg-transparent'
                            )}
                        >
                            {/* Checkbox Cell Skeleton */}
                            <TableCell className="w-12 min-w-[48px] max-w-[48px] pl-4 py-3.5 text-center align-middle rounded-l-md border-0">
                                <motion.div
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                    className="w-4 h-4 mx-auto rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                />
                            </TableCell>

                            {/* Title Cell Skeleton */}
                            <TableCell className="w-auto py-3.5 px-3 align-middle border-0">
                                <motion.div
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                    className={cn(
                                        'h-4 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3',
                                        titleWidths[index % titleWidths.length]
                                    )}
                                />
                            </TableCell>

                            {/* Action Icons & Difficulty Cell Skeleton */}
                            <TableCell className="w-48 min-w-48 max-w-48 pr-4 py-3.5 text-right align-middle rounded-r-md border-0">
                                <div className="flex items-center justify-end gap-3.5">
                                    {/* External Link Skeleton */}
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                        className="w-4 h-4 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                    />
                                    {/* Difficulty Badge Skeleton */}
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                        className="w-12 h-4 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                    />
                                    {/* Favourite Star Skeleton */}
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                        className="w-4 h-4 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                    />
                                </div>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
