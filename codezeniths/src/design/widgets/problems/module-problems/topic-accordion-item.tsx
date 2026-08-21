'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { ChevronRight, Layers, Bookmark } from 'lucide-react';
import { ProblemRow, ProblemItem } from '../problem-row';
import { Table, TableBody } from '@codezeniths/modules';
import { Progress } from '@codezeniths/components';

export interface TopicAccordionData {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    level?: 'fundamental' | 'intermediate' | 'advanced' | null;
    order?: number;
    isBookmarked?: boolean;
    problemsCount: number;
    problemsSolvedCount: number;
    problemsSolvedPercentage: number;
    problems: ProblemItem[];
}

export interface TopicAccordionItemProps {
    topic: TopicAccordionData;
    isOpen: boolean;
    onToggle: () => void;
    onToggleSolved?: (problemId: string, currentSolved: boolean) => void;
    onToggleFavourite?: (problemId: string, currentFavourite: boolean) => void;
    onToggleBookmark?: (topicId: string, currentBookmarked: boolean) => void;
    className?: string;
}

const TopicAccordionItemComponent: React.FC<TopicAccordionItemProps> = ({
    topic,
    isOpen,
    onToggle,
    onToggleSolved,
    onToggleFavourite,
    onToggleBookmark,
    className,
}) => {
    const renderLevelBadge = (level?: 'fundamental' | 'intermediate' | 'advanced' | null) => {
        if (!level) return null;
        const normalizedLevel = level.toLowerCase();

        let colorClasses = 'bg-muted/10 text-muted-dark border-muted/20';
        const label = level.charAt(0).toUpperCase() + level.slice(1);

        if (normalizedLevel === 'fundamental') {
            colorClasses = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
        } else if (normalizedLevel === 'intermediate') {
            colorClasses = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
        } else if (normalizedLevel === 'advanced') {
            colorClasses = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
        }

        return (
            <span
                className={cn(
                    'px-2 py-0.5 rounded-full text-[9px] font-medium border tracking-wider shrink-0',
                    colorClasses
                )}
            >
                {label}
            </span>
        );
    };

    const hasProblems = topic.problems && topic.problems.length > 0;

    return (
        <div
            className={cn(
                'w-full p-2 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade3/60 bg-background-light/50 dark:bg-background-dark/50 overflow-hidden transition-all duration-200',
                isOpen ? 'ring-1 ring-primary/30 border-primary/40' : 'hover:border-primary/30',
                className
            )}
        >
            {/* Topic Header Row */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors hover:bg-foreground-light-shade1/40 dark:hover:bg-foreground-dark-shade1/40"
                aria-expanded={isOpen}
            >
                {/* Left Side: Chevron + Title + Level Badge */}
                <div className="flex items-center gap-2.5 min-w-0">
                    <div
                        className={cn(
                            'size-5 rounded-md flex items-center justify-center text-muted-light dark:text-muted-dark transition-transform duration-200 shrink-0',
                            isOpen && 'rotate-90 text-primary'
                        )}
                    >
                        <ChevronRight className="size-4" />
                    </div>

                    <h3 className="text-sm sm:text-base font-normal text-foreground-dark-shade3 dark:text-foreground-light-shade3 truncate line-clamp-1">
                        {topic.title}
                    </h3>

                    {renderLevelBadge(topic.level)}
                </div>

                {/* Right Side: Progress Fraction + Progress Component + Bookmark Icon */}
                <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
                    <span className="text-xs font-semibold text-muted-light dark:text-muted-dark shrink-0">
                        {topic.problemsSolvedCount} / {topic.problemsCount}
                    </span>

                    {/* Official Progress Component from @codezeniths/components */}
                    <div className="w-36 sm:w-56 md:w-72 xs:block shrink-0">
                        <Progress
                            value={topic.problemsSolvedPercentage}
                            className="h-2 bg-foreground-light-shade3 dark:bg-foreground-dark-shade3"
                            indicatorClassName="bg-primary"
                        />
                    </div>

                    {/* Bookmark Toggle Icon */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark?.(topic.id, !!topic.isBookmarked);
                        }}
                        className={cn(
                            'size-7 rounded-full flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-1',
                            topic.isBookmarked
                                ? 'text-primary bg-primary/10 hover:bg-primary/20'
                                : 'text-muted-light dark:text-muted-dark hover:text-primary hover:bg-foreground-light-shade1 dark:hover:bg-foreground-dark-shade1'
                        )}
                        title={topic.isBookmarked ? 'Remove Bookmark' : 'Bookmark Topic'}
                    >
                        <Bookmark className={cn('size-4', topic.isBookmarked && 'fill-current')} />
                    </button>
                </div>
            </button>

            {/* Accordion Content Area - Fully Expanded without Scroll Truncation */}
            {isOpen && (
                <div className="border-t border-foreground-light-shade3 dark:border-foreground-dark-shade3/60 bg-foreground-light dark:bg-foreground-dark p-3 sm:p-4 pt-1">
                    {hasProblems ? (
                        <Table className="w-full border-separate border-spacing-y-1.5 border-spacing-x-0">
                            <TableBody>
                                {topic.problems.map((problem, idx) => (
                                    <ProblemRow
                                        key={problem.id}
                                        problem={problem}
                                        index={idx}
                                        onToggleSolved={onToggleSolved}
                                        onToggleFavourite={onToggleFavourite}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-6 text-center text-xs font-medium text-muted-light dark:text-muted-dark flex flex-col items-center justify-center gap-2">
                            <Layers className="size-6 opacity-40" />
                            <span>No problems found under this topic matching active filters.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const TopicAccordionItem: React.FC<TopicAccordionItemProps> = React.memo(
    TopicAccordionItemComponent,
    (prevProps, nextProps) => {
        return (
            prevProps.isOpen === nextProps.isOpen &&
            prevProps.topic.id === nextProps.topic.id &&
            prevProps.topic.isBookmarked === nextProps.topic.isBookmarked &&
            prevProps.topic.problemsSolvedCount === nextProps.topic.problemsSolvedCount &&
            prevProps.topic.problemsCount === nextProps.topic.problemsCount &&
            prevProps.topic.problems === nextProps.topic.problems
        );
    }
);
