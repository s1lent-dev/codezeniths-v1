'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Card } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface CategorySuggestionItem {
    id: string;
    title: string;
    slug: string;
    level?: string | null;
    href?: string;
    moduleSlug?: string;
    problemsCount: number;
    type?: 'tag' | 'topic';
}

export interface CategorySuggestionsCardProps {
    title: string;
    suggestions: CategorySuggestionItem[];
    type?: 'tag' | 'topic';
    moduleSlug?: string;
    className?: string;
}

const levelConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    fundamental: {
        label: 'Fundamental',
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

export const CategorySuggestionsCard: React.FC<CategorySuggestionsCardProps> = ({
    title,
    suggestions,
    type = 'topic',
    moduleSlug,
    className,
}) => {
    if (!suggestions || suggestions.length === 0) return null;

    return (
        <Card
            className={cn(
                'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-4 relative overflow-hidden w-full font-sans ring-0',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h3 className="text-sm font-bold tracking-tight text-heading-light dark:text-heading-dark uppercase">
                        {title}
                    </h3>
                </div>
                <span className="text-xs font-semibold text-muted-light dark:text-muted-dark">
                    {suggestions.length} Suggested
                </span>
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap gap-2.5 pt-6">
                {suggestions.map((item) => {
                    const stLvl = levelConfig[item.level?.toLowerCase() || 'fundamental'] || levelConfig.fundamental;
                    const itemType = item.type || type;

                    const targetHref =
                        item.href ||
                        (itemType === 'tag'
                            ? `/tags/${item.slug}`
                            : `/modules/${item.moduleSlug || moduleSlug || 'module-dsa'}/${item.slug}`);

                    return (
                        <Link
                            key={item.id}
                            href={targetHref}
                            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border border-foreground-light-shade3 dark:border-foreground-dark-shade3 text-body-light dark:text-body-dark hover:border-primary/50 hover:text-heading-light dark:hover:text-heading-dark transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
                        >
                            <span className="size-1.5 rounded-full shrink-0" style={{ background: stLvl.color }} />
                            <span>{item.title}</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-primary/10 dark:bg-primary/15 text-foreground-dark-shade3/75 dark:text-foreground-light-shade3 text-[10px] font-bold group-hover:text-primary transition-colors">
                                {item.problemsCount}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </Card>
    );
};
