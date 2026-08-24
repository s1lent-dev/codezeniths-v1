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
        <div className={cn('w-full space-y-4 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-2.5 xs:p-3 sm:p-5 md:p-6 rounded-lg shadow-sm', className)}>
            {/* Top Control Bar Skeleton */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4 pb-2">
                {/* Left controls: Search input & buttons */}
                <div className="flex items-center gap-2 xs:gap-2.5 flex-1 min-w-0 max-w-md">
                    <div className="relative flex-1 h-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                    <div className="size-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                    <div className="size-9 rounded-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse shrink-0" />
                </div>

                {/* Right controls: Solved counter & menu */}
                <div className="flex items-center justify-between xs:justify-end gap-3 sm:gap-4 shrink-0 pt-2 xs:pt-0 border-t xs:border-t-0 border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                    <div className="w-20 sm:w-24 h-4 rounded-md bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
                    <div className="size-7 sm:size-8 rounded-lg bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 animate-pulse" />
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
                            <TableCell className="w-10 sm:w-12 min-w-[40px] sm:min-w-[48px] max-w-[40px] sm:max-w-[48px] pl-2.5 sm:pl-4 py-2.5 sm:py-3.5 text-center align-middle rounded-l-md border-0">
                                <motion.div
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                    className="w-4 h-4 mx-auto rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                />
                            </TableCell>

                            {/* Title Cell Skeleton */}
                            <TableCell className="w-auto py-2.5 sm:py-3.5 px-1.5 sm:px-3 align-middle border-0 min-w-0">
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
                            <TableCell className="w-24 xs:w-28 sm:w-36 min-w-[96px] xs:min-w-[112px] sm:min-w-[144px] max-w-[144px] pr-2 sm:pr-4 py-2.5 sm:py-3.5 text-right align-middle rounded-r-md border-0">
                                <div className="flex items-center justify-end gap-1.5 xs:gap-2.5">
                                    {/* External Link Skeleton */}
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                        className="hidden xs:block w-4 h-4 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                                    />
                                    {/* Difficulty Badge Skeleton */}
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                        className="w-8 xs:w-10 sm:w-12 h-4 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0"
                                    />
                                    {/* Actions Skeleton */}
                                    <motion.div
                                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.1 }}
                                        className="size-6 sm:size-7 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0"
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
