'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface TrendingProblemsSkeletonProps {
    className?: string;
}

export const TrendingProblemsSkeleton: React.FC<TrendingProblemsSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 flex flex-col justify-between border border-secondary/20 relative overflow-hidden shadow-xs select-none font-sans min-h-60',
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
                className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-amber-500/10 dark:via-amber-400/15 to-transparent w-1/2 -skew-x-12"
            />

            {/* Header Skeleton */}
            <div className="flex items-center justify-between z-10 mb-4">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-5 rounded-xs bg-amber-500/30 dark:bg-amber-400/40"
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-4 w-32 rounded-xs bg-amber-500/20 dark:bg-amber-400/25"
                    />
                </div>

                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    className="h-6 w-20 rounded-full bg-amber-500/15 border border-amber-500/25"
                />
            </div>

            {/* List Skeleton (5 Rows) */}
            <div className="space-y-2.5 my-auto py-1 z-10">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between gap-2.5 p-2 rounded-md bg-secondary/10 border border-secondary/15"
                    >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
                                className="size-5 rounded-xs bg-amber-500/20 shrink-0"
                            />
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 }}
                                className="h-3.5 flex-1 max-w-[160px] rounded-xs bg-amber-100/20 dark:bg-amber-100/10"
                            />
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.09 }}
                                className="h-3.5 w-7 rounded-xs bg-amber-500/25"
                            />
                            <motion.div
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.11 }}
                                className="size-3.5 rounded-full bg-emerald-500/20"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Skeleton */}
            <div className="pt-3 border-t border-primary/5 flex items-center justify-between z-10 mt-3">
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                    className="h-3.5 w-24 rounded-xs bg-secondary/20"
                />
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                    className="h-3.5 w-28 rounded-xs bg-amber-500/20"
                />
            </div>
        </Card>
    );
};
