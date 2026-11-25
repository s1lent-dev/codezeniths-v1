'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonBadgeProps } from './types';
import { SkeletonBone } from './skeleton-bone';

export const SkeletonBadge: React.FC<SkeletonBadgeProps> = ({
    size = 'md',
    tint,
    width = 'w-16',
    delay,
    className,
    ...props
}) => {
    const sizeClass =
        size === 'sm'
            ? 'h-4.5 px-2'
            : size === 'lg'
              ? 'h-6 sm:h-7 px-3'
              : 'h-5 sm:h-6 px-2.5';

    return (
        <SkeletonBone
            shape="pill"
            tint={tint}
            delay={delay}
            className={cn(
                'rounded-full border border-current/20 inline-flex items-center justify-center shrink-0',
                sizeClass,
                width,
                className
            )}
            {...props}
        />
    );
};
