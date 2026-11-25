'use client';

import React from 'react';
import { cn } from '@codezeniths/design/cn';
import { SkeletonAvatarProps } from './types';
import { SkeletonBone } from './skeleton-bone';
import { resolveAvatarSize } from './skeleton-molecules-helpers';

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
    size = 'md',
    shape = 'circle',
    tint,
    delay,
    className,
    ...props
}) => {
    return (
        <SkeletonBone
            shape={shape === 'circle' ? 'circle' : 'rounded'}
            tint={tint}
            delay={delay}
            className={cn(resolveAvatarSize(size), className)}
            {...props}
        />
    );
};
