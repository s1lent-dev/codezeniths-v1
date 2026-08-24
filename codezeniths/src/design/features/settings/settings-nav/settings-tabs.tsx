'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@codezeniths/design/cn';
import {
    User,
    Settings,
    Shield,
    CreditCard,
    Bell,
    LayoutDashboard,
    History,
} from 'lucide-react';

export interface SettingsTab {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const SETTINGS_TABS: SettingsTab[] = [
    { label: 'Profile Details',        href: '/settings/profile-details',      icon: User },
    { label: 'Account Settings',       href: '/settings/account-settings',     icon: Settings },
    { label: 'Privacy Settings',       href: '/settings/privacy-settings',     icon: Shield },
    { label: 'Subscription & Billing', href: '/settings/subscription-billing', icon: CreditCard },
    { label: 'Notifications',          href: '/settings/notifications',        icon: Bell },
    { label: 'Views',                  href: '/settings/views',                icon: LayoutDashboard },
    { label: 'Search History',         href: '/settings/search-history',       icon: History },
];

export interface SettingsNavProps {
    className?: string;
}

export const SettingsNav: React.FC<SettingsNavProps> = ({ className }) => {
    const pathname = usePathname();

    return (
        <nav className={cn('flex flex-col gap-1.5 pb-2', className)}>
            {SETTINGS_TABS.map((tab) => {
                const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            'group relative flex items-center gap-3 rounded-sm px-3 py-3.5 text-sm transition-all duration-150',
                            isActive
                                ? 'bg-primary/8 dark:bg-primary/10 text-heading-light dark:text-heading-dark font-medium'
                                : 'text-muted-light dark:text-muted-dark font-normal hover:bg-foreground-light-shade2/60 dark:hover:bg-foreground-dark-shade1/60 hover:text-body-light dark:hover:text-body-dark'
                        )}
                    >
                        {/* Active left-bar indicator — full item height, fully rounded */}
                        <span
                            className={cn(
                                'absolute left-0 inset-y-1.5 w-0.75 rounded-full transition-all duration-200',
                                isActive
                                    ? 'bg-primary opacity-100'
                                    : 'opacity-0'
                            )}
                        />

                        <Icon
                            className={cn(
                                'size-3.75 shrink-0 transition-colors duration-150',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-light/70 dark:text-muted-dark/70 group-hover:text-muted-light dark:group-hover:text-muted-dark'
                            )}
                        />

                        <span className="truncate">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export const MobileSettingsNav: React.FC<SettingsNavProps> = ({ className }) => {
    const pathname = usePathname();

    return (
        <div className={cn('w-full overflow-x-auto no-scrollbar rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-1.5 shadow-xs', className)}>
            <nav className="flex items-center gap-1 min-w-max">
                {SETTINGS_TABS.map((tab) => {
                    const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
                    const Icon = tab.icon;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                'flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-medium transition-all shrink-0 whitespace-nowrap',
                                isActive
                                    ? 'bg-primary/10 dark:bg-primary/15 text-primary font-semibold shadow-2xs'
                                    : 'text-muted-light dark:text-muted-dark hover:bg-foreground-light-shade2/60 dark:hover:bg-foreground-dark-shade1/60 hover:text-body-light dark:hover:text-body-dark'
                            )}
                        >
                            <Icon
                                className={cn(
                                    'size-3.5 shrink-0 transition-colors',
                                    isActive ? 'text-primary' : 'text-muted-light/70 dark:text-muted-dark/70'
                                )}
                            />
                            <span>{tab.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export { SettingsNav as SettingsTabs };
