import { describe, it, expect } from 'vitest';
import { resolveRootContextValue } from '../skeleton-root';

describe('Skeleton Root Context Resolver', () => {
  it('instantiates root context with defaults when top-level', () => {
    const parentContext = { hasParentRoot: false } as any;
    const resolved = resolveRootContextValue(parentContext, {
      tint: 'purple',
      shimmer: true,
    });
    expect(resolved.tint).toBe('purple');
    expect(resolved.hasParentRoot).toBe(true);
    expect(resolved.shimmer).toBe(true);
    expect(resolved.shouldRenderShimmer).toBe(true);
  });

  it('inherits parent context properties and prevents double shimmer when nested', () => {
    const parentContext = {
      engine: 'motion',
      animation: 'breathe',
      tint: 'primary',
      speed: 1.2,
      baseDelay: 0.1,
      shimmer: true,
      shimmerTint: 'primary',
      hasParentRoot: true,
    } as any;

    const resolved = resolveRootContextValue(parentContext, {});
    expect(resolved.tint).toBe('primary');
    expect(resolved.speed).toBe(1.2);
    // When nested in a root that already has shimmer, child suppresses its duplicate shimmer
    expect(resolved.shouldRenderShimmer).toBe(false);
  });

  it('allows overriding engine and animation on child root', () => {
    const parentContext = {
      engine: 'motion',
      animation: 'breathe',
      tint: 'primary',
      speed: 1,
      baseDelay: 0,
      shimmer: false,
      shimmerTint: 'primary',
      hasParentRoot: true,
    } as any;

    const resolved = resolveRootContextValue(parentContext, {
      engine: 'css',
      animation: 'pulse',
    });
    expect(resolved.engine).toBe('css');
    expect(resolved.animation).toBe('pulse');
  });
});
