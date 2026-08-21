'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Users,
    UserPlus,
    UserCheck,
    UserX,
    Search,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import {
    Typography,
    Button,
    ButtonVariant,
    ButtonSize,
    Avatar,
    AvatarImage,
    AvatarFallback,
    Badge,
    Input,
} from '@codezeniths/components';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { cn } from '@codezeniths/design/cn';

export interface ProfileNetworkListProps {
    userId: string;
    username?: string;
    name?: string;
    initialTab?: 'followers' | 'following';
    followerCount?: number;
    followingCount?: number;
    currentViewerId?: string;
    onBack: () => void;
    className?: string;
}

function getInitials(name?: string | null): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
}

function formatUserType(type?: string | null): string {
    if (!type) return '';
    return type.replace(/_/g, ' ').toLowerCase();
}

export const ProfileNetworkList: React.FC<ProfileNetworkListProps> = ({
    userId,
    username,
    name,
    initialTab = 'followers',
    followerCount = 0,
    followingCount = 0,
    currentViewerId,
    onBack,
    className,
}) => {
    const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
    const [pendingUserId, setPendingUserId] = useState<string | null>(null);

    // Queries
    const {
        data: followersData,
        isLoading: isLoadingFollowers,
    } = userQueryService.getFollowers(
        { userId, page, limit: 15 },
        { enabled: Boolean(userId) && activeTab === 'followers' }
    );

    const {
        data: followingData,
        isLoading: isLoadingFollowing,
    } = userQueryService.getFollowing(
        { userId, page, limit: 15 },
        { enabled: Boolean(userId) && activeTab === 'following' }
    );

    // Mutations
    const { mutate: followUserMutation } = userQueryService.followUser();
    const { mutate: unfollowUserMutation } = userQueryService.unfollowUser();

    const activeData = activeTab === 'followers' ? followersData : followingData;
    const isLoading = activeTab === 'followers' ? isLoadingFollowers : isLoadingFollowing;

    const rawItems = activeData?.items ?? [];
    const total = activeData?.total ?? 0;
    const totalPages = activeData?.totalPages ?? 1;
    const hasNextPage = activeData?.hasNextPage ?? false;

    // Filter by client-side search query
    const filteredItems = rawItems.filter((user: any) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const userName = (user.name || '').toLowerCase();
        const userHandle = (user.username || '').toLowerCase();
        const userType = (user.userType || '').toLowerCase();
        return userName.includes(q) || userHandle.includes(q) || userType.includes(q);
    });

    const handleFollow = (targetUserId: string) => {
        setPendingUserId(targetUserId);
        followUserMutation(
            { targetUserId },
            {
                onSettled: () => setPendingUserId(null),
            }
        );
    };

    const handleUnfollow = (targetUserId: string) => {
        setPendingUserId(targetUserId);
        unfollowUserMutation(
            { targetUserId },
            {
                onSettled: () => setPendingUserId(null),
            }
        );
    };

    return (
        <div
            className={cn(
                'w-full rounded-lg bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-6 shadow-xs flex flex-col gap-5 font-sans',
                className
            )}
        >
            {/* 1. Header with Back Button and Network Context */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-secondary/20">
                <div className="flex items-center gap-3">
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.SM}
                        onClick={onBack}
                        className="gap-2 border-secondary/25 text-heading-light dark:text-heading-dark hover:bg-secondary/10"
                    >
                        <ArrowLeft className="size-4" />
                        <span>Back to Overview</span>
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-muted-light dark:text-muted-dark text-xs sm:text-sm">
                    <Users className="size-4 text-primary" />
                    <Typography className="font-semibold text-heading-light dark:text-heading-dark">
                        {username ? `@${username}` : name ? name : 'User'}&apos;s Network
                    </Typography>
                </div>
            </div>

            {/* 2. Segmented Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="inline-flex p-1 rounded-lg bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-secondary/15">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('followers');
                            setPage(1);
                        }}
                        className={cn(
                            'px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer',
                            activeTab === 'followers'
                                ? 'bg-primary text-white shadow-xs'
                                : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                        )}
                    >
                        <span>Followers</span>
                        <span
                            className={cn(
                                'text-[11px] px-1.5 py-0.2 rounded-full font-bold',
                                activeTab === 'followers'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-secondary/20 text-muted-light dark:text-muted-dark'
                            )}
                        >
                            {followerCount.toLocaleString()}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('following');
                            setPage(1);
                        }}
                        className={cn(
                            'px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer',
                            activeTab === 'following'
                                ? 'bg-primary text-white shadow-xs'
                                : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                        )}
                    >
                        <span>Following</span>
                        <span
                            className={cn(
                                'text-[11px] px-1.5 py-0.2 rounded-full font-bold',
                                activeTab === 'following'
                                    ? 'bg-white/20 text-white'
                                    : 'bg-secondary/20 text-muted-light dark:text-muted-dark'
                            )}
                        >
                            {followingCount.toLocaleString()}
                        </span>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                    <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${activeTab}...`}
                        className="h-8 pl-8 text-xs bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/60 border-secondary/20"
                    />
                </div>
            </div>

            {/* 3. User List Container */}
            <div className="w-full flex flex-col gap-2 min-h-[300px]">
                {isLoading ? (
                    <div className="space-y-3 py-4 animate-pulse">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-16 rounded-md bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 w-full"
                            />
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="size-12 rounded-full bg-secondary/15 text-muted-light dark:text-muted-dark flex items-center justify-center mb-3">
                            <Users className="size-6" />
                        </div>
                        <Typography className="text-sm font-semibold text-heading-light dark:text-heading-dark">
                            {searchQuery ? 'No matching users found' : `No ${activeTab} yet`}
                        </Typography>
                        <p className="text-xs text-muted-light dark:text-muted-dark mt-1 max-w-xs">
                            {searchQuery
                                ? 'Try refining your search terms.'
                                : activeTab === 'followers'
                                ? 'This user has no followers yet.'
                                : 'This user is not following anyone yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {filteredItems.map((user: any, idx: number) => {
                            const isSelf = currentViewerId === user.id;
                            const isPending = pendingUserId === user.id;
                            const isHovered = hoveredUserId === user.id;
                            const isOdd = idx % 2 === 1;

                            return (
                                <div
                                    key={user.id}
                                    className={cn(
                                        'flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-lg transition-all duration-150 border border-secondary/10 hover:border-secondary/30',
                                        isOdd
                                            ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 hover:bg-foreground-light-shade1/80 dark:hover:bg-foreground-dark-shade1/80'
                                            : 'bg-transparent hover:bg-foreground-light-shade1/50 dark:hover:bg-foreground-dark-shade1/50'
                                    )}
                                >
                                    {/* User Info with Avatar */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Link
                                            href={`/profile/${user.username || user.id}`}
                                            className="shrink-0 group"
                                        >
                                            <Avatar className="size-10 border border-secondary/20 group-hover:border-primary transition-colors">
                                                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                                                <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>

                                        <div className="flex flex-col min-w-0">
                                            <Link
                                                href={`/profile/${user.username || user.id}`}
                                                className="hover:underline"
                                            >
                                                <Typography className="text-sm font-semibold text-heading-light dark:text-heading-dark truncate">
                                                    {user.name}
                                                </Typography>
                                            </Link>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark truncate mt-0.5">
                                                <span>@{user.username || 'zenith_user'}</span>
                                                {user.userType && (
                                                    <>
                                                        <span className="text-secondary/50">•</span>
                                                        <span className="capitalize">
                                                            {formatUserType(user.userType)}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Follow / Following CTA relative to logged-in viewer */}
                                    <div className="shrink-0">
                                        {isSelf ? (
                                            <Badge
                                                variant="secondary"
                                                className="text-xs px-3 py-1 rounded-full border-secondary/30 bg-primary/10 text-primary dark:text-primary font-semibold"
                                            >
                                                It&apos;s You
                                            </Badge>
                                        ) : user.isFollowing ? (
                                            <Button
                                                variant={
                                                    isHovered ? ButtonVariant.ERROR : ButtonVariant.OUTLINE
                                                }
                                                size={ButtonSize.SM}
                                                onMouseEnter={() => setHoveredUserId(user.id)}
                                                onMouseLeave={() => setHoveredUserId(null)}
                                                disabled={isPending}
                                                onClick={() => handleUnfollow(user.id)}
                                                className={cn(
                                                    'min-w-[96px] text-xs font-medium transition-all duration-150',
                                                    isHovered
                                                        ? 'bg-destructive/15! dark:bg-destructive/15! text-destructive border-none'
                                                        : 'border-secondary/25 bg-foreground-light-shade1/60 dark:bg-foreground-dark-shade1/60 text-heading-light dark:text-heading-dark hover:bg-secondary/15'
                                                )}
                                            >
                                                {isPending ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : isHovered ? (
                                                    <>
                                                        <UserX className="size-3.5 mr-1" />
                                                        <span>Unfollow</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="size-3.5 mr-1 text-primary" />
                                                        <span>Following</span>
                                                    </>
                                                )}
                                            </Button>
                                        ) : (
                                            <Button
                                                variant={ButtonVariant.DEFAULT}
                                                size={ButtonSize.SM}
                                                disabled={isPending}
                                                onClick={() => handleFollow(user.id)}
                                                className="min-w-[96px] text-xs font-medium bg-primary hover:bg-primary-shade1 text-white shadow-xs transition-colors"
                                            >
                                                {isPending ? (
                                                    <Loader2 className="size-3.5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <UserPlus className="size-3.5 mr-1" />
                                                        <span>Follow</span>
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 4. Pagination Footer */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                    <Typography className="text-xs text-muted-light dark:text-muted-dark">
                        Page {page} of {totalPages} ({total} users)
                    </Typography>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            disabled={page <= 1 || isLoading}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="h-8 text-xs border-secondary/25 gap-1"
                        >
                            <ChevronLeft className="size-3.5" />
                            <span>Previous</span>
                        </Button>
                        <Button
                            variant={ButtonVariant.OUTLINE}
                            size={ButtonSize.SM}
                            disabled={!hasNextPage || isLoading}
                            onClick={() => setPage((p) => p + 1)}
                            className="h-8 text-xs border-secondary/25 gap-1"
                        >
                            <span>Next</span>
                            <ChevronRight className="size-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
