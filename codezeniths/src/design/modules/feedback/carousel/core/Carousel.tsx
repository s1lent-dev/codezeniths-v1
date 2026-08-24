'use client';
import React, { forwardRef, useCallback } from 'react';
import { cn } from '@codezeniths/design/cn';
import { useEmblaCarousel } from './useEmblaCarousel';
import { CarouselProvider, useCarouselContext } from './CarouselProvider';
import { carouselVariants, carouselContentVariants, carouselTrackVariants, carouselSlideVariants } from './variants';
import { CarouselAxis, CarouselEffect } from './types';
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import { EffectsController } from '../effects/EffectsController';

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  orientation?: CarouselAxis;
  effect?: CarouselEffect;
  effectOptions?: any;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      options,
      plugins,
      orientation = CarouselAxis.HORIZONTAL,
      effect = CarouselEffect.NONE,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // For now, mapping orientation to Embla axis
    const emblaOpts: EmblaOptionsType = {
      ...options,
      axis: orientation === CarouselAxis.VERTICAL ? 'y' : 'x',
    };

    const { emblaRef, emblaApi, isReady } = useEmblaCarousel(emblaOpts, plugins);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          emblaApi?.scrollPrev();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          emblaApi?.scrollNext();
        }
      },
      [emblaApi]
    );

    return (
      <CarouselProvider
        emblaRef={emblaRef}
        emblaApi={emblaApi}
        isReady={isReady}
        orientation={orientation}
        loop={!!emblaOpts.loop}
        activePlugins={[]}
        activeModules={[]}
        activeEffect={effect}
        effectOptions={props.effectOptions}
      >
        <EffectsController />
        <div
          ref={ref}
          className={cn(carouselVariants({ axis: orientation }), className)}
          role="region"
          aria-roledescription="carousel"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          data-slot="carousel"
          data-axis={orientation}
          data-effect={effect}
          {...props}
        >
          {children}
        </div>
      </CarouselProvider>
    );
  }
);
Carousel.displayName = 'Carousel';

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, viewportClassName, ...props }, ref) => {
    const { emblaRef, orientation, activeEffect } = useCarouselContext();

    return (
      <div 
        ref={emblaRef} 
        className={cn(carouselContentVariants({ effect: activeEffect }), 'w-full min-w-0 max-w-full', viewportClassName)}
        data-slot="carousel-viewport"
      >
        <div
          ref={ref}
          className={cn(carouselTrackVariants({ axis: orientation, effect: activeEffect }), className)}
          data-slot="carousel-content"
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation, activeEffect } = useCarouselContext();

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cn(carouselSlideVariants({ axis: orientation, effect: activeEffect }), className)}
        data-slot="carousel-item"
        {...props}
      />
    );
  }
);
CarouselItem.displayName = 'CarouselItem';
