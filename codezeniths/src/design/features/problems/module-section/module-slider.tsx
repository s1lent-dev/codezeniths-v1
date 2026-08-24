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
        <div className={cn('relative flex items-center gap-1.5 sm:gap-2.5 w-full max-w-full min-w-0 group/slider select-none', className)}>
            {/* Left Navigation Arrow */}
            <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                aria-label="Previous modules"
                className={cn(
                    'shrink-0 size-7 sm:size-7.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark transition-all cursor-pointer z-10',
                    canScrollPrev ? 'hover:text-heading-light dark:hover:text-heading-dark hover:border-primary opacity-90 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                )}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Embla Carousel Viewport — Contained between both navigation buttons */}
            <div className="overflow-hidden flex-1 min-w-0 w-0 max-w-full rounded-sm py-1" ref={emblaRef}>
                <div className="flex -ml-2 sm:-ml-3 touch-pan-y">
                    {modules.map((module, index) => (
                        <div
                            key={module.id}
                            className="min-w-0 shrink-0 pl-2 sm:pl-3 module-slide-basis max-w-full"
                        >
                            <ModuleCard module={module} index={index} onSolve={onSolve} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Navigation Arrow */}
            <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                aria-label="Next modules"
                className={cn(
                    'shrink-0 size-7 sm:size-7.5 rounded-full bg-background-light dark:bg-background-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade3 shadow-md flex items-center justify-center text-muted-light dark:text-muted-dark transition-all cursor-pointer z-10',
                    canScrollNext ? 'hover:text-heading-light dark:hover:text-heading-dark hover:border-primary opacity-90 hover:opacity-100' : 'opacity-30 cursor-not-allowed'
                )}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};
