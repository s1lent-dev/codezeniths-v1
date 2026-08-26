'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import { Button, ButtonVariant } from '@codezeniths/components';
import { Carousel, CarouselContent, CarouselItem } from '@codezeniths/modules';
import AutoScroll from 'embla-carousel-auto-scroll';
import { animate } from 'motion';
import { Layers } from 'lucide-react';
import { moduleQueryService } from '@/lib/tanstack/services/module.query-service';
import { TagsQuickTabsSkeleton } from './tags-quick-tabs-skeleton';

export interface TagsQuickTabsProps {
    selectedModuleSlug?: string;
    onSelectModuleSlug: (slug?: string) => void;
}

const NORMAL_SPEED = 1.2;
const HOVER_SPEED = 0.35;

export const TagsQuickTabs: React.FC<TagsQuickTabsProps> = ({
    selectedModuleSlug,
    onSelectModuleSlug,
}) => {
    const { data: modules, isLoading } = moduleQueryService.getModules();

    // Mutable ref holding the live animated speed
    const speedRef = useRef(NORMAL_SPEED);

    // Dynamic speed object with valueOf() to allow Embla AutoScroll seek() to read speedRef live on every frame
    const speedObj = useMemo(
        () => ({
            valueOf: () => speedRef.current,
        }),
        []
    );

    const autoScrollPlugin = useRef(
        AutoScroll({
            speed: speedObj as unknown as number,
            stopOnInteraction: false,
            stopOnMouseEnter: false,
            startDelay: 500,
        })
    );

    const animControlsRef = useRef<ReturnType<typeof animate> | null>(null);

    const setSpeedSmoothly = useCallback((targetSpeed: number) => {
        if (animControlsRef.current) {
            animControlsRef.current.stop();
        }

        animControlsRef.current = animate(speedRef.current, targetSpeed, {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier easing
            onUpdate: (latestSpeed) => {
                speedRef.current = latestSpeed;
            },
        });
    }, []);

    const handleMouseEnter = useCallback(() => {
        setSpeedSmoothly(HOVER_SPEED);
    }, [setSpeedSmoothly]);

    const handleMouseLeave = useCallback(() => {
        setSpeedSmoothly(NORMAL_SPEED);
    }, [setSpeedSmoothly]);

    if (isLoading) {
        return <TagsQuickTabsSkeleton />;
    }

    const badgeClass = (active: boolean) =>
        `inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
            active
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-body-light-shade3 dark:text-body-dark border-foreground-light-shade3/40 dark:border-foreground-dark-shade1/40 hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2'
        }`;

    return (
        <div className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-4 shadow-xs space-y-3 overflow-hidden relative">
            {/* Header: Subtle module filter heading */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                    <Layers className="size-3.5 text-primary" />
                    <span>Filter Tags by Module</span>
                </div>
                {selectedModuleSlug && (
                    <Button
                        type="button"
                        variant={ButtonVariant.GHOST}
                        onClick={() => onSelectModuleSlug(undefined)}
                        className="text-xs text-primary hover:underline p-0 h-auto font-medium cursor-pointer"
                    >
                        View All
                    </Button>
                )}
            </div>

            {/* Carousel — smooth motion slowdown on hover */}
            <div
                className="w-full relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Carousel
                    key={`loaded-${modules?.length ?? 0}`}
                    options={{ loop: true, align: 'start', dragFree: true }}
                    plugins={[autoScrollPlugin.current]}
                    className="w-full"
                >
                    <CarouselContent className="flex items-center ml-0">
                        {/* All Modules / Reset Option */}
                        <CarouselItem className="pl-2 basis-auto">
                            <button
                                type="button"
                                onClick={() => onSelectModuleSlug(undefined)}
                                className={badgeClass(selectedModuleSlug === undefined)}
                            >
                                <Layers className="size-3.5" />
                                <span>All Modules</span>
                            </button>
                        </CarouselItem>

                        {/* Module badges */}
                        {modules?.map((m) => (
                            <CarouselItem key={m.id} className="pl-2 basis-auto">
                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectModuleSlug(
                                            selectedModuleSlug === m.slug ? undefined : m.slug
                                        )
                                    }
                                    className={badgeClass(selectedModuleSlug === m.slug)}
                                >
                                    <span>{m.title}</span>
                                </button>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Edge fade masks */}
                <div className="absolute inset-y-0 left-0 w-6 bg-linear-to-r from-foreground-light dark:from-foreground-dark to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-6 bg-linear-to-l from-foreground-light dark:from-foreground-dark to-transparent z-10 pointer-events-none" />
            </div>
        </div>
    );
};
