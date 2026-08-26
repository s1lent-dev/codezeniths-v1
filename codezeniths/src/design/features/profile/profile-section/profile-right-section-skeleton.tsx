'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface ProfileRightSectionSkeletonProps {
    className?: string;
}

export const ProfileRightSectionSkeleton: React.FC<ProfileRightSectionSkeletonProps> = ({
    className,
}) => {
    return (
        <div className={cn('w-full flex flex-col gap-6 font-sans select-none', className)}>
            {/* 1. Top Highlights Skeleton Bar (Matches ProfileSummaryCards 3-column height) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
                {[0, 1, 2].map((idx) => (
                    <Card
                        key={idx}
                        variant={CardVariant.FLAT}
                        className={cn(
                            'h-48 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-5 relative overflow-hidden shadow-xs',
                            idx === 2 ? 'md:col-span-2 xl:col-span-1' : ''
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
                                delay: idx * 0.1,
                            }}
                            className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
                        />

                        <div className="flex items-center justify-between gap-3 relative z-10">
                            <motion.div
                                animate={{ opacity: [0.35, 0.8, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-4 w-28 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            />
                            <motion.div
                                animate={{ opacity: [0.35, 0.75, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                                className="size-6 rounded-md bg-primary/15 dark:bg-primary/25"
                            />
                        </div>

                        <div className="mt-8 space-y-3 relative z-10">
                            <motion.div
                                animate={{ opacity: [0.35, 0.85, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                                className="h-7 w-24 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            />
                            <motion.div
                                animate={{ opacity: [0.35, 0.75, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                                className="h-3 w-40 rounded bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60"
                            />
                        </div>
                    </Card>
                ))}
            </div>

            {/* 2. Middle Heatmap Skeleton Container */}
            <Card
                variant={CardVariant.FLAT}
                className="w-full h-56 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 relative overflow-hidden shadow-xs"
            >
                {/* Sweeping Shimmer Beam */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.2,
                        delay: 0.2,
                    }}
                    className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
                />

                <div className="flex items-center justify-between gap-4 relative z-10 pb-4 border-b border-foreground-light-shade3/60 dark:border-foreground-dark-shade3/40">
                    <div className="flex items-center gap-2">
                        <motion.div
                            animate={{ opacity: [0.35, 0.75, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-4 rounded bg-primary/15 dark:bg-primary/25"
                        />
                        <motion.div
                            animate={{ opacity: [0.35, 0.85, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                            className="h-4 w-36 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-7 w-24 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                </div>

                <div className="grid grid-cols-12 gap-2 pt-6 relative z-10">
                    {Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: (i % 8) * 0.04 }}
                            className="h-6 rounded-xs bg-foreground-light-shade2/80 dark:bg-foreground-dark-shade1/80"
                        />
                    ))}
                </div>
            </Card>

            {/* 3. Bottom Recents Skeleton Card */}
            <Card
                variant={CardVariant.FLAT}
                className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-5 relative overflow-hidden shadow-xs space-y-3.5"
            >
                {/* Sweeping Shimmer Beam */}
                <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.2,
                        delay: 0.3,
                    }}
                    className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
                />

                <motion.div
                    animate={{ opacity: [0.35, 0.85, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-4 w-44 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 relative z-10"
                />

                <div className="flex flex-col gap-2 relative z-10 pt-1">
                    {[0, 1, 2].map((idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-md bg-foreground-light-shade1/50 dark:bg-foreground-dark-shade1/50 border border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40"
                        >
                            <motion.div
                                animate={{ opacity: [0.35, 0.8, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.05 }}
                                className="h-4 w-48 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            />
                            <motion.div
                                animate={{ opacity: [0.35, 0.75, 0.35] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.05 + 0.05 }}
                                className="h-3 w-16 rounded bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60"
                            />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
