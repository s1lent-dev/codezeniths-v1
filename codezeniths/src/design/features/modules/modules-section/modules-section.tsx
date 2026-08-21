'use client';

import React from 'react';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import { useModulesSection } from './useModulesSection';
import { ModuleSlider } from './module-slider';
import { ModulesSummaryGrid } from './modules-summary-grid';
import { ModulesTopicRows } from './modules-topic-rows';

export const ModulesSection: React.FC = () => {
    const {
        modules,
        streakData,
        recentModuleData,
        featuredModuleData,
        problemProgress,
        modulesWithTopics,
        isLoading,
        isLoadingProgress,
        isLoadingWithTopics,
        handleSolveModule,
    } = useModulesSection();

    return (
        <div className="w-full space-y-10">
            {/* Breadcrumb Navigation */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[{ label: 'Modules', isCurrentPage: true }]}
            />

            {/* Interactive 3D Module Slider Component */}
            <div className="w-full pt-2">
                <ModuleSlider
                    modules={modules}
                    isLoading={isLoading}
                    onSolve={handleSolveModule}
                />
            </div>

            {/* Middle Section: 3 Summary Cards (Active Streak, Recently Solved Module, Problem Progress) */}
            <div className="w-full pt-4">
                <ModulesSummaryGrid
                    streakData={streakData}
                    recentModuleData={recentModuleData}
                    featuredModuleData={featuredModuleData}
                    problemProgress={problemProgress}
                    isLoading={isLoadingProgress}
                />
            </div>

            {/* Bottom Section: Netflix-style Module Topic Sliders */}
            <div className="w-full pt-6">
                <ModulesTopicRows
                    modulesWithTopics={modulesWithTopics || []}
                    isLoading={isLoadingWithTopics}
                />
            </div>
        </div>
    );
};
