'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface StreakCardSkeletonProps {
    className?: string;
}

export const StreakCardSkeleton: React.FC<StreakCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-md bg-foreground-light dark:bg-foreground-dark p-6 flex flex-col justify-between border border-secondary/20 relative overflow-hidden shadow-xs select-none font-sans min-h-48 h-full',
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
                    repeatDelay: 0.3,
                }}
                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-amber-500/10 dark:via-amber-400/15 to-transparent w-1/2 -skew-x-12"
            />

            {/* Header: Flame Icon & Best Days Badge */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-md bg-amber-500/10 dark:bg-amber-400/15 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3], scale: [0.95, 1.05, 0.95] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-5 rounded-sm bg-amber-500/30 dark:bg-amber-400/40"
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-4 w-24 rounded-xs bg-amber-500/20 dark:bg-amber-400/25"
                    />
                </div>

                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    className="h-6 w-24 rounded-full bg-amber-500/15 border border-amber-500/25"
                />
            </div>

            {/* Center Hero: Animated Big Streak Number */}
            <div className="my-auto py-5 flex flex-col items-center justify-center text-center gap-2 z-10">
                <motion.div
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-14 w-20 rounded-md bg-amber-500/25 dark:bg-amber-400/30"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-4 w-24 rounded-xs bg-amber-500/15 dark:bg-amber-400/20"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    className="h-3 w-32 rounded-xs bg-secondary/20 dark:bg-secondary/25 mt-0.5"
                />
            </div>

            {/* Footer: Activity Status & Freeze Status */}
            <div className="pt-4 border-t border-primary/5 flex items-center justify-between z-10">
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-4 w-16 rounded-xs bg-secondary/25 dark:bg-secondary/30"
                />
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-4 w-16 rounded bg-blue-500/20"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="h-4 w-14 rounded-xs bg-amber-500/20"
                    />
                </div>
            </div>
        </Card>
    );
};
