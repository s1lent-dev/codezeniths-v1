'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Eye,
    Clock,
    ChevronLeft,
    ChevronRight,
    Info,
    UserCheck,
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
} from '@codezeniths/components';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { cn } from '@codezeniths/design/cn';

export interface ProfileViewerItem {
    viewerId: string;
    name: string;
    username: string | null;
    image: string | null;
    viewedAt: Date | string;
    visitCount?: number;
}

export interface ProfileViewersListProps {
    userId: string;
    username?: string;
    name?: string;
    isOwnProfile?: boolean;
    totalViews?: number;
    pastWeekViews?: number;
    uniqueViewers?: number;
    initialRecentViewers?: ProfileViewerItem[];
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

function formatRelativeTime(dateInput: Date | string): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

export const ProfileViewersList: React.FC<ProfileViewersListProps> = ({
    userId,
    username,
    name,
    isOwnProfile = false,
    totalViews = 0,
    pastWeekViews = 0,
    uniqueViewers = 0,
    initialRecentViewers = [],
    onBack,
    className,
}) => {
    const [page, setPage] = useState<number>(1);

    // If own profile, query paginated viewers; otherwise use the initial top 10 recent viewers
    const {
        data: paginatedViewersData,
        isLoading: isLoadingPaginated,
    } = userQueryService.getProfileViewers(
        { userId, page, limit: 15 },
        { enabled: Boolean(userId) && isOwnProfile }
    );

    const items: ProfileViewerItem[] = isOwnProfile
        ? paginatedViewersData?.items ?? []
        : initialRecentViewers.slice(0, 10);

    const total = isOwnProfile ? paginatedViewersData?.total ?? 0 : items.length;
    const totalPages = isOwnProfile ? paginatedViewersData?.totalPages ?? 1 : 1;
    const hasNextPage = isOwnProfile ? paginatedViewersData?.hasNextPage ?? false : false;
    const isLoading = isOwnProfile && isLoadingPaginated;

    return (
        <div
            className={cn(
                'w-full rounded-lg bg-foreground-light dark:bg-foreground-dark border border-secondary/20 p-6 shadow-xs flex flex-col gap-5 font-sans',
                className
            )}
        >
            {/* 1. Header with Back Button and Views Stats */}
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

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-light dark:text-muted-dark">
                        <Eye className="size-4 text-info" />
                        <span>{totalViews.toLocaleString()} Total Views</span>
                    </div>

                    {pastWeekViews > 0 && (
                        <Badge
                            variant="success"
                            className="text-[11px] px-2 py-0.5 font-medium rounded-full bg-success/15 text-success dark:bg-teal/15 dark:text-teal border-none"
                        >
                            +{pastWeekViews} this week
                        </Badge>
                    )}
                </div>
            </div>

            {/* 2. Banner note for other profiles vs own profile */}
            {!isOwnProfile ? (
                <div className="flex items-center gap-2 p-3 rounded-md bg-foreground-light-shade1/70 dark:bg-foreground-dark-shade1/70 border border-secondary/15 text-xs text-muted-light dark:text-muted-dark">
                    <Info className="size-4 text-info shrink-0" />
                    <span>
                        Showing the past 10 visitors for{' '}
                        <strong className="text-heading-light dark:text-heading-dark">
                            {username ? `@${username}` : name || 'this profile'}
                        </strong>
                        .
                    </span>
                </div>
            ) : (
                <div className="flex items-center justify-between gap-2 text-xs text-muted-light dark:text-muted-dark">
                    <div className="flex items-center gap-1.5">
                        <UserCheck className="size-3.5 text-primary" />
                        <span>
                            <strong>{uniqueViewers.toLocaleString()}</strong> unique visitors recorded
                        </span>
                    </div>
                </div>
            )}

            {/* 3. Viewers List */}
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
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="size-12 rounded-full bg-secondary/15 text-muted-light dark:text-muted-dark flex items-center justify-center mb-3">
                            <Eye className="size-6" />
                        </div>
                        <Typography className="text-sm font-semibold text-heading-light dark:text-heading-dark">
                            No profile views yet
                        </Typography>
                        <p className="text-xs text-muted-light dark:text-muted-dark mt-1 max-w-xs">
                            When users visit this profile, their activity will be displayed here.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {items.map((viewer, idx) => {
                            const isOdd = idx % 2 === 1;

                            return (
                                <Link
                                    key={`${viewer.viewerId}-${viewer.viewedAt}`}
                                    href={`/profile/${viewer.username || viewer.viewerId}`}
                                    className={cn(
                                        'flex items-center justify-between gap-4 p-3.5 sm:p-4 rounded-lg transition-all duration-150 group border border-secondary/10 hover:border-secondary/30',
                                        isOdd
                                            ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 hover:bg-foreground-light-shade1/80 dark:hover:bg-foreground-dark-shade1/80'
                                            : 'bg-transparent hover:bg-foreground-light-shade1/50 dark:hover:bg-foreground-dark-shade1/50'
                                    )}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <Avatar className="size-10 border border-secondary/20 group-hover:border-primary transition-colors">
                                            {viewer.image && (
                                                <AvatarImage src={viewer.image} alt={viewer.name} />
                                            )}
                                            <AvatarFallback className="text-xs font-bold bg-info/10 text-info">
                                                {getInitials(viewer.name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col min-w-0">
                                            <Typography className="text-sm font-semibold text-heading-light dark:text-heading-dark group-hover:underline truncate">
                                                {viewer.name}
                                            </Typography>
                                            <span className="text-xs text-muted-light dark:text-muted-dark truncate mt-0.5">
                                                @{viewer.username || 'zenith_user'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                                        {viewer.visitCount && viewer.visitCount > 1 ? (
                                            <Badge
                                                variant="secondary"
                                                className="text-[11px] px-2.5 py-0.5 font-semibold rounded-full bg-primary/10 text-primary border-primary/20"
                                            >
                                                {viewer.visitCount} visits
                                            </Badge>
                                        ) : (
                                            <span className="text-[11px] text-muted-light dark:text-muted-dark font-medium hidden sm:inline">
                                                1 visit
                                            </span>
                                        )}

                                        <div className="flex items-center gap-1 text-xs text-muted-light dark:text-muted-dark">
                                            <Clock className="size-3.5 text-secondary/60" />
                                            <span>{formatRelativeTime(viewer.viewedAt)}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 4. Pagination Footer for Own Profile */}
            {isOwnProfile && totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-secondary/20">
                    <Typography className="text-xs text-muted-light dark:text-muted-dark">
                        Page {page} of {totalPages} ({total} views)
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
