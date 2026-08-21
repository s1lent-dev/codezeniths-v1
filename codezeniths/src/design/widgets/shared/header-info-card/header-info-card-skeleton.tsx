'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { Card, CardVariant } from '@codezeniths/modules';

export interface HeaderInfoCardSkeletonProps {
    className?: string;
}

export const HeaderInfoCardSkeleton: React.FC<HeaderInfoCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-6 relative overflow-hidden h-full min-h-[220px]',
                className
            )}
        >
            {/* Top Right Decorative Bluish Circle Replica */}
            <div className="absolute -top-36 -right-24 size-52 rounded-full bg-linear-to-br from-primary/15 via-blue-500/5 to-transparent dark:from-primary/20 dark:via-blue-500/10 dark:to-transparent border border-blue-400/15 pointer-events-none" />
            {/* Bottom Right Decorative Bluish Circle Replica */}
            <div className="absolute -bottom-68 -right-48 size-96 rounded-full bg-linear-to-tl from-sky-400/15 via-blue-400/5 to-transparent dark:from-sky-300/20 dark:via-blue-400/10 dark:to-transparent border border-sky-400/15 pointer-events-none" />

            {/* Ambient Glow Blurs */}
            <div
                className="absolute -left-16 -top-16 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                style={{ background: 'var(--color-primary)' }}
            />
            <div
                className="absolute -right-16 -bottom-8 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                style={{ background: 'var(--color-teal)' }}
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

            {/* Content Skeleton */}
            <div className="space-y-4 relative z-10 p-2">
                {/* 1] Badge pill skeleton */}
                <motion.div
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-6 w-44 rounded-full bg-primary/15 dark:bg-primary/25"
                />

                {/* 2] Heading H1 skeleton */}
                <motion.div
                    animate={{ opacity: [0.4, 0.95, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-8 w-3/4 bg-primary/20 dark:bg-primary/30 rounded-md"
                />

                {/* 3] Counter dots row skeleton */}
                <div className="flex items-center gap-5 pt-0.5">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary/60" />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="h-3.5 w-24 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-teal/60" />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                            className="h-3.5 w-28 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                    </div>
                </div>

                {/* 4] Description paragraph skeleton */}
                <div className="space-y-2 pt-1 max-w-150">
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="h-3.5 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                        className="h-3.5 w-5/6 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                    />
                </div>
            </div>

            {/* 5] Bottom Action Buttons Row Skeleton */}
            <div className="pt-2 flex items-center gap-3 relative z-10 px-2">
                {/* Primary pill button skeleton */}
                <motion.div
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                    className="h-9 w-28 rounded-full bg-primary/20 dark:bg-primary/30"
                />

                {/* Circle buttons x3 skeleton */}
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                    className="size-9 rounded-full bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
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
            </div>
        </Card>
    );
};
