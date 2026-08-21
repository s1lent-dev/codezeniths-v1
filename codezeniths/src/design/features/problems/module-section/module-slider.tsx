'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { ModuleItem } from './useModules';
import { ModuleCard } from './module-card';
import { ModuleSliderSkeleton } from './module-slider-skeleton';

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
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            align: 'start',
            loop: true,
            slidesToScroll: 1,
        },
        [
            Autoplay({
                delay: 10000,
                stopOnInteraction: false,
            }),
        ]
    );

    const [canScrollPrev, setCanScrollPrev] = useState(true);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    if (isLoading) {
        return <ModuleSliderSkeleton className={className} />;
    }

    if (!modules || modules.length === 0) return null;

    return (
        <div className={cn('relative w-full max-w-full min-w-0 group/slider', className)}>
            {/* Left Navigation Arrow — fully visible inside slider bounds */}
            <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Previous modules"
                className={cn(
                    'absolute left-1 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark transition-all cursor-pointer',
                    canScrollPrev ? 'hover:text-heading-light dark:hover:text-heading-dark hover:border-primary opacity-90 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                )}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Embla Carousel Viewport — 2 slides per view */}
            <div className="overflow-hidden w-full min-w-0 max-w-full rounded-sm p-2" ref={emblaRef}>
                <div className="flex -ml-4 touch-pan-y select-none">
                    {modules.map((module, index) => (
                        <div key={module.id} className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_50%] min-w-0 pl-4">
                            <ModuleCard module={module} index={index} onSolve={onSolve} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Navigation Arrow — fully visible inside slider bounds */}
            <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Next modules"
                className={cn(
                    'absolute right-1 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark transition-all cursor-pointer',
                    canScrollNext ? 'hover:text-heading-light dark:hover:text-heading-dark hover:border-primary opacity-90 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                )}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};
