'use client';

import React, { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    Typography,
    TypographyVariant,
    TypographyWeight,
} from '@codezeniths/components';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    useCarouselContext,
} from '@codezeniths/modules';
import { CategoryCard, CategoryCardSkeleton } from '@codezeniths/widgets';

export interface ModuleTopicsSectionProps {
    topics?: Array<{
        id?: string;
        title: string;
        slug: string;
        description?: string | null;
        level?: any;
        order?: number;
        problemsCount: number;
        problemsSolvedCount: number;
        problemsSolvedPercentage: number;
    }>;
    moduleSlug: string;
    isLoading?: boolean;
}

const ModuleTopicsSliderHeader: React.FC = () => {
    const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarouselContext();

    return (
        <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="size-7 sm:size-8 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Layers className="size-4 sm:size-4.5" />
                </div>
                <Typography
                    variant={TypographyVariant.H2}
                    weight={TypographyWeight.BOLD}
                    className="text-base sm:text-lg md:text-xl text-body-light dark:text-body-dark"
                >
                    Module Topics
                </Typography>
            </div>

            {/* Navigation Arrows (Desktop / Tablet view) */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <Button
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.ICON_XS}
                    disabled={!canScrollPrev}
                    onClick={scrollPrev}
                    className="size-8 rounded-full border-primary/20 hover:border-primary text-heading-light dark:text-heading-dark transition-all disabled:opacity-40 cursor-pointer"
                    aria-label="Previous topics"
                >
                    <ChevronLeft className="size-4" />
                </Button>
                <Button
                    variant={ButtonVariant.OUTLINE}
                    size={ButtonSize.ICON_XS}
                    disabled={!canScrollNext}
                    onClick={scrollNext}
                    className="size-8 rounded-full border-primary/20 hover:border-primary text-heading-light dark:text-heading-dark transition-all disabled:opacity-40 cursor-pointer"
                    aria-label="Next topics"
                >
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
};

const ModuleTopicsSliderBottomNav: React.FC = () => {
    const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarouselContext();

    return (
        <div className="flex sm:hidden items-center justify-start gap-1.5 pt-1">
            <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.ICON_XS}
                disabled={!canScrollPrev}
                onClick={scrollPrev}
                className="size-8 rounded-full border-primary/20 hover:border-primary text-heading-light dark:text-heading-dark transition-all disabled:opacity-40 cursor-pointer"
                aria-label="Previous topics"
            >
                <ChevronLeft className="size-4" />
            </Button>
            <Button
                variant={ButtonVariant.OUTLINE}
                size={ButtonSize.ICON_XS}
                disabled={!canScrollNext}
                onClick={scrollNext}
                className="size-8 rounded-full border-primary/20 hover:border-primary text-heading-light dark:text-heading-dark transition-all disabled:opacity-40 cursor-pointer"
                aria-label="Next topics"
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
};

export const ModuleTopicsSection: React.FC<ModuleTopicsSectionProps> = ({
    topics,
    moduleSlug,
    isLoading = false,
}) => {
    const autoplayPlugin = useRef(
        Autoplay({ delay: 10000, stopOnInteraction: false, stopOnMouseEnter: true })
    );

    if (isLoading) {
        return (
            <div className="w-full space-y-3 sm:space-y-4 pt-2">
                <Carousel
                    options={{
                        align: 'start',
                        loop: true,
                    }}
                    plugins={[autoplayPlugin.current]}
                    className="w-full relative"
                >
                    <ModuleTopicsSliderHeader />
                    <div className="w-full relative">
                        <CarouselContent className="-ml-4 py-2">
                            {[1, 2, 3].map((idx) => (
                                <CarouselItem
                                    key={idx}
                                    className="pl-4 basis-full sm:basis-1/2 md:basis-full min-[840px]:basis-1/2 min-[1240px]:basis-1/3"
                                >
                                    <CategoryCardSkeleton index={idx - 1} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </div>
                    <ModuleTopicsSliderBottomNav />
                </Carousel>
            </div>
        );
    }

    if (!topics || topics.length === 0) {
        return null;
    }

    return (
        <div className="w-full space-y-3 sm:space-y-4 pt-2">
            <Carousel
                options={{
                    align: 'start',
                    loop: true,
                }}
                plugins={[autoplayPlugin.current]}
                className="w-full relative"
            >
                <ModuleTopicsSliderHeader />
                <div className="w-full relative">
                    <CarouselContent className="-ml-4 py-2">
                        {topics.map((topic, idx) => (
                            <CarouselItem
                                key={topic.id || topic.slug || idx}
                                className="pl-4 basis-full sm:basis-1/2 md:basis-full min-[840px]:basis-1/2 min-[1240px]:basis-1/3"
                            >
                                <CategoryCard
                                    data={{
                                        id: topic.id || `topic-${idx}`,
                                        title: topic.title,
                                        slug: topic.slug,
                                        href: `/modules/${moduleSlug}/${topic.slug}`,
                                        description: topic.description,
                                        level: topic.level,
                                        moduleSlug: moduleSlug,
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
                <ModuleTopicsSliderBottomNav />
            </Carousel>
        </div>
    );
};
