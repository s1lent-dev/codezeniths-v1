'use client';

import React from 'react';
import { Trophy } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@codezeniths/components';
import { Typography } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export interface UserInfoCardProps {
    name?: string | null;
    username?: string | null;
    image?: string | null;
    globalRank?: number | null;
    isLoading?: boolean;
    className?: string;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
    name,
    username,
    image,
    globalRank,
    isLoading = false,
    className,
}) => {
    const displayName = name || 'Zenith User';
    const displayUsername = username ? `@${username}` : '@anonymous';
    const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    if (isLoading) {
        return (
            <div className={cn('flex items-center gap-4 w-full animate-pulse', className)}>
                <div className="size-18 sm:size-20 rounded-full bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 shrink-0" />
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="h-6 w-32 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                    <div className="h-4 w-24 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                    <div className="h-5 w-20 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div className={cn('flex items-center gap-4 w-full', className)}>
            {/* Left: Avatar with Subtle Border */}
            <div className="relative shrink-0">
                <Avatar className="size-18 sm:size-20 rounded-full border-2 border-secondary/25 dark:border-secondary/25 shadow-sm">
                    {image && <AvatarImage src={image} alt={displayName} className="object-cover" />}
                    <AvatarFallback className="bg-foreground-light-shade2 dark:bg-foreground-dark-shade2 text-heading-light dark:text-heading-dark font-bold text-lg">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* Right: Name, @username, Rank */}
            <div className="flex flex-col min-w-0 flex-1">
                <Typography className="text-base sm:text-lg font-bold text-heading-light dark:text-heading-dark truncate leading-tight">
                    {displayName}
                </Typography>
                <span className="text-xs sm:text-sm font-medium text-muted-light dark:text-muted-dark truncate mt-0.5">
                    {displayUsername}
                </span>

                {/* Global Rank Badge */}
                <div className="mt-2 flex items-center">
                    {globalRank ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/20 text-xs font-semibold text-body-light dark:text-body-dark">
                            <Trophy className="size-3.5 text-warning" />
                            <span>Rank #{globalRank.toLocaleString()}</span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/15 text-[11px] font-medium text-muted-light dark:text-muted-dark">
                            <span>Unranked</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
