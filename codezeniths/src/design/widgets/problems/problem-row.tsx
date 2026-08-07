'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ExternalLink } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { TableRow, TableCell } from '@codezeniths/modules';
import { Checkbox, Tooltip, TooltipTrigger, TooltipContent } from '@codezeniths/components';

export interface ProblemItem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'easy' | 'medium' | 'hard';
    order?: number;
    articleUrl?: string | null;
    problemUrl?: string | null;
    favouriteCount?: number;
    tags?: Array<{ id: string; name: string; slug: string }>;
    status?: 'solved' | 'revisit' | 'not_solved' | null;
    favourite?: boolean | null;
}

export interface ProblemRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-index'?: number;
    problem: ProblemItem;
    index?: number;
    isSolved?: boolean;
    isFavourite?: boolean;
    onToggleSolved?: (problemId: string, currentSolved: boolean) => void;
    onToggleFavourite?: (problemId: string, currentFavourite: boolean) => void;
    className?: string;
}

export const ProblemRow = React.forwardRef<HTMLTableRowElement, ProblemRowProps>(
    (
        {
            problem,
            index = 0,
            'data-index': dataIndex,
            isSolved = problem.status === 'solved',
            isFavourite = Boolean(problem.favourite),
            onToggleSolved,
            onToggleFavourite,
            className,
            ...props
        },
        ref
    ) => {
        const formatDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
            if (difficulty === 'medium') return 'Med';
            return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        };

        return (
            <TableRow
                ref={ref}
                data-index={dataIndex ?? index}
                {...props}
                className={cn(
                    'group transition-colors rounded-md border-0 h-13 box-border',
                    index % 2 === 0
                        ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 hover:bg-primary/10 dark:hover:bg-primary/10'
                        : 'bg-transparent hover:bg-primary/3 dark:hover:bg-primary/3',
                    className
                )}
            >
                {/* 1. Solved Checkbox Column */}
                <TableCell className="w-12 min-w-[48px] max-w-[48px] pl-4 py-3 text-center align-middle rounded-l-md border-0">
                    <Checkbox
                        checked={isSolved}
                        onCheckedChange={() => onToggleSolved?.(problem.id, isSolved)}
                        className="mx-auto cursor-pointer"
                    />
                </TableCell>

                {/* 2. Problem Title Column */}
                <TableCell className="w-auto py-3 px-3 align-middle border-0">
                    <Link
                        href={`/problemset/${problem.slug}`}
                        className="text-sm font-medium transition-colors text-body-light dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark line-clamp-1"
                    >
                        {problem.title}
                    </Link>
                </TableCell>

                {/* 3. Right Actions (External Link, Difficulty, Favourite Star) Column */}
                <TableCell className="w-44 min-w-44 max-w-44 pr-4 py-3 text-right align-middle rounded-r-md border-0">
                    <div className="flex items-center justify-end gap-3">
                        {/* External Link */}
                        {problem.problemUrl || problem.articleUrl ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={problem.problemUrl || problem.articleUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-light dark:text-muted-dark hover:text-primary transition-colors p-1"
                                    >
                                        <ExternalLink className="w-4.5 h-4.5" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                    Open Problem
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <div className="w-5 h-5" />
                        )}

                        {/* Difficulty Badge */}
                        <span
                            className={cn(
                                'text-xs font-semibold w-14 text-center',
                                problem.difficulty === 'hard' && 'text-rose-500 dark:text-rose-400',
                                problem.difficulty === 'medium' && 'text-amber-500 dark:text-amber-400',
                                problem.difficulty === 'easy' && 'text-emerald-500 dark:text-emerald-400'
                            )}
                        >
                            {formatDifficulty(problem.difficulty)}
                        </span>

                        {/* Favourite Star Icon */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => onToggleFavourite?.(problem.id, isFavourite)}
                                    className="rounded text-muted-light dark:text-muted-dark hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer p-1"
                                >
                                    <Star
                                        className={cn(
                                            'w-4.5 h-4.5 transition-transform active:scale-125',
                                            isFavourite && 'fill-amber-400 text-amber-400'
                                        )}
                                    />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                                {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TableCell>
            </TableRow>
        );
    }
);

ProblemRow.displayName = 'ProblemRow';
