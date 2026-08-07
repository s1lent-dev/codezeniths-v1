'use client';

import React from 'react';
import { problemQueryService } from '@/lib/tanstack/services/problem.query-service';
import { ProblemProgressCard } from '@codezeniths/widgets';

export interface ProblemProgressSectionProps {
    className?: string;
}

export const ProblemProgressSection: React.FC<ProblemProgressSectionProps> = ({ className }) => {
    const { data: progress, isLoading } = problemQueryService.getProblemProgress();

    return (
        <div className={className}>
            <ProblemProgressCard progress={progress} isLoading={isLoading} />
        </div>
    );
};
