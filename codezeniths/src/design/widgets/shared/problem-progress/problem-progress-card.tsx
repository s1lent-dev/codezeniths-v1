'use client';

import React from 'react';
import { Card, ProblemProgress } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface ProblemProgressData {
    problemsCount: number;
    problemsSolvedCount: number;
    problemsRevisitCount?: number;
    problemNotSolvedCount?: number;
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
}

export interface ProblemProgressCardProps {
    progress?: ProblemProgressData | null;
    isLoading?: boolean;
    className?: string;
    showCardWrapper?: boolean;
}

const BONE = 'rounded-md bg-foreground-light-shade3 dark:bg-foreground-dark-shade1 animate-pulse';

export const ProblemProgressCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
    <Card className={cn('rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-5 shadow-xs overflow-hidden h-full ring-0', className)}>
        <div className="flex flex-row items-center justify-between gap-4 w-full h-full min-h-[160px]">
            <div className="flex items-center justify-center shrink-0">
                <div className={`${BONE} size-[120px] rounded-full`} />
            </div>
            <div className="flex flex-col items-stretch justify-center gap-2 flex-1 min-w-25 max-w-32.5">
                <div className={`${BONE} rounded-md h-10 w-full`} />
                <div className={`${BONE} rounded-md h-10 w-full`} />
                <div className={`${BONE} rounded-md h-10 w-full`} />
            </div>
        </div>
    </Card>
);

export const ProblemProgressCard: React.FC<ProblemProgressCardProps> = ({
    progress,
    isLoading = false,
    className,
    showCardWrapper = true,
}) => {
    if (isLoading) {
        return <ProblemProgressCardSkeleton className={className} />;
    }

    const easySolved = progress?.problemsSolvedCountByDifficulty?.easy || 0;
    const easyTotal = progress?.problemsCountByDifficulty?.easy || 0;

    const mediumSolved = progress?.problemsSolvedCountByDifficulty?.medium || 0;
    const mediumTotal = progress?.problemsCountByDifficulty?.medium || 0;

    const hardSolved = progress?.problemsSolvedCountByDifficulty?.hard || 0;
    const hardTotal = progress?.problemsCountByDifficulty?.hard || 0;

    const totalProblems = progress?.problemsCount || 0;
    const solved = progress?.problemsSolvedCount || 0;
    const unsolved = progress?.problemNotSolvedCount ?? Math.max(0, totalProblems - solved);
    const completionPercentage = progress?.problemsSolvedPercentage || 0;
    const revisitCount = progress?.problemsRevisitCount || 0;

    const content = (
        <div className="flex flex-row items-center justify-between gap-4 w-full h-full">
            {/* Left Side: Circular Donut Chart */}
            <div className="flex items-center justify-center shrink-0">
                <ProblemProgress
                    easy={{ solved: easySolved, total: easyTotal }}
                    medium={{ solved: mediumSolved, total: mediumTotal }}
                    hard={{ solved: hardSolved, total: hardTotal }}
                    totalProblems={totalProblems}
                    solved={solved}
                    unsolved={unsolved}
                    completionPercentage={completionPercentage}
                    revisitCount={revisitCount}
                    interactive={true}
                    defaultMode="difficulty"
                />
            </div>

            {/* Right Side: Difficulty Badges */}
            <div className="flex flex-col items-stretch justify-center gap-2 flex-1 min-w-25 max-w-32.5">
                {/* Easy Badge */}
                <div className="w-full rounded-md bg-teal/10 border border-teal/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-teal dark:text-teal-400 tracking-wider uppercase">
                        Easy
                    </span>
                    <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                        {easySolved} / {easyTotal}
                    </span>
                </div>

                {/* Medium Badge */}
                <div className="w-full rounded-md bg-warning/10 border border-warning/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-warning tracking-wider uppercase">
                        Medium
                    </span>
                    <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                        {mediumSolved} / {mediumTotal}
                    </span>
                </div>

                {/* Hard Badge */}
                <div className="w-full rounded-md bg-destructive/10 border border-destructive/20 px-2.5 py-1.5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-destructive tracking-wider uppercase">
                        Hard
                    </span>
                    <span className="text-xs font-medium text-body-light-shade3 dark:text-body-dark mt-0.5">
                        {hardSolved} / {hardTotal}
                    </span>
                </div>
            </div>
        </div>
    );

    if (!showCardWrapper) {
        return <div className={className}>{content}</div>;
    }

    return (
        <Card className={cn('rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-5 shadow-xs overflow-hidden h-full ring-0', className)}>
            {content}
        </Card>
    );
};
