'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { Grid } from '@codezeniths/components';
import { Separator } from '@codezeniths/design/components/core/separator';
import { cn } from '@codezeniths/design/cn';

export interface BookmarksCardSkeletonProps {
    className?: string;
    index?: number;
}

export const BookmarksCardSkeleton: React.FC<BookmarksCardSkeletonProps> = ({
    className,
    index = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            className="h-full w-full select-none"
        >
            <Card
                variant={CardVariant.FLAT}
                className={cn(
                    'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between h-full border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xs overflow-hidden relative group',
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

                {/* Top Row: Left Badge & Right Bookmark Action Button */}
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-5 w-20 bg-primary/15 dark:bg-primary/25 rounded-full"
                            />
                        </div>
                        <motion.div
                            animate={{ opacity: [0.4, 0.75, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="size-8 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                        />
                    </div>

                    {/* Middle Row: Title + Subtext (Left) & Slug Icon (Right) */}
                    <div className="flex items-start justify-between gap-3 pt-1">
                        <div className="space-y-2 flex-1 min-w-0">
                            {/* Title Line */}
                            <motion.div
                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                                className="h-5 sm:h-6 w-3/4 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />

                            {/* Subtext */}
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                                className="h-3.5 w-24 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                        </div>

                        {/* Icon placeholder */}
                        <motion.div
                            animate={{ opacity: [0.4, 0.75, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                            className="size-10 sm:size-11 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0"
                        />
                    </div>
                </div>

                {/* Separator & Bottom Progress Section */}
                <div className="space-y-4 pt-5 relative z-10">
                    <Separator className="bg-primary/5" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                                className="h-3.5 w-24 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                                className="h-3.5 w-8 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                        </div>
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                            className="h-2 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-full"
                        />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export const BookmarksGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
    count = 6,
    className,
}) => {
    return (
        <Grid cols={3} gap="lg" className={cn('w-full', className)}>
            {Array.from({ length: count }).map((_, i) => (
                <BookmarksCardSkeleton key={i} index={i} />
            ))}
        </Grid>
    );
};
