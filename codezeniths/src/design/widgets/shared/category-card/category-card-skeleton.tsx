'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Card, CardVariant } from '@codezeniths/modules';
import { Separator } from '@codezeniths/design/components/core/separator';

export interface CategoryCardSkeletonProps {
    className?: string;
    index?: number;
}

export const CategoryCardSkeleton: React.FC<CategoryCardSkeletonProps> = ({
    className,
    index = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            className="h-full w-full"
        >
            <Card
                variant={CardVariant.FLAT}
                className={cn(
                    'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between h-full border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xs overflow-hidden relative group',
                    className
                )}
            >
                {/* Motion Shimmer Beam Effect */}
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

                {/* Top Row Skeleton: Title + Subtext + Icon Box */}
                <div className="space-y-4 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2.5 flex-1 min-w-0">
                            {/* Title Line Skeleton */}
                            <motion.div
                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-5 sm:h-6 w-3/4 bg-primary/15 dark:bg-primary/25 rounded-md"
                            />

                            {/* Subtext + Level Badge Pill Skeleton */}
                            <div className="flex items-center gap-2">
                                <motion.div
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                                    className="h-3.5 w-20 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                                />
                                <div className="size-1 rounded-full bg-secondary/50" />
                                <motion.div
                                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                                    className="h-3.5 w-16 bg-primary/15 dark:bg-primary/25 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Icon Box Skeleton */}
                        <motion.div
                            animate={{ opacity: [0.4, 0.85, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                            className="size-12 sm:size-14 rounded-md bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade3/60 shrink-0"
                        />
                    </div>
                </div>

                {/* Separator & Bottom Progress Section Skeleton */}
                <div className="space-y-4 pt-5 relative z-10">
                    <Separator className="bg-primary/5" />

                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                                className="h-3.5 w-24 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                                className="h-3.5 w-10 bg-primary/15 dark:bg-primary/25 rounded-md"
                            />
                        </div>
                        {/* Progress Bar Skeleton */}
                        <motion.div
                            animate={{ opacity: [0.4, 0.85, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                            className="h-2 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3/60 rounded-full overflow-hidden"
                        />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export interface CategoryCardGridSkeletonProps {
    count?: number;
    className?: string;
}

export const CategoryCardGridSkeleton: React.FC<CategoryCardGridSkeletonProps> = ({
    count = 6,
    className,
}) => {
    return (
        <div
            className={cn(
                'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full',
                className
            )}
        >
            {Array.from({ length: count }).map((_, idx) => (
                <CategoryCardSkeleton key={idx} index={idx} />
            ))}
        </div>
    );
};
