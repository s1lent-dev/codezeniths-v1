'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, UserCheck, UserX, Edit3, Loader2 } from 'lucide-react';
import { Button, ButtonVariant, ButtonSize } from '@codezeniths/components';
import { Typography } from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export interface FollowStatsCTAProps {
    followerCount?: number;
    followingCount?: number;
    isFollowing?: boolean;
    isOwnProfile?: boolean;
    isLoading?: boolean;
    isPendingAction?: boolean;
    onFollow?: () => void;
    onUnfollow?: () => void;
    onClickFollowers?: () => void;
    onClickFollowing?: () => void;
    className?: string;
}

export const FollowStatsCTA: React.FC<FollowStatsCTAProps> = ({
    followerCount = 0,
    followingCount = 0,
    isFollowing = false,
    isOwnProfile = false,
    isLoading = false,
    isPendingAction = false,
    onFollow,
    onUnfollow,
    onClickFollowers,
    onClickFollowing,
    className,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    if (isLoading) {
        return (
            <div className={cn('space-y-3 w-full animate-pulse', className)}>
                <div className="h-4 w-40 bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
                <div className="h-9 w-full bg-foreground-dark-shade1 dark:bg-foreground-dark-shade1 rounded-md" />
            </div>
        );
    }

    return (
        <div className={cn('space-y-3 w-full font-sans', className)}>
            {/* Follower / Following Stats Row */}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-body-light dark:text-body-dark">
                <button
                    type="button"
                    onClick={onClickFollowers}
                    className="inline-flex items-center gap-1 hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer group"
                >
                    <span className="font-semibold text-heading-light dark:text-heading-dark group-hover:underline">
                        {followerCount.toLocaleString()}
                    </span>
                    <span className="text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark">
                        followers
                    </span>
                </button>
                <span className="text-secondary/40 select-none">|</span>
                <button
                    type="button"
                    onClick={onClickFollowing}
                    className="inline-flex items-center gap-1 hover:text-heading-light dark:hover:text-heading-dark transition-colors cursor-pointer group"
                >
                    <span className="font-semibold text-heading-light dark:text-heading-dark group-hover:underline">
                        {followingCount.toLocaleString()}
                    </span>
                    <span className="text-muted-light dark:text-muted-dark group-hover:text-heading-light dark:group-hover:text-heading-dark">
                        following
                    </span>
                </button>
            </div>

            {/* Action CTA Button */}
            <div className="w-full">
                {isOwnProfile ? (
                    <Link href="/settings" className="block w-full">
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            className="w-full rounded-sm justify-center gap-2 border-none bg-primary/10 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/15 text-heading-light dark:text-heading-dark font-medium transition-colors"
                        >
                            <Edit3 className="size-3.5" />
                            <span>Edit Profile</span>
                        </Button>
                    </Link>
                ) : isFollowing ? (
                    <Button
                        variant={isHovered ? ButtonVariant.ERROR : ButtonVariant.OUTLINE}
                        onClick={onUnfollow}
                        disabled={isPendingAction}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={cn(
                            'w-full justify-center gap-2 font-medium transition-all duration-200',
                            isHovered
                                ? 'bg-destructive/15! dark:bg-destructive/15! text-destructive border-none'
                                : 'border-none bg-primary/10 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/15 text-heading-light dark:text-heading-dark'
                        )}
                    >
                        {isPendingAction ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : isHovered ? (
                            <>
                                <UserX className="size-3.5" />
                                <span>Unfollow</span>
                            </>
                        ) : (
                            <>
                                <UserCheck className="size-3.5 text-primary" />
                                <span>Following</span>
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        variant={ButtonVariant.DEFAULT}
                        size={ButtonSize.SM}
                        onClick={onFollow}
                        disabled={isPendingAction}
                        className="w-full justify-center gap-2 bg-primary hover:bg-primary-shade1 text-white font-medium shadow-xs transition-colors"
                    >
                        {isPendingAction ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <>
                                <UserPlus className="size-3.5" />
                                <span>Follow +</span>
                            </>
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
};
