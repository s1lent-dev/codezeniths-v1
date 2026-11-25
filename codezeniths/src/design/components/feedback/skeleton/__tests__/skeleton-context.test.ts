import { describe, it, expect } from 'vitest';
import { TINT_BONE_MAP, TINT_SHIMMER_MAP, DEFAULT_SKELETON_CONTEXT } from '../constants';

describe('Skeleton Constants & Token Mappings', () => {
  it('defines correct tint mappings for light and dark modes', () => {
    expect(TINT_BONE_MAP.primary).toContain('bg-primary/20');
    expect(TINT_BONE_MAP.amber).toContain('bg-amber-500/20');
    expect(TINT_BONE_MAP.emerald).toContain('bg-emerald-500/20');
    expect(TINT_BONE_MAP.purple).toContain('bg-purple-500/20');
  });

  it('defines correct shimmer gradient mappings', () => {
    expect(TINT_SHIMMER_MAP.primary).toContain('via-primary/10');
    expect(TINT_SHIMMER_MAP.amber).toContain('via-amber-500/10');
  });

  it('provides sensible default context values', () => {
    expect(DEFAULT_SKELETON_CONTEXT.engine).toBe('motion');
    expect(DEFAULT_SKELETON_CONTEXT.animation).toBe('breathe');
    expect(DEFAULT_SKELETON_CONTEXT.shimmer).toBe(true);
    expect(DEFAULT_SKELETON_CONTEXT.speed).toBe(1);
    expect(DEFAULT_SKELETON_CONTEXT.hasParentRoot).toBe(false);
  });
});
