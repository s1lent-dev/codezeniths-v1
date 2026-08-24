'use client';

import React from 'react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Bell, CheckCheck, Loader2, Sparkles } from 'lucide-react';

export interface NotificationsHeroCardProps {
    unreadCount: number;
    totalCount: number;
    isMarkingAllRead?: boolean;
    onMarkAllRead?: () => void;
    isLoading?: boolean;
}

export const NotificationsHeroCard: React.FC<NotificationsHeroCardProps> = ({
    unreadCount,
    totalCount,
    isMarkingAllRead = false,
    onMarkAllRead,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                    <div className="flex items-center gap-4 xs:gap-5">
                        <div className="size-14 xs:size-16 rounded-md bg-secondary/20 shrink-0" />
                        <div className="space-y-3 min-w-0 flex-1">
                            <div className="h-6 w-36 xs:w-48 rounded bg-secondary/20" />
                            <div className="h-4 w-48 xs:w-64 rounded bg-secondary/15" />
                        </div>
                    </div>
                    <div className="h-10 w-full sm:w-36 rounded-sm bg-secondary/20 shrink-0" />
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full p-4.5 xs:p-5 sm:p-7 rounded-md border-foreground-light-shade3 dark:border-foreground-dark-shade1 ring-0 bg-foreground-light dark:bg-foreground-dark shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6">
                {/* Emblem & Header Info */}
                <div className="flex items-center gap-4 xs:gap-5 sm:gap-6 min-w-0">
                    <div className="size-14 xs:size-16 sm:size-18 rounded-md bg-primary/10 dark:bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                        <Bell className="size-6 sm:size-8" />
                    </div>

                    <div className="flex flex-col min-w-0 justify-center">
                        <div className="flex items-center gap-2 xs:gap-2.5">
                            <Typography
                                as="h2"
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-heading-light dark:text-heading-dark text-h5! xs:text-lg! sm:text-xl! md:text-2xl! tracking-tight truncate"
                            >
                                Notification Center
                            </Typography>
                            {unreadCount > 0 ? (
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-normal tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 shrink-0 mb-1">
                                    <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                                    {unreadCount} Unread
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-normal tracking-wider px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0 mb-1">
                                    <Sparkles className="size-3" />
                                    All Caught Up
                                </span>
                            )}
                        </div>

                        <Typography
                            as="p"
                            variant={TypographyVariant.P}
                            className="text-xs sm:text-sm text-body-light dark:text-body-dark mt-1 line-clamp-1"
                        >
                            View, search, and manage all your platform activity alerts, achievements, and notifications ({totalCount} total).
                        </Typography>
                    </div>
                </div>

                {/* Mark all as read CTA Button */}
                {unreadCount > 0 && onMarkAllRead && (
                    <Button
                        type="button"
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.DEFAULT}
                        onClick={onMarkAllRead}
                        disabled={isMarkingAllRead}
                        className="w-full sm:w-auto shrink-0 rounded-sm justify-center gap-2 border-none bg-primary/10 dark:bg-primary/10 hover:bg-primary/15 dark:hover:bg-primary/15 text-heading-light dark:text-heading-dark font-medium transition-colors px-4 py-2"
                    >
                        {isMarkingAllRead ? (
                            <Loader2 className="size-4 animate-spin mr-2" />
                        ) : (
                            <CheckCheck className="size-4 mr-2" />
                        )}
                        <span>Mark All as Read</span>
                    </Button>
                )}
            </div>
        </Card>
    );
};
