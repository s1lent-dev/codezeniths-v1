'use client';

import React from 'react';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { ResumeTopicCard } from '@codezeniths/widgets';

export interface ResumeTopicSectionProps {
    className?: string;
}

export const ResumeTopicSection: React.FC<ResumeTopicSectionProps> = ({ className }) => {
    const { data: context, isLoading } = problemQueryService.getRecentlySolvedContext();

    const recentTopicData = context?.topic
        ? {
              topic: context.topic,
              module: context.module,
              lastProblem: context.problem,
              tags: context.tags,
          }
        : null;

    return (
        <div className={className}>
            <ResumeTopicCard
                recentTopicData={recentTopicData}
                isLoading={isLoading}
            />
        </div>
    );
};
