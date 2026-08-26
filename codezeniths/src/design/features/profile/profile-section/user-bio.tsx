'use client';

import React from 'react';
import { Typography } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

import { motion } from 'motion/react';

export interface UserBioProps {
    about?: string | null;
    isLoading?: boolean;
    className?: string;
}

export const UserBio: React.FC<UserBioProps> = ({
    about,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return (
            <div className={cn('space-y-2 select-none w-full', className)}>
                <motion.div
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-3.5 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md w-full"
                />
                <motion.div
                    animate={{ opacity: [0.35, 0.75, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                    className="h-3.5 bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60 rounded-md w-4/5"
                />
            </div>
        );
    }

    return (
        <div className={cn('w-full', className)}>
            {about ? (
                <Typography className="text-xs sm:text-sm text-body-light-shade1 dark:text-body-dark leading-relaxed whitespace-pre-line line-clamp-4">
                    {about}
                </Typography>
            ) : (
                <Typography className="text-xs text-muted-light/80 dark:text-muted-dark/80 italic">
                    No bio provided yet.
                </Typography>
            )}
        </div>
    );
};
