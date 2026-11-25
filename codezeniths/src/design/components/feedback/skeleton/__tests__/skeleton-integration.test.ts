import { describe, it, expect } from 'vitest';
import { Skeleton } from '@codezeniths/components';
import { TINT_BONE_MAP, TINT_SHIMMER_MAP } from '../constants';
import { computeLineWidths } from '../skeleton-molecules-helpers';
import { resolveRowDelay } from '../skeleton-row';
import { resolveRootContextValue } from '../skeleton-root';

describe('Skeleton End-to-End Composite Recipes & Library Exports', () => {
  it('exports all compound components from @codezeniths/components', () => {
    expect(Skeleton).toBeDefined();
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

  it('provides all semantic tint mappings across the palette', () => {
    const tints = ['default', 'primary', 'secondary', 'amber', 'emerald', 'rose', 'teal', 'purple'] as const;
    tints.forEach((tint) => {
      expect(TINT_BONE_MAP[tint]).toBeDefined();
      expect(TINT_SHIMMER_MAP[tint]).toBeDefined();
    });
  });

  it('supports building realistic module card recipes', () => {
    // 3 lines of description text: realistic width cycle + custom last line
    const descWidths = computeLineWidths(3, 'w-4/5', true);
    expect(descWidths.length).toBe(3);
    expect(descWidths[2]).toBe('w-4/5');
  });

  it('supports building realistic tabular row recipes with staggered delays', () => {
    // Row 0 has delay 0, Row 3 has delay 0.12
    expect(resolveRowDelay(0)).toBe(0);
    expect(resolveRowDelay(1)).toBe(0.04);
    expect(resolveRowDelay(2)).toBe(0.08);
    expect(resolveRowDelay(3)).toBe(0.12);
  });

  it('defaults shimmerTint to the container tint if not explicitly overridden', () => {
    const resolved = resolveRootContextValue({ hasParentRoot: false } as any, {
      tint: 'amber',
    });
    expect(resolved.tint).toBe('amber');
    expect(resolved.shimmerTint).toBe('amber');
  });

  it('preserves explicit shimmerTint override', () => {
    const resolved = resolveRootContextValue({ hasParentRoot: false } as any, {
      tint: 'purple',
      shimmerTint: 'teal',
    });
    expect(resolved.tint).toBe('purple');
    expect(resolved.shimmerTint).toBe('teal');
  });
});
