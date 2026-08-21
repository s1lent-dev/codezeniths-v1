'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { BreadcrumbHeader } from '@/design/widgets/shared/breadcrumb-header/breadcrumb-header';
import { SETTINGS_TABS } from './settings-tabs';

export interface SettingsBreadcrumbProps {
    className?: string;
}

export const SettingsBreadcrumb: React.FC<SettingsBreadcrumbProps> = ({ className }) => {
    const pathname = usePathname();

    const activeTab = SETTINGS_TABS.find(
        (tab) => pathname === tab.href || pathname.startsWith(tab.href + '/')
    );

    const currentPageLabel = activeTab?.label ?? 'Profile Details';

    return (
        <BreadcrumbHeader
            className={className}
            items={[
                { label: 'Settings', href: '/settings/profile-details' },
                { label: currentPageLabel, isCurrentPage: true },
            ]}
        />
    );
};
