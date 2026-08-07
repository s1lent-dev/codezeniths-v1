'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

export function useCubeEffect(emblaApi: EmblaCarouselType | undefined) {
  const tweenNodes = useRef<HTMLElement[]>([]);
  const shadowNode = useRef<HTMLElement | null>(null);

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    tweenNodes.current = api.slideNodes().map((slideNode) => {
      return slideNode.firstElementChild as HTMLElement;
    });
  }, []);

  const tweenCube = useCallback((api: EmblaCarouselType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const tweenFactor = api.scrollSnapList().length;
    const scrollableDistance = engine.limit.length;

    let cubeSize = 300;

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

        const pixelDistance = diffToTarget * scrollableDistance;

        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) {
          const size = tweenNode.offsetWidth;
          cubeSize = size;
          
          // Calculate strictly based on physical pixels to prevent snap overshoot
          const slideProgress = pixelDistance / size;
          
          const translateX = -pixelDistance;
          const rotateY = slideProgress * 90;
          const zIndex = 100 - Math.round(Math.abs(slideProgress));

          // Exact Swiper orientation
          tweenNode.style.transform = `translate3d(${translateX}px, 0, ${-size / 2}px) rotateY(${rotateY}deg) translateZ(${size / 2}px)`;
          tweenNode.style.zIndex = zIndex.toString();
          
          // Slide Shadows via CSS brightness
          const brightness = 1 - Math.min(Math.abs(slideProgress), 1) * 0.7;
          tweenNode.style.filter = `brightness(${brightness})`;

          if (Math.abs(slideProgress) > 1.5) {
            tweenNode.style.visibility = 'hidden';
          } else {
            tweenNode.style.visibility = 'visible';
          }
        }
      });
    });

    // Update bottom shadow
    if (shadowNode.current) {
      // Swiper default params
      const shadowOffset = 20;
      const shadowScale = 0.94;
      
      // Calculate global rotation of the cube based on current scroll progress
      // Global progress goes from 0 to 1. Total rotation is (tweenFactor - 1) * 90 in non-loop, or tweenFactor * 90 in loop.
      // Actually, since we rotate slides individually, the shadow just needs to sit at the active slide position.
      // But the shadow rotates with the cube. We can simulate it by rotating Z.
      const globalRotate = -api.scrollProgress() * tweenFactor * 90;
      
      shadowNode.current.style.transform = `translate3d(0, ${cubeSize / 2 + shadowOffset}px, ${-cubeSize / 2}px) rotateX(90deg) rotateZ(${globalRotate}deg) scale(${shadowScale})`;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    // Create bottom shadow element
    const shadow = document.createElement('div');
    shadow.style.position = 'absolute';
    shadow.style.left = '0';
    shadow.style.top = '0';
    shadow.style.width = '100%';
    shadow.style.height = '100%';
    shadow.style.background = '#000';
    shadow.style.opacity = '0.4';
    shadow.style.filter = 'blur(40px)';
    shadow.style.pointerEvents = 'none';
    shadow.style.transformOrigin = '50% 50%';
    
    // Append to the container node (which holds the slides)
    // Wait, if we append to container, it translates with scroll. 
    // We should append to rootNode (viewport) so it stays centered.
    const root = emblaApi.rootNode();
    root.style.transformStyle = 'preserve-3d'; // Ensure shadow is rendered in 3D space
    root.appendChild(shadow);
    shadowNode.current = shadow;

    setTweenNodes(emblaApi);
    tweenCube(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', tweenCube)
      .on('scroll', tweenCube)
      .on('slideFocus', tweenCube);

    return () => {
      if (shadow.parentNode) shadow.parentNode.removeChild(shadow);
    };
  }, [emblaApi, setTweenNodes, tweenCube]);
}
