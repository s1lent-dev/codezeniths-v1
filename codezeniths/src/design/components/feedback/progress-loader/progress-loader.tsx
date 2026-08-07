'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Container } from '@codezeniths/design/components/layout';
import { cn } from '@codezeniths/design/cn';

export interface ProgressLoaderProps {
  totalBlocks: number;
  progressPercentage: number;
  blockWidth?: number;
  blockHeight?: number;
  gap?: number;
  animationDuration?: number;
  className?: string;
}

export const ProgressLoader = ({
  totalBlocks,
  progressPercentage,
  blockWidth = 4,
  blockHeight = 30,
  gap = 4,
  animationDuration = 2000,
  className,
}: ProgressLoaderProps) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progressPercentage || 0)));

  const filledBlockCount = useMemo(
    () => Math.floor((clampedProgress / 100) * totalBlocks),
    [clampedProgress, totalBlocks]
  );

  const shimmerWindowSize = useMemo(() => {
    return Math.max(Math.floor(totalBlocks / 8), 10);
  }, [totalBlocks]);

  const isDone = clampedProgress >= 100;

  const [shimmerStartIndex, setShimmerStartIndex] = useState(-shimmerWindowSize);

  useEffect(() => {
    if (isDone) {
      setShimmerStartIndex(-shimmerWindowSize);
      return;
    }

    const interval = setInterval(() => {
      setShimmerStartIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex > totalBlocks ? -shimmerWindowSize : nextIndex;
      });
    }, animationDuration / totalBlocks);

    return () => clearInterval(interval);
  }, [totalBlocks, shimmerWindowSize, animationDuration, isDone]);

  return (
    <Container
      direction="row"
      justify="between"
      align="center"
      className={cn('w-full', className)}
      style={{ gap: `${gap}px` }}
    >
      {Array.from({ length: totalBlocks }).map((_, index) => {
        const isFilled = index < filledBlockCount;
        const isShimmering =
          !isDone && index >= shimmerStartIndex && index < shimmerStartIndex + shimmerWindowSize;

        let blockState = 'idle';
        if (isFilled && isShimmering) {
          blockState = 'filled-shimmer';
        } else if (isFilled) {
          blockState = 'filled';
        } else if (isShimmering) {
          blockState = 'shimmer';
        }

        return (
          <div
            key={index}
            style={{
              width: `${blockWidth}px`,
              height: `${blockHeight}px`,
            }}
            className={cn(
              'transition-colors duration-300 ease-in-out rounded-sm',
              blockState === 'filled' && 'bg-primary shadow-[0_0_2px_var(--color-primary)]',
              blockState === 'filled-shimmer' && 'bg-primary/20 dark:bg-primary-shade1 shadow-[0_0_4px_var(--color-primary-shade1)]',
              blockState === 'shimmer' && 'bg-primary/20 dark:bg-primary-shade1 shadow-[0_0_3px_var(--color-primary-shade1)]',
              blockState === 'idle' && 'bg-background-light-shade3 dark:bg-background-dark-shade2'
            )}
          />
        );
      })}
    </Container>
  );
};
