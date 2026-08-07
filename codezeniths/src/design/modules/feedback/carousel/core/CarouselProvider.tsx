'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';
import type { CarouselOptions, CarouselEffect, CarouselAxis } from './types';

export interface CarouselContextValue {
  emblaRef: (node: HTMLElement | null) => void;
  emblaApi: EmblaCarouselType | undefined;
  isReady: boolean;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  scrollSnapCount: number;
  orientation: CarouselAxis;
  loop: boolean;
  activePlugins: string[];
  activeModules: string[];
  activeEffect: CarouselEffect;
  effectOptions?: any;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollTo: (index: number, jump?: boolean) => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

export function useCarouselContext() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarouselContext must be used within a <CarouselProvider />');
  }
  return context;
}

interface CarouselProviderProps {
  children: React.ReactNode;
  emblaRef: (node: HTMLElement | null) => void;
  emblaApi: EmblaCarouselType | undefined;
  isReady: boolean;
  orientation: CarouselAxis;
  loop: boolean;
  activePlugins: string[];
  activeModules: string[];
  activeEffect: CarouselEffect;
  effectOptions?: any;
}

export const CarouselProvider: React.FC<CarouselProviderProps> = ({
  children,
  emblaRef,
  emblaApi,
  isReady,
  orientation,
  loop,
  activePlugins,
  activeModules,
  activeEffect,
  effectOptions,
}) => {
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnapCount, setScrollSnapCount] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnapCount(api.scrollSnapList().length);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect(emblaApi);
    onInit(emblaApi);
    
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('init', onInit);
    emblaApi.on('reInit', onInit);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('init', onInit);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi, onSelect, onInit]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number, jump?: boolean) => {
    emblaApi?.scrollTo(index, jump);
  }, [emblaApi]);

  return (
    <CarouselContext.Provider
      value={{
        emblaRef,
        emblaApi,
        isReady,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        scrollSnapCount,
        orientation,
        loop,
        activePlugins,
        activeModules,
        activeEffect,
        effectOptions,
        scrollPrev,
        scrollNext,
        scrollTo,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};
