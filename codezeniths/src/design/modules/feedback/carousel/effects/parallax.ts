'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType, EmblaEventListType } from 'embla-carousel';

const TWEEN_FACTOR_BASE = 0.2;

export function useParallaxEffect(emblaApi: EmblaCarouselType | undefined) {
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    // Target the parallax layer inside the bounding box
    // Expected structure: CarouselItem > [Bounding Box with overflow-hidden] > [Parallax Layer]
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      // Look for a specific data attribute first, otherwise assume the second-level child
      const explicitLayer = slideNode.querySelector('[data-parallax-layer]') as HTMLElement;
      if (explicitLayer) return explicitLayer;
      
      const boundingBox = slideNode.firstElementChild as HTMLElement;
      return boundingBox?.firstElementChild as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback(
    (
      api: EmblaCarouselType,
      eventName?: string
    ) => {
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
      const slidesInView = api.slidesInView();
      const isScrollEvent = eventName === 'scroll';

      api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];
          if (tweenNode) {
            tweenNode.style.transform = `translateX(${translate}%)`;
          }
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax);
  }, [emblaApi, tweenParallax, setTweenNodes, setTweenFactor]);
}
