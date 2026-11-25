'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonButtonProps } from './types';
import { SkeletonBone } from './skeleton-bone';
import { resolveButtonSize } from './skeleton-molecules-helpers';

export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
    size = 'md',
    variant = 'solid',
    tint,
    width,
    delay,
    className,
    ...props
}) => {
    const defaultWidth = size === 'icon' ? '' : 'w-24';

    return (
        <SkeletonBone
            shape="rounded"
            tint={tint}
            delay={delay}
            className={cn(
                'inline-flex items-center justify-center shrink-0',
                resolveButtonSize(size),
                variant === 'outline'
                    ? 'border border-foreground-light-shade3 dark:border-foreground-dark-shade2 bg-transparent'
                    : '',
                width ?? defaultWidth,
                className
            )}
            {...props}
        />
    );
};
