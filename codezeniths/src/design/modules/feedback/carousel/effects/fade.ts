'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export function useFadeEffect(emblaApi: EmblaCarouselType | undefined) {
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.firstElementChild as HTMLElement;
    });
  }, []);

  const tweenFade = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
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

        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          const pixelDistance = diffToTarget * scrollableDistance;
          const size = tweenNode.offsetWidth;
          
          // Calculate purely physical progress to avoid gap snapping issues
          const slideProgress = pixelDistance / size;
          
          // 1. Stack all slides at exactly the viewport center by negating their physical scroll offset
          const translateX = -pixelDistance;
          
          // 2. Calculate crossfade opacity
          // When progress is 0 (active), opacity is 1. When progress is 1 (inactive), opacity is 0.
          const opacity = Math.max(0, 1 - Math.abs(slideProgress));
          
          // 3. Keep active slide on top
          const zIndex = 100 - Math.round(Math.abs(slideProgress) * 10);

          tweenNode.style.transform = `translate3d(${translateX}px, 0, 0)`;
          tweenNode.style.opacity = opacity.toString();
          tweenNode.style.zIndex = zIndex.toString();
          
          // Performance optimization: hide invisible slides
          if (opacity === 0) {
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
    tweenFade(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenFade)
      .on('scroll', tweenFade)
      .on('slideFocus', tweenFade);
  }, [emblaApi, setTweenNodes, tweenFade]);
}
