'use client';

import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@codezeniths/components';
import { Typography } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

import { motion } from 'motion/react';

export interface UserInfoCardProps {
    name?: string | null;
    username?: string | null;
    image?: string | null;
    globalRank?: number | null;
    isPrivate?: boolean;
    isOwnProfile?: boolean;
    isLoading?: boolean;
    className?: string;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({
    name,
    username,
    image,
    globalRank,
    isPrivate = false,
    isOwnProfile = false,
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
            <div className={cn('flex items-center gap-4 w-full select-none relative overflow-hidden', className)}>
                <motion.div
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="size-18 sm:size-20 rounded-full bg-primary/15 dark:bg-primary/25 shrink-0"
                />
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <motion.div
                        animate={{ opacity: [0.35, 0.85, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
                        className="h-6 w-32 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 rounded-md"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
                        className="h-4 w-24 bg-foreground-light-shade3/70 dark:bg-foreground-dark-shade3/60 rounded-md"
                    />
                    <motion.div
                        animate={{ opacity: [0.35, 0.75, 0.35] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
                        className="h-5 w-20 bg-primary/10 dark:bg-primary/20 rounded-full"
                    />
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

            {/* Right: Name, @username, Rank / Private Status */}
            <div className="flex flex-col min-w-0 flex-1">
                <Typography className="text-base sm:text-lg font-bold text-heading-light dark:text-heading-dark truncate leading-tight">
                    {displayName}
                </Typography>
                <span className="text-xs sm:text-sm font-medium text-muted-light dark:text-muted-dark truncate mt-0.5">
                    {displayUsername}
                </span>

                {/* Status Badge */}
                <div className="mt-2 flex items-center gap-2">
                    {isPrivate && !isOwnProfile ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 text-[10px] font-medium">
                            <Lock className="size-2.5" />
                            <span>Private Account</span>
                        </div>
                    ) : globalRank ? (
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
