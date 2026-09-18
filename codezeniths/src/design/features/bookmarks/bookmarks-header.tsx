'use client';

import React from 'react';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Bookmark, BookOpen, Target, Tag } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface BookmarksHeaderProps {
    totalCount?: number;
    modulesCount?: number;
    topicsCount?: number;
    tagsCount?: number;
    isLoading?: boolean;
    className?: string;
}

export const BookmarksHeader: React.FC<BookmarksHeaderProps> = ({
    totalCount = 0,
    modulesCount = 0,
    topicsCount = 0,
    tagsCount = 0,
    isLoading = false,
    className,
}) => {
    return (
        <div className={cn('w-full space-y-5', className)}>
            {/* Top Breadcrumb Bar */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[{ label: 'Bookmarks', isCurrentPage: true }]}
            />

            {/* Hub Title Banner & Stats Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-foreground-light dark:bg-foreground-dark p-5 sm:p-7 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xs relative overflow-hidden">
                {/* Decorative Ambient Background Glows */}
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl pointer-events-none" />
                <div className="absolute -left-12 -bottom-12 size-36 rounded-full bg-primary/5 dark:bg-primary/10 blur-2xl pointer-events-none" />

                {/* Left Title & Subtext */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 z-10">
                    <div className="size-10 sm:size-11 rounded-md bg-primary/10 dark:bg-primary/15 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                        <Bookmark className="size-5 sm:size-5.5 fill-primary/20 text-primary" />
                    </div>
                    <div className="space-y-1 min-w-0">
                        <Typography
                            variant={TypographyVariant.H1}
                            weight={TypographyWeight.EXTRABOLD}
                            className="text-xl sm:text-2xl tracking-tight text-body-light-shade3 dark:text-body-dark"
                        >
                            Bookmarks Hub
                        </Typography>
                        <Typography
                            variant={TypographyVariant.P}
                            className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed line-clamp-2 max-w-lg"
                        >
                            Access and practice your saved modules, topics, and concept tags to accelerate your coding preparation.
                        </Typography>
                    </div>
                </div>

                {/* Right Bookmark Counters (Luminescent Badges) */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 z-10">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="h-7 w-28 rounded-full bg-primary/15 animate-pulse" />
                            <div className="h-7 w-24 rounded-full bg-primary/10 animate-pulse" />
                            <div className="h-7 w-22 rounded-full bg-amber-500/10 animate-pulse" />
                            <div className="h-7 w-20 rounded-full bg-emerald-500/10 animate-pulse" />
                        </div>
                    ) : (
                        <>
                            {/* Total Count Badge (Luminescent Primary) */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 dark:bg-primary/20 text-primary border border-primary/25 shadow-2xs shadow-primary/10 transition-all">
                                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                                <span>{totalCount} Total Saved</span>
                            </span>

                            {/* Modules Pill (Soft Luminous Primary) */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 dark:bg-primary/15 text-primary border border-primary/20 dark:border-primary/25 shadow-2xs shadow-primary/5 transition-all">
                                <BookOpen className="size-3.5 text-primary" />
                                <span>{modulesCount} Modules</span>
                            </span>

                            {/* Topics Pill (Soft Luminous Amber) */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/25 shadow-2xs shadow-amber-500/5 transition-all">
                                <Target className="size-3.5 text-amber-500 dark:text-amber-400" />
                                <span>{topicsCount} Topics</span>
                            </span>

                            {/* Tags Pill (Soft Luminous Emerald) */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/25 shadow-2xs shadow-emerald-500/5 transition-all">
                                <Tag className="size-3.5 text-emerald-500 dark:text-emerald-400" />
                                <span>{tagsCount} Tags</span>
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
