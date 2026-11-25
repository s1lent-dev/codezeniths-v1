'use client';

import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonBoneProps, SkeletonShape, SkeletonTint } from './types';
import { useSkeletonContext } from './skeleton-context';
import { TINT_BONE_MAP } from './constants';

export const computeFinalDelay = (
    baseDelay: number,
    delay?: number,
    index?: number
): number => {
    let result = baseDelay;
    if (delay !== undefined) {
        result = baseDelay + delay;
    } else if (index !== undefined) {
        result = baseDelay + index * 0.04;
    }
    return Math.round(result * 10000) / 10000;
};

export const resolveBoneClasses = ({
    shape = 'rounded',
    tint = 'default',
    className,
}: {
    shape?: SkeletonShape;
    tint?: SkeletonTint;
    className?: string;
}): string => {
    const shapeClass =
        shape === 'rect'
            ? 'rounded-none'
            : shape === 'circle'
              ? 'rounded-full aspect-square'
              : shape === 'pill'
                ? 'rounded-full'
                : 'rounded-md';

    const tintClass = TINT_BONE_MAP[tint] ?? TINT_BONE_MAP.default;

    return cn(shapeClass, tintClass, className);
};

export const SkeletonBone: React.FC<SkeletonBoneProps> = ({
    as = 'div',
    shape = 'rounded',
    tint,
    animation,
    engine,
    delay,
    index,
    width,
    height,
    className,
    style,
    children,
    ...props
}) => {
    const context = useSkeletonContext();
    const shouldReduceMotion = useReducedMotion();

    const effectiveTint: SkeletonTint = tint ?? context.tint ?? 'default';
    const effectiveAnimation = shouldReduceMotion ? 'none' : (animation ?? context.animation ?? 'breathe');
    const effectiveEngine = engine ?? context.engine ?? 'motion';
    const finalDelay = computeFinalDelay(context.baseDelay || 0, delay, index);
    const speed = context.speed || 1;

    const baseClasses = resolveBoneClasses({
        shape,
        tint: effectiveTint,
        className,
    });

    const sizingStyle: React.CSSProperties = {
        ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
        ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
        ...style,
    };

    // Static / Reduced Motion / animation="none"
    if (effectiveAnimation === 'none') {
        const Component = as as any;
        return (
            <Component
                className={cn('select-none opacity-50', baseClasses)}
                style={sizingStyle}
                {...props}
            >
                {children}
            </Component>
        );
    }

    // CSS Engine
    if (effectiveEngine === 'css') {
        const Component = as as any;
        const animationClass =
            effectiveAnimation === 'pulse'
                ? 'animate-[skeleton-pulse_1s_ease-in_infinite]'
                : 'animate-[skeleton-breathe_1.5s_ease-in-out_infinite]';

        return (
            <Component
                className={cn('select-none relative overflow-hidden', animationClass, baseClasses)}
                style={{
                    ...sizingStyle,
                    animationDuration: `${(effectiveAnimation === 'pulse' ? 1.0 : 1.5) / speed}s`,
                    animationDelay: `${finalDelay}s`,
                }}
                {...props}
            >
                {effectiveAnimation === 'shimmer' && (
                    <div
                        aria-hidden="true"
                        style={{
                            animationDuration: `${1.8 / speed}s`,
                        }}
                        className="absolute inset-0 z-10 pointer-events-none -skew-x-12 w-1/2 bg-linear-to-r from-transparent via-white/10 dark:via-white/15 to-transparent animate-[skeleton-shimmer-sweep_1.8s_ease-in-out_infinite]"
                    />
                )}
                {children}
            </Component>
        );
    }

    // Motion Engine (Default)
    const MotionComponent = (motion as any)[as as string] ?? motion.div;

    const keyframes =
        effectiveAnimation === 'pulse'
            ? [0.4, 0.95, 0.4]
            : [0.35, 0.85, 0.35];

    const duration = (effectiveAnimation === 'pulse' ? 1.0 : 1.5) / speed;

    return (
        <MotionComponent
            animate={{ opacity: keyframes }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: finalDelay,
            }}
            className={cn('select-none relative overflow-hidden', baseClasses)}
            style={sizingStyle}
            {...props}
        >
            {effectiveAnimation === 'shimmer' && (
                <motion.div
                    aria-hidden="true"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                        duration: 1.8 / speed,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 0.2,
                    }}
                    className="absolute inset-0 z-10 pointer-events-none -skew-x-12 w-1/2 bg-linear-to-r from-transparent via-white/10 dark:via-white/15 to-transparent"
                />
            )}
            {children}
        </MotionComponent>
    );
};
