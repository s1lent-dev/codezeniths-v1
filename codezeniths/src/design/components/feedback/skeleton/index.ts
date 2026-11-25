import { SkeletonRoot } from './skeleton-root';
import { SkeletonShimmer } from './skeleton-shimmer';
import { SkeletonBone } from './skeleton-bone';
import { SkeletonText } from './skeleton-text';
import { SkeletonAvatar } from './skeleton-avatar';
import { SkeletonBadge } from './skeleton-badge';
import { SkeletonButton } from './skeleton-button';
import { SkeletonCard } from './skeleton-card';
import { SkeletonRow } from './skeleton-row';

export * from './types';
export * from './constants';
export * from './skeleton-context';
export * from './skeleton-root';
export * from './skeleton-shimmer';
export * from './skeleton-bone';
export * from './skeleton-text';
export * from './skeleton-avatar';
export * from './skeleton-badge';
export * from './skeleton-button';
export * from './skeleton-card';
export * from './skeleton-row';

export const Skeleton = Object.assign(SkeletonRoot, {
    Root: SkeletonRoot,
    Shimmer: SkeletonShimmer,
    Bone: SkeletonBone,
    Text: SkeletonText,
    Avatar: SkeletonAvatar,
    Badge: SkeletonBadge,
    Button: SkeletonButton,
    Card: SkeletonCard,
    Row: SkeletonRow,
});

export default Skeleton;
