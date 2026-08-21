'use client';

import React, { useState } from 'react';
import { useDebouncedValue } from '@/hooks/performance-hooks/useDebounce';
import { notificationQueryService } from '@/lib/tanstack/services/notification.query-service';
import { NotificationsHeroCard } from './notifications-hero-card';
import {
    NotificationsFilterBar,
    NotificationStatusFilter,
    NotificationCategoryFilter,
    NotificationSortOption,
} from './notifications-filter-bar';
import { NotificationsInfiniteList } from './notifications-infinite-list';
import { cn } from '@codezeniths/design/cn';

export interface NotificationsSettingsSectionProps {
    className?: string;
}

export const NotificationsSettingsSection: React.FC<NotificationsSettingsSectionProps> = ({
    className,
}) => {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<NotificationStatusFilter>('all');
    const [category, setCategory] = useState<NotificationCategoryFilter>('all');
    const [sort, setSort] = useState<NotificationSortOption>('latest');

    const debouncedSearch = useDebouncedValue(search, 400);

    // Standard query to get unreadCount and totalCount accurately for hero stats
    const { data: summaryData, isLoading: isSummaryLoading } = notificationQueryService.getNotifications({ limit: 1 });
    const markAllAsReadMutation = notificationQueryService.markAllAsRead();

    const unreadCount = summaryData?.unreadCount ?? 0;
    const totalCount = summaryData?.totalCount ?? 0;

    const handleMarkAllRead = () => {
        if (unreadCount > 0) {
            markAllAsReadMutation.mutate();
        }
    };

    return (
        <div className={cn('w-full space-y-6 sm:space-y-7', className)}>
            {/* 1. Hero Card: Status Emblem, Unread Count & Mark All As Read CTA */}
            <NotificationsHeroCard
                unreadCount={unreadCount}
                totalCount={totalCount}
                isMarkingAllRead={markAllAsReadMutation.isPending}
                onMarkAllRead={handleMarkAllRead}
                isLoading={isSummaryLoading}
            />

            {/* 2. Filter & Search Controls */}
            <NotificationsFilterBar
                search={search}
                onSearchChange={setSearch}
                status={status}
                onStatusChange={setStatus}
                category={category}
                onCategoryChange={setCategory}
                sort={sort}
                onSortChange={setSort}
                unreadCount={unreadCount}
            />

            {/* 3. Infinite Scrolling Notifications List (6 per scroll) */}
            <NotificationsInfiniteList
                search={debouncedSearch}
                status={status}
                category={category}
                sort={sort}
            />
        </div>
    );
};
