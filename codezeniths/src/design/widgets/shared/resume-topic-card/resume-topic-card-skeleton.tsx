'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';
import type { TopicLevel } from './resume-topic-card';

export interface ResumeTopicCardSkeletonProps {
    className?: string;
    level?: TopicLevel;
}

const SKELETON_THEME_CONFIG: Record<
    TopicLevel,
    {
        beam: string;
        iconBox: string;
        iconFill: string;
        barBg: string;
        barFill: string;
        badge: string;
        btn: string;
    }
> = {
    fundamental: {
        beam: 'via-emerald-500/10 dark:via-emerald-400/15',
        iconBox: 'bg-emerald-500/10 dark:bg-emerald-400/15',
        iconFill: 'bg-emerald-500/30 dark:bg-emerald-400/40',
        barBg: 'bg-emerald-500/15 dark:bg-emerald-400/20',
        barFill: 'bg-emerald-500/40 dark:bg-emerald-400/50',
        badge: 'bg-emerald-500/15 border-emerald-500/25',
        btn: 'bg-emerald-500/20 dark:bg-emerald-400/25',
    },
    intermediate: {
        beam: 'via-amber-500/10 dark:via-amber-400/15',
        iconBox: 'bg-amber-500/10 dark:bg-amber-400/15',
        iconFill: 'bg-amber-500/30 dark:bg-amber-400/40',
        barBg: 'bg-amber-500/15 dark:bg-amber-400/20',
        barFill: 'bg-amber-500/40 dark:bg-amber-400/50',
        badge: 'bg-amber-500/15 border-amber-500/25',
        btn: 'bg-amber-500/20 dark:bg-amber-400/25',
    },
    advanced: {
        beam: 'via-rose-500/10 dark:via-rose-400/15',
        iconBox: 'bg-rose-500/10 dark:bg-rose-400/15',
        iconFill: 'bg-rose-500/30 dark:bg-rose-400/40',
        barBg: 'bg-rose-500/15 dark:bg-rose-400/20',
        barFill: 'bg-rose-500/40 dark:bg-rose-400/50',
        badge: 'bg-rose-500/15 border-rose-500/25',
        btn: 'bg-rose-500/20 dark:bg-rose-400/25',
    },
};

export const ResumeTopicCardSkeleton: React.FC<ResumeTopicCardSkeletonProps> = ({
    className,
    level = 'fundamental',
}) => {
    const theme = SKELETON_THEME_CONFIG[level] || SKELETON_THEME_CONFIG.fundamental;

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
                className={cn(
                    'absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent to-transparent w-1/2 -skew-x-12',
                    theme.beam
                )}
            />

            {/* Header Skeleton */}
            <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                    <div className={cn('size-9 rounded-md flex items-center justify-center', theme.iconBox)}>
                        <motion.div
                            animate={{ opacity: [0.3, 0.75, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className={cn('size-5 rounded-xs', theme.iconFill)}
                        />
                    </div>
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className={cn('h-4 w-28 rounded-xs', theme.barBg)}
                    />
                </div>

                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    className={cn('h-6 w-24 rounded-full border', theme.badge)}
                />
            </div>

            {/* Center Content Skeleton */}
            <div className="my-auto py-3 flex flex-col justify-center gap-6 w-full z-10">
                <div className="space-y-2">
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className={cn('h-3 w-32 rounded-xs', theme.barBg)}
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                        className="h-6 w-3/4 rounded-xs bg-secondary/30 dark:bg-secondary/40"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="h-3 w-1/2 rounded-xs bg-secondary/20 dark:bg-secondary/30"
                    />
                </div>

                {/* Progress Skeleton */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                            className="h-3 w-24 rounded-xs bg-secondary/30"
                        />
                        <motion.div
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                            className={cn('h-3 w-8 rounded-xs', theme.barBg)}
                        />
                    </div>
                    <div className="h-1.5 w-full bg-secondary/20 dark:bg-secondary/30 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ width: ['20%', '60%', '20%'] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                            className={cn('h-full rounded-full', theme.barFill)}
                        />
                    </div>
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className="pt-2 border-t border-primary/5 flex items-center justify-between z-10">
                <motion.div
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.45 }}
                    className="h-4 w-24 rounded-xs bg-secondary/20"
                />
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className={cn('h-7 w-20 rounded-md', theme.btn)}
                />
            </div>
        </Card>
    );
};
