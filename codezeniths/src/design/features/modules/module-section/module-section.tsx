'use client';

import React from 'react';
import Link from 'next/link';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import { useModuleDetails } from './useModuleDetails';
import { ModuleHeaderSection } from './module-header-section';
import { ModuleTopicsSection } from './module-topics-section';
import { ModuleProblemSection } from '@codezeniths/design/features/shared/problem-list-section';

export const SingleModuleSection: React.FC = () => {
    const { moduleDetails, isLoading, isError, handleToggleModuleBookmark } = useModuleDetails();

    if (isError || (!isLoading && !moduleDetails)) {
        return (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center space-y-4">
                <h2 className="text-xl font-bold text-heading-light dark:text-heading-dark">Module Not Found</h2>
                <p className="text-sm text-muted-light dark:text-muted-dark">
                    The requested module could not be found or does not exist.
                </p>
                <Link
                    href="/modules"
                    className="px-4 py-2 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-shade2 transition-colors"
                >
                    Back to Modules
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8">
            {/* 1] Shared Breadcrumb Header */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[
                    { label: 'Modules', href: '/modules' },
                    { label: moduleDetails?.title || 'Module', isCurrentPage: true },
                ]}
            />

            {/* 2] Header Section (Info Card + Progress Card) */}
            <ModuleHeaderSection
                moduleDetails={moduleDetails}
                isLoading={isLoading}
                onToggleBookmark={handleToggleModuleBookmark}
            />

            {/* 3] Module Topics Section (Topics Slider with Arrow Controls) */}
            <ModuleTopicsSection topics={moduleDetails?.topics} moduleSlug={moduleDetails?.slug || ''} isLoading={isLoading} />

            {/* 4] Full-Width Module Problem List Section (Topic Accordions + Binary Scope Search/Filter/Sort) */}
            <ModuleProblemSection moduleSlug={moduleDetails?.slug || ''} topics={moduleDetails?.topics} isLoading={isLoading} />
        </div>
    );
};

export const SingleModulePageSection = SingleModuleSection;
