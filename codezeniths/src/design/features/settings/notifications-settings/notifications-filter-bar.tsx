'use client';

import React from 'react';
import {
    Search,
    X,
    Sparkles,
    Users,
    Settings,
    Bell,
    CheckCircle2,
    Clock,
    ArrowUpDown,
} from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@codezeniths/components';
import { cn } from '@codezeniths/design/cn';

export type NotificationStatusFilter = 'all' | 'unread' | 'read';
export type NotificationCategoryFilter = 'all' | 'achievements' | 'social' | 'system';
export type NotificationSortOption = 'latest' | 'oldest';

export interface NotificationsFilterBarProps {
    search: string;
    onSearchChange: (val: string) => void;
    status: NotificationStatusFilter;
    onStatusChange: (status: NotificationStatusFilter) => void;
    category: NotificationCategoryFilter;
    onCategoryChange: (category: NotificationCategoryFilter) => void;
    sort: NotificationSortOption;
    onSortChange: (sort: NotificationSortOption) => void;
    unreadCount?: number;
}

const CATEGORY_TABS: Array<{ id: NotificationCategoryFilter; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'all', label: 'All Categories', icon: Bell },
    { id: 'achievements', label: 'Achievements', icon: Sparkles },
    { id: 'social', label: 'Social & Network', icon: Users },
    { id: 'system', label: 'System', icon: Settings },
];

const STATUS_TABS: Array<{ id: NotificationStatusFilter; label: string }> = [
    { id: 'all', label: 'All Status' },
    { id: 'unread', label: 'Unread' },
    { id: 'read', label: 'Read' },
];

export const NotificationsFilterBar: React.FC<NotificationsFilterBarProps> = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    category,
    onCategoryChange,
    sort,
    onSortChange,
    unreadCount = 0,
}) => {
    return (
        <div className="w-full space-y-4 font-sans">
            {/* Top Row: Search Input + Status Filter & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark placeholder:text-muted-light dark:placeholder:text-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                    {search && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark p-0.5 cursor-pointer"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Status Tabs + Sort Dropdown */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    {/* Status Tabs (All / Unread / Read) */}
                    <div className="flex items-center bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 p-0.5 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                        {STATUS_TABS.map((tab) => {
                            const isActive = status === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => onStatusChange(tab.id)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-sm text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5',
                                        isActive
                                            ? 'bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark shadow-xs font-semibold'
                                            : 'text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark'
                                    )}
                                >
                                    <span>{tab.label}</span>
                                    {tab.id === 'unread' && unreadCount > 0 && (
                                        <span className="size-1.5 rounded-full bg-primary" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort Dropdown */}
                    <Select value={sort} onValueChange={(val) => onSortChange(val as NotificationSortOption)}>
                        <SelectTrigger className="h-8.5 px-3 text-xs bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md min-w-32">
                            <ArrowUpDown className="size-3 mr-1.5 text-muted-light dark:text-muted-dark" />
                            <SelectValue placeholder="Sort order" />
                        </SelectTrigger>
                        <SelectContent className="z-250 bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1">
                            <SelectItem value="latest" className="cursor-pointer text-xs">Latest First</SelectItem>
                            <SelectItem value="oldest" className="cursor-pointer text-xs">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Bottom Row: Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = category === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onCategoryChange(tab.id)}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer whitespace-nowrap shrink-0',
                                isActive
                                    ? 'bg-primary/10 border-primary text-primary font-semibold shadow-xs ring-1 ring-primary/30'
                                    : 'bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-heading-light dark:hover:text-heading-dark hover:border-primary/50'
                            )}
                        >
                            <Icon className="size-3.5" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
