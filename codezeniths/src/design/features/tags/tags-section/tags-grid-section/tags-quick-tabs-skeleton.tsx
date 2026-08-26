'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';

export interface TagsQuickTabsSkeletonProps {
    className?: string;
}

const CHIP_WIDTHS = ['w-24', 'w-32', 'w-28', 'w-36', 'w-22', 'w-30', 'w-26', 'w-28'];

export const TagsQuickTabsSkeleton: React.FC<TagsQuickTabsSkeletonProps> = ({ className }) => {
    return (
        <div
            className={cn(
                'w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-4 shadow-xs space-y-3 overflow-hidden relative group select-none font-sans',
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

            {/* Header Skeleton */}
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="size-3.5 rounded bg-primary/25 dark:bg-primary/35"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                        className="h-3.5 w-44 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                </div>

                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-3 w-14 rounded bg-primary/15 dark:bg-primary/25"
                />
            </div>

            {/* Chips Marquee Skeleton */}
            <div className="w-full relative overflow-hidden z-10">
                <div className="flex items-center gap-2 overflow-hidden py-0.5">
                    {CHIP_WIDTHS.map((widthClass, idx) => (
                        <motion.div
                            key={idx}
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: 0.05 + idx * 0.04,
                            }}
                            className={cn(
                                'h-7 rounded-md bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/50 dark:border-foreground-dark-shade3/40 shrink-0',
                                widthClass
                            )}
                        />
                    ))}
                </div>

                {/* Edge fade masks */}
                <div className="absolute inset-y-0 left-0 w-6 bg-linear-to-r from-foreground-light dark:from-foreground-dark to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-6 bg-linear-to-l from-foreground-light dark:from-foreground-dark to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    );
};
