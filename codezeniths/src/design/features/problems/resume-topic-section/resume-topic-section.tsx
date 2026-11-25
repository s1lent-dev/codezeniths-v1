'use client';

import React, { useMemo } from 'react';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { ResumeTopicCard } from '@codezeniths/widgets';

export interface ResumeTopicSectionProps {
    className?: string;
}

export const ResumeTopicSection: React.FC<ResumeTopicSectionProps> = React.memo(({ className }) => {
    const { data: context, isLoading } = problemQueryService.getRecentlySolvedContext();

    const recentTopicData = useMemo(() => {
        if (!context?.topic) return null;
        return {
            topic: context.topic,
            module: context.module,
            lastProblem: context.problem,
            tags: context.tags,
        };
    }, [context]);

    return (
        <div className={className}>
            <ResumeTopicCard
                recentTopicData={recentTopicData}
                isLoading={isLoading}
            />
        </div>
    );
});

ResumeTopicSection.displayName = 'ResumeTopicSection';
