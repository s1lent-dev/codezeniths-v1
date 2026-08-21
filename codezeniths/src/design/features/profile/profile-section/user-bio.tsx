'use client';

import React from 'react';
import { Typography } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

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
            <div className={cn('space-y-2 animate-pulse w-full', className)}>
                <div className="h-3.5 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md w-full" />
                <div className="h-3.5 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md w-4/5" />
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
