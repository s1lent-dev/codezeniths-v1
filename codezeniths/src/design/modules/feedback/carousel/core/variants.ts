import { cva } from 'class-variance-authority';
import { CarouselAxis, CarouselEffect } from './types';

export const carouselVariants = cva(
  'relative w-full min-w-0 max-w-full',
  {
    variants: {
      axis: {
        [CarouselAxis.HORIZONTAL]: '',
        [CarouselAxis.VERTICAL]: '',
      },
    },
    defaultVariants: {
      axis: CarouselAxis.HORIZONTAL,
    },
  }
);

export const carouselContentVariants = cva(
  'overflow-hidden w-full min-w-0 max-w-full',
  {
    variants: {
      effect: {
        [CarouselEffect.NONE]: '',
        [CarouselEffect.FADE]: '',
        [CarouselEffect.SCALE]: '',
        [CarouselEffect.OPACITY]: '',
        [CarouselEffect.PARALLAX]: '',
        [CarouselEffect.COVERFLOW]: '[perspective:1200px] overflow-visible',
        [CarouselEffect.CUBE]: '[perspective:1200px] overflow-visible',
        [CarouselEffect.FLIP]: '[perspective:1200px] overflow-visible',
        [CarouselEffect.CARDS]: 'overflow-visible',
        [CarouselEffect.CREATIVE]: '[perspective:1200px]',
        [CarouselEffect.MONOPARALLAX]: '',
        [CarouselEffect.WHEEL]: '[perspective:1500px] overflow-visible',
        [CarouselEffect.INTERACTIVE3D]: '[perspective:1500px] overflow-visible',
        [CarouselEffect.SPRING]: 'overflow-visible',
      }
    },
    defaultVariants: {
      effect: CarouselEffect.NONE,
    }
  }
);

export const carouselTrackVariants = cva(
  'flex',
  {
    variants: {
      axis: {
        [CarouselAxis.HORIZONTAL]: 'flex-row -ml-4',
        [CarouselAxis.VERTICAL]: 'flex-col -mt-4',
      },
      effect: {
        [CarouselEffect.NONE]: '',
        [CarouselEffect.FADE]: '',
        [CarouselEffect.SCALE]: '',
        [CarouselEffect.OPACITY]: '',
        [CarouselEffect.PARALLAX]: '',
        [CarouselEffect.COVERFLOW]: '[transform-style:preserve-3d]',
        [CarouselEffect.CUBE]: '[transform-style:preserve-3d] ml-0',
        [CarouselEffect.FLIP]: '[transform-style:preserve-3d] ml-0',
        [CarouselEffect.CARDS]: '',
        [CarouselEffect.CREATIVE]: '[transform-style:preserve-3d] ml-0',
        [CarouselEffect.MONOPARALLAX]: '',
        [CarouselEffect.WHEEL]: '[transform-style:preserve-3d] ml-0',
        [CarouselEffect.INTERACTIVE3D]: '[transform-style:preserve-3d] ml-0',
        [CarouselEffect.SPRING]: 'ml-0',
      }
    },
    defaultVariants: {
      axis: CarouselAxis.HORIZONTAL,
      effect: CarouselEffect.NONE,
    },
  }
);

export const carouselSlideVariants = cva(
  'min-w-0 shrink-0 grow-0 basis-full relative',
  {
    variants: {
      axis: {
        [CarouselAxis.HORIZONTAL]: 'pl-4',
        [CarouselAxis.VERTICAL]: 'pt-4',
      },
      effect: {
        [CarouselEffect.NONE]: '',
        [CarouselEffect.FADE]: '',
        [CarouselEffect.SCALE]: 'will-change-transform transform-gpu',
        [CarouselEffect.OPACITY]: 'will-change-opacity transform-gpu',
        [CarouselEffect.PARALLAX]: 'transform-gpu',
        [CarouselEffect.MONOPARALLAX]: 'transform-gpu',
        [CarouselEffect.COVERFLOW]: '[transform-style:preserve-3d]',
        [CarouselEffect.CUBE]: '[transform-style:preserve-3d] pl-0',
        [CarouselEffect.FLIP]: '[transform-style:preserve-3d] pl-0',
        [CarouselEffect.CARDS]: 'will-change-transform',
        [CarouselEffect.CREATIVE]: '[transform-style:preserve-3d] pl-0',
        [CarouselEffect.WHEEL]: '[transform-style:preserve-3d] pl-0',
        [CarouselEffect.INTERACTIVE3D]: '[transform-style:preserve-3d] pl-0',
        [CarouselEffect.SPRING]: 'pl-0 transform-gpu',
      }
    },
    defaultVariants: {
      axis: CarouselAxis.HORIZONTAL,
      effect: CarouselEffect.NONE,
    },
  }
);
