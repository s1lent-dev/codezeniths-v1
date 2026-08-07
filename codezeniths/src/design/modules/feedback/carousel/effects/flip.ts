'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export function useFlipEffect(emblaApi: EmblaCarouselType | undefined) {
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    // Target the inner container of each slide
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.firstElementChild as HTMLElement;
    });
  }, []);

  const tweenFlip = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    
    // Total slides to normalize to Swiper's slide-relative progress
    const tweenFactor = api.scrollSnapList().length;
    // Total scrollable width in pixels to stack slides perfectly
    const scrollableDistance = engine.limit.length;

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

        const slideProgress = diffToTarget * tweenFactor;
        const pixelDistance = diffToTarget * scrollableDistance;

        // Flip math matching Swiper:
        const rotateY = -slideProgress * 180;
        
        // Stack the slides by negating their physical offset from the active center
        const translateX = -pixelDistance;
        
        const zIndex = 100 - Math.round(Math.abs(slideProgress));

        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          tweenNode.style.transform = `translate3d(${translateX}px, 0, 0) rotateY(${rotateY}deg)`;
          tweenNode.style.zIndex = zIndex.toString();
          
          // Hide backface manually like Swiper
          if (Math.abs(slideProgress) > 0.5) {
            tweenNode.style.visibility = 'hidden';
          } else {
            tweenNode.style.visibility = 'visible';
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    tweenFlip(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenFlip)
      .on('scroll', tweenFlip)
      .on('slideFocus', tweenFlip);
  }, [emblaApi, setTweenNodes, tweenFlip]);
}
