'use client';
import React from 'react';
import { useCarouselContext } from '../core/CarouselProvider';
import { CarouselEffect } from '../core/types';
import { useScaleEffect } from './scale';
import { useParallaxEffect } from './parallax';
import { useMonoParallaxEffect } from './monoparallax';
import { useOpacityEffect } from './opacity';
import { useCoverflowEffect } from './coverflow';
import { useFlipEffect } from './flip';
import { useCubeEffect } from './cube';
import { useCreativeEffect } from './creative';
import { useFadeEffect } from './fade';
import { useWheelEffect } from './wheel';
import { useInteractive3DEffect } from './interactive3d';
import { useSpringEffect } from './spring';

export const EffectsController: React.FC = () => {
  const { emblaApi, activeEffect, effectOptions } = useCarouselContext();

  useSpringEffect(activeEffect === CarouselEffect.SPRING ? emblaApi : undefined, effectOptions);
  useInteractive3DEffect(activeEffect === CarouselEffect.INTERACTIVE3D ? emblaApi : undefined, effectOptions);

  useWheelEffect(activeEffect === CarouselEffect.WHEEL ? emblaApi : undefined, effectOptions);
  useFadeEffect(activeEffect === CarouselEffect.FADE ? emblaApi : undefined);
  useScaleEffect(activeEffect === CarouselEffect.SCALE ? emblaApi : undefined);
  useParallaxEffect(activeEffect === CarouselEffect.PARALLAX ? emblaApi : undefined);
  useMonoParallaxEffect(activeEffect === CarouselEffect.MONOPARALLAX ? emblaApi : undefined);
  useOpacityEffect(activeEffect === CarouselEffect.OPACITY ? emblaApi : undefined);
  useCoverflowEffect(activeEffect === CarouselEffect.COVERFLOW ? emblaApi : undefined);
  useFlipEffect(activeEffect === CarouselEffect.FLIP ? emblaApi : undefined);
  useCubeEffect(activeEffect === CarouselEffect.CUBE ? emblaApi : undefined);
  useCreativeEffect(activeEffect === CarouselEffect.CREATIVE ? emblaApi : undefined, effectOptions);

  return null;
};
