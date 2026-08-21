'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface ModuleCardSkeletonProps {
    className?: string;
}

export const ModuleCardSkeleton: React.FC<ModuleCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark h-80 w-full max-w-145 flex flex-col justify-between shadow-xs font-sans select-none',
                className
            )}
        >
            {/* Top-Right Decorative Background Circle Accent Skeleton */}
            <div className="absolute -top-36 -right-24 size-56 rounded-full border border-primary/10 bg-linear-to-br from-primary/10 to-transparent pointer-events-none" />

            {/* Bottom-Right Decorative Background Circle Accent Skeleton */}
            <div className="absolute -bottom-68 -right-48 size-96 rounded-full border border-teal-500/10 bg-linear-to-tl from-teal-500/10 to-transparent pointer-events-none" />

            {/* Motion Sweeping Gradient Shimmer Beam */}
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

            {/* Top Card Section Skeleton */}
            <div className="relative z-10 space-y-4 pr-6">
                {/* Header Row: Icon + Problem Count Pill */}
                <div className="flex items-center justify-between">
                    <motion.div
                        animate={{ opacity: [0.4, 0.85, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="size-14 rounded-md bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40 ml-2"
                    />

                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-7 w-28 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40"
                    />
                </div>

                {/* Module Title & Description Bones */}
                <div className="space-y-2 pt-1">
                    <motion.div
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="h-7 w-2/3 bg-primary/20 dark:bg-primary/30 rounded-md"
                    />

                    <div className="space-y-1.5 pt-1">
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="h-3.5 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                            className="h-3.5 w-5/6 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                            className="h-3.5 w-4/6 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Action Footer Skeleton */}
            <div className="relative z-10 pt-4 flex items-center justify-between border-t border-foreground-light-shade3/50 dark:border-foreground-dark-shade3/50">
                <motion.div
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
                    className="ml-2 h-9 w-36 rounded-full bg-primary/20 dark:bg-primary/30"
                />
            </div>
        </Card>
    );
};
