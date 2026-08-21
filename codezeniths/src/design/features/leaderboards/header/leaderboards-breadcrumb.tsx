'use client';

import React from 'react';
import { BreadcrumbHeader } from '@/design/widgets/shared/breadcrumb-header/breadcrumb-header';

export interface LeaderboardsBreadcrumbProps {
    isLoading?: boolean;
    className?: string;
}

export const LeaderboardsBreadcrumb: React.FC<LeaderboardsBreadcrumbProps> = ({
    isLoading = false,
    className,
}) => {
    return (
        <BreadcrumbHeader
            isLoading={isLoading}
            items={[{ label: 'Leaderboards', isCurrentPage: true }]}
            className={className}
        />
    );
};
