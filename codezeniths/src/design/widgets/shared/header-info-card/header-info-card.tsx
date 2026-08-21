'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Play, Star, Bookmark, GitFork, ExternalLink } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import {
    Badge,
    Button,
    ButtonSize,
    ButtonVariant,
    Typography,
    TypographyEffect,
    TypographyVariant,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';

export interface HeaderInfoCardStat {
    label: string;
    dotColor?: string;
}

export interface HeaderInfoCardProps {
    badgeIcon?: React.ReactNode;
    badgeText: string;
    title: string;
    stats: HeaderInfoCardStat[];
    description: string;
    actionHref?: string;
    actionLabel?: string;
    isBookmarked?: boolean;
    onActionClick?: () => void;
    onShareClick?: () => void;
    onStarClick?: () => void;
    onBookmarkClick?: () => void;
    onForkClick?: () => void;
    className?: string;
}

export const HeaderInfoCard: React.FC<HeaderInfoCardProps> = ({
    badgeIcon,
    badgeText,
    title,
    stats,
    description,
    actionHref,
    actionLabel = 'Practice',
    isBookmarked = false,
    onActionClick,
    onShareClick,
    onStarClick,
    onBookmarkClick,
    onForkClick,
    className,
}) => {
    return (
        <Card
            className={cn(
                'rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-4 relative overflow-hidden h-full',
                className
            )}
        >
            {/* Top Right Decorative Bluish Circle */}
            <div className="absolute -top-36 -right-24 size-52 rounded-full bg-linear-to-br from-primary/20 via-blue-500/10 to-transparent dark:from-primary/25 dark:via-blue-500/15 dark:to-transparent border border-blue-400/20 dark:border-blue-400/15 pointer-events-none" />
            {/* Bottom Right Decorative Bluish Circle */}
            <div className="absolute -bottom-68 -right-48 size-96 rounded-full bg-linear-to-tl from-sky-400/20 via-blue-400/10 to-transparent dark:from-sky-300/25 dark:via-blue-400/15 dark:to-transparent border border-sky-400/20 dark:border-sky-400/15 pointer-events-none" />

            {/* Ambient Glow Blurs */}
            <div
                className="absolute -left-16 -top-16 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                style={{ background: 'var(--color-primary)' }}
            />
            <div
                className="absolute -right-16 -bottom-8 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                style={{ background: 'var(--color-teal)' }}
            />

            <div className="space-y-3 relative z-10 p-2">
                {/* 1] Badge */}
                <Badge
                    variant="default"
                    className="px-3 py-1 rounded-full bg-primary/5 dark:bg-primary/5 text-primary text-xs font-semibold border-none"
                >
                    {badgeIcon || <BookOpen className="size-3.5" />}
                    <Typography
                        variant={TypographyVariant.P}
                        effect={TypographyEffect.GRADIENT}
                        colorFrom="#6A7CFF"
                        colorTo="#a289fa"
                        speed={1}
                        className="text-[10px] lg:text-[12px] tracking-wider"
                    >
                        {badgeText}
                    </Typography>
                </Badge>

                {/* 2] Heading */}
                <Typography
                    variant={TypographyVariant.H1}
                    className="text-2xl font-bold sm:text-3xl tracking-tight text-body-light-shade3 dark:text-body-dark"
                >
                    {title}
                </Typography>

                {/* 3] Counters Row */}
                <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-medium text-muted-light dark:text-muted-dark pt-0.5">
                    {stats.map((stat, idx) => (
                        <span key={idx} className="flex items-center gap-2 text-[12px]">
                            <span className={cn('size-2 rounded-full', stat.dotColor || 'bg-primary')} />
                            {stat.label}
                        </span>
                    ))}
                </div>

                {/* 4] Description */}
                <Typography
                    variant={TypographyVariant.P}
                    className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed pt-1 block max-w-150"
                >
                    {description}
                </Typography>
            </div>

            {/* 5] Group of Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center gap-3 relative z-10 px-2">
                <Button
                    variant={ButtonVariant.DEFAULT}
                    onClick={onActionClick}
                    className="px-4 py-2 rounded-full bg-primary hover:bg-primary-shade2 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                >
                    <Play className="size-3.5 fill-current" />
                    {actionHref ? (
                        <Link href={actionHref}>
                            <span>{actionLabel}</span>
                        </Link>
                    ) : (
                        <span>{actionLabel}</span>
                    )}
                </Button>

                {onBookmarkClick && (
                    <Button
                        size={ButtonSize.ICON}
                        variant={ButtonVariant.OUTLINE}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                        onClick={onBookmarkClick}
                        className={cn(
                            'size-9 rounded-full transition-colors border cursor-pointer',
                            isBookmarked
                                ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                                : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40'
                        )}
                    >
                        <Bookmark className={cn('size-4', isBookmarked && 'fill-current')} />
                    </Button>
                )}

                <Button
                    size={ButtonSize.ICON}
                    variant={ButtonVariant.OUTLINE}
                    title="Star"
                    onClick={onStarClick}
                    className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
                >
                    <Star className="size-4" />
                </Button>

                <Button
                    size={ButtonSize.ICON}
                    variant={ButtonVariant.OUTLINE}
                    title="Fork"
                    onClick={onForkClick}
                    className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
                >
                    <GitFork className="size-4" />
                </Button>

                <Button
                    size={ButtonSize.ICON}
                    variant={ButtonVariant.OUTLINE}
                    title="Share Link"
                    onClick={
                        onShareClick ||
                        (() => {
                            if (typeof window !== 'undefined') {
                                navigator.clipboard.writeText(window.location.href);
                            }
                        })
                    }
                    className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40 cursor-pointer"
                >
                    <ExternalLink className="size-4" />
                </Button>
            </div>
        </Card>
    );
};
