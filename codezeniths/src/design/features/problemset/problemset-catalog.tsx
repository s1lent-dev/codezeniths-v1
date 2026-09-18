'use client';

import React from 'react';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import { ProblemsSection } from '../shared/problem-list-section';
import { cn } from '@codezeniths/design/cn';

export interface ProblemsetCatalogProps {
    className?: string;
}

export const ProblemsetCatalog: React.FC<ProblemsetCatalogProps> = ({ className }) => {
    return (
        <div className={cn('w-full space-y-6 pb-12', className)}>
            {/* Top Shared Breadcrumb Bar */}
            <BreadcrumbHeader
                items={[
                    { label: 'Problemset', isCurrentPage: true },
                ]}
            />

            {/* Full-Width Problem List Section with Direct Star and Bookmark Actions */}
            <div className="w-full min-w-0">
                <ProblemsSection pageContext="problemset" showDirectActions={true} />
            </div>
        </div>
    );
};

export const ProblemsetCatalogSection = ProblemsetCatalog;
