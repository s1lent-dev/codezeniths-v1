'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Bell,
    CheckCheck,
    Sparkles,
    Inbox,
    Flame,
    Crown,
    GraduationCap,
    CheckCircle2,
    Eye,
    UserPlus,
    Bookmark,
    Star,
    ShieldAlert,
    Megaphone,
    CreditCard,
    Loader2,
    ArrowRight,
} from 'lucide-react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    Button,
    ButtonVariant,
    ButtonSize,
    ScrollArea,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Typography,
    TypographyVariant,
    Container,
} from '@codezeniths/components';
import { notificationQueryService } from '@/lib/tanstack/services/notification.query-service';
import { cn } from '@codezeniths/design/cn';

export type NotificationFilter = 'all' | 'unread' | 'read' | 'achievements' | 'social';

const FILTER_TITLE_MAP: Record<NotificationFilter, string> = {
    all: 'All Notifications',
    unread: 'Unread Notifications',
    read: 'Read Notifications',
    achievements: 'Achievements & Milestones',
    social: 'Social & Activity',
};

function formatRelativeTime(dateInput: string | Date): string {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return 'Just now';

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function getNotificationVisuals(type: string): {
    icon: React.ComponentType<{ className?: string }>;
    bgClass: string;
    textClass: string;
    category: 'achievements' | 'social' | 'system';
} {
    const lower = type.toLowerCase();

    if (lower.includes('rank') || lower.includes('tier')) {
        return {
            icon: Crown,
            bgClass: 'bg-purple-500/15 text-purple-500 dark:text-purple-400 border border-purple-500/25',
            textClass: 'text-purple-500',
            category: 'achievements',
        };
    }
    if (lower.includes('streak')) {
        return {
            icon: Flame,
            bgClass: 'bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/25',
            textClass: 'text-amber-500',
            category: 'achievements',
        };
    }
    if (lower.includes('module') || lower.includes('topic') || lower.includes('tag')) {
        return {
            icon: GraduationCap,
            bgClass: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/25',
            textClass: 'text-emerald-500',
            category: 'achievements',
        };
    }
    if (lower.includes('solve')) {
        return {
            icon: CheckCircle2,
            bgClass: 'bg-primary/15 text-primary border border-primary/25',
            textClass: 'text-primary',
            category: 'achievements',
        };
    }
    if (lower.includes('profile_view') || lower.includes('viewer')) {
        return {
            icon: Eye,
            bgClass: 'bg-teal/15 text-teal dark:text-teal-400 border border-teal/25',
            textClass: 'text-teal',
            category: 'social',
        };
    }
    if (lower.includes('follow')) {
        return {
            icon: UserPlus,
            bgClass: 'bg-primary/15 text-primary border border-primary/25',
            textClass: 'text-primary',
            category: 'social',
        };
    }
    if (lower.includes('playlist') || lower.includes('bookmark') || lower.includes('star')) {
        return {
            icon: Bookmark,
            bgClass: 'bg-amber-400/15 text-amber-500 dark:text-amber-300 border border-amber-400/25',
            textClass: 'text-amber-500',
            category: 'social',
        };
    }
    if (lower.includes('welcome')) {
        return {
            icon: Sparkles,
            bgClass: 'bg-primary/15 text-primary border border-primary/25',
            textClass: 'text-primary',
            category: 'system',
        };
    }
    if (lower.includes('payment') || lower.includes('subscription')) {
        return {
            icon: CreditCard,
            bgClass: 'bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/25',
            textClass: 'text-indigo-500',
            category: 'system',
        };
    }
    if (lower.includes('session') || lower.includes('device') || lower.includes('security') || lower.includes('lock')) {
        return {
            icon: ShieldAlert,
            bgClass: 'bg-destructive/15 text-destructive border border-destructive/25',
            textClass: 'text-destructive',
            category: 'system',
        };
    }
    if (lower.includes('admin') || lower.includes('broadcast') || lower.includes('announcement') || lower.includes('content')) {
        return {
            icon: Megaphone,
            bgClass: 'bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/25',
            textClass: 'text-blue-500',
            category: 'system',
        };
    }

    return {
        icon: Bell,
        bgClass: 'bg-secondary/15 text-muted-light dark:text-muted-dark border border-secondary/25',
        textClass: 'text-muted-light',
        category: 'system',
    };
}

export const NotificationPopover: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState<NotificationFilter>('all');

    const queryFilters = {
        status: filter === 'unread' ? ('unread' as const) : filter === 'read' ? ('read' as const) : undefined,
        category: filter === 'achievements' ? ('achievements' as const) : filter === 'social' ? ('social' as const) : undefined,
    };

    // Live Infinite TanStack Query for notifications (6 per page)
    const {
        data: infiniteData,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = notificationQueryService.getNotificationsInfinite(queryFilters, 6);

    const markAsReadMutation = notificationQueryService.markAsRead();
    const markAllAsReadMutation = notificationQueryService.markAllAsRead();

    const allNotifications = infiniteData?.pages.flatMap((page) => page.notifications) || [];
    const unreadCount = infiniteData?.pages[0]?.unreadCount ?? 0;
    const totalCount = infiniteData?.pages[0]?.totalCount ?? 0;

    // Limit maximum loaded in navbar popover to 24
    const MAX_NAVBAR_NOTIFICATIONS = 24;
    const displayedNotifications = allNotifications.slice(0, MAX_NAVBAR_NOTIFICATIONS);
    const hasReachedMaxLimit = allNotifications.length >= MAX_NAVBAR_NOTIFICATIONS;
    const showSeeMore = hasReachedMaxLimit || totalCount > MAX_NAVBAR_NOTIFICATIONS || hasNextPage;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!hasNextPage || isFetchingNextPage || displayedNotifications.length >= MAX_NAVBAR_NOTIFICATIONS) return;
        const target = e.currentTarget;
        const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        if (scrollBottom < 40) {
            void fetchNextPage();
        }
    };

    const handleMarkAsRead = (notificationId: string, currentRead: boolean) => {
        if (!currentRead) {
            markAsReadMutation.mutate({ notificationId });
        }
    };

    const handleMarkAllAsRead = () => {
        if (unreadCount > 0) {
            markAllAsReadMutation.mutate();
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant={ButtonVariant.GHOST}
                    size={ButtonSize.NONE}
                    className="p-2 rounded-lg hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark transition-colors relative cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full ring-2 ring-background-light dark:ring-background-dark animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                sideOffset={12}
                className="w-84 sm:w-96 p-0 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-2xl shadow-2xl z-900 overflow-hidden font-sans"
            >
                {/* Header: Title + Mark all as read */}
                <div className="p-4 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 space-y-3 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40">
                    <Container size="none" direction="row" align="center" justify="between" padded={false}>
                        <Typography
                            variant={TypographyVariant.H6}
                            className="text-xs sm:text-sm font-black uppercase tracking-wider text-heading-light dark:text-heading-dark flex items-center gap-2"
                        >
                            <Bell className="w-4 h-4 text-primary" />
                            <span>{FILTER_TITLE_MAP[filter]}</span>
                        </Typography>

                        {unreadCount > 0 && (
                            <Button
                                variant={ButtonVariant.GHOST}
                                size={ButtonSize.NONE}
                                onClick={handleMarkAllAsRead}
                                disabled={markAllAsReadMutation.isPending}
                                className="px-2 py-1 text-[11px] font-semibold text-muted-light dark:text-muted-dark hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                {markAllAsReadMutation.isPending ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <CheckCheck className="w-3.5 h-3.5" />
                                )}
                                <span>Mark all read</span>
                            </Button>
                        )}
                    </Container>

                    {/* Filter Category Select */}
                    <div className="w-full">
                        <Select
                            value={filter}
                            onValueChange={(val) => setFilter(val as NotificationFilter)}
                        >
                            <SelectTrigger className="w-full h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-lg">
                                <SelectValue placeholder="Filter notifications" />
                            </SelectTrigger>
                            <SelectContent className="z-999 bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                <SelectItem value="all" className="cursor-pointer text-xs">All Notifications</SelectItem>
                                <SelectItem value="unread" className="cursor-pointer text-xs">Unread Only ({unreadCount})</SelectItem>
                                <SelectItem value="read" className="cursor-pointer text-xs">Read Notifications</SelectItem>
                                <SelectItem value="achievements" className="cursor-pointer text-xs">Achievements & Ranks</SelectItem>
                                <SelectItem value="social" className="cursor-pointer text-xs">Social & Activity</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Notifications ScrollArea List with infinite scroll */}
                <ScrollArea
                    onScroll={handleScroll}
                    className="h-84 sm:h-96 w-full"
                >
                    {isLoading ? (
                        <div className="p-4 space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start gap-3 animate-pulse p-2">
                                    <div className="size-8 rounded-lg bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-3/4 h-3 rounded bg-foreground-light-shade3 dark:bg-foreground-dark-shade3" />
                                        <div className="w-full h-2.5 rounded bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade3/60" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : displayedNotifications.length === 0 ? (
                        <Container
                            size="none"
                            direction="col"
                            align="center"
                            justify="center"
                            padded={false}
                            className="h-full py-16 px-4 text-center space-y-2.5 text-muted-light dark:text-muted-dark"
                        >
                            <div className="size-12 rounded-full bg-secondary/10 flex items-center justify-center text-muted-light dark:text-muted-dark">
                                <Inbox className="w-6 h-6 stroke-[1.5]" />
                            </div>
                            <Typography variant={TypographyVariant.MUTED} className="text-xs font-semibold">
                                {filter === 'unread' ? 'You’re all caught up! No unread alerts.' : 'No notifications in this category.'}
                            </Typography>
                        </Container>
                    ) : (
                        <div className="divide-y divide-foreground-light-shade3/40 dark:divide-foreground-dark-shade3/40 flex flex-col gap-1">
                            {displayedNotifications.map((notification) => {
                                const visuals = getNotificationVisuals(notification.type);
                                const IconComp = visuals.icon;
                                const timeStr = formatRelativeTime(notification.createdAt);

                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleMarkAsRead(notification.id, notification.read)}
                                        className={cn(
                                            'p-3.5 transition-all hover:bg-foreground-light-shade1/60 dark:hover:bg-foreground-dark-shade1/60 cursor-pointer flex items-start gap-3 relative',
                                            !notification.read && 'bg-primary/4 dark:bg-primary/6'
                                        )}
                                    >
                                        {/* Unread indicator dot */}
                                        {!notification.read && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 animate-pulse" />
                                        )}

                                        {/* Category Icon Badge */}
                                        <div
                                            className={cn(
                                                'size-8 rounded-sm flex items-center justify-center shrink-0 shadow-2xs mt-0.5',
                                                visuals.bgClass
                                            )}
                                        >
                                            <IconComp className="w-4 h-4" />
                                        </div>

                                        {/* Content Block */}
                                        <div className="flex-1 min-w-0 space-y-0.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <Typography
                                                    variant={TypographyVariant.P}
                                                    className={cn(
                                                        'text-xs truncate leading-tight',
                                                        !notification.read
                                                            ? 'font-bold text-heading-light dark:text-heading-dark'
                                                            : 'font-semibold text-body-light dark:text-body-dark'
                                                    )}
                                                >
                                                    {notification.title}
                                                </Typography>
                                                <span className="text-[10px] text-muted-light dark:text-muted-dark whitespace-nowrap shrink-0 font-medium">
                                                    {timeStr}
                                                </span>
                                            </div>

                                            <Typography
                                                variant={TypographyVariant.P}
                                                className="text-[11px] sm:text-xs text-muted-light dark:text-muted-dark line-clamp-2 leading-relaxed"
                                            >
                                                {notification.message}
                                            </Typography>
                                        </div>
                                    </div>
                                );
                            })}

                            {isFetchingNextPage && (
                                <div className="p-3 text-center flex items-center justify-center gap-2 text-xs text-muted-light dark:text-muted-dark">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                                    <span>Loading more...</span>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer: See more in Settings button */}
                <div className="p-2.5 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 text-center">
                    <Link
                        href="/settings/notifications"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-1 text-xs font-semibold text-primary hover:text-primary-shade1 hover:underline inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <span>See more in Settings</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
};
