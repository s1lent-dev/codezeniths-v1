'use client';
import React, { useEffect, useCallback } from 'react';
import { useCarouselContext } from '../core/CarouselProvider';

export const KeyboardModule: React.FC<{ options?: { enabled?: boolean, onlyInViewport?: boolean } }> = ({ options }) => {
  const { scrollPrev, scrollNext } = useCarouselContext();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (options?.enabled === false) return;
      if (event.key === 'ArrowLeft') {
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        scrollNext();
      }
    },
    [scrollPrev, scrollNext, options?.enabled]
  );

  useEffect(() => {
    if (options?.onlyInViewport !== false) {
      // Handled natively by Carousel root onKeyDown if onlyInViewport is true
      return;
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, options?.onlyInViewport]);

  return null;
};
