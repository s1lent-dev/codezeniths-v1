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
        <div className={cn('relative w-full max-w-full min-w-0 font-sans', className)}>
            {/* Left Navigation Arrow Skeleton */}
            <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark opacity-60 pointer-events-none"
            >
                <ChevronLeft className="w-4 h-4" />
            </motion.div>

            {/* 2-Slide Grid Viewport Skeleton */}
            <div className="overflow-hidden w-full min-w-0 max-w-full rounded-sm p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    <ModuleCardSkeleton />
                    <div className="hidden sm:block">
                        <ModuleCardSkeleton />
                    </div>
                </div>
            </div>

            {/* Right Navigation Arrow Skeleton */}
            <motion.div
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark opacity-60 pointer-events-none"
            >
                <ChevronRight className="w-4 h-4" />
            </motion.div>
        </div>
    );
};
