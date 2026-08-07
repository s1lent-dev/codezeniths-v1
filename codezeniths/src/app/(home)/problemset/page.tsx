import React from 'react';
import {
    ProblemsSection,
    ModuleSection,
    TagsSection,
    CalendarActivitySection,
    ProblemProgressSection,
    CompanySection,
} from '@codezeniths/features';

export default function Page() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
            {/* Left Main Section */}
            <div className="w-0 flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6 flex flex-col gap-4">
                <ModuleSection />
                <TagsSection />
                <ProblemsSection pageContext="problemset" />
            </div>

            {/* Right Sidebar Section */}
            <div className="w-full lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                <CalendarActivitySection />
                <ProblemProgressSection />
                <CompanySection />
            </div>
        </div>
    );
}
