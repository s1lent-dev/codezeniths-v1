'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonCardProps } from './types';
import { SkeletonRoot } from './skeleton-root';

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
    variant = 'flat',
    className,
    children,
    ...props
}) => {
    const variantClasses =
        variant === 'outline'
            ? 'bg-transparent border border-foreground-light-shade3 dark:border-foreground-dark-shade1'
            : variant === 'subtle'
              ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border-0'
              : 'border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark';

    return (
        <SkeletonRoot
            className={cn(
                'rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs overflow-hidden relative select-none font-sans min-w-0 max-w-full',
                variantClasses,
                className
            )}
            {...props}
        >
            {children}
        </SkeletonRoot>
    );
};
