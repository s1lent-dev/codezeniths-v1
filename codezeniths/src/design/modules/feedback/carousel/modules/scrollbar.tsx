'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '@codezeniths/design/cn';
import { useCarouselContext } from '../core/CarouselProvider';
import { CarouselAxis } from '../core/types';

export const CarouselScrollbar: React.FC<{ draggable?: boolean, hide?: boolean, className?: string }> = ({ draggable = true, hide = false, className }) => {
  const { emblaApi, orientation } = useCarouselContext();
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress * 100);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll();
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onScroll);
    return () => {
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onScroll);
    };
  }, [emblaApi, onScroll]);

  if (hide) return null;

  const isHorizontal = orientation === CarouselAxis.HORIZONTAL;

  return (
    <div className={cn(
      "bg-secondary rounded-full relative overflow-hidden",
      isHorizontal ? "h-1 w-full" : "w-1 h-full",
      className
    )}>
      <div 
        className={cn(
          "bg-primary absolute top-0 left-0 transition-transform",
          isHorizontal ? "h-full w-1/4" : "w-full h-1/4"
        )}
        style={{
          transform: isHorizontal 
            ? `translate3d(${scrollProgress * 3}%, 0, 0)` 
            : `translate3d(0, ${scrollProgress * 3}%, 0)`
        }}
      />
    </div>
  );
};

export const ScrollbarModule: React.FC<{ options?: { draggable?: boolean, hide?: boolean } }> = ({ options }) => {
  return (
    <div className="absolute -bottom-8 left-0 right-0 px-12">
      <CarouselScrollbar draggable={options?.draggable} hide={options?.hide} />
    </div>
  );
};
