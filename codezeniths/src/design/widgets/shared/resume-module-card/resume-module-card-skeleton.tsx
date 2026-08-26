'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface ResumeModuleCardSkeletonProps {
    className?: string;
}

export const ResumeModuleCardSkeleton: React.FC<ResumeModuleCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 flex flex-col justify-between border border-secondary/20 relative overflow-hidden shadow-xs select-none font-sans min-h-48 h-full',
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
                    repeatDelay: 0.25,
                }}
                className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-emerald-500/10 dark:via-emerald-400/15 to-transparent w-1/2 -skew-x-12"
            />

            {/* Header Skeleton */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-emerald-500/10 dark:bg-emerald-400/15 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-5 rounded-xs bg-emerald-500/30 dark:bg-emerald-400/40"
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-4 w-28 rounded-xs bg-emerald-500/20 dark:bg-emerald-400/25"
                    />
                </div>

                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    className="h-6 w-24 rounded-full bg-emerald-500/15 border border-emerald-500/25"
                />
            </div>

            {/* Center Content Skeleton */}
            <div className="my-auto py-3 flex flex-col justify-center gap-8 w-full z-10">
                <div className="space-y-2">
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-5 sm:h-6 w-3/4 rounded-md bg-emerald-500/25 dark:bg-emerald-400/30"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="h-3.5 w-5/6 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                </div>

                {/* Progress Bar Skeleton */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="h-3 w-28 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                            className="h-3 w-8 rounded-xs bg-emerald-500/30 dark:bg-emerald-400/35"
                        />
                    </div>
                    <div className="h-1.5 w-full bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-full w-1/3 bg-emerald-500/40 rounded-full"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="pt-2 border-t border-primary/5 flex items-center justify-between z-10">
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-4 w-28 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.75, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-7 w-20 rounded-md bg-emerald-500/20 dark:bg-emerald-400/25"
                />
            </div>
        </Card>
    );
};
