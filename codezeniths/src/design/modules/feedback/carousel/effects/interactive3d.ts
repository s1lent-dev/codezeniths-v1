'use client';
import { useCallback, useEffect } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export interface Interactive3DEffectOptions {
  scale?: number;
  opacity?: number;
}

export function useInteractive3DEffect(emblaApi: EmblaCarouselType | undefined, options?: Interactive3DEffectOptions) {
  const config = {
    scale: options?.scale ?? 0.85,
    opacity: options?.opacity ?? 0.5,
  };

  const tweenInteractive3D = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex: number) => {
        // Scoped diffToTarget per slide
        let diffToTarget = scrollSnap - scrollProgress;

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

        const tweenFactor = api.scrollSnapList().length;
        const slideProgress = diffToTarget * tweenFactor;
        let absProgress = Math.abs(slideProgress);
        let sign = Math.sign(slideProgress);

        // Snap near-zero progress to exact 0 to eliminate floating point precision artifacts (e.g. -1.17e-5)
        if (absProgress < 0.005) {
          absProgress = 0;
          sign = 0;
        }

        // 1. Scale down inactive slides
        const scale = absProgress === 0 ? 1 : (1 - Math.min(absProgress, 2) * (1 - config.scale));
        
        // 2. Non-linear Translate X for accurate overlapping
        let desiredPosition = 0;
        if (absProgress <= 1) {
          desiredPosition = absProgress * 55; 
        } else if (absProgress <= 2) {
          desiredPosition = 55 + (absProgress - 1) * 30;
        } else {
          desiredPosition = 85 + (absProgress - 2) * 15;
        }
        
        const nativePosition = absProgress * 100;
        const translateX = absProgress === 0 ? 0 : (desiredPosition - nativePosition) * sign;

        // 3. 3D Perspective (translateZ and rotateY)
        const translateZ = absProgress === 0 ? 0 : -absProgress * 250;
        const rotateY = absProgress === 0 ? 0 : -sign * Math.min(absProgress, 1.5) * 12;
        
        // 4. Opacity & Shadow fade for inactive
        const opacity = absProgress === 0 ? 1 : (1 - Math.min(absProgress, 2) * (1 - config.opacity));
        const isInactive = absProgress > 0.3;
        const shadow = isInactive ? '0 30px 60px -15px rgba(0, 0, 0, 0.95)' : 'none';

        const slideNode = api.slideNodes()[slideIndex];
        const tweenNode = slideNode ? (slideNode.firstElementChild as HTMLElement) : null;
        
        if (slideNode) {
          // Highest zIndex (100) for active slide, lower for side slides
          const zIndex = absProgress === 0 ? 100 : Math.max(1, Math.round(100 - absProgress * 10));
          slideNode.style.zIndex = zIndex.toString();

          // CRITICAL: Side slides (isInactive) get pointer-events: none so they do not block active center slide
          if (isInactive) {
            slideNode.style.pointerEvents = 'none';
          } else {
            slideNode.style.pointerEvents = 'auto';
          }

          if (tweenNode) {
            tweenNode.style.transform = `translate3d(${translateX}%, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
            tweenNode.style.opacity = opacity.toString();
            tweenNode.style.boxShadow = shadow;

            if (isInactive) {
              tweenNode.style.pointerEvents = 'none';
            } else {
              tweenNode.style.pointerEvents = 'auto';
            }
          }
        }
      });
    });
  }, [config]);

  useEffect(() => {
    if (!emblaApi) return;

    tweenInteractive3D(emblaApi);

    emblaApi
      .on('reInit', tweenInteractive3D)
      .on('scroll', tweenInteractive3D)
      .on('slideFocus', tweenInteractive3D)
      .on('settle', tweenInteractive3D)
      .on('select', tweenInteractive3D);

    return () => {
      emblaApi
        .off('reInit', tweenInteractive3D)
        .off('scroll', tweenInteractive3D)
        .off('slideFocus', tweenInteractive3D)
        .off('settle', tweenInteractive3D)
        .off('select', tweenInteractive3D);
    };
  }, [emblaApi, tweenInteractive3D]);
}
