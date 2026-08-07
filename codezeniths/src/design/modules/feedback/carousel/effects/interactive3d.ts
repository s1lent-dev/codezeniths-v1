'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export interface Interactive3DEffectOptions {
  scale?: number;
  opacity?: number;
}

export function useInteractive3DEffect(emblaApi: EmblaCarouselType | undefined, options?: Interactive3DEffectOptions) {
  const tweenNodes = useRef<HTMLElement[]>([]);

  const config = {
    scale: options?.scale ?? 0.85,
    opacity: options?.opacity ?? 0.5,
  };

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.firstElementChild as HTMLElement;
    });
  }, []);

  const tweenInteractive3D = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();

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

        const tweenFactor = api.scrollSnapList().length;
        const slideProgress = diffToTarget * tweenFactor;
        const absProgress = Math.abs(slideProgress);
        const sign = Math.sign(slideProgress);

        // 1. Scale down inactive slides
        const scale = 1 - Math.min(absProgress, 2) * (1 - config.scale);
        
        // 2. Non-linear Translate X for accurate overlapping
        let desiredPosition = 0;
        if (absProgress <= 1) {
          // 0 to 1: Moves from 0% to 50% relative to center
          desiredPosition = absProgress * 55; 
        } else if (absProgress <= 2) {
          // 1 to 2: Moves from 55% to 85% relative to center
          desiredPosition = 55 + (absProgress - 1) * 30;
        } else {
          // 2 to 3: Moves from 85% to 100%
          desiredPosition = 85 + (absProgress - 2) * 15;
        }
        
        const nativePosition = absProgress * 100; // Embla's default CSS placement
        const translateX = (desiredPosition - nativePosition) * sign;

        // 3. 3D Perspective (translateZ and rotateY) for true 3D stacking
        const translateZ = -absProgress * 250; // Push each layer 250px deep into the Z-axis
        const rotateY = sign * Math.min(absProgress, 1.5) * -12; // Tilt cards inwards towards the center
        
        // 4. Opacity & Shadow fade for inactive
        const opacity = 1 - Math.min(absProgress, 2) * (1 - config.opacity);
        const isInactive = absProgress > 0.3;
        const shadow = isInactive ? '0 30px 60px -15px rgba(0, 0, 0, 0.95)' : 'none';

        const slideNode = api.slideNodes()[slideIndex];
        const tweenNode = tweenNodes.current[slideIndex];
        
        if (tweenNode && slideNode) {
          // IMPORTANT: Apply translateZ to fix Z-fighting ("seeing through") and enable real 3D!
          tweenNode.style.transform = `translate3d(${translateX}%, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
          tweenNode.style.opacity = opacity.toString();
          tweenNode.style.boxShadow = shadow;
          
          // Z-index MUST be applied to the outer slide container (CarouselItem) 
          // because it creates a new stacking context via transform-gpu.
          const zIndex = 100 - Math.round(absProgress * 10);
          slideNode.style.zIndex = zIndex.toString();
        }
      });
    });
  }, [config]);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    tweenInteractive3D(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenInteractive3D)
      .on('scroll', tweenInteractive3D)
      .on('slideFocus', tweenInteractive3D)
      .on('settle', tweenInteractive3D);
  }, [emblaApi, setTweenNodes, tweenInteractive3D]);
}
