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
                'relative rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:p-3.5 xl:p-4.5 overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-foreground-light dark:bg-foreground-dark min-h-[120px] sm:min-h-[135px] sm:h-38 md:h-40 xl:h-46 flex flex-col justify-between font-sans select-none w-full min-w-0 max-w-full',
                className
            )}
        >
            {/* Top-Right Decorative Background Circle Accent Skeleton */}
            <div className="absolute -right-20 -top-20 sm:-right-24 sm:-top-24 w-32 sm:w-44 xl:w-48 h-32 sm:h-44 xl:h-48 rounded-full bg-linear-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="absolute -right-6 -top-28 sm:-right-8 sm:-top-36 w-32 sm:w-44 xl:w-48 h-32 sm:h-44 xl:h-48 rounded-full bg-linear-to-tl from-teal-500/10 to-transparent pointer-events-none" />

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

            {/* Card Header Content Skeleton */}
            <div className="p-0 space-y-1 relative z-10 pr-6 sm:pr-8 md:pr-10 min-w-0 max-w-full">
                {/* Icon Box Skeleton */}
                <motion.div
                    animate={{ opacity: [0.4, 0.85, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-6 min-[480px]:w-6.5 min-[480px]:h-6.5 sm:w-7.5 sm:h-7.5 md:w-8.5 md:h-8.5 xl:w-9.5 xl:h-9.5 rounded-sm bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40"
                />

                {/* Title Bone */}
                <motion.div
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-3.5 sm:h-4 w-3/4 bg-primary/20 dark:bg-primary/30 rounded-md"
                />

                {/* Description Lines Bones */}
                <div className="space-y-1 pt-0.5">
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="h-2.5 sm:h-3 w-full bg-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-md"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                        className="h-2.5 sm:h-3 w-5/6 bg-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-md"
                    />
                </div>
            </div>
        </Card>
    );
};
