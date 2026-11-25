'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonContextValue, SkeletonRowProps } from './types';
import { SkeletonContext, useSkeletonContext } from './skeleton-context';

export const resolveRowDelay = (index?: number): number => {
    const idx = index ?? 0;
    return Math.round((idx % 10) * 0.04 * 10000) / 10000;
};

export const SkeletonRow: React.FC<SkeletonRowProps> = ({
    index = 0,
    zebra = true,
    tint,
    as = 'tr',
    className,
    children,
    ...props
}) => {
    const parentContext = useSkeletonContext();
    const rowDelay = resolveRowDelay(index);

    const contextValue: SkeletonContextValue = {
        ...parentContext,
        tint: tint ?? parentContext.tint,
        baseDelay: parentContext.baseDelay + rowDelay,
        shimmer: false, // Strict Tier 3 loading: no sweeping beams on appending/tabular rows
        hasParentRoot: true,
    };

    const Component = as as any;

    const zebraClass = zebra
        ? index % 2 === 0
            ? 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1'
            : 'bg-transparent'
        : '';

    return (
        <SkeletonContext.Provider value={contextValue}>
            <Component
                className={cn(
                    'group transition-colors select-none font-sans border-0',
                    zebraClass,
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        </SkeletonContext.Provider>
    );
};
