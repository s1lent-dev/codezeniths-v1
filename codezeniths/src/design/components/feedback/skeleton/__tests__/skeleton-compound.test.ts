import { describe, it, expect } from 'vitest';
import { Skeleton } from '../index';
import { resolveRowDelay } from '../skeleton-row';

describe('Skeleton Compound Assembly & Row Helpers', () => {
  it('exposes all compound members on Skeleton namespace', () => {
    expect(Skeleton.Root).toBeDefined();
    expect(Skeleton.Shimmer).toBeDefined();
    expect(Skeleton.Bone).toBeDefined();
    expect(Skeleton.Text).toBeDefined();
    expect(Skeleton.Avatar).toBeDefined();
    expect(Skeleton.Badge).toBeDefined();
    expect(Skeleton.Button).toBeDefined();
    expect(Skeleton.Card).toBeDefined();
    expect(Skeleton.Row).toBeDefined();
  });

  it('computes row delay correctly with modulo cycle', () => {
    expect(resolveRowDelay(0)).toBe(0);
    expect(resolveRowDelay(3)).toBeCloseTo(0.12, 2);
    expect(resolveRowDelay(13)).toBeCloseTo(0.12, 2); // 13 % 10 = 3 -> 0.12s
  });
});
