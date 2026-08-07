'use client';

import React from 'react';
import { ProblemProgressCard } from '@codezeniths/widgets';
import { useProgress } from './useProgress';

export const TagsProgress: React.FC = () => {
    const { progress, isLoading } = useProgress();

    return <ProblemProgressCard progress={progress} isLoading={isLoading} />;
};
