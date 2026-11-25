import { SkeletonAvatarSize, SkeletonButtonSize } from './types';
import { DEFAULT_WIDTHS } from './constants';

export const computeLineWidths = (
    lines: number,
    lastLineWidth?: string,
    randomizeWidths = true
): string[] => {
    if (lines <= 0) return [];
    if (lines === 1) {
        return [lastLineWidth ?? 'w-full'];
    }

    const widths: string[] = [];
    for (let i = 0; i < lines - 1; i++) {
        if (randomizeWidths) {
            widths.push(DEFAULT_WIDTHS[i % DEFAULT_WIDTHS.length]);
        } else {
            widths.push('w-full');
        }
    }

    widths.push(lastLineWidth ?? (randomizeWidths ? 'w-3/5' : 'w-full'));
    return widths;
};

export const resolveAvatarSize = (size: SkeletonAvatarSize = 'md'): string => {
    switch (size) {
        case 'xs':
            return 'size-4';
        case 'sm':
            return 'size-6';
        case 'md':
            return 'size-8';
        case 'lg':
            return 'size-10';
        case 'xl':
            return 'size-12';
        case '2xl':
            return 'size-16';
        default:
            return 'size-8';
    }
};

export const resolveButtonSize = (size: SkeletonButtonSize = 'md'): string => {
    switch (size) {
        case 'xs':
            return 'h-7 px-2.5 rounded-md text-xs';
        case 'sm':
            return 'h-8 px-3 rounded-md text-sm';
        case 'md':
            return 'h-10 px-4 rounded-md text-base';
        case 'lg':
            return 'h-11 px-5 rounded-lg text-lg';
        case 'icon':
            return 'size-9 rounded-md';
        default:
            return 'h-10 px-4 rounded-md';
    }
};
