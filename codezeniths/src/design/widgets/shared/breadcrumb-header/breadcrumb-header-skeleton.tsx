'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';

export interface BreadcrumbHeaderSkeletonProps {
    itemCount?: number;
    className?: string;
}

export const BreadcrumbHeaderSkeleton: React.FC<BreadcrumbHeaderSkeletonProps> = ({
    itemCount = 3,
    className,
}) => {
    return (
        <div
            className={cn(
                'w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark px-5 py-3 sm:px-6 sm:py-4 shadow-xs relative overflow-hidden flex items-center gap-2.5',
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
                    repeatDelay: 0.2,
                }}
                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
            />

            {/* Home Icon Bone */}
            <motion.div
                animate={{ opacity: [0.4, 0.85, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="size-4.5 rounded-sm bg-primary/15 dark:bg-primary/25 shrink-0"
            />

            {/* Chevron + Text Bone Pairs */}
            {Array.from({ length: itemCount }).map((_, idx) => (
                <React.Fragment key={idx}>
                    {/* Chevron Separator Bone */}
                    <div className="h-3 w-2 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-xs opacity-40 shrink-0" />

                    {/* Breadcrumb Label Bone */}
                    <motion.div
                        animate={{ opacity: [0.4, 0.85, 0.4] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: (idx + 1) * 0.1,
                        }}
                        className="h-4 rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade1"
                        style={{ width: `${60 + idx * 24}px` }}
                    />
                </React.Fragment>
            ))}
        </div>
    );
};
