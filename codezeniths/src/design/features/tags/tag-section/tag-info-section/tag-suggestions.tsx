'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Card } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface SimilarTagItem {
    id: string;
    title: string;
    slug: string;
    level?: string | null;
    moduleTitle?: string;
    problemsCount: number;
}

export interface TagSuggestionsProps {
    similarTags: SimilarTagItem[];
    className?: string;
}

const levelConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    beginner: {
        label: 'Beginner',
        color: 'var(--color-teal)',
        bg: 'rgba(115, 218, 202, 0.08)',
        border: 'rgba(115, 218, 202, 0.2)',
    },
    fundamental: {
        label: 'Beginner',
        color: 'var(--color-teal)',
        bg: 'rgba(115, 218, 202, 0.08)',
        border: 'rgba(115, 218, 202, 0.2)',
    },
    intermediate: {
        label: 'Intermediate',
        color: 'var(--color-warning)',
        bg: 'rgba(224, 175, 104, 0.08)',
        border: 'rgba(224, 175, 104, 0.2)',
    },
    advanced: {
        label: 'Advanced',
        color: 'var(--color-destructive)',
        bg: 'rgba(255, 70, 85, 0.08)',
        border: 'rgba(255, 70, 85, 0.2)',
    },
};

export const TagSuggestions: React.FC<TagSuggestionsProps> = ({ similarTags, className }) => {
    if (!similarTags || similarTags.length === 0) return null;

    return (
        <Card className={cn('rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-4 relative overflow-hidden w-full font-sans ring-0', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="text-sm font-bold tracking-tight text-heading-light dark:text-heading-dark uppercase">
                        Similar Tags
                    </h3>
                </div>
                <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">
                    {similarTags.length} Suggested
                </span>
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap gap-2.5 pt-6">
                {similarTags.map((st) => {
                    const stLvl = levelConfig[st.level?.toLowerCase() || 'beginner'] || levelConfig.beginner;
                    return (
                        <Link
                            key={st.id}
                            href={`/tags/${st.slug}`}
                            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark hover:border-primary/50 hover:text-heading-light dark:hover:text-heading-dark transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                        >
                            <span className="size-1.5 rounded-full shrink-0" style={{ background: stLvl.color }} />
                            <span>{st.title}</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/15 text-foreground-dark-shade3/75 dark:text-foreground-light-shade3 text-[10px] font-bold group-hover:text-primary transition-colors">
                                {st.problemsCount}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </Card>
    );
};
