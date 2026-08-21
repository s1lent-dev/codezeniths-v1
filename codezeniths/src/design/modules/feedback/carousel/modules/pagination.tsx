'use client';
import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { useCarouselContext } from '../core/CarouselProvider';

export const CarouselPagination: React.FC<{ type?: 'bullets' | 'fraction' | 'progressbar', clickable?: boolean, className?: string }> = ({ type = 'bullets', clickable = true, className }) => {
  const { scrollSnapCount, selectedIndex, scrollTo } = useCarouselContext();

  if (scrollSnapCount <= 1) return null;

  if (type === 'fraction') {
    return (
      <div className={cn("text-sm text-body-light dark:text-body-dark text-center", className)}>
        {selectedIndex + 1} / {scrollSnapCount}
      </div>
    );
  }

  if (type === 'progressbar') {
    const progress = (selectedIndex + 1) / scrollSnapCount;
    return (
      <div className={cn("h-1 w-full bg-secondary overflow-hidden rounded-full", className)}>
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {Array.from({ length: scrollSnapCount }).map((_, idx) => (
        <button
          key={idx}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            idx === selectedIndex ? "bg-primary" : "bg-primary/20"
          )}
          onClick={() => clickable && scrollTo(idx)}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
};

export const PaginationModule: React.FC<{ options?: { type?: 'bullets' | 'fraction' | 'progressbar', clickable?: boolean } }> = ({ options }) => {
  return (
    <div className="absolute -bottom-6 left-0 right-0">
      <CarouselPagination type={options?.type} clickable={options?.clickable} />
    </div>
  );
};
