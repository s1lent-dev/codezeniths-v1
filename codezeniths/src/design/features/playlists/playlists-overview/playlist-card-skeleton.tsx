'use client';

import React from 'react';
import { Card, CardVariant } from '@codezeniths/modules';
import { Grid } from '@codezeniths/components';
import { Separator } from '@codezeniths/design/components/core/separator';
import { cn } from '@codezeniths/design/cn';
import { motion } from 'motion/react';

export interface PlaylistCardSkeletonProps {
    className?: string;
    index?: number;
}

const TITLE_WIDTHS = ['w-3/4', 'w-2/3', 'w-4/5', 'w-3/5', 'w-5/6', 'w-1/2'];

export const PlaylistCardSkeleton: React.FC<PlaylistCardSkeletonProps> = ({
    className,
    index = 0,
}) => {
    const baseDelay = (index % 6) * 0.04;
    const titleWidth = TITLE_WIDTHS[index % TITLE_WIDTHS.length];

    return (
        <div className="h-full w-full select-none font-sans">
            <Card
                variant={CardVariant.FLAT}
                className={cn(
                    'rounded-md bg-foreground-light dark:bg-foreground-dark p-5 sm:p-6 flex flex-col justify-between shadow-xs h-full border border-foreground-light-shade3 dark:border-foreground-dark-shade1 overflow-hidden relative group',
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
                    className="absolute inset-0 z-20 pointer-events-none bg-linear-to-r from-transparent via-primary/10 dark:via-primary/20 to-transparent w-1/2 -skew-x-12"
                />

                <div className="space-y-4 relative z-10">
                    {/* Top Badge & Action Icons */}
                    <div className="flex items-center justify-between">
                        <motion.div
                            animate={{ opacity: [0.35, 0.8, 0.35] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: baseDelay }}
                            className="h-5 w-20 bg-primary/15 dark:bg-primary/25 rounded-full"
                        />
                        <div className="flex items-center gap-1.5">
                            <motion.div
                                animate={{ opacity: [0.35, 0.75, 0.35] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: baseDelay + 0.08,
                                }}
                                className="size-8 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Title & Description Lines */}
                    <div className="space-y-2">
                        <motion.div
                            animate={{ opacity: [0.35, 0.85, 0.35] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: baseDelay + 0.05,
                            }}
                            className={cn('h-5 bg-primary/15 dark:bg-primary/25 rounded-md', titleWidth)}
                        />
                        <motion.div
                            animate={{ opacity: [0.35, 0.7, 0.35] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: baseDelay + 0.1,
                            }}
                            className="h-3.5 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.35, 0.7, 0.35] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: baseDelay + 0.15,
                            }}
                            className="h-3.5 w-4/5 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                    </div>
                </div>

                {/* Bottom Footer & Stats Strip */}
                <div className="space-y-3 pt-4 relative z-10">
                    <Separator className="bg-primary/10" />
                    <div className="flex items-center justify-between">
                        <motion.div
                            animate={{ opacity: [0.35, 0.75, 0.35] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: baseDelay + 0.1,
                            }}
                            className="h-4 w-24 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.35, 0.75, 0.35] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: baseDelay + 0.15,
                            }}
                            className="h-4 w-16 bg-primary/15 dark:bg-primary/25 rounded-full"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export const PlaylistCardGridSkeleton: React.FC<{ count?: number; className?: string }> = ({
    count = 6,
    className,
}) => {
    return (
        <Grid cols={3} className={cn('grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7', className)}>
            {Array.from({ length: count }).map((_, idx) => (
                <PlaylistCardSkeleton key={idx} index={idx} />
            ))}
        </Grid>
    );
};
