'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';

export interface TagsSectionSkeletonProps {
    className?: string;
    chipsCount?: number;
}

const CHIP_WIDTHS = [
    'w-16', // ~Array
    'w-24', // ~Dynamic Prog
    'w-20', // ~Two Pointers
    'w-28', // ~Binary Search
    'w-14', // ~Trees
    'w-22', // ~Hash Table
    'w-18', // ~Strings
    'w-26', // ~Backtracking
    'w-20', // ~Graph
    'w-16', // ~Stack
    'w-24', // ~Bit Manipulation
    'w-18', // ~Heap
];

export const TagsSectionSkeleton: React.FC<TagsSectionSkeletonProps> = ({
    className,
    chipsCount = 12,
}) => {
    return (
        <div
            className={cn(
                'w-full space-y-3 font-sans text-xs relative overflow-hidden select-none',
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

            {/* Header Controls Skeleton */}
            <div className="flex items-center justify-between gap-3 relative z-10">
                {/* Module Filter Dropdown Bone */}
                <div className="h-8 w-36 sm:w-40 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 px-3 flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="size-3 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-3 w-20 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                </div>

                {/* Expand / Collapse Button Bone */}
                <motion.div
                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    className="h-8 w-24 sm:w-28 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 flex items-center justify-between px-3"
                >
                    <div className="h-2.5 w-14 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                    <div className="size-3 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0" />
                </motion.div>
            </div>

            {/* Tags Chips Grid Skeleton */}
            <div className="flex items-center gap-2 flex-wrap relative z-10">
                {Array.from({ length: chipsCount }).map((_, i) => {
                    const widthClass = CHIP_WIDTHS[i % CHIP_WIDTHS.length];
                    const delay = (i % 10) * 0.04;

                    return (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.35, 0.8, 0.35] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay,
                            }}
                            className={cn(
                                'h-7 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 px-3 flex items-center justify-center shrink-0',
                                widthClass
                            )}
                        >
                            <div className="h-2.5 w-full rounded bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/70" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
