'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

const DAYS_HEADER = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface ActivityCalendarSkeletonProps {
    className?: string;
}

export const ActivityCalendarSkeleton: React.FC<ActivityCalendarSkeletonProps> = ({ className }) => {
    return (
        <div className={cn('w-full space-y-3 font-sans text-heading-light dark:text-heading-dark relative overflow-hidden select-none', className)}>
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

            {/* Header: Day Title & Nav Controls with Center-Top Emblem Badge Skeleton */}
            <div className="flex items-center justify-between relative z-10">
                {/* Left: Active Day Header Skeleton */}
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-6 w-20 bg-primary/20 dark:bg-primary/30 rounded-md ml-3"
                    />
                </div>

                {/* Right: Nav Controls with Emblem Badge Skeleton */}
                <div className="flex items-center gap-1 text-muted-light dark:text-muted-dark relative pt-1">
                    {/* Left Nav Arrow Bone */}
                    <div className="p-1 opacity-40">
                        <ChevronLeft className="w-4.5 h-4.5" />
                    </div>

                    {/* Emblem Badge Skeleton */}
                    <div className="relative -top-5 mx-0.5 flex items-center justify-center">
                        <motion.div
                            animate={{ opacity: [0.4, 0.85, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="w-9 h-9 rounded-lg bg-primary/20 dark:bg-primary/30 border border-primary/30 shadow-md flex items-center justify-center"
                        >
                            <div className="size-4 rounded-xs bg-purple-500/30" />
                        </motion.div>
                    </div>

                    {/* Right Nav Arrow Bone */}
                    <div className="p-1 opacity-40">
                        <ChevronRight className="w-4.5 h-4.5" />
                    </div>
                </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-light dark:text-muted-dark relative z-10 opacity-75">
                {DAYS_HEADER.map((d, i) => (
                    <div key={i} className="py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Calendar Grid Skeleton (5 Weeks x 7 Days) */}
            <div className="space-y-1.5 relative z-10">
                {Array.from({ length: 5 }).map((_, weekIdx) => (
                    <div key={weekIdx} className="grid grid-cols-7 gap-1 text-center text-xs">
                        {Array.from({ length: 7 }).map((_, dayIdx) => (
                            <div key={dayIdx} className="h-7 flex items-center justify-center">
                                <motion.div
                                    animate={{ opacity: [0.3, 0.75, 0.3] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: (weekIdx * 7 + dayIdx) * 0.03,
                                    }}
                                    className="size-6 rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade1"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
