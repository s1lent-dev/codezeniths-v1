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
        <div className="relative size-36 xs:size-40 sm:size-44 flex items-center justify-center select-none">
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
        <div className="flex flex-col justify-between w-full h-full min-w-0 z-10 relative">
            {/* 1. Header Skeleton */}
            <div className="flex items-center justify-between w-full mb-3 xs:mb-3.5">
                <div className="flex items-center gap-2">
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="size-9 rounded-md bg-primary/20 shrink-0"
                    />
                    <motion.div
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-3.5 w-28 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                    />
                </div>
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                    className="h-5.5 w-24 rounded-full bg-primary/15"
                />
            </div>

            {/* 2. Middle Section: Donut + Tactile Badges Skeleton */}
            <div className="flex flex-col @[285px]:flex-row items-center justify-between gap-3 @[285px]:gap-3.5 w-full flex-1 my-auto min-w-0 py-2">
                {/* Left Side: 270-Degree 3-Arc Donut SVG Skeleton */}
                <div className="flex items-center justify-center shrink-0">
                    <ProblemProgressSkeleton />
                </div>

                {/* Right Side: 3 Difficulty Pill Badges Skeleton */}
                <div className="grid grid-cols-3 @[285px]:flex @[285px]:flex-col items-stretch justify-center gap-1.5 @[285px]:gap-2 w-full @[285px]:flex-1 @[285px]:min-w-22 @[285px]:max-w-36">
                    {/* Easy Pill Skeleton */}
                    <div className="w-full rounded-md bg-teal/10 border border-teal/20 px-2 py-1.5 @[285px]:px-2.5 @[285px]:py-2 flex flex-col justify-center text-center">
                        <div className="flex items-center justify-between gap-1 w-full">
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-2.5 w-7 rounded-xs bg-teal/40"
                            />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                                className="h-2.5 w-8 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            />
                        </div>
                        <div className="w-full h-1 bg-teal/20 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full w-1/2 bg-teal/40 rounded-full" />
                        </div>
                    </div>

                    {/* Medium Pill Skeleton */}
                    <div className="w-full rounded-md bg-warning/10 border border-warning/20 px-2 py-1.5 @[285px]:px-2.5 @[285px]:py-2 flex flex-col justify-center text-center">
                        <div className="flex items-center justify-between gap-1 w-full">
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                                className="h-2.5 w-7 rounded-xs bg-warning/40"
                            />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                                className="h-2.5 w-8 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            />
                        </div>
                        <div className="w-full h-1 bg-warning/20 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full w-1/3 bg-warning/40 rounded-full" />
                        </div>
                    </div>

                    {/* Hard Pill Skeleton */}
                    <div className="w-full rounded-md bg-destructive/10 border border-destructive/20 px-2 py-1.5 @[285px]:px-2.5 @[285px]:py-2 flex flex-col justify-center text-center">
                        <div className="flex items-center justify-between gap-1 w-full">
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                                className="h-2.5 w-7 rounded-xs bg-destructive/40"
                            />
                            <motion.div
                                animate={{ opacity: [0.4, 0.8, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                                className="h-2.5 w-8 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            />
                        </div>
                        <div className="w-full h-1 bg-destructive/20 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full w-1/4 bg-destructive/40 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Footer Skeleton */}
            <div className="pt-4 border-t border-primary/5 dark:border-primary/10 flex items-center justify-between text-xs text-muted-light dark:text-muted-dark font-medium w-full">
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                    className="h-3 w-16 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                />
                <motion.div
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
                    className="h-3 w-20 rounded-xs bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                />
            </div>
        </div>
    );

    if (!showCardWrapper) {
        return <div className={cn('@container relative overflow-hidden w-full min-w-0', className)}>{content}</div>;
    }

    return (
        <Card
            variant={CardVariant.FLAT}
            className={cn(
                '@container rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 shadow-xs overflow-hidden h-full w-full min-w-0 ring-0 font-sans relative',
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
