'use client';
import React, { forwardRef } from 'react';
import { Button, ButtonSize, ButtonVariant } from '@codezeniths/design/components';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import { useCarouselContext } from '../core/CarouselProvider';
import { CarouselAxis } from '../core/types';

export const CarouselPrevious = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = ButtonVariant.OUTLINE, size = ButtonSize.ICON, ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarouselContext();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === CarouselAxis.HORIZONTAL
            ? '-left-12 top-1/2 -translate-y-1/2'
            : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  }
);
CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, variant = 'outline' as any, size = 'icon' as any, ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarouselContext();

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          'absolute h-8 w-8 rounded-full',
          orientation === CarouselAxis.HORIZONTAL
            ? '-right-12 top-1/2 -translate-y-1/2'
            : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = 'CarouselNext';

export const NavigationModule: React.FC<{ options?: { showArrows?: boolean; arrowClass?: string } }> = ({ options }) => {
  if (options?.showArrows === false) return null;
  
  return (
    <>
      <CarouselPrevious className={options?.arrowClass} />
      <CarouselNext className={options?.arrowClass} />
    </>
  );
};
