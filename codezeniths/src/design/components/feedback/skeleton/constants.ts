import { SkeletonContextValue, SkeletonTint } from './types';

export const TINT_BONE_MAP: Record<SkeletonTint, string> = {
    default: 'bg-foreground-light-shade3 dark:bg-foreground-dark-shade3',
    primary: 'bg-primary/20 dark:bg-primary/30 text-primary',
    secondary: 'bg-secondary/20 dark:bg-secondary/25',
    amber: 'bg-amber-500/20 dark:bg-amber-400/25',
    emerald: 'bg-emerald-500/20 dark:bg-emerald-400/25',
    rose: 'bg-rose-500/20 dark:bg-rose-400/25',
    teal: 'bg-teal-500/20 dark:bg-teal-400/25',
    purple: 'bg-purple-500/20 dark:bg-purple-400/25',
    none: 'bg-transparent',
};

export const TINT_SHIMMER_MAP: Record<SkeletonTint, string> = {
    default: 'via-foreground-light-shade3/40 dark:via-foreground-dark-shade2/40',
    primary: 'via-primary/10 dark:via-primary/20',
    secondary: 'via-secondary/15 dark:via-secondary/25',
    amber: 'via-amber-500/10 dark:via-amber-400/15',
    emerald: 'via-emerald-500/10 dark:via-emerald-400/15',
    rose: 'via-rose-500/10 dark:via-rose-400/15',
    teal: 'via-teal-500/10 dark:via-teal-400/15',
    purple: 'via-purple-500/10 dark:via-purple-400/15',
    none: 'via-transparent',
};

export const DEFAULT_WIDTHS = ['w-full', 'w-5/6', 'w-4/5', 'w-3/4', 'w-2/3', 'w-3/5', 'w-1/2'];

export const DEFAULT_SKELETON_CONTEXT: SkeletonContextValue = {
    engine: 'motion',
    animation: 'breathe',
    tint: 'default',
    speed: 1,
    baseDelay: 0,
    shimmer: true,
    shimmerTint: 'primary',
    hasParentRoot: false,
};
