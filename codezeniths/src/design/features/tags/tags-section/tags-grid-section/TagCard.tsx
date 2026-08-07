'use client';

import React from 'react';
import Link from 'next/link';
import { TagIcon } from './TagIcon';
import { Typography, TypographyVariant, TypographyWeight } from '@codezeniths/components';
import { Card, CardBorderEffect, CardVariant } from '@codezeniths/modules';
import { Progress } from '@codezeniths/design/components/feedback/progress';
import { Separator } from '@codezeniths/design/components/core/separator';
import { Level } from '@prisma/client';

export interface TagCardItem {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    level?: Level | null;
    module?: {
        title: string;
        slug: string;
    };
    problemsCount: number;
    problemsSolvedCount: number;
    problemsSolvedPercentage: number;
}

export interface TagCardProps {
    tag: TagCardItem;
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

export const TagCard: React.FC<TagCardProps> = ({ tag }) => {
    const lvl = levelConfig[tag.level?.toLowerCase() || 'beginner'] || levelConfig.beginner;

    return (
        <Link href={`/tags/${tag.slug}`} className="h-full block">
            <Card 
                variant={CardVariant.FLAT}
                effectConfig={{
                    borderEffect: CardBorderEffect.GRADIENT_HOVER
                }}
                className="group rounded-md bg-foreground-light dark:bg-foreground-dark hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-lg h-full cursor-pointer transition-all duration-300 relative overflow-hidden group border">

                {/* Top Row: Title + Problems Count Subtext & Right Icon */}
                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 min-w-0 flex-1">
                            <Typography
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-base sm:text-lg text-body-light-shade3 dark:text-body-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors leading-tight truncate"
                            >
                                {tag.title}
                            </Typography>
                            <div className="text-[10px] sm:text-xs font-medium text-muted-light dark:text-muted-dark flex items-center gap-2 flex-wrap">
                                <span>{tag.problemsCount} {tag.problemsCount === 1 ? 'Problem' : 'Problems'}</span>
                                {tag.level && (
                                    <>
                                        <span className="size-1 rounded-full bg-secondary" />
                                        <span
                                            className="text-[10px] font-medium tracking-widest shrink-0"
                                            style={{ color: lvl.color }}
                                        >
                                            {lvl.label}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <TagIcon tagSlug={tag.slug} moduleSlug={tag.module?.slug} />
                    </div>
                </div>

                {/* Separator & Bottom Section: Progress Bar */}
                <div className="space-y-4 pt-5">
                    <Separator className="bg-primary/5" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                            <span className="text-muted-light dark:text-muted-dark font-medium text-[12px]">
                                {tag.problemsSolvedCount} / {tag.problemsCount} Solved
                            </span>
                            <span className="text-body-light-shade3 dark:text-body-dark font-semibold text-[12px]">
                                {tag.problemsSolvedPercentage}%
                            </span>
                        </div>
                        <Progress value={tag.problemsSolvedPercentage} className="h-2 rounded-full" />
                    </div>
                </div>
            </Card>
        </Link>
    );
};
