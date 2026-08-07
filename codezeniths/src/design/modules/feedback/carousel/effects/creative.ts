'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export interface CreativeEffectTransform {
  translate?: [string | number, string | number, string | number];
  rotate?: [number, number, number];
  scale?: number;
  opacity?: number;
  origin?: string;
  shadow?: boolean;
}

export interface CreativeEffectConfig {
  prev?: CreativeEffectTransform;
  next?: CreativeEffectTransform;
  limitProgress?: number;
}

const defaultConfig: Required<CreativeEffectConfig> = {
  limitProgress: 1,
  prev: { translate: [0, 0, 0], rotate: [0, 0, 0], scale: 1, opacity: 1 },
  next: { translate: [0, 0, 0], rotate: [0, 0, 0], scale: 1, opacity: 1 }
};

const interpolateValue = (progress: number, start: number, end: string | number | undefined, size: number): number => {
  if (end === undefined) return start;
  const parseEnd = typeof end === 'string' && end.endsWith('%') ? parseFloat(end) * size / 100 : Number(end);
  return start + progress * (parseEnd - start);
};

export function useCreativeEffect(emblaApi: EmblaCarouselType | undefined, options?: CreativeEffectConfig) {
  const tweenNodes = useRef<HTMLElement[]>([]);

  const config = {
    limitProgress: options?.limitProgress ?? defaultConfig.limitProgress,
    prev: { ...defaultConfig.prev, ...options?.prev },
    next: { ...defaultConfig.next, ...options?.next },
  };

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.firstElementChild as HTMLElement;
    });
  }, []);

  const tweenCreative = useCallback((api: EmblaCarouselType) => {
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
          
          let slideProgress = pixelDistance / size;
          // Apply limit
          const absProgress = Math.min(Math.abs(slideProgress), config.limitProgress);
          
          const currentConfig = slideProgress < 0 ? config.prev : config.next;

          // 1. Stack all slides at viewport center
          const ox = -pixelDistance;
          
          // 2. Interpolate user transforms
          const tx = interpolateValue(absProgress, 0, currentConfig.translate?.[0], size);
          const ty = interpolateValue(absProgress, 0, currentConfig.translate?.[1], size);
          const tz = interpolateValue(absProgress, 0, currentConfig.translate?.[2], size);
          
          const rx = interpolateValue(absProgress, 0, currentConfig.rotate?.[0], size);
          const ry = interpolateValue(absProgress, 0, currentConfig.rotate?.[1], size);
          const rz = interpolateValue(absProgress, 0, currentConfig.rotate?.[2], size);
          
          const scale = interpolateValue(absProgress, 1, currentConfig.scale, size);
          const opacity = interpolateValue(absProgress, 1, currentConfig.opacity, size);

          tweenNode.style.transform = `translate3d(${ox + tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
          tweenNode.style.opacity = opacity.toString();
          
          if (currentConfig.origin) {
            tweenNode.style.transformOrigin = currentConfig.origin;
          } else {
            tweenNode.style.transformOrigin = '50% 50%';
          }
          
          // Z-index calculation to mimic Swiper depth
          tweenNode.style.zIndex = (100 - Math.round(Math.abs(slideProgress) * 10)).toString();
          
          // Slide shadows
          if (currentConfig.shadow) {
            const brightness = 1 - absProgress * 0.5;
            tweenNode.style.filter = `brightness(${brightness})`;
          } else {
            tweenNode.style.filter = '';
          }

          // Hide slides beyond limitProgress to prevent stacked Z-fighting and overflowing artifacts
          if (Math.abs(slideProgress) > config.limitProgress) {
            tweenNode.style.visibility = 'hidden';
          } else {
            tweenNode.style.visibility = 'visible';
          }
        }
      });
    });
  }, [config]);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    tweenCreative(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenCreative)
      .on('scroll', tweenCreative)
      .on('slideFocus', tweenCreative);
  }, [emblaApi, setTweenNodes, tweenCreative]);
}
