'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface RankCardSkeletonProps {
    className?: string;
}

export const RankCardSkeleton: React.FC<RankCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-xl bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-5 flex flex-col justify-between relative overflow-hidden shadow-xs font-sans gap-3.5 h-77.5 min-h-77.5 select-none',
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
                    repeatDelay: 0.3,
                }}
                className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
            />

            {/* ─── 1. TOP HEADER SKELETON ─────────────────────────────────────── */}
            <div className="flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-2">
                    {/* Trophy Icon Square */}
                    <div className="size-8 rounded-lg bg-secondary/15 dark:bg-secondary/20 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-4.5 rounded-sm bg-secondary/30 dark:bg-secondary/40"
                        />
                    </div>
                    {/* "Rank & Standing" title placeholder */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-3.5 w-28 rounded-xs bg-secondary/25 dark:bg-secondary/30"
                    />
                </div>

                {/* Top-Right Badge Pill Placeholder */}
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    className="h-5 w-20 rounded-full bg-secondary/20 dark:bg-secondary/30 border border-secondary/25"
                />
            </div>

            {/* ─── 2. CENTER HERO SKELETON (Custom Shield SVG Emblem & Text) ─── */}
            <div className="py-6 flex flex-col items-center justify-center text-center gap-1 z-10">
                {/* Shield-like Rank Crest Placeholder */}
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ opacity: [0.3, 0.75, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="size-16 sm:size-17 flex items-center justify-center"
                    >
                        <svg viewBox="0 0 100 115" className="size-full overflow-visible drop-shadow-xs">
                            {/* Outer Shield Outline */}
                            <path
                                d="M50 5 L85 18 C85 65 50 105 50 105 C50 105 15 65 15 18 Z"
                                className="fill-secondary/15 stroke-secondary/30 dark:fill-secondary/20 dark:stroke-secondary/40"
                                strokeWidth="3"
                                strokeLinejoin="round"
                            />
                            {/* Inner Crest Core */}
                            <path
                                d="M50 18 L75 28 C75 60 50 92 50 92 C50 92 25 60 25 28 Z"
                                className="fill-secondary/20 dark:fill-secondary/30"
                            />
                            {/* Center Emblem Diamond */}
                            <path
                                d="M50 35 L62 50 L50 65 L38 50 Z"
                                className="fill-secondary/35 dark:fill-secondary/45"
                            />
                        </svg>
                    </motion.div>
                </div>

                {/* Rank Name Placeholder */}
                <div className="flex flex-col items-center gap-1 mt-1">
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-5 w-28 rounded-md bg-secondary/30 dark:bg-secondary/40"
                    />
                    {/* Score Subtext Placeholder */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="h-3 w-20 rounded-xs bg-secondary/20 dark:bg-secondary/25 mt-0.5"
                    />
                </div>
            </div>

            {/* ─── 3. DIVISION PROGRESS TRACKER SKELETON ──────────────────────── */}
            <div className="space-y-3.5 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 p-2.5 rounded-lg border border-secondary/15 z-10 shrink-0">
                <div className="flex items-center justify-between text-[11px]">
                    {/* Left: Tier Progress label */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-3 w-24 rounded-xs bg-secondary/25 dark:bg-secondary/30"
                    />
                    {/* Right: Next rank target */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="h-3 w-28 rounded-xs bg-secondary/25 dark:bg-secondary/30"
                    />
                </div>

                {/* Progress bar track placeholder with animated fill */}
                <div className="h-1.5 w-full bg-secondary/20 rounded-full overflow-hidden relative">
                    <motion.div
                        animate={{ width: ['20%', '65%', '20%'] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-full rounded-full bg-secondary/40 dark:bg-secondary/50"
                    />
                </div>
            </div>

            {/* ─── 4. FOOTER SKELETON: 2-ROW DEDICATED METRIC SECTION ─────────── */}
            <div className="pt-2 border-t border-secondary/15 flex flex-col gap-2.5 text-xs z-10 shrink-0">
                {/* Row 1: Global Standing */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-3 rounded-full bg-secondary/30"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="h-3 w-24 rounded-xs bg-secondary/25 dark:bg-secondary/30"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                            className="h-3.5 w-14 rounded-xs bg-secondary/30"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="h-4 w-12 rounded bg-teal/20 border border-teal/30"
                        />
                    </div>
                </div>

                {/* Row 2: Best Subject Achievement */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="size-3 rounded-xs bg-warning/30"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="h-3 w-36 rounded-xs bg-secondary/25 dark:bg-secondary/30"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="h-4 w-12 rounded bg-amber-500/20 border border-amber-500/30"
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};
