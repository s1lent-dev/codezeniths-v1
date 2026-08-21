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
        <div className={cn('relative w-full py-4 select-none font-sans overflow-hidden', className)}>
            {/* 3D Perspective Carousel Container */}
            <div className="relative w-full h-95 flex items-center justify-center perspective-[1000px]">
                {/* 1. Left Side 3D Perspective Card (Angled & Scaled Down) */}
                <div className="absolute left-0 sm:left-[15%] md:left-[25%] lg:left-[45%] w-120 sm:w-135 max-w-[85vw] h-77.5 z-10 scale-[0.82] opacity-40 blur-[0.5px] pointer-events-none transform-gpu -rotate-y-12 translate-z-[-80px] transition-all duration-500 hidden sm:block">
                    <ModuleCardSkeleton />
                </div>

                {/* 2. Center Front Card (Active Focus Slide) */}
                <div className="relative w-145 max-w-[92vw] h-85 z-20 scale-100 shadow-2xl pointer-events-none transform-gpu transition-all duration-500">
                    <ModuleCardSkeleton />
                </div>

                {/* 3. Right Side 3D Perspective Card (Angled & Scaled Down) */}
                <div className="absolute right-0 sm:right-[15%] md:right-[25%] lg:right-[45%] w-120 sm:w-135 max-w-[85vw] h-77.5 z-10 scale-[0.82] opacity-40 blur-[0.5px] pointer-events-none transform-gpu rotate-y-12 translate-z-[-80px] transition-all duration-500 hidden sm:block">
                    <ModuleCardSkeleton />
                </div>
            </div>

            {/* Navigation Arrows Skeleton */}
            <div className="hidden sm:flex items-center justify-between absolute inset-x-4 top-1/2 -translate-y-1/2 pointer-events-none z-30">
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="size-11 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3/40 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark opacity-60"
                >
                    <ChevronLeft className="size-5" />
                </motion.div>
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="size-11 rounded-full bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3/40 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark opacity-60"
                >
                    <ChevronRight className="size-5" />
                </motion.div>
            </div>

            {/* Pagination Dots Skeleton */}
            <div className="pt-4 flex justify-center items-center gap-2 relative z-30">
                {[0, 1, 2, 3, 4].map((idx) => (
                    <motion.div
                        key={idx}
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.1 }}
                        className={cn(
                            'rounded-full transition-all duration-300',
                            idx === 1
                                ? 'w-6 h-2 bg-primary/60'
                                : 'size-2 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3'
                        )}
                    />
                ))}
            </div>
        </div>
    );
};
