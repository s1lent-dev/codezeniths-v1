'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Tag as TagIconLucide, Play, Star, GitFork, ExternalLink } from 'lucide-react';
import {
    Badge,
    Button,
    ButtonEffect,
    ButtonSize,
    ButtonVariant,
    Grid,
    GridItem,
    Typography,
    TypographyEffect,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@codezeniths/design/components/navigation/breadcrumb';
import { useProgress } from './useProgress';
import { TagsProgress } from './tags-progress';

export const TagsHeaderSection: React.FC = () => {
    const { tagsCount, modulesCount, isLoading } = useProgress();

    return (
        <div className="w-full space-y-6">
            {/* Breadcrumb (Full Width with Background & Active Styling) */}
            <div className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark px-5 py-2 sm:px-6 sm:py-4 shadow-xs">
                <Breadcrumb className="w-full">
                    <BreadcrumbList className="text-sm sm:text-base font-medium">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-heading-light dark:text-heading-dark hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    <Home className="size-4.5" />
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-heading-light dark:text-heading-dark">
                                Tags
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Header Two Cards Layout */}
            <Grid cols={12} gap="lg" className="items-stretch">
                {/* Left Card: Refined Info Card with Decorative Gradient Circles */}
                <GridItem colSpan={8} className="col-span-12 lg:col-span-8 overflow-hidden rounded-md">
                    <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-4 relative overflow-hidden h-full">
                        {/* Top Right Decorative Bluish Circle */}
                        <div className="absolute -top-36 -right-24 size-52 rounded-full bg-linear-to-br from-primary/20 via-blue-500/10 to-transparent dark:from-primary/25 dark:via-blue-500/15 dark:to-transparent border border-blue-400/20 dark:border-blue-400/15 pointer-events-none" />
                        {/* Bottom Right Decorative Bluish Circle */}
                        <div className="absolute -bottom-68 -right-48 size-96 rounded-full bg-linear-to-tl from-sky-400/20 via-blue-400/10 to-transparent dark:from-sky-300/25 dark:via-blue-400/15 dark:to-transparent border border-sky-400/20 dark:border-sky-400/15 pointer-events-none" />

                        <div
                            className="absolute -left-16 -top-16 w-56 h-56 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                            style={{ background: "var(--color-primary)" }}
                        />
                        <div
                            className="absolute -right-16 -bottom-8 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-[0.08]"
                            style={{ background: "var(--color-teal)" }}
                        />

                        <div className="space-y-3 relative z-10 p-2">
                            {/* 1] Topic categorization badge (compact) */}
                            <Badge
                                variant="default"
                                className="px-3 py-1 rounded-full bg-primary/5 dark:bg-primary/5 text-primary text-xs font-semibold border-none"
                            >
                                <TagIconLucide className="size-3.5" />
                                <Typography
                                    variant={TypographyVariant.P}
                                    effect={TypographyEffect.GRADIENT}
                                    colorFrom="#6A7CFF"
                                    colorTo="#a289fa"
                                    speed={1}
                                    className="text-[10px] lg:text-[12px] tracking-wider"
                                >
                                    Topic Categorization
                                </Typography>
                            </Badge>

                            {/* 2] Heading (slightly smaller) */}
                            <Typography
                                variant={TypographyVariant.H1}
                                className="text-2xl font-bold sm:text-3xl tracking-tight text-body-light-shade3 dark:text-body-dark"
                            >
                                Problem Tags & Topics
                            </Typography>

                            {/* 3] Tags and Modules counters (with blue & green circles) */}
                            <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-medium text-muted-light dark:text-muted-dark pt-0.5">
                                <span className="flex items-center gap-2 text-[12px]">
                                    <span className="size-2 rounded-full bg-primary"></span>
                                    {isLoading ? 'Loading Tags...' : `${tagsCount} Tags Available`}
                                </span>
                                <span className="flex items-center gap-2 text-[12px]">
                                    <span className="size-2 rounded-full bg-teal"></span>
                                    {isLoading ? 'Loading Modules...' : `${modulesCount} Core Modules`}
                                </span>
                            </div>

                            {/* 4] Description (smaller font) */}
                            <Typography
                                variant={TypographyVariant.P}
                                className="text-xs sm:text-sm text-muted-light dark:text-muted-dark leading-relaxed pt-1 block max-w-150"
                            >
                                Explore coding problems categorized by algorithmic techniques, data structures, and domain topics. Use filters to hone specific technical skill gaps.
                            </Typography>
                        </div>

                        {/* 5] Group of action buttons */}
                        <div className="pt-6 flex flex-wrap items-center gap-3 relative z-10 px-2">
                            {/* Practice Button with Play icon */}
                            <Button
                                variant={ButtonVariant.DEFAULT}
                                className="px-4 py-2 rounded-full bg-primary hover:bg-primary-shade2 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                            >
                                <Play className="size-3.5 fill-current" />
                                <Link href="/problemset">
                                    <span>Practice</span>
                                </Link>
                            </Button>

                            {/* Circle Buttons with foreground shade1 bg */}
                            <Button
                                size={ButtonSize.ICON}
                                variant={ButtonVariant.OUTLINE}
                                title="Star Tags"
                                className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                            >
                                <Star className="size-4" />
                            </Button>

                            <Button
                                size={ButtonSize.ICON}
                                variant={ButtonVariant.OUTLINE}
                                title="Fork Topic List"
                                className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                            >
                                <GitFork className="size-4" />
                            </Button>

                            <Button
                                size={ButtonSize.ICON}
                                variant={ButtonVariant.OUTLINE}
                                title="Share Link"
                                className="size-9 rounded-full bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 transition-colors border border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40"
                            >
                                <ExternalLink className="size-4" />
                            </Button>
                        </div>
                    </Card>
                </GridItem>

                {/* Right Card: Compact TagsProgress Component */}
                <GridItem colSpan={4} className="col-span-12 lg:col-span-4">
                    <TagsProgress />
                </GridItem>
            </Grid>
        </div>
    );
};
