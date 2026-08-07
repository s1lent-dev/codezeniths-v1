import type { EffectStrategy } from '../core/types';
import { CarouselEffect } from '../core/types';

export const CardsEffect: EffectStrategy = {
  name: CarouselEffect.CARDS,
  getSlideStyle: ({ slideProgress }: { slideProgress: number }) => ({
    transform: `translate3d(${slideProgress * 10}%, 0, ${-Math.abs(slideProgress) * 50}px) scale(${1 - Math.abs(slideProgress) * 0.05}) rotateZ(${slideProgress * 2}deg)`,
    zIndex: 100 - Math.abs(Math.round(slideProgress)),
  }),
};
