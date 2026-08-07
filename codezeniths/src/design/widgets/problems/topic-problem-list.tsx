'use client';

import React, { useState } from 'react';
import { cn } from '@codezeniths/design/cn';
import { ProblemRow, ProblemItem } from './problem-row';
import { Table, TableBody } from '@codezeniths/modules';
import { CheckCircle2, Layers } from 'lucide-react';
import {
    TooltipProvider,
    ScrollArea,
} from '@codezeniths/components';

export interface TopicWithProblems {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    problemsCount: number;
    problemsSolvedCount: number;
    problemsSolvedPercentage: number;
    problems: ProblemItem[];
}

export interface TopicProblemListProps {
    topic: TopicWithProblems;
    onToggleSolved?: (problemId: string, currentSolved: boolean) => void;
    onToggleFavourite?: (problemId: string, currentFavourite: boolean) => void;
    className?: string;
}

export const TopicProblemList: React.FC<TopicProblemListProps> = ({
    topic,
    onToggleSolved,
    onToggleFavourite,
    className,
}) => {
    if (!topic || !topic.problems || topic.problems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border rounded-xl border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-center font-sans">
                <Layers className="w-10 h-10 text-muted-light dark:text-muted-dark mb-3" />
                <p className="text-sm font-medium text-muted-light dark:text-muted-dark">
                    No problems available for this topic yet.
                </p>
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={100}>
            {/* Outer Container with Foreground Background Color */}
            <div className={cn('w-full space-y-4 font-sans bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark p-6', className)}>
                {/* Topic Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold uppercase tracking-wider text-muted-light dark:text-muted-dark shrink-0">
                            Topic: {topic.title}
                        </span>
                    </div>

                    {/* Topic Progress Counter */}
                    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary shrink-0 self-start sm:self-auto">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span>
                            {topic.problemsSolvedCount} / {topic.problemsCount} Solved
                        </span>
                    </div>
                </div>

                {/* Problems List Table */}
                <ScrollArea
                    className="max-h-120 w-full bg-foreground-light dark:bg-foreground-dark"
                    scrollbarClassName="translate-x-2"
                    type="auto"
                >
                    <Table className="w-full border-separate border-spacing-y-1.5 border-spacing-x-0">
                        <TableBody>
                            {topic.problems.map((problem, index) => (
                                <ProblemRow
                                    key={problem.id}
                                    problem={problem}
                                    index={index}
                                    onToggleSolved={onToggleSolved}
                                    onToggleFavourite={onToggleFavourite}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
        </TooltipProvider>
    );
};

