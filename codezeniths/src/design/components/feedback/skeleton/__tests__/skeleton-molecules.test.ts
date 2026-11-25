import { describe, it, expect } from 'vitest';
import {
  computeLineWidths,
  resolveAvatarSize,
  resolveButtonSize,
} from '../skeleton-molecules-helpers';

describe('Skeleton Molecules Helpers', () => {
  it('computes correct line widths with custom lastLineWidth', () => {
    const widths = computeLineWidths(3, 'w-1/2', false);
    expect(widths).toEqual(['w-full', 'w-full', 'w-1/2']);
  });

  it('cycles realistic widths when randomizeWidths is enabled', () => {
    const widths = computeLineWidths(4, 'w-2/5', true);
    expect(widths.length).toBe(4);
    expect(widths[3]).toBe('w-2/5');
    // First 3 lines should follow cycled widths
    expect(widths[0]).toBeDefined();
    expect(widths[1]).toBeDefined();
    expect(widths[2]).toBeDefined();
  });

  it('handles single line text width', () => {
    const widths = computeLineWidths(1, 'w-3/4', false);
    expect(widths).toEqual(['w-3/4']);
  });

  it('resolves semantic avatar sizes to exact tailwind dimensions', () => {
    expect(resolveAvatarSize('xs')).toBe('size-4');
    expect(resolveAvatarSize('sm')).toBe('size-6');
    expect(resolveAvatarSize('md')).toBe('size-8');
    expect(resolveAvatarSize('lg')).toBe('size-10');
    expect(resolveAvatarSize('xl')).toBe('size-12');
    expect(resolveAvatarSize('2xl')).toBe('size-16');
  });

  it('resolves button sizes matching design system standards', () => {
    expect(resolveButtonSize('xs')).toContain('h-7');
    expect(resolveButtonSize('sm')).toContain('h-8');
    expect(resolveButtonSize('md')).toContain('h-10');
    expect(resolveButtonSize('lg')).toContain('h-11');
    expect(resolveButtonSize('icon')).toContain('size-9');
  });
});
