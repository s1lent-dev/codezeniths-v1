'use client';

import React, { useEffect, useRef } from 'react';
import {
    Bell,
    Check,
    CheckCheck,
    Eye,
    Inbox,
    Loader2,
    Crown,
    Flame,
    GraduationCap,
    CheckCircle2,
    UserPlus,
    Bookmark,
    Sparkles,
    CreditCard,
    ShieldAlert,
    Megaphone,
} from 'lucide-react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { notificationQueryService } from '@/lib/tanstack/services/notification.query-service';
import { cn } from '@codezeniths/design/cn';
import {
    NotificationStatusFilter,
    NotificationCategoryFilter,
    NotificationSortOption,
} from './notifications-filter-bar';

export interface NotificationsInfiniteListProps {
    search: string;
    status: NotificationStatusFilter;
    category: NotificationCategoryFilter;
    sort: NotificationSortOption;
}

function formatRelativeTime(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Just now';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
}

function getNotificationVisuals(type: string): {
    icon: React.ComponentType<{ className?: string }>;
    bgClass: string;
    textClass: string;
    categoryLabel: string;
} {
    const lower = type.toLowerCase();

    if (lower.includes('rank') || lower.includes('tier')) {
        return {
            icon: Crown,
            bgClass: 'bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20',
            textClass: 'text-purple-500 dark:text-purple-400',
            categoryLabel: 'Rank / Tier',
        };
    }
    if (lower.includes('streak')) {
        return {
            icon: Flame,
            bgClass: 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20',
            textClass: 'text-amber-500 dark:text-amber-400',
            categoryLabel: 'Streak',
        };
    }
    if (lower.includes('module') || lower.includes('topic') || lower.includes('tag')) {
        return {
            icon: GraduationCap,
            bgClass: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20',
            textClass: 'text-emerald-500 dark:text-emerald-400',
            categoryLabel: 'Curriculum',
        };
    }
    if (lower.includes('solve')) {
        return {
            icon: CheckCircle2,
            bgClass: 'bg-primary/10 text-primary border-primary/20',
            textClass: 'text-primary',
            categoryLabel: 'Problem Solved',
        };
    }
    if (lower.includes('profile_view') || lower.includes('viewer')) {
        return {
            icon: Eye,
            bgClass: 'bg-teal/10 text-teal dark:text-teal-400 border-teal/20',
            textClass: 'text-teal dark:text-teal-400',
            categoryLabel: 'Profile View',
        };
    }
    if (lower.includes('follow')) {
        return {
            icon: UserPlus,
            bgClass: 'bg-primary/10 text-primary border-primary/20',
            textClass: 'text-primary',
            categoryLabel: 'Follow Activity',
        };
    }
    if (lower.includes('playlist') || lower.includes('bookmark') || lower.includes('star')) {
        return {
            icon: Bookmark,
            bgClass: 'bg-amber-400/10 text-amber-500 dark:text-amber-300 border-amber-400/20',
            textClass: 'text-amber-500 dark:text-amber-300',
            categoryLabel: 'Playlist / Bookmark',
        };
    }
    if (lower.includes('welcome')) {
        return {
            icon: Sparkles,
            bgClass: 'bg-primary/10 text-primary border-primary/20',
            textClass: 'text-primary',
            categoryLabel: 'System',
        };
    }
    if (lower.includes('payment') || lower.includes('subscription')) {
        return {
            icon: CreditCard,
            bgClass: 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/20',
            textClass: 'text-indigo-500 dark:text-indigo-400',
            categoryLabel: 'Billing',
        };
    }
    if (lower.includes('session') || lower.includes('device') || lower.includes('security') || lower.includes('lock')) {
        return {
            icon: ShieldAlert,
            bgClass: 'bg-destructive/10 text-destructive border-destructive/20',
            textClass: 'text-destructive',
            categoryLabel: 'Security',
        };
    }
    if (lower.includes('admin') || lower.includes('broadcast') || lower.includes('announcement') || lower.includes('content')) {
        return {
            icon: Megaphone,
            bgClass: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20',
            textClass: 'text-blue-500 dark:text-blue-400',
            categoryLabel: 'Announcement',
        };
    }

    return {
        icon: Bell,
        bgClass: 'bg-secondary/10 text-muted-light dark:text-muted-dark border-secondary/20',
        textClass: 'text-muted-light dark:text-muted-dark',
        categoryLabel: 'General',
    };
}

