import React from 'react';

export type SkeletonAnimation = 'breathe' | 'shimmer' | 'pulse' | 'none';

export type SkeletonEngine = 'motion' | 'css';

export type SkeletonTint =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'amber'
    | 'emerald'
    | 'rose'
    | 'teal'
    | 'purple'
    | 'none';

export type SkeletonShape = 'rect' | 'rounded' | 'circle' | 'pill';

export type SkeletonAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type SkeletonButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

type HTMLAttributesWithoutMotion<T> = Omit<
    React.HTMLAttributes<T>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
>;

export interface SkeletonContextValue {
    engine: SkeletonEngine;
    animation: SkeletonAnimation;
    tint: SkeletonTint;
    speed: number;
    baseDelay: number;
    shimmer: boolean;
    shimmerTint: SkeletonTint;
    hasParentRoot: boolean;
}

export interface SkeletonRootProps extends HTMLAttributesWithoutMotion<HTMLDivElement> {
    engine?: SkeletonEngine;
    animation?: SkeletonAnimation;
    tint?: SkeletonTint;
    speed?: number;
    baseDelay?: number;
    shimmer?: boolean;
    shimmerTint?: SkeletonTint;
    as?: React.ElementType;
    className?: string;
    children?: React.ReactNode;
}

export interface SkeletonBoneProps extends HTMLAttributesWithoutMotion<HTMLElement> {
    as?: React.ElementType;
    shape?: SkeletonShape;
    tint?: SkeletonTint;
    animation?: SkeletonAnimation;
    engine?: SkeletonEngine;
    delay?: number;
    index?: number;
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}

export interface SkeletonShimmerProps extends HTMLAttributesWithoutMotion<HTMLDivElement> {
    tint?: SkeletonTint;
    duration?: number;
    delay?: number;
    className?: string;
}

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
    lines?: number;
    lastLineWidth?: string;
    randomizeWidths?: boolean;
    spacing?: string;
    lineHeight?: string;
    tint?: SkeletonTint;
    delay?: number;
    className?: string;
}

export interface SkeletonAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: SkeletonAvatarSize;
    shape?: 'circle' | 'rounded';
    tint?: SkeletonTint;
    delay?: number;
    className?: string;
}

export interface SkeletonBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
    tint?: SkeletonTint;
    width?: string;
    delay?: number;
    className?: string;
}

export interface SkeletonButtonProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: SkeletonButtonSize;
    variant?: 'solid' | 'outline';
    tint?: SkeletonTint;
    width?: string;
    delay?: number;
    className?: string;
}

export interface SkeletonCardProps extends SkeletonRootProps {
    variant?: 'flat' | 'outline' | 'subtle';
}

export interface SkeletonRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    index?: number;
    zebra?: boolean;
    tint?: SkeletonTint;
    as?: React.ElementType;
    className?: string;
    children?: React.ReactNode;
}
