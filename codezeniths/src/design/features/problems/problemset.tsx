'use client';

import React from 'react';
import { ModuleSection } from './module-section';
import { TagsSection } from './tags-section';
import { CalendarActivitySection } from './calander-activity-section';
import { CompanySection } from './company-section';
import { ProblemProgressSection } from './problem-progress-section';
import { ProblemsSection } from '../shared/problem-list-section';

export const ProblemsetSection: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
            {/* Main Column Stack (Full-width on mobile/tablet, Left column on desktop) */}
            <div className="w-full lg:w-0 lg:flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6 flex flex-col gap-4">
                {/* 1. Module Slider inside strict overflow-contained wrapper */}
                <div className="w-full max-w-full min-w-0 overflow-hidden">
                    <ModuleSection />
                </div>

                {/* 2. Tags Filter Section */}
                <TagsSection />

                {/* 3. Mobile & Tablet Activity & Progress Cards (Hidden on desktop lg:) */}
                {/* Column-wise 768px-1024px, Row-wise 580px-768px, Column-wise < 580px */}
                <div className="flex flex-col min-[580px]:max-[767px]:flex-row gap-4 w-full min-w-0 lg:hidden">
                    <div className="flex-1 min-w-0">
                        <CalendarActivitySection />
                    </div>
                    <div className="flex-1 min-w-0">
                        <ProblemProgressSection />
                    </div>
                </div>

                {/* 4. Problems Table List */}
                <ProblemsSection pageContext="problemset" />
            </div>

            {/* Desktop Right Sidebar Section (Only visible on lg: and up) */}
            <div className="hidden lg:block lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                <CalendarActivitySection />
                <ProblemProgressSection />
                <CompanySection />
            </div>
        </div>
    );
};

export const ProblemsetPageSection = ProblemsetSection;
