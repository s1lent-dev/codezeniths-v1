'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
    Typography,
    TypographyVariant,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { Eye, Loader2, Users, Clock } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface ViewsInfiniteListProps {
    userId?: string;
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

export const ViewsInfiniteList: React.FC<ViewsInfiniteListProps> = ({
    userId,
}) => {
    const observerRef = useRef<HTMLDivElement | null>(null);

    // Infinite Query: 6 profile viewers per scroll page
    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = userQueryService.getProfileViewersInfinite({ userId, limit: 6 });

    // Infinite Scroll IntersectionObserver
    useEffect(() => {
        const el = observerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const allViewers = data?.pages.flatMap((page) => page.items) || [];

    if (isLoading) {
        return (
            <div className="w-full space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card
                        key={i}
                        className="w-full p-4 sm:p-5 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark animate-pulse"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="size-11 sm:size-12 rounded-full bg-secondary/20 shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-40 rounded bg-secondary/20" />
                                    <div className="h-3.5 w-24 rounded bg-secondary/15" />
                                </div>
                            </div>
                            <div className="h-4 w-28 rounded bg-secondary/20 shrink-0" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (allViewers.length === 0) {
        return (
            <Card
                variant={CardVariant.FLAT}
                className="w-full py-16 px-6 text-center flex flex-col items-center justify-center gap-3 border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark rounded-md"
            >
                <div className="size-14 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                    <Users className="size-7 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                    <Typography variant={TypographyVariant.H6} className="text-sm font-bold text-heading-light dark:text-heading-dark">
                        No profile viewers yet
                    </Typography>
                    <Typography variant={TypographyVariant.MUTED} className="text-xs text-muted-light dark:text-muted-dark max-w-sm">
                        When other developers and peers visit your profile, their activity will be displayed here.
                    </Typography>
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full space-y-3 font-sans">
            {allViewers.map((viewer) => {
                const profileUrl = `/profile/${viewer.username || viewer.viewerId}`;
                const timeStr = formatRelativeTime(viewer.viewedAt);

                return (
                    <Card
                        key={`${viewer.viewerId}-${viewer.viewedAt}`}
                        variant={CardVariant.FLAT}
                        effectConfig={{ borderEffect: CardBorderEffect.GRADIENT_HOVER }}
                        className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark hover:border-primary/50 transition-all shadow-xs overflow-hidden group"
                    >
                        <Link
                            href={profileUrl}
                            className="flex items-center justify-between gap-4 p-4 sm:p-5 w-full cursor-pointer"
                        >
                            {/* Left: User Avatar & Name + Username in flex-col */}
                            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                <Avatar className="size-10 sm:size-11 rounded-full border-2 border-primary/20 group-hover:border-primary shrink-0 shadow-2xs transition-colors">
                                    {viewer.image ? (
                                        <AvatarImage src={viewer.image} alt={viewer.name} />
                                    ) : null}
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs sm:text-sm">
                                        {getInitials(viewer.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col min-w-0 justify-center">
                                    <Typography
                                        className="font-bold text-sm sm:text-base text-heading-light dark:text-heading-dark group-hover:text-primary transition-colors truncate leading-tight"
                                    >
                                        {viewer.name}
                                    </Typography>

                                    <span className="text-xs font-medium text-muted-light dark:text-muted-dark truncate mt-0.5">
                                        @{viewer.username || 'zenith_user'}
                                    </span>
                                </div>
                            </div>

                            {/* Right: Visit Count Badge/Text + Viewed Timestamp */}
                            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
                                {viewer.visitCount && viewer.visitCount > 1 ? (
                                    <span className="text-[11px] px-2.5 py-0.5 font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                                        {viewer.visitCount} visits
                                    </span>
                                ) : (
                                    <span className="text-[11px] text-muted-light dark:text-muted-dark font-medium hidden sm:inline shrink-0">
                                        1 visit
                                    </span>
                                )}

                                <div className="flex items-center gap-1.5 text-xs text-muted-light dark:text-muted-dark shrink-0">
                                    <Clock className="size-3.5 text-muted-light/70 dark:text-muted-dark/70" />
                                    <span>{timeStr}</span>
                                </div>
                            </div>
                        </Link>
                    </Card>
                );
            })}

            {/* Bottom Infinite Scroll Target */}
            <div ref={observerRef} className="py-4 text-center">
                {isFetchingNextPage ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-light dark:text-muted-dark">
                        <Loader2 className="size-4 animate-spin text-teal" />
                        <span>Loading more viewers...</span>
                    </div>
                ) : hasNextPage ? (
                    <div className="h-4" />
                ) : (
                    <Typography variant={TypographyVariant.MUTED} className="text-xs text-muted-light/60 dark:text-muted-dark/60 py-2">
                        You've reached the end of your profile viewers list.
                    </Typography>
                )}
            </div>
        </div>
    );
};
