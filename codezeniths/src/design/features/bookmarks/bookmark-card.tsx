'use client';

import React from 'react';
import Link from 'next/link';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    Badge,
    Button,
    ButtonSize,
    ButtonVariant,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@codezeniths/components';
import { Card, CardVariant, CardBorderEffect } from '@codezeniths/modules';
import { Progress } from '@codezeniths/design/components/feedback/progress';
import { Separator } from '@codezeniths/design/components/core/separator';
import { CategoryCardIcon } from '@codezeniths/design/widgets/shared/category-card/category-card-icon';
import {
    BookOpen,
    Target,
    Tag,
    Bookmark,
    Layers,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export type BookmarkCardType = 'module' | 'topic' | 'tag';

export interface BookmarkCardData {
    id: string;
    title: string;
    slug: string;
    type: BookmarkCardType;
    level?: 'fundamental' | 'intermediate' | 'advanced' | string | null;
    moduleSlug?: string | null;
    moduleTitle?: string | null;
    problemsCount: number;
    problemsSolvedCount: number;
    problemsSolvedPercentage: number;
}

export interface BookmarkCardProps {
    data: BookmarkCardData;
    onRemoveBookmark: () => void;
    className?: string;
}

const LEVEL_CONFIG: Record<string, { label: string; badge: string }> = {
    fundamental: {
        label: 'Fundamental',
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/20',
    },
    intermediate: {
        label: 'Intermediate',
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/20',
    },
    advanced: {
        label: 'Advanced',
        badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/20',
    },
};

const TYPE_CONFIG = {
    module: {
        label: 'Module',
        icon: BookOpen,
        badge: 'bg-primary/10 text-primary dark:bg-primary/15 border-none',
    },
    topic: {
        label: 'Topic',
        icon: Target,
        badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/20',
    },
    tag: {
        label: 'Tag',
        icon: Tag,
        badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/20',
    },
};

export const BookmarkCard: React.FC<BookmarkCardProps> = ({
    data,
    onRemoveBookmark,
    className,
}) => {
    const typeMeta = TYPE_CONFIG[data.type] || TYPE_CONFIG.module;
    const TypeIcon = typeMeta.icon;

    const rawLevel = data.level?.toString().toLowerCase() || null;
    const levelMeta = rawLevel ? LEVEL_CONFIG[rawLevel] : null;

    // Target navigation URL
    const targetHref =
        data.type === 'module'
            ? `/modules/${data.slug}`
            : data.type === 'topic'
            ? data.moduleSlug
                ? `/modules/${data.moduleSlug}/${data.slug}`
                : `/modules`
            : `/tags/${data.slug}`;

    return (
        <Link href={targetHref} prefetch={true} className="h-full block group">
            <Card
                variant={CardVariant.FLAT}
                effectConfig={{
                    borderEffect: CardBorderEffect.GRADIENT_HOVER,
                }}
                className={cn(
                    'group rounded-md bg-foreground-light dark:bg-foreground-dark',
                    'hover:bg-linear-to-r hover:from-primary/8 hover:via-primary/2 hover:to-transparent',
                    'p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-lg hover:shadow-primary/5',
                    'h-full cursor-pointer transition-all duration-300 relative overflow-hidden',
                    'border border-foreground-light-shade3 dark:border-foreground-dark-shade1',
                    'hover:border-primary/40 dark:hover:border-primary/40',
                    className
                )}
            >
                {/* Top Subtle Ambient Glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 dark:group-hover:bg-primary/15 transition-all duration-500" />

                <div className="space-y-4 relative z-10">
                    {/* Top Row: Left Type & Level Badges + Right Bookmark Action Button */}
                    <div className="flex items-center justify-between gap-3">
                        {/* Visibility / Type & Level Badge (Left) */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant="default"
                                className={cn(
                                    'px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5',
                                    typeMeta.badge
                                )}
                            >
                                <TypeIcon className="size-3" />
                                <span>{typeMeta.label}</span>
                            </Badge>

                            {levelMeta && (
                                <Badge
                                    variant="default"
                                    className={cn(
                                        'px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center',
                                        levelMeta.badge
                                    )}
                                >
                                    {levelMeta.label}
                                </Badge>
                            )}
                        </div>

                        {/* Top Right Action: Bookmark Button (matching playlist card) */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size={ButtonSize.ICON}
                                        variant={ButtonVariant.OUTLINE}
                                        title="Remove Bookmark"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onRemoveBookmark();
                                        }}
                                        className={cn(
                                            'size-8 rounded-full transition-colors border cursor-pointer shrink-0',
                                            'bg-primary/10 text-primary border-primary/30 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30'
                                        )}
                                        aria-label={`Remove ${data.type} bookmark`}
                                    >
                                        <Bookmark className="size-3.5 fill-current transition-colors" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">
                                    Remove Bookmark
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Middle Section: Title + Subtext (Left) & Slug Icon (Right) */}
                    <div className="flex items-start justify-between gap-3 pt-1">
                        <div className="space-y-1.5 min-w-0 flex-1">
                            <Typography
                                variant={TypographyVariant.H3}
                                weight={TypographyWeight.BOLD}
                                className="text-base sm:text-lg text-body-light-shade3 dark:text-body-dark group-hover:text-heading-light dark:group-hover:text-heading-dark transition-colors leading-tight truncate"
                            >
                                {data.title}
                            </Typography>
                            <div className="text-[11px] sm:text-xs font-medium text-muted-light dark:text-muted-dark flex items-center gap-2 flex-wrap">
                                <span>
                                    {data.problemsCount} {data.problemsCount === 1 ? 'Problem' : 'Problems'}
                                </span>
                                {data.moduleTitle && (
                                    <>
                                        <span className="size-1 rounded-full bg-muted-light/60 dark:bg-muted-dark/60 shrink-0" />
                                        <span className="text-[11px] text-muted-light/90 dark:text-muted-dark/90 truncate max-w-[130px] flex items-center gap-1">
                                            <Layers className="size-3 shrink-0 text-muted-light dark:text-muted-dark" />
                                            <span className="truncate">{data.moduleTitle}</span>
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Slug Icon (no background wrapper) */}
                        <CategoryCardIcon
                            slug={data.slug}
                            moduleSlug={data.moduleSlug ?? undefined}
                            type={data.type}
                            size="sm"
                        />
                    </div>
                </div>

                {/* Separator & Bottom Section: Progress Bar */}
                <div className="space-y-3 pt-5 relative z-10">
                    <Separator className="bg-foreground-light-shade3/60 dark:bg-foreground-dark-shade1/60" />

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-medium">
                            <span className="text-muted-light dark:text-muted-dark font-medium text-[11px] sm:text-[12px]">
                                {data.problemsSolvedCount} / {data.problemsCount} Solved
                            </span>
                            <span className="text-body-light-shade3 dark:text-body-dark font-bold text-[11px] sm:text-[12px]">
                                {data.problemsSolvedPercentage}%
                            </span>
                        </div>
                        <Progress
                            value={data.problemsSolvedPercentage}
                            className="h-2 w-full rounded-full bg-foreground-light-shade3 dark:bg-foreground-dark-shade3 [&>div]:bg-primary"
                        />
                    </div>
                </div>
            </Card>
        </Link>
    );
};
