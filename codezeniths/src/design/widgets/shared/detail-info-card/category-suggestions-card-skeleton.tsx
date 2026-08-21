'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface CategorySuggestionsCardSkeletonProps {
    className?: string;
}

export const CategorySuggestionsCardSkeleton: React.FC<CategorySuggestionsCardSkeletonProps> = ({ className }) => {
    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-4 relative overflow-hidden w-full font-sans ring-0',
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

            {/* Header Skeleton */}
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary/50" />
                    <motion.div
                        animate={{ opacity: [0.4, 0.9, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-4 w-32 bg-primary/15 dark:bg-primary/25 rounded-md"
                    />
                </div>
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-3.5 w-20 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                />
            </div>

            {/* Badges Grid Skeleton */}
            <div className="flex flex-wrap gap-2.5 pt-6 relative z-10">
                {[28, 36, 24, 32, 40].map((width, idx) => (
                    <motion.div
                        key={idx}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.08 }}
                        className="h-7 rounded-full bg-foreground-light-shade2 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade3/60"
                        style={{ width: `${width * 4}px` }}
                    />
                ))}
            </div>
        </Card>
    );
};
