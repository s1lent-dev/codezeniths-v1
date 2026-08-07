'use client';

import React from 'react';
import { Bell, CheckCheck, Sparkles, Inbox, Clock, ShieldAlert } from 'lucide-react';
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
import { useNavigationStore, NotificationFilter } from '../store/navigation.store';

const FILTER_TITLE_MAP: Record<NotificationFilter, string> = {
    all: 'All notifications',
    new: 'New notifications',
    unread: 'Unread notifications',
    read: 'Read notifications',
    others: 'Others notifications',
};

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    new: Sparkles,
    unread: Inbox,
    read: Clock,
    others: ShieldAlert,
};

export const NotificationPopover = () => {
    const {
        isNotificationPopoverOpen,
        setNotificationPopoverOpen,
        notificationFilter,
        setNotificationFilter,
        notifications,
        markAllAsRead,
        markAsRead,
    } = useNavigationStore();

    const filteredNotifications = notifications.filter((item) => {
        if (notificationFilter === 'all') return true;
        if (notificationFilter === 'unread') return !item.isRead;
        if (notificationFilter === 'read') return item.isRead;
        return item.category === notificationFilter;
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <Popover open={isNotificationPopoverOpen} onOpenChange={setNotificationPopoverOpen}>
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
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background-light dark:ring-background-dark animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={12}
                className="w-80 sm:w-96 p-0 bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-2xl shadow-2xl z-900 overflow-hidden"
            >
                {/* Header */}
                <div className="p-4 border-b border-foreground-light-shade3 dark:border-foreground-dark-shade3 space-y-3 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40">
                    <Container size="none" direction="row" align="center" justify="between" padded={false}>
                        <Typography
                            variant={TypographyVariant.H6}
                            className="text-sm font-bold text-heading-light dark:text-heading-dark capitalize flex items-center gap-2"
                        >
                            <Bell className="w-4 h-4 text-primary" />
                            {FILTER_TITLE_MAP[notificationFilter]}
                        </Typography>
                        <Button
                            variant={ButtonVariant.GHOST}
                            size={ButtonSize.NONE}
                            onClick={markAllAsRead}
                            className="px-2 py-1 text-[11px] font-medium text-muted-light dark:text-muted-dark hover:text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all as read
                        </Button>
                    </Container>

                    {/* Filter Select */}
                    <div className="w-full">
                        <Select
                            value={notificationFilter}
                            onValueChange={(val) => setNotificationFilter(val as NotificationFilter)}
                        >
                            <SelectTrigger className="w-full h-8 text-xs bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                <SelectValue placeholder="Filter notifications" />
                            </SelectTrigger>
                            <SelectContent className="z-999 bg-background-light dark:bg-background-dark border-foreground-light-shade3 dark:border-foreground-dark-shade3">
                                <SelectItem value="all" className="cursor-pointer">All</SelectItem>
                                <SelectItem value="new" className="cursor-pointer">New</SelectItem>
                                <SelectItem value="unread" className="cursor-pointer">Unread</SelectItem>
                                <SelectItem value="read" className="cursor-pointer">Read</SelectItem>
                                <SelectItem value="others" className="cursor-pointer">Others</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-80 w-full" type="auto">
                    {filteredNotifications.length === 0 ? (
                        <Container
                            size="none"
                            direction="col"
                            align="center"
                            justify="center"
                            padded={false}
                            className="h-full py-12 px-4 text-center space-y-2 text-muted-light dark:text-muted-dark"
                        >
                            <Inbox className="w-8 h-8 stroke-1 text-muted-light/60 dark:text-muted-dark/60" />
                            <Typography variant={TypographyVariant.MUTED} className="text-xs font-medium">
                                No notifications in this filter.
                            </Typography>
                        </Container>
                    ) : (
                        <div className="divide-y divide-foreground-light-shade3/60 dark:divide-foreground-dark-shade3/60">
                            {filteredNotifications.map((notification) => {
                                const IconComp = CATEGORY_ICON_MAP[notification.category] || Bell;
                                return (
                                    <div
                                        key={notification.id}
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-3.5 transition-all hover:bg-foreground-light-shade1/60 dark:hover:bg-foreground-dark-shade1/60 cursor-pointer flex items-start gap-3 relative ${
                                            !notification.isRead ? 'bg-primary/5 dark:bg-primary/5' : ''
                                        }`}
                                    >
                                        {!notification.isRead && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                        )}
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                            <IconComp className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <Container size="none" direction="row" align="center" justify="between" padded={false} gap="2">
                                                <Typography
                                                    variant={TypographyVariant.P}
                                                    className="text-xs font-semibold text-heading-light dark:text-heading-dark truncate"
                                                >
                                                    {notification.title}
                                                </Typography>
                                                <Typography
                                                    variant={TypographyVariant.MUTED}
                                                    className="text-[10px] text-muted-light dark:text-muted-dark whitespace-nowrap"
                                                >
                                                    {notification.timestamp}
                                                </Typography>
                                            </Container>
                                            <Typography
                                                variant={TypographyVariant.P}
                                                className="text-xs text-body-light dark:text-body-dark line-clamp-2 leading-relaxed"
                                            >
                                                {notification.message}
                                            </Typography>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};
