'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Card, CardVariant } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface ProblemProgressSkeletonProps {
    className?: string;
    showCardWrapper?: boolean;
}

export const ProblemProgressSkeleton: React.FC = () => {
    // SVG Donut Geometry Constants matching ProblemProgress exactly
    const radius = 45;
    const circumference = 2 * Math.PI * radius; // ~282.743
    const gapPx = 8;
    const totalGaugeArcLength = circumference * 0.75; // ~212.057 (270 degrees)
    const availableLength = totalGaugeArcLength - 2 * gapPx; // ~196.057
    const arcLen = availableLength / 3; // ~65.35px per difficulty tier arc

    const offsetEasy = 0;
    const offsetMedium = -(arcLen + gapPx);
    const offsetHard = -(2 * (arcLen + gapPx));

    return (
        <div className="relative size-44 flex items-center justify-center select-none">
            {/* SVG 270-Degree 3-Arc Donut Skeleton */}
            <svg className="size-full overflow-visible" viewBox="0 0 100 100">
                <g className="transform rotate-135 origin-[50px_50px]">
                    {/* Easy Arc Skeleton (Teal) */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        stroke="var(--color-teal)"
                        strokeDasharray={`${arcLen} ${circumference - arcLen}`}
                        strokeDashoffset={offsetEasy}
                        animate={{ opacity: [0.25, 0.7, 0.25] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Medium Arc Skeleton (Yellow/Warning) */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        stroke="var(--color-warning)"
                        strokeDasharray={`${arcLen} ${circumference - arcLen}`}
                        strokeDashoffset={offsetMedium}
                        animate={{ opacity: [0.25, 0.7, 0.25] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
                    />

                    {/* Hard Arc Skeleton (Red/Destructive) */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r={radius}
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                        stroke="var(--color-destructive)"
                        strokeDasharray={`${arcLen} ${circumference - arcLen}`}
                        strokeDashoffset={offsetHard}
                        animate={{ opacity: [0.25, 0.7, 0.25] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.24 }}
                    />
                </g>
            </svg>

            {/* Center Content Display Skeleton */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pb-2">
                {/* Big Percentage Placeholder */}
                <motion.div
                    animate={{ opacity: [0.4, 0.85, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-7 w-12 rounded-md bg-primary/20 dark:bg-primary/30"
                />
                {/* Subtext Completed Placeholder */}
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    className="h-3 w-16 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 mt-1.5"
                />
            </div>
        </div>
    );
};

export const ProblemProgressCardSkeleton: React.FC<ProblemProgressSkeletonProps> = ({
    className,
    showCardWrapper = true,
}) => {
    const content = (
        <div className="flex flex-row items-center justify-between gap-4 w-full h-full min-h-[160px] relative z-10">
            {/* Left Side: 270-Degree 3-Arc Donut SVG Skeleton */}
            <div className="flex items-center justify-center shrink-0">
                <ProblemProgressSkeleton />
            </div>

            {/* Right Side: 3 Difficulty Pill Badges Skeleton */}
            <div className="flex flex-col items-stretch justify-center gap-2 flex-1 min-w-25 max-w-32.5">
                {/* Easy Pill Skeleton */}
                <div className="w-full rounded-md bg-teal/10 border border-teal/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="h-2.5 w-8 rounded-xs bg-teal/40"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-3 w-10 rounded-sm bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 mt-1"
                    />
                </div>

                {/* Medium Pill Skeleton */}
                <div className="w-full rounded-md bg-warning/10 border border-warning/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-2.5 w-12 rounded-xs bg-warning/40"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="h-3 w-10 rounded-sm bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 mt-1"
                    />
                </div>

                {/* Hard Pill Skeleton */}
                <div className="w-full rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                        className="h-2.5 w-9 rounded-xs bg-destructive/40"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                        className="h-3 w-10 rounded-sm bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 mt-1"
                    />
                </div>
            </div>
        </div>
    );

    if (!showCardWrapper) {
        return <div className={cn('relative overflow-hidden', className)}>{content}</div>;
    }

    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-5 shadow-xs overflow-hidden h-full ring-0 font-sans relative min-h-[220px]',
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

            {content}
        </Card>
    );
};
