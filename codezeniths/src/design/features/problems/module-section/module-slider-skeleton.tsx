'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ModuleCardSkeleton } from './module-card-skeleton';
import { cn } from '@codezeniths/design/cn';

export interface ModuleSliderSkeletonProps {
    className?: string;
}

export const ModuleSliderSkeleton: React.FC<ModuleSliderSkeletonProps> = ({ className }) => {
    return (
        <div className={cn('relative flex items-center gap-1.5 sm:gap-2.5 w-full max-w-full min-w-0 font-sans', className)}>
            {/* Left Navigation Arrow Skeleton */}
            <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="shrink-0 size-7 sm:size-7.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark opacity-60 pointer-events-none"
            >
                <ChevronLeft className="w-4 h-4" />
            </motion.div>

            {/* Viewport Skeleton */}
            <div className="overflow-hidden flex-1 min-w-0 max-w-full rounded-sm py-1">
                <div className="grid module-grid-cols gap-2 sm:gap-3 w-full">
                    <ModuleCardSkeleton />
                    <div className="hidden module-skeleton-second">
                        <ModuleCardSkeleton />
                    </div>
                </div>
            </div>

            {/* Right Navigation Arrow Skeleton */}
            <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="shrink-0 size-7 sm:size-7.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark opacity-60 pointer-events-none"
            >
                <ChevronRight className="w-4 h-4" />
            </motion.div>
        </div>
    );
};
