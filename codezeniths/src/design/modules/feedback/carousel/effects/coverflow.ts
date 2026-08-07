'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export function useCoverflowEffect(emblaApi: EmblaCarouselType | undefined) {
  const tweenNodes = useRef<HTMLElement[]>([]);

  // Coverflow configuration (matching Swiper defaults)
  const rotate = 50;
  const stretch = 0;
  const depth = 100;
  const modifier = 1;

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    // Target the inner container of each slide
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.firstElementChild as HTMLElement;
    });
  }, []);

  const tweenCoverflow = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    
    // To normalize Embla's global progress into Swiper's slide-relative progress
    const tweenFactor = api.scrollSnapList().length;

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex: number) => {
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        // slideProgress is exactly how many slides away this slide is from the active center.
        // 0 = active, 1 = next, -1 = prev
        const slideProgress = diffToTarget * tweenFactor;

        // Swiper Coverflow Math
        const rotateY = slideProgress * rotate * modifier;
        const translateZ = -Math.abs(slideProgress * depth * modifier);
        const translateX = slideProgress * stretch * modifier;
        
        // Z-index ensures the active slide is always on top
        const zIndex = Math.round(100 - Math.abs(slideProgress) * 10);

        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          tweenNode.style.transform = `translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg)`;
          tweenNode.style.zIndex = zIndex.toString();
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    tweenCoverflow(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenCoverflow)
      .on('scroll', tweenCoverflow)
      .on('slideFocus', tweenCoverflow);
  }, [emblaApi, setTweenNodes, tweenCoverflow]);
}
