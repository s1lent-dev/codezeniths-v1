'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import {
    Typography,
    Badge,
    Button,
    ButtonVariant,
    ButtonSize,
} from '@codezeniths/components';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    useCarouselContext,
} from '@codezeniths/design/modules/feedback/carousel';
import { CategoryCard, CategoryCardGridSkeleton } from '@codezeniths/design/widgets/shared';

export interface ModuleWithTopicsItem {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    topicsCount: number;
    topics: Array<{
        id: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: any;
        order: number;
        problemsCount: number;
        problemsSolvedCount: number;
        problemsSolvedPercentage: number;
    }>;
}

export interface ModulesTopicRowsProps {
    modulesWithTopics: ModuleWithTopicsItem[];
    isLoading?: boolean;
}

const SingleModuleRowHeader: React.FC<{ moduleItem: ModuleWithTopicsItem }> = ({ moduleItem }) => {
    const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarouselContext();

    return (
        <div className="flex items-center justify-between gap-4 mb-3 font-sans">
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                    <Layers className="size-4.5" />
                </div>
                <Typography
                    className="font-bold text-lg sm:text-xl text-body-light dark:text-body-dark"
                >
                    {moduleItem.title}
                </Typography>
                <Badge variant="secondary" className="text-xs text-body-light dark:text-body-dark font-semibold px-2.5 py-0.5">
                    {moduleItem.topicsCount} {moduleItem.topicsCount === 1 ? 'Topic' : 'Topics'}
                </Badge>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {/* Arrow Navigation Controls for each slider */}
                <div className="flex items-center gap-1.5">
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.ICON_XS}
                        disabled={!canScrollPrev}
                        onClick={scrollPrev}
                        className="size-8 rounded-full border-primary/20 hover:border-primary text-heading-light dark:text-heading-dark transition-all disabled:opacity-40"
                        aria-label="Previous topics"
                    >
                        <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                        variant={ButtonVariant.OUTLINE}
                        size={ButtonSize.ICON_XS}
                        disabled={!canScrollNext}
                        onClick={scrollNext}
                        className="size-8 rounded-full border-primary/20 hover:border-primary text-heading-light dark:text-heading-dark transition-all disabled:opacity-40"
                        aria-label="Next topics"
                    >
                        <ChevronRight className="size-4" />
                    </Button>
                </div>

                {/* See More Link */}
                <Link
                    href={`/modules/${moduleItem.slug}`}
                    className="group inline-flex items-center gap-1 text-sm font-semibold text-heading-light dark:text-heading-dark hover:text-primary-shade2 dark:hover:text-primary-tint2 transition-colors ml-1"
                >
                    <span>See More</span>
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>
        </div>
    );
};

const SingleModuleRow: React.FC<{ moduleItem: ModuleWithTopicsItem }> = ({ moduleItem }) => {
    return (
        <div className="w-full space-y-4 font-sans">
            <Carousel
                options={{
                    align: 'start',
                    dragFree: true,
                    containScroll: 'trimSnaps',
                }}
                className="w-full relative"
            >
                <SingleModuleRowHeader moduleItem={moduleItem} />
                <div className="w-full relative">
                    <CarouselContent className="-ml-4 py-2">
                        {moduleItem.topics.map((topic) => (
                            <CarouselItem
                                key={topic.id}
                                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3"
                            >
                                <CategoryCard
                                    data={{
                                        id: topic.id,
                                        title: topic.title,
                                        slug: topic.slug,
                                        href: `/modules/${moduleItem.slug}/${topic.slug}`,
                                        description: topic.description,
                                        level: topic.level,
                                        moduleSlug: moduleItem.slug,
                                        problemsCount: topic.problemsCount,
                                        problemsSolvedCount: topic.problemsSolvedCount,
                                        problemsSolvedPercentage: topic.problemsSolvedPercentage,
                                        type: 'topic',
                                    }}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </div>
            </Carousel>
        </div>
    );
};

export const ModulesTopicRows: React.FC<ModulesTopicRowsProps> = ({
    modulesWithTopics,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="w-full space-y-10">
                {[1, 2, 3].map((row) => (
                    <div key={row} className="space-y-4">
                        <div className="h-7 w-48 bg-primary/10 rounded-md animate-pulse" />
                        <CategoryCardGridSkeleton count={3} />
                    </div>
                ))}
            </div>
        );
    }

    if (!modulesWithTopics || modulesWithTopics.length === 0) {
        return null;
    }

    return (
        <div className="w-full space-y-16 pt-4">
            {modulesWithTopics.map((moduleItem) => (
                <SingleModuleRow key={moduleItem.id} moduleItem={moduleItem} />
            ))}
        </div>
    );
};
