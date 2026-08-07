'use client';
import { useState, useCallback, useEffect } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';
import { useCarouselContext } from '../core/CarouselProvider';

export function useProgressTracker() {
  const { emblaApi, isReady } = useCarouselContext();
  const [slideProgresses, setSlideProgresses] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress();
    const slideNodes = emblaApi.slideNodes();
    
    // We compute the offset of each slide relative to the current scroll position
    const newProgresses = slideNodes.map((_: HTMLElement, index: number) => {
      // In Embla, we can calculate per-slide progress using engine internal math or approximation
      // A common approach for custom effects:
      const scrollProgress = emblaApi.scrollProgress();
      const slidePosition = emblaApi.scrollSnapList()[index] || 0;
      
      return scrollProgress - slidePosition;
    });
    
    setSlideProgresses(newProgresses);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !isReady) return;
    
    onScroll();
    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onScroll);
    
    return () => {
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onScroll);
    };
  }, [emblaApi, isReady, onScroll]);

  return { slideProgresses };
}
