'use client';
import type { EmblaOptionsType, EmblaPluginType, EmblaCarouselType } from 'embla-carousel';
import type React from 'react';

// Enums for configuring Layouts & Effects
export enum CarouselAlign {
  CENTER = 'center',
  START = 'start',
  END = 'end',
}

export enum CarouselAxis {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum CarouselEffect {
  NONE = 'none',
  FADE = 'fade',
  SCALE = 'scale',
  OPACITY = 'opacity',
  PARALLAX = 'parallax',
  COVERFLOW = 'coverflow',
  CUBE = 'cube',
  FLIP = 'flip',
  CARDS = 'cards',
  CREATIVE = 'creative',
  MONOPARALLAX = 'monoparallax',
  WHEEL = 'wheel',
  INTERACTIVE3D = 'interactive3d',
  SPRING = 'spring',
}

export enum CarouselPluginName {
  AUTOPLAY = 'autoplay',
  AUTO_SCROLL = 'auto-scroll',
  AUTO_HEIGHT = 'auto-height',
  CLASS_NAMES = 'class-names',
  WHEEL_GESTURES = 'wheel-gestures',
  FADE = 'fade',
}

export enum CarouselModuleName {
  NAVIGATION = 'navigation',
  PAGINATION = 'pagination',
  SCROLLBAR = 'scrollbar',
  KEYBOARD = 'keyboard',
  THUMBS = 'thumbs',
  VIRTUAL = 'virtual',
}

export interface EmblaPluginLike {
  name: string;
  create: (options?: any) => EmblaPluginType;
  defaultOptions?: any;
}

export interface ModuleLike {
  name: string;
  component: React.FC<any>;
  defaultOptions?: any;
}

export interface EffectStrategy {
  name: string;
  getSlideStyle: (params: {
    slideProgress: number;
    slideIndex: number;
    totalSlides: number;
    options?: Record<string, unknown>;
  }) => React.CSSProperties;
  getContainerStyle?: (options?: Record<string, unknown>) => React.CSSProperties;
  slideClassName?: string;
  requiresPlugin?: CarouselPluginName;
}

export interface ProgressTrackerContextType {
  slideProgresses: number[];
}

export type CarouselOptions = EmblaOptionsType;
