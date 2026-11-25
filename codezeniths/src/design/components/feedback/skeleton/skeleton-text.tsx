'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonTextProps } from './types';
import { SkeletonBone } from './skeleton-bone';
import { computeLineWidths } from './skeleton-molecules-helpers';

export const SkeletonText: React.FC<SkeletonTextProps> = ({
    lines = 1,
    lastLineWidth,
    randomizeWidths = true,
    spacing = 'space-y-2',
    lineHeight = 'h-3.5 sm:h-4',
    tint,
    delay = 0,
    className,
    ...props
}) => {
    const widths = computeLineWidths(lines, lastLineWidth, randomizeWidths);

    if (lines === 1) {
        return (
            <SkeletonBone
                tint={tint}
                delay={delay}
                shape="rounded"
                className={cn(lineHeight, widths[0], className)}
                {...props}
            />
        );
    }

    return (
        <div className={cn(spacing, className)} {...props}>
            {widths.map((widthClass, idx) => (
                <SkeletonBone
                    key={idx}
                    tint={tint}
                    delay={delay + idx * 0.05}
                    shape="rounded"
                    className={cn(lineHeight, widthClass)}
                />
            ))}
        </div>
    );
};
