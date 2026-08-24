'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ExternalLink, Bookmark, MoreVertical } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    TableRow,
    TableCell,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@codezeniths/modules';
import { Checkbox, Tooltip, TooltipTrigger, TooltipContent } from '@codezeniths/components';
import { ProblemPlaylistSubmenu } from './problem-playlist-submenu';

export interface ProblemItem {
    id: string;
    title: string;
    slug: string;
    difficulty: 'easy' | 'medium' | 'hard';
    order?: number;
    articleUrl?: string | null;
    problemUrl?: string | null;
    favouriteCount?: number;
    topicId?: string | null;
    topicSlug?: string | null;
    tags?: Array<{ id: string; name: string; slug: string }>;
    status?: 'solved' | 'not_solved' | null;
    revisit?: boolean | null;
    favourite?: boolean | null;
}

export interface ProblemRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-index'?: number;
    problem: ProblemItem;
    index?: number;
    isSolved?: boolean;
    isRevisit?: boolean;
    isFavourite?: boolean;
    onToggleSolved?: (problemId: string, currentSolved: boolean) => void;
    onToggleRevisit?: (problemId: string, currentRevisit: boolean) => void;
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
            isRevisit = Boolean(problem.revisit),
            isFavourite = Boolean(problem.favourite),
            onToggleSolved,
            onToggleRevisit,
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
                <TableCell className="w-10 sm:w-12 min-w-[40px] sm:min-w-[48px] max-w-[40px] sm:max-w-[48px] pl-2.5 sm:pl-4 py-2.5 sm:py-3 text-center align-middle rounded-l-md border-0">
                    <Checkbox
                        checked={isSolved}
                        onCheckedChange={() => onToggleSolved?.(problem.id, isSolved)}
                        className="mx-auto cursor-pointer"
                    />
                </TableCell>

                {/* 2. Problem Title Column */}
                <TableCell className="w-auto py-2.5 sm:py-3 px-1.5 sm:px-3 align-middle border-0 min-w-0">
                    <Link
                        href={`/problemset/${problem.slug}`}
                        className="text-xs sm:text-sm font-medium transition-colors text-body-light dark:text-body-dark hover:text-heading-light dark:hover:text-heading-dark line-clamp-1 block truncate"
                    >
                        {problem.title}
                    </Link>
                </TableCell>

                {/* 3. Right Actions (External Link, Difficulty, 3-Dot Actions Dropdown) Column */}
                <TableCell className="w-24 xs:w-28 sm:w-36 min-w-[96px] xs:min-w-[112px] sm:min-w-[144px] max-w-[144px] pr-2 sm:pr-4 py-2.5 sm:py-3 text-right align-middle rounded-r-md border-0">
                    <div className="flex items-center justify-end gap-1.5 xs:gap-2.5">
                        {/* External Link */}
                        {problem.problemUrl || problem.articleUrl ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={problem.problemUrl || problem.articleUrl || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hidden xs:inline-flex text-muted-light dark:text-muted-dark hover:text-primary transition-colors p-1"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                    Open Problem
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <div className="hidden xs:block w-4 h-4" />
                        )}

                        {/* Difficulty Badge */}
                        <span
                            className={cn(
                                'text-[11px] sm:text-xs font-semibold w-8 xs:w-10 sm:w-12 text-center shrink-0',
                                problem.difficulty === 'hard' && 'text-rose-500 dark:text-rose-400',
                                problem.difficulty === 'medium' && 'text-amber-500 dark:text-amber-400',
                                problem.difficulty === 'easy' && 'text-emerald-500 dark:text-emerald-400'
                            )}
                        >
                            {formatDifficulty(problem.difficulty)}
                        </span>

                        {/* 3-Dot Actions Dropdown Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="size-6 sm:size-7 rounded-md flex items-center justify-center text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors cursor-pointer shrink-0"
                                    title="Problem options"
                                >
                                    <MoreVertical className="size-3.5 sm:size-4" />
                                    <span className="sr-only">Actions</span>
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                sideOffset={6}
                                className="w-52 p-1 rounded-md bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-lg text-body-light-shade3 dark:text-body-dark space-y-0.5 z-100"
                            >
                                {/* Toggle Favourite */}
                                <DropdownMenuItem
                                    onClick={() => onToggleFavourite?.(problem.id, isFavourite)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs font-medium text-body-light-shade3 dark:text-body-dark hover:text-amber-500 hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 cursor-pointer transition-colors outline-none select-none"
                                >
                                    <Star
                                        className={cn(
                                            'size-3.5 shrink-0',
                                            isFavourite ? 'fill-amber-400 text-amber-400' : 'text-muted-light dark:text-muted-dark'
                                        )}
                                    />
                                    <span>{isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}</span>
                                </DropdownMenuItem>

                                {/* Toggle Revisit */}
                                <DropdownMenuItem
                                    onClick={() => onToggleRevisit?.(problem.id, isRevisit)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs font-medium text-body-light-shade3 dark:text-body-dark hover:text-blue-500 hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 cursor-pointer transition-colors outline-none select-none"
                                >
                                    <Bookmark
                                        className={cn(
                                            'size-3.5 shrink-0',
                                            isRevisit ? 'fill-blue-500 text-blue-500' : 'text-muted-light dark:text-muted-dark'
                                        )}
                                    />
                                    <span>{isRevisit ? 'Remove from Revisit' : 'Mark for Revisit'}</span>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1 bg-foreground-light-shade3 dark:bg-foreground-dark-shade1 h-px" />

                                {/* Add to Playlist Submenu */}
                                <ProblemPlaylistSubmenu problemId={problem.id} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </TableCell>
            </TableRow>
        );
    }
);

ProblemRow.displayName = 'ProblemRow';
