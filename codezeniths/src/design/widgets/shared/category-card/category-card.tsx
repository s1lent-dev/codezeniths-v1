'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@codezeniths/design/cn';
import { Typography, TypographyVariant, TypographyWeight } from '@codezeniths/components';
import { Card, CardBorderEffect, CardVariant } from '@codezeniths/modules';
import { Progress } from '@codezeniths/design/components/feedback/progress';
import { Separator } from '@codezeniths/design/components/core/separator';
import { CategoryCardIcon } from './category-card-icon';

export interface CategoryCardData {
    id: string;
    title: string;
    slug: string;
    href?: string;
    description?: string | null;
    level?: 'fundamental' | 'intermediate' | 'advanced' | string | null;
    moduleSlug?: string;
    problemsCount: number;
    problemsSolvedCount: number;
    problemsSolvedPercentage: number;
    type?: 'tag' | 'topic';
}

export interface CategoryCardProps {
    data: CategoryCardData;
    className?: string;
}

const levelConfig: Record<string, { label: string; color: string }> = {
    fundamental: {
        label: 'Fundamental',
        color: 'var(--color-teal)',
    },
    intermediate: {
        label: 'Intermediate',
        color: 'var(--color-warning)',
    },
    advanced: {
        label: 'Advanced',
        color: 'var(--color-destructive)',
    },
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ data, className }) => {
    const rawLevel = data.level?.toString().toLowerCase() || 'fundamental';
    const lvl = levelConfig[rawLevel] || levelConfig.fundamental;

    const targetHref =
        data.href ||
        (data.type === 'tag'
            ? `/tags/${data.slug}`
            : data.moduleSlug
            ? `/modules/${data.moduleSlug}/${data.slug}`
            : `/topics/${data.slug}`);

    return (
        <Link href={targetHref} className="h-full block">
            <Card
                variant={CardVariant.FLAT}
                effectConfig={{
                    borderEffect: CardBorderEffect.GRADIENT_HOVER,
                }}
                className={cn(
                    'group rounded-md bg-foreground-light dark:bg-foreground-dark hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:shadow-lg h-full cursor-pointer transition-all duration-300 relative overflow-hidden border border-foreground-light-shade3 dark:border-foreground-dark-shade1',
                    className
                )}
            >
                {/* Top Row: Title + Problems Count Subtext & Right Icon */}
                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 min-w-0 flex-1">
                            <Typography
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-h4! sm:text-h6! xs:text-h6! text-body-light-shade3 dark:text-body-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors leading-tight truncate"
                            >
                                {data.title}
                            </Typography>
                            <div className="text-[10px] sm:text-xs font-medium text-muted-light dark:text-muted-dark flex items-center gap-2 flex-wrap">
                                <span>
                                    {data.problemsCount} {data.problemsCount === 1 ? 'Problem' : 'Problems'}
                                </span>
                                {data.level && (
                                    <>
                                        <span className="size-1 rounded-full bg-secondary" />
                                        <span
                                            className="text-[10px] font-medium shrink-0"
                                            style={{ color: lvl.color }}
                                        >
                                            {lvl.label}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <CategoryCardIcon
                            slug={data.slug}
                            moduleSlug={data.moduleSlug}
                            type={data.type || 'topic'}
                        />
                    </div>
                </div>

                {/* Separator & Bottom Section: Progress Bar */}
                <div className="space-y-4 pt-5">
                    <Separator className="bg-primary/5" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                            <span className="text-muted-light dark:text-muted-dark font-medium text-[12px]">
                                {data.problemsSolvedCount} / {data.problemsCount} Solved
                            </span>
                            <span className="text-body-light-shade3 dark:text-body-dark font-semibold text-[12px]">
                                {data.problemsSolvedPercentage}%
                            </span>
                        </div>
                        <Progress value={data.problemsSolvedPercentage} className="h-2 rounded-full" />
                    </div>
                </div>
            </Card>
        </Link>
    );
};
