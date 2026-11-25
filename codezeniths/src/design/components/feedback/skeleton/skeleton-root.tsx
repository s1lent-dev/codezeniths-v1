'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonContextValue, SkeletonRootProps, SkeletonTint } from './types';
import { SkeletonContext, useSkeletonContext } from './skeleton-context';
import { DEFAULT_SKELETON_CONTEXT } from './constants';
import { SkeletonShimmer } from './skeleton-shimmer';

export interface ResolvedRootContext extends SkeletonContextValue {
    shouldRenderShimmer: boolean;
}

export const resolveRootContextValue = (
    parentContext: SkeletonContextValue,
    props: SkeletonRootProps
): ResolvedRootContext => {
    const isNested = parentContext.hasParentRoot;

    const engine = props.engine ?? (isNested ? parentContext.engine : DEFAULT_SKELETON_CONTEXT.engine);
    const animation = props.animation ?? (isNested ? parentContext.animation : DEFAULT_SKELETON_CONTEXT.animation);
    const tint: SkeletonTint = props.tint ?? (isNested ? parentContext.tint : DEFAULT_SKELETON_CONTEXT.tint);
    const speed = props.speed ?? (isNested ? parentContext.speed : DEFAULT_SKELETON_CONTEXT.speed);
    const baseDelay = (props.baseDelay ?? 0) + (isNested ? parentContext.baseDelay : 0);
    const shimmer = props.shimmer ?? (isNested ? parentContext.shimmer : DEFAULT_SKELETON_CONTEXT.shimmer);
    const shimmerTint: SkeletonTint =
        props.shimmerTint ??
        (props.tint && props.tint !== 'default' ? props.tint : undefined) ??
        (isNested ? parentContext.shimmerTint : DEFAULT_SKELETON_CONTEXT.shimmerTint);

    // Suppress duplicate sweeping shimmer if an ancestor is already sweeping
    const shouldRenderShimmer = isNested
        ? !parentContext.shimmer && Boolean(props.shimmer)
        : shimmer && animation !== 'none';

    return {
        engine,
        animation,
        tint,
        speed,
        baseDelay,
        shimmer,
        shimmerTint,
        hasParentRoot: true,
        shouldRenderShimmer,
    };
};

export const SkeletonRoot: React.FC<SkeletonRootProps> = ({
    as = 'div',
    engine,
    animation,
    tint,
    speed,
    baseDelay,
    shimmer,
    shimmerTint,
    className,
    children,
    ...props
}) => {
    const parentContext = useSkeletonContext();

    const resolved = resolveRootContextValue(parentContext, {
        engine,
        animation,
        tint,
        speed,
        baseDelay,
        shimmer,
        shimmerTint,
    });

    const contextValue: SkeletonContextValue = {
        engine: resolved.engine,
        animation: resolved.animation,
        tint: resolved.tint,
        speed: resolved.speed,
        baseDelay: resolved.baseDelay,
        shimmer: resolved.shimmer,
        shimmerTint: resolved.shimmerTint,
        hasParentRoot: true,
    };

    const Component = as as any;

    return (
        <SkeletonContext.Provider value={contextValue}>
            <Component
                className={cn('relative overflow-hidden select-none font-sans', className)}
                {...props}
            >
                {resolved.shouldRenderShimmer && <SkeletonShimmer tint={resolved.shimmerTint} />}
                {children}
            </Component>
        </SkeletonContext.Provider>
    );
};
