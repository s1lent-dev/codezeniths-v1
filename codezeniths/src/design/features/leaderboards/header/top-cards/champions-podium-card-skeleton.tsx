'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface ChampionsPodiumCardSkeletonProps {
    className?: string;
}

export const ChampionsPodiumCardSkeleton: React.FC<ChampionsPodiumCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden shadow-sm select-none font-sans min-h-110 h-full w-full',
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
                className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-purple-500/10 dark:via-purple-400/15 to-transparent w-1/2 -skew-x-12"
            />

            {/* Header Skeleton */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-purple-500/10 dark:bg-purple-400/15 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-5 rounded-xs bg-purple-500/30 dark:bg-purple-400/40"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                            className="h-4 w-36 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="h-2.5 w-28 rounded-xs bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60"
                        />
                    </div>
                </div>

                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    className="h-6 w-28 rounded-full bg-purple-500/15 border border-purple-500/25"
                />
            </div>

            {/* 3D Cylindrical Podium Columns Skeleton */}
            <div className="pt-3 pb-2 grid grid-cols-3 gap-3.5 sm:gap-5 md:gap-7 items-end z-10 relative flex-1 max-w-2xl mx-auto w-full">
                {/* 2nd Place Column Skeleton (Cyber Primary) */}
                <div className="flex flex-col items-center justify-end text-center gap-1.5 min-w-0 w-full">
                    <div className="h-7" />
                    <div className="size-11 sm:size-13 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="size-8 rounded-full bg-primary/20"
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="h-3 w-16 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="h-5 w-14 rounded-full bg-foreground-light-shade3/50 dark:bg-foreground-dark-shade3/50"
                    />
                    <div className="w-full relative flex flex-col items-center justify-end pt-2">
                        <div className="w-full h-4 sm:h-5 rounded-[50%] bg-primary/20 border border-primary/30 z-20 -mb-2" />
                        <div className="w-full h-32 sm:h-38 md:h-42 rounded-b-3xl bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5 border-x-2 border-b-2 border-primary/30 flex items-center justify-center">
                            <motion.div
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-6 w-12 rounded-full bg-primary/25"
                            />
                        </div>
                    </div>
                </div>

                {/* 1st Place Column Skeleton (Royal Purple & Violet) */}
                <div className="flex flex-col items-center justify-end text-center gap-1.5 min-w-0 w-full">
                    <div className="h-7 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.4, 0.85, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-5 rounded-full bg-purple-400/40"
                        />
                    </div>
                    <div className="size-14 sm:size-16 md:size-17 rounded-full bg-purple-500/15 border-2 border-purple-400/40 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                            className="size-11 rounded-full bg-purple-400/30"
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-3.5 w-20 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="h-5 w-16 rounded-full bg-purple-500/20 border border-purple-500/30"
                    />
                    <div className="w-full relative flex flex-col items-center justify-end pt-2">
                        <div className="w-full h-5 sm:h-6 rounded-[50%] bg-purple-400/30 border-2 border-purple-400/40 z-20 -mb-2.5" />
                        <div className="w-full h-42 sm:h-50 md:h-56 rounded-b-3xl bg-gradient-to-b from-purple-500/25 via-purple-600/15 to-primary/10 border-x-2 border-b-2 border-purple-400/40 flex items-center justify-center">
                            <motion.div
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-7 w-16 rounded-full bg-purple-500/30"
                            />
                        </div>
                    </div>
                </div>

                {/* 3rd Place Column Skeleton (Deep Twilight Violet) */}
                <div className="flex flex-col items-center justify-end text-center gap-1.5 min-w-0 w-full">
                    <div className="h-7" />
                    <div className="size-11 sm:size-13 rounded-full bg-purple-700/10 border border-purple-700/20 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="size-8 rounded-full bg-purple-700/20"
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                        className="h-3 w-14 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="h-5 w-14 rounded-full bg-foreground-light-shade3/50 dark:bg-foreground-dark-shade3/50"
                    />
                    <div className="w-full relative flex flex-col items-center justify-end pt-2">
                        <div className="w-full h-4 sm:h-5 rounded-[50%] bg-purple-700/20 border border-purple-700/30 z-20 -mb-2" />
                        <div className="w-full h-24 sm:h-28 md:h-32 rounded-b-3xl bg-gradient-to-b from-purple-800/20 via-indigo-900/15 to-transparent border-x-2 border-b-2 border-purple-700/30 flex items-center justify-center">
                            <motion.div
                                animate={{ opacity: [0.2, 0.6, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-6 w-12 rounded-full bg-purple-700/25"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="pt-3 border-t border-secondary/15 flex items-center justify-between text-xs z-10">
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-3.5 w-32 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                />
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-3.5 w-28 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                />
            </div>
        </Card>
    );
};
