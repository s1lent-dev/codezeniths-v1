'use client';
import useReactEmblaCarousel from 'embla-carousel-react';
import type { EmblaOptionsType, EmblaPluginType, EmblaCarouselType } from 'embla-carousel';
import { useState, useEffect, useCallback } from 'react';

export function useEmblaCarousel(
  options?: EmblaOptionsType,
  plugins?: EmblaPluginType[]
) {
  const [emblaRef, emblaApi] = useReactEmblaCarousel(options, plugins);
  const [isReady, setIsReady] = useState(false);

  const onInit = useCallback(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    // If it's already initialized (though usually we catch it via event)
    setIsReady(true);
    
    emblaApi.on('init', onInit);
    emblaApi.on('reInit', onInit);
    
    return () => {
      emblaApi.off('init', onInit);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi, onInit]);

  return {
    emblaRef,
    emblaApi,
    isReady,
  };
}
