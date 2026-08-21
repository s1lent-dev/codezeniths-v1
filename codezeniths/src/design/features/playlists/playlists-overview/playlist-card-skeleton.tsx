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

export const PlaylistCardSkeleton: React.FC<PlaylistCardSkeletonProps> = ({
    className,
    index = 0,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
            className="h-full w-full"
        >
            <Card
                variant={CardVariant.FLAT}
                className={cn(
                    'rounded-md bg-foreground-light dark:bg-foreground-dark p-5 sm:p-6 flex flex-col justify-between shadow-xs h-full border border-foreground-light-shade3 dark:border-foreground-dark-shade1 overflow-hidden relative',
                    className
                )}
            >
                <div className="space-y-4 relative z-10">
                    {/* Top Badge & Action */}
                    <div className="flex items-center justify-between">
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-5 w-16 bg-primary/15 dark:bg-primary/25 rounded-full"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="size-8 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-full"
                        />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                        <motion.div
                            animate={{ opacity: [0.4, 0.9, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-5 w-3/4 bg-primary/15 dark:bg-primary/25 rounded-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="h-3.5 w-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                            className="h-3.5 w-2/3 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="space-y-3 pt-4 relative z-10">
                    <Separator className="bg-primary/5" />
                    <div className="flex items-center justify-between">
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-4 w-20 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                        <motion.div
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                            className="h-3.5 w-16 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                        />
                    </div>
                </div>
            </Card>
        </motion.div>
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
