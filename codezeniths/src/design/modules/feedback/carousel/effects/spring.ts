'use client';
import { useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';
import { useMotionValue, useSpring } from 'motion/react';

export interface SpringEffectOptions {
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
  duration?: number;
}

export function useSpringEffect(emblaApi: EmblaCarouselType | undefined, options?: SpringEffectOptions) {
  const isDragging = useRef(false);
  const prevTarget = useRef(0);
  
  // Motion value representing the target position
  const target = useMotionValue(0);
  
  // If exact physics are provided, use them. Otherwise, default to exactly what the reference video shows:
  // critically damped (bounce: 0) and taking ~650ms (duration: 650) for a single slide transition.
  const springConfig = options?.stiffness 
    ? { stiffness: options.stiffness, damping: options.damping ?? 22, mass: options.mass ?? 1 }
    : { bounce: options?.bounce ?? 0, duration: options?.duration ?? 650 };

  const spring = useSpring(target, springConfig);

  useEffect(() => {
    if (!emblaApi) return;
    
    const engine = emblaApi.internalEngine();
    const container = emblaApi.containerNode();
    
    // Disable native translate to prevent DOM fighting.
    // We will apply the transform manually in our spring subscriber.
    const originalTranslateTo = engine.translate.to;
    const originalTranslateClear = engine.translate.clear;
    engine.translate.to = () => {};
    engine.translate.clear = () => {}; 

    // 1. Subscribe to the spring to update the DOM AND sync Embla's internal state
    const unsubscribe = spring.on("change", (v: number) => {
      // Keep Embla's internal location perfectly synced with our spring value!
      // This is CRITICAL so that Embla's slideLooper knows exactly where we are visually,
      // preventing slides from teleporting out from under us during infinite loops.
      engine.location.set(v);
      engine.slideLooper.loop();
      
      const axis = engine.options.axis === 'y' ? 'Y' : 'X';
      container.style.transform = `translate3d(${axis === 'X' ? v : 0}px, ${axis === 'Y' ? v : 0}px, 0)`;
    });

    const handleWrap = (currentTarget: number) => {
      const limit = engine.limit;
      const carouselSize = limit.max - limit.min;
      const jumpAmount = currentTarget - prevTarget.current;
      
      // If the target jumped by a huge amount (e.g. > half the carousel size) in a single frame, 
      // Embla wrapped the coordinates. We must apply the exact same jump to our spring.
      if (Math.abs(jumpAmount) > carouselSize / 2 && carouselSize > 0) {
        target.set(target.get() + jumpAmount);
        spring.jump(spring.get() + jumpAmount);
      }
      prevTarget.current = currentTarget;
    };

    // Embla event handlers
    const onPointerDown = () => {
      isDragging.current = true;
    };

    const onPointerUp = () => {
      isDragging.current = false;
      const currentTarget = engine.target.get();
      handleWrap(currentTarget);
      target.set(currentTarget);
    };

    const onScroll = () => {
      if (isDragging.current) {
        // While dragging, instantly sync the spring to the finger's location without easing
        const loc = engine.location.get();
        target.set(loc);
        spring.jump(loc);
        prevTarget.current = engine.target.get();
      } else {
        // While Embla's internal engine is settling natively, check if it wrapped
        handleWrap(engine.target.get());
      }
    };

    const onSelect = () => {
      // When a new target is chosen (via arrows, autoplay, or release)
      if (!isDragging.current) {
        const currentTarget = engine.target.get();
        handleWrap(currentTarget);
        target.set(currentTarget);
      }
    };

    const onInit = () => {
      const currentLoc = engine.location.get();
      prevTarget.current = engine.target.get();
      target.set(currentLoc);
      spring.jump(currentLoc);
    };

    // Hook up events
    emblaApi
      .on('init', onInit)
      .on('reInit', onInit)
      .on('pointerDown', onPointerDown)
      .on('pointerUp', onPointerUp)
      .on('scroll', onScroll)
      .on('select', onSelect);

    onInit();

    return () => {
      unsubscribe();
      // Restore Embla's native methods
      engine.translate.to = originalTranslateTo;
      engine.translate.clear = originalTranslateClear;
      
      emblaApi
        .off('init', onInit)
        .off('reInit', onInit)
        .off('pointerDown', onPointerDown)
        .off('pointerUp', onPointerUp)
        .off('scroll', onScroll)
        .off('select', onSelect);
    };
  }, [emblaApi, spring, target]);
}
