import { describe, it, expect } from 'vitest';
import { resolveBoneClasses, computeFinalDelay } from '../skeleton-bone';

describe('Skeleton Bone Helpers', () => {
  it('computes final delay combining baseDelay and element index/delay', () => {
    expect(computeFinalDelay(0.2, 0.1, undefined)).toBe(0.3);
    expect(computeFinalDelay(0.1, undefined, 2)).toBeCloseTo(0.18, 2);
    expect(computeFinalDelay(0, undefined, undefined)).toBe(0);
  });

  it('resolves correct shape and tint classes', () => {
    const classes = resolveBoneClasses({
      shape: 'circle',
      tint: 'amber',
      className: 'size-10',
    });
    expect(classes).toContain('rounded-full');
    expect(classes).toContain('aspect-square');
    expect(classes).toContain('bg-amber-500/20');
    expect(classes).toContain('size-10');
  });

  it('resolves default classes when options are omitted', () => {
    const classes = resolveBoneClasses({});
    expect(classes).toContain('rounded-md'); // default rounded
    expect(classes).toContain('bg-foreground-light-shade3');
  });
});
