'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export interface WheelEffectOptions {
  radius?: number;
  tiltSensitivity?: number;
  autospinSpeed?: number; 
}

export function useWheelEffect(emblaApi: EmblaCarouselType | undefined, options?: WheelEffectOptions) {
  const tweenNodes = useRef<HTMLElement[]>([]);
  const containerRef = useRef<HTMLElement | null>(null);
  const tiltRef = useRef<number>(0);
  
  const config = {
    radius: options?.radius ?? 240,
    tiltSensitivity: options?.tiltSensitivity ?? 10,
  };

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    containerRef.current = api.containerNode();
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.firstElementChild as HTMLElement;
    });
  }, []);

  const tweenWheel = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const scrollableDistance = engine.limit.length;
    const slideCount = api.slideNodes().length;
    
    const anglePerSlide = 360 / slideCount;

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

        // Total slides in the carousel determines the tween factor
        const tweenFactor = api.scrollSnapList().length;
        const slideProgress = diffToTarget * tweenFactor;
        
        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          const pixelDistance = diffToTarget * scrollableDistance;
          
          // 1. Stack all slides at exactly the viewport center
          const translateX = -pixelDistance;
          
          // 2. Rotate them based on their distance from the active center
          const rotateY = slideProgress * anglePerSlide;
          
          tweenNode.style.transform = `translate3d(${translateX}px, 0, 0) rotateX(${tiltRef.current}deg) rotateY(${rotateY}deg) translateZ(${config.radius}px)`;
          
          // Hide backfaces to match Sera UI
          tweenNode.style.backfaceVisibility = 'hidden';
          
          // Optional Z-index based on proximity to front
          const zIndex = 100 - Math.round(Math.abs(slideProgress) * 10);
          tweenNode.style.zIndex = zIndex.toString();
        }
      });
    });
  }, [config.radius]);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    tweenWheel(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenWheel)
      .on('scroll', tweenWheel)
      .on('slideFocus', tweenWheel);
      
    // Tilt effect on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseY = e.clientY - rect.top;
      const normalizedY = (mouseY / rect.height - 0.5) * 2;
      tiltRef.current = -normalizedY * config.tiltSensitivity;
      
      // Force an update to apply the new tilt
      tweenWheel(emblaApi);
    };
    
    // Smooth reset on mouse leave
    const handleMouseLeave = () => {
      tiltRef.current = 0;
      tweenWheel(emblaApi);
    };

    window.addEventListener('mousemove', handleMouseMove);
    containerRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [emblaApi, setTweenNodes, tweenWheel, config.tiltSensitivity]);
}
