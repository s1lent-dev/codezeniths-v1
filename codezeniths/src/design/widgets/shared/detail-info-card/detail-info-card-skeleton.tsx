'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Card, CardVariant } from '@codezeniths/modules';
import { Separator } from '@codezeniths/design/components/core/separator';

export interface DetailInfoCardSkeletonProps {
    className?: string;
}

export const DetailInfoCardSkeleton: React.FC<DetailInfoCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-6 relative overflow-hidden h-full ring-0 min-h-[480px]',
                className
            )}
        >
            {/* Ambient Glow Skeleton */}
            <div
                className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                style={{ background: 'var(--color-primary)' }}
            />

            {/* Motion Sweeping Gradient Shimmer Beam */}
            <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    repeatDelay: 0.2,
                }}
                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
            />

            <div className="space-y-5 relative z-10">
                {/* 1] Top Row Skeleton: Icon box + Level badge pill */}
                <div className="flex items-start justify-between gap-4">
                    <motion.div
                        animate={{ opacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="size-12 sm:size-14 rounded-md bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade3/60 shrink-0"
                    />

                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-6 w-24 bg-primary/15 dark:bg-primary/25 rounded-sm shrink-0"
                    />
                </div>

                {/* 2] Title & Counters Skeleton */}
                <div className="space-y-2">
                    <motion.div
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="h-8 w-3/4 bg-primary/20 dark:bg-primary/30 rounded-md"
                    />

                    <div className="flex items-center gap-4 pt-0.5">
                        <div className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full bg-primary/60" />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                                className="h-3.5 w-20 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full bg-success/60" />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                                className="h-3.5 w-16 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full bg-warning/60" />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                                className="h-3.5 w-16 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                {/* 3] Description Skeleton */}
                <div className="space-y-2 pt-1">
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                        className="h-3.5 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                        className="h-3.5 w-5/6 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                    />
                </div>

                {/* 4] Action Buttons Group Skeleton */}
                <div className="pt-2 flex items-center gap-3">
                    <motion.div
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                        className="h-9 w-28 rounded-full bg-primary/20 dark:bg-primary/30"
                    />

                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        className="size-9 rounded-full bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.55 }}
                        className="size-9 rounded-full bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        className="size-9 rounded-full bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                    />
                </div>
            </div>

            {/* 5] Separator Skeleton */}
            <Separator className="my-8 bg-primary/10" />

            {/* 6] Problem Progress Donut & Difficulty Badges Section Skeleton */}
            <div className="space-y-4 relative z-10">
                <div className="flex flex-row items-center justify-between gap-4 w-full">
                    {/* Donut Chart Skeleton */}
                    <motion.div
                        animate={{ opacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.65 }}
                        className="size-[136px] rounded-full bg-primary/10 dark:bg-primary/15 border border-primary/20 shrink-0"
                    />

                    {/* Difficulty Badges Skeleton x3 */}
                    <div className="flex flex-col items-stretch justify-center gap-2 flex-1 min-w-25 max-w-32.5">
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
                            className="w-full h-[44px] rounded-md bg-teal/10 border border-teal/20"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.75 }}
                            className="w-full h-[44px] rounded-md bg-warning/10 border border-warning/20"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                            className="w-full h-[44px] rounded-md bg-destructive/10 border border-destructive/20"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};
