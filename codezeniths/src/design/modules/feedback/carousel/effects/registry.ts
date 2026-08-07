import type { EffectStrategy } from '../core/types';
import { CarouselEffect } from '../core/types';
import { CardsEffect } from './cards';

export const EFFECT_REGISTRY: Record<string, EffectStrategy> = {
  [CarouselEffect.CARDS]: CardsEffect,
};