export const NotificationsInfiniteList: React.FC<NotificationsInfiniteListProps> = ({
    search,
    status,
    category,
    sort,
}) => {
    const observerRef = useRef<HTMLDivElement | null>(null);

    const queryFilters = {
        status: status === 'unread' ? ('unread' as const) : status === 'read' ? ('read' as const) : undefined,
        category: category === 'all' ? undefined : category,
        sort,
        search: search.trim() || undefined,
    };

    // Infinite Query: 6 notifications per fetch/scroll page
    const {
        data,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
    } = notificationQueryService.getNotificationsInfinite(queryFilters, 6);

    const markAsReadMutation = notificationQueryService.markAsRead();

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

    const allNotifications = data?.pages.flatMap((page) => page.notifications) || [];

    const handleMarkAsRead = (notificationId: string, currentRead: boolean) => {
        if (!currentRead) {
            markAsReadMutation.mutate({ notificationId });
        }
    };

    if (isLoading) {
        return (
            <div className="w-full space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card
                        key={i}
                        className="w-full p-3.5 xs:p-4 sm:p-5 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark animate-pulse"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                                <div className="size-9 xs:size-10 sm:size-12 rounded-md bg-secondary/20 shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 w-32 xs:w-48 rounded bg-secondary/20" />
                                    <div className="h-3.5 w-full max-w-md rounded bg-secondary/15" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60">
                                <div className="sm:hidden h-3 w-14 rounded bg-secondary/15" />
                                <div className="h-7 sm:h-8 w-24 rounded bg-secondary/20 shrink-0" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (allNotifications.length === 0) {
        return (
            <Card
                variant={CardVariant.FLAT}
                className="w-full py-12 xs:py-16 px-4 xs:px-6 border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark rounded-md"
            >
                <div className="w-full flex flex-col items-center justify-center text-center gap-3">
                    <div className="size-12 xs:size-14 rounded-full bg-secondary/10 flex items-center justify-center text-muted-light dark:text-muted-dark shrink-0 mx-auto">
                        <Inbox className="size-6 xs:size-7 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <Typography variant={TypographyVariant.H6} className="text-sm sm:text-base font-bold text-heading-light dark:text-heading-dark text-center">
                            No notifications found
                        </Typography>
                        <Typography variant={TypographyVariant.MUTED} className="text-xs text-muted-light dark:text-muted-dark text-center leading-relaxed">
                            {search
                                ? `No alerts matching "${search}". Try adjusting your search or filters.`
                                : status === 'unread'
                                ? "You're all caught up! No unread notifications right now."
                                : 'You have no notifications in this category.'}
                        </Typography>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <div className="w-full space-y-3 font-sans">
            {allNotifications.map((item) => {
                const visuals = getNotificationVisuals(item.type);
                const Icon = visuals.icon;
                const timeStr = formatRelativeTime(item.createdAt);

                return (
                    <Card
                        key={item.id}
                        variant={CardVariant.FLAT}
                        effectConfig={{ borderEffect: CardBorderEffect.GRADIENT_HOVER }}
                        onClick={() => handleMarkAsRead(item.id, item.read)}
                        className={cn(
                            'w-full p-3.5 xs:p-4 sm:p-5 rounded-md border transition-all cursor-pointer',
                            item.read
                                ? 'bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 hover:border-primary/50'
                                : 'bg-primary/3 dark:bg-primary/5 border-primary/40 shadow-xs hover:border-primary/70'
                        )}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                            {/* Left: Icon Emblem + Notification Content */}
                            <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                                {/* Emblem Icon */}
                                <div className="relative shrink-0 mt-0.5">
                                    <div
                                        className={cn(
                                            'size-9 xs:size-10 sm:size-12 rounded-md flex items-center justify-center border shadow-2xs',
                                            visuals.bgClass
                                        )}
                                    >
                                        <Icon className="size-4.5 xs:size-5 sm:size-6" />
                                    </div>
                                    {!item.read && (
                                        <span className="absolute -top-1 -right-1 size-2 xs:size-2.5 rounded-full bg-primary ring-2 ring-background-light dark:ring-background-dark animate-pulse" />
                                    )}
                                </div>

                                {/* Content Details */}
                                <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                        <Typography
                                            variant={TypographyVariant.P}
                                            weight={item.read ? TypographyWeight.SEMIBOLD : TypographyWeight.BOLD}
                                            className={cn(
                                                'text-xs xs:text-sm sm:text-base tracking-tight leading-snug',
                                                item.read
                                                    ? 'text-body-light dark:text-body-dark'
                                                    : 'text-heading-light dark:text-heading-dark font-bold'
                                            )}
                                        >
                                            {item.title}
                                        </Typography>

                                        {/* Category Pill */}
                                        <span className="text-[9px] xs:text-[10px] font-normal tracking-wider px-1.5 xs:px-2 py-0.5 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 text-muted-light dark:text-muted-dark shrink-0">
                                            {visuals.categoryLabel}
                                        </span>

                                        <span className="hidden sm:inline-block text-xs text-muted-light dark:text-muted-dark whitespace-nowrap font-medium">
                                            {timeStr}
                                        </span>
                                    </div>

                                    <Typography
                                        variant={TypographyVariant.P}
                                        className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed line-clamp-3 sm:line-clamp-none"
                                    >
                                        {item.message}
                                    </Typography>
                                </div>
                            </div>

                            {/* Mobile Footer (< sm) / Desktop Action (sm+) */}
                            <div className="flex items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 shrink-0">
                                <span className="sm:hidden text-[11px] text-muted-light dark:text-muted-dark font-medium">
                                    {timeStr}
                                </span>

                                {!item.read ? (
                                    <Button
                                        type="button"
                                        variant={ButtonVariant.OUTLINE}
                                        size={ButtonSize.SM}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkAsRead(item.id, item.read);
                                        }}
                                        disabled={markAsReadMutation.isPending}
                                        className="rounded-sm border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 h-7 sm:h-8 cursor-pointer flex items-center gap-1.5 shrink-0"
                                    >
                                        <Eye className="size-3.5" />
                                        <span>Mark as read</span>
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-medium text-muted-light/70 dark:text-muted-dark/70 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 border border-transparent shrink-0">
                                        <Check className="size-3 text-emerald-500" />
                                        <span>Viewed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                );
            })}

            {/* Bottom Intersection Observer Target */}
            <div ref={observerRef} className="py-4 text-center">
                {isFetchingNextPage ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-light dark:text-muted-dark">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        <span>Loading more notifications...</span>
                    </div>
                ) : hasNextPage ? (
                    <div className="h-4" />
                ) : (
                    <Typography variant={TypographyVariant.MUTED} className="text-xs text-muted-light/60 dark:text-muted-dark/60 py-2">
                        You've reached the end of your notifications.
                    </Typography>
                )}
            </div>
        </div>
    );
};
