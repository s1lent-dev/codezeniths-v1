'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Table, TableBody, TableCell, TableRow } from '@codezeniths/modules';

export interface ProblemRowSkeletonProps {
    index?: number;
    titleWidth?: string;
    className?: string;
}

const DEFAULT_TITLE_WIDTHS = ['w-2/5', 'w-3/5', 'w-1/2', 'w-4/5', 'w-1/3', 'w-2/3'];

export const ProblemRowSkeleton: React.FC<ProblemRowSkeletonProps> = ({
    index = 0,
    titleWidth,
    className,
}) => {
    const selectedTitleWidth = titleWidth ?? DEFAULT_TITLE_WIDTHS[index % DEFAULT_TITLE_WIDTHS.length];
    const baseDelay = (index % 10) * 0.04;

    return (
        <TableRow
            className={cn(
                'group rounded-md border-0 h-13 box-border transition-colors',
                index % 2 === 0
                    ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1'
                    : 'bg-transparent',
                className
            )}
        >
            {/* 1. Solved Checkbox Column Skeleton */}
            <TableCell className="w-10 sm:w-12 min-w-[40px] sm:min-w-[48px] max-w-[40px] sm:max-w-[48px] pl-2.5 sm:pl-4 py-2.5 sm:py-3 text-center align-middle rounded-l-md border-0">
                <motion.div
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay }}
                    className="size-4 mx-auto rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 border border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/60"
                />
            </TableCell>

            {/* 2. Title Column Skeleton */}
            <TableCell className="w-auto py-2.5 sm:py-3 px-1.5 sm:px-3 align-middle border-0 min-w-0">
                <motion.div
                    animate={{ opacity: [0.35, 0.85, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.05 }}
                    className={cn(
                        'h-3.5 sm:h-4 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3',
                        selectedTitleWidth
                    )}
                />
            </TableCell>

            {/* 3. Action Icons & Difficulty Column Skeleton */}
            <TableCell className="w-24 xs:w-28 sm:w-36 min-w-[96px] xs:min-w-[112px] sm:min-w-[144px] max-w-[144px] pr-2 sm:pr-4 py-2.5 sm:py-3 text-right align-middle rounded-r-md border-0">
                <div className="flex items-center justify-end gap-1.5 xs:gap-2.5">
                    {/* External Link Icon Bone */}
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.1 }}
                        className="hidden xs:block size-4 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />

                    {/* Difficulty Badge Bone with subtle color variations */}
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.15 }}
                        className={cn(
                            'h-4 rounded-md shrink-0',
                            index % 3 === 0
                                ? 'w-10 bg-emerald-500/20 dark:bg-emerald-400/25'
                                : index % 3 === 1
                                ? 'w-8 bg-amber-500/20 dark:bg-amber-400/25'
                                : 'w-10 bg-rose-500/20 dark:bg-rose-400/25'
                        )}
                    />

                    {/* 3-Dot Menu Button Bone */}
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay + 0.2 }}
                        className="size-6 sm:size-7 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0"
                    />
                </div>
            </TableCell>
        </TableRow>
    );
};

export interface ProblemListSkeletonProps {
    rowsCount?: number;
    className?: string;
}

export const ProblemListSkeleton: React.FC<ProblemListSkeletonProps> = ({
    rowsCount = 6,
    className,
}) => {
    return (
        <div
            className={cn(
                'w-full space-y-4 sm:space-y-5 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-2.5 xs:p-3 sm:p-5 md:p-6 rounded-lg shadow-sm relative overflow-hidden select-none',
                className
            )}
        >
            {/* Motion Sweeping Gradient Shimmer Beam */}
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

            {/* Top Control Bar Skeleton */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4 pb-2 relative z-10">
                {/* Left controls: Search input & filter/sort buttons */}
                <div className="flex items-center gap-2 xs:gap-2.5 flex-1 min-w-0 max-w-md">
                    {/* Search Input Skeleton */}
                    <div className="relative flex-1 h-9 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 flex items-center px-3.5 gap-2">
                        <motion.div
                            animate={{ opacity: [0.35, 0.75, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-4 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0"
                        />
                        <motion.div
                            animate={{ opacity: [0.35, 0.75, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="h-3 w-20 rounded bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/70"
                        />
                    </div>

                    {/* Filter Button Bone */}
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="size-9 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 flex items-center justify-center shrink-0"
                    >
                        <div className="size-4 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                    </motion.div>

                    {/* Sort Button Bone */}
                    <motion.div
                        animate={{ opacity: [0.35, 0.8, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="size-9 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 flex items-center justify-center shrink-0"
                    >
                        <div className="size-4 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                    </motion.div>
                </div>

                {/* Right controls: Solved counter & menu */}
                <div className="flex items-center justify-between xs:justify-end gap-3 sm:gap-4 shrink-0 pt-2 xs:pt-0 border-t xs:border-t-0 border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="w-24 sm:w-28 h-4 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                        className="size-7 sm:size-8 rounded-lg bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                </div>
            </div>

            {/* Problem Table Rows Skeleton */}
            <div className="relative z-10">
                <Table className="w-full table-fixed border-separate border-spacing-y-1.5 border-spacing-x-0">
                    <TableBody>
                        {Array.from({ length: rowsCount }).map((_, index) => (
                            <ProblemRowSkeleton key={index} index={index} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

