'use client';

import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselEffect,
} from '@codezeniths/design/modules/feedback/carousel';
import {
    CarouselPrevious,
    CarouselNext,
} from '@codezeniths/design/modules/feedback/carousel/modules/navigation';
import { CarouselPagination } from '@codezeniths/design/modules/feedback/carousel/modules/pagination';
import Autoplay from 'embla-carousel-autoplay';
import { ModuleCard } from './module-card';
import { ModuleSliderSkeleton } from './module-slider-skeleton';
import { ModuleItem } from '../useModulesSection';
import { cn } from '@codezeniths/design/cn';

export interface ModuleSliderProps {
    modules: ModuleItem[];
    isLoading?: boolean;
    onSolve?: (slug: string) => void;
    className?: string;
}

export const ModuleSlider: React.FC<ModuleSliderProps> = ({
    modules,
    isLoading = false,
    onSolve,
    className,
}) => {
    const autoplayPlugin = React.useMemo(
        () => Autoplay({ delay: 10000, stopOnInteraction: false }),
        []
    );

    if (isLoading) {
        return <ModuleSliderSkeleton className={className} />;
    }

    if (!modules || modules.length === 0) {
        return (
            <div className="w-full flex items-center justify-center h-[280px] text-muted-light dark:text-muted-dark border border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade3 rounded-3xl">
                <span>No modules available at the moment.</span>
            </div>
        );
    }

    return (
        <div className={cn('relative w-full py-4 select-none', className)}>
            <Carousel
                effect={CarouselEffect.INTERACTIVE3D}
                options={{ loop: true, align: 'center' }}
                plugins={[autoplayPlugin]}
                className="w-full relative z-10"
            >
                <CarouselContent className="h-[300px] xs:h-[310px] sm:h-[330px] md:h-[340px] lg:h-[360px] 2xl:h-[380px] items-center">
                    {modules.map((module, index) => (
                        <CarouselItem
                            key={module.id || module.slug || index}
                            className="basis-[84vw] max-w-[320px] xs:basis-[340px] xs:max-w-none sm:basis-[380px] md:basis-[410px] lg:basis-[480px] xl:basis-[530px] 2xl:basis-[580px] transform-gpu flex justify-center items-center shrink-0"
                        >
                            <div className="interactive-3d-wrapper will-change-transform transform-gpu flex justify-center items-center w-full h-[270px] xs:h-[280px] sm:h-[295px] md:h-[305px] lg:h-[320px] 2xl:h-[340px] rounded-2xl sm:rounded-3xl">
                                <ModuleCard module={module} index={index} onSolve={onSolve} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Left / Right Arrow Controls */}
                <div className="hidden sm:flex items-center justify-between absolute inset-x-4 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                    <CarouselPrevious className="pointer-events-auto relative left-0 top-0 translate-y-0 size-11 rounded-full bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark hover:bg-primary/15 dark:hover:bg-primary/15 hover:text-primary/75 border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40 shadow-md transition-all cursor-pointer" />
                    <CarouselNext className="pointer-events-auto relative right-0 top-0 translate-y-0 size-11 rounded-full bg-foreground-light dark:bg-foreground-dark text-heading-light dark:text-heading-dark hover:bg-primary/15 dark:hover:bg-primary/15 hover:text-primary/75 border-foreground-light-shade3/40 dark:border-foreground-dark-shade3/40 shadow-md transition-all cursor-pointer" />
                </div>

                {/* Pagination Dots */}
                <div className="pt-4 flex justify-center">
                    <CarouselPagination type="bullets" clickable className="gap-2" />
                </div>
            </Carousel>
        </div>
    );
};
