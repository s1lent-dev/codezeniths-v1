'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonShimmerProps, SkeletonTint } from './types';
import { useSkeletonContext } from './skeleton-context';
import { TINT_SHIMMER_MAP } from './constants';

export const SkeletonShimmer: React.FC<SkeletonShimmerProps> = ({
    tint,
    duration,
    delay,
    className,
    ...props
}) => {
    const context = useSkeletonContext();
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return null;
    }

    const effectiveTint: SkeletonTint = tint ?? context.shimmerTint ?? 'primary';
    const shimmerGradient = TINT_SHIMMER_MAP[effectiveTint] ?? TINT_SHIMMER_MAP.primary;
    const baseDuration = (duration ?? 1.8) / (context.speed || 1);
    const finalDelay = delay ?? 0;

    if (context.engine === 'css') {
        return (
            <div
                aria-hidden="true"
                style={{
                    animationDuration: `${baseDuration}s`,
                    animationDelay: `${finalDelay}s`,
                }}
                className={cn(
                    'absolute inset-0 z-20 pointer-events-none w-1/2 -skew-x-12 bg-linear-to-r from-transparent to-transparent animate-[skeleton-shimmer-sweep_1.8s_ease-in-out_infinite]',
                    shimmerGradient,
                    className
                )}
                {...props}
            />
        );
    }

    return (
        <motion.div
            aria-hidden="true"
            animate={{ x: ['-100%', '200%'] }}
            transition={{
                duration: baseDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 0.2,
                delay: finalDelay,
            }}
            className={cn(
                'absolute inset-0 z-20 pointer-events-none w-1/2 -skew-x-12 bg-linear-to-r from-transparent to-transparent',
                shimmerGradient,
                className
            )}
            {...props}
        />
    );
};
