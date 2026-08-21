'use client';

import React from 'react';
import { ProblemProgressCard } from '@codezeniths/widgets';

export interface ModuleProgressCardProps {
    progress?: {
        problemsCount: number;
        problemsSolvedCount: number;
        problemsRevisitCount: number;
        problemNotSolvedCount: number;
        problemsSolvedPercentage: number;
        problemsCountByDifficulty: {
            easy: number;
            medium: number;
            hard: number;
        };
        problemsSolvedCountByDifficulty: {
            easy: number;
            medium: number;
            hard: number;
        };
    };
    isLoading?: boolean;
}

export const ModuleProgressCard: React.FC<ModuleProgressCardProps> = ({ progress, isLoading = false }) => {
    return <ProblemProgressCard progress={progress} isLoading={isLoading} />;
};
