'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

interface ParallaxNode {
  element: HTMLElement;
  originalValue: string;
  isPercentage: boolean;
  numericValue: number;
}

export function useMonoParallaxEffect(emblaApi: EmblaCarouselType | undefined) {
  const slideLayers = useRef<ParallaxNode[][]>([]);
  const globalLayers = useRef<ParallaxNode[]>([]);

  const parseParallaxValue = (el: HTMLElement): ParallaxNode => {
    const val = el.getAttribute('data-parallax') || '0';
    return {
      element: el,
      originalValue: val,
      isPercentage: val.includes('%'),
      numericValue: parseFloat(val),
    };
  };

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    // 1. Find all parallax elements inside each slide
    slideLayers.current = api.slideNodes().map((slideNode) => {
      const nodes = Array.from(slideNode.querySelectorAll<HTMLElement>('[data-parallax]'));
      return nodes.map(parseParallaxValue);
    });

    // 2. Find global parallax background elements (siblings to the viewport or container)
    const carouselNode = api.rootNode().closest('[data-slot="carousel"]');
    const globals = Array.from(carouselNode?.querySelectorAll<HTMLElement>('[data-global-parallax]') || []);
    globalLayers.current = globals.map((el) => {
      const val = el.getAttribute('data-global-parallax') || '0';
      return {
        element: el,
        originalValue: val,
        isPercentage: val.includes('%'),
        numericValue: parseFloat(val),
      };
    });
  }, []);

  const tweenParallax = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();

    // 1. Global Parallax (Backgrounds)
    globalLayers.current.forEach((node) => {
      const translate = scrollProgress * node.numericValue;
      node.element.style.transform = `translate3d(${translate}${node.isPercentage ? '%' : 'px'}, 0, 0)`;
    });

    // 2. Per-Slide Parallax
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

        const layers = slideLayers.current[slideIndex];
        if (layers) {
          layers.forEach((node) => {
            // diffToTarget is global progress offset, multiply by length to get slide offset
            // We multiply by -1 because if a slide is to the right (positive diff), 
            // a negative parallax value means it should lag behind (be pushed further right, so positive translate)
            const slideProgress = diffToTarget * tweenFactor;
            const translate = -1 * slideProgress * node.numericValue;
            node.element.style.transform = `translate3d(${translate}${node.isPercentage ? '%' : 'px'}, 0, 0)`;
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax);
  }, [emblaApi, tweenParallax, setTweenNodes]);
}
