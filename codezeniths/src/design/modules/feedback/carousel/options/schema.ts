import { z } from 'zod';
import {
  CarouselAlign,
  CarouselAxis,
  CarouselPluginName,
  CarouselModuleName,
  CarouselEffect,
} from '../core/types';

export const carouselLayoutSchema = z.object({
  align: z.enum(CarouselAlign).default(CarouselAlign.CENTER),
  axis: z.enum(CarouselAxis).default(CarouselAxis.HORIZONTAL),
  slidesPerView: z.union([z.number().positive(), z.literal('auto')]).default(1),
  spaceBetween: z.number().nonnegative().default(0),
  containScroll: z.union([z.literal('trimSnaps'), z.literal('keepSnaps'), z.boolean()]).default('trimSnaps'),
});

export const carouselCoreOptionsSchema = z.object({
  active: z.boolean().default(true),
  loop: z.boolean().default(false),
  dragFree: z.boolean().default(false),
  dragThreshold: z.number().positive().default(10),
  duration: z.number().positive().default(25),
  skipSnaps: z.boolean().default(false),
  startIndex: z.number().nonnegative().default(0),
  watchDrag: z.boolean().default(true),
  watchResize: z.boolean().default(true),
  watchSlides: z.boolean().default(true),
});

export const carouselPluginConfigSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal(CarouselPluginName.AUTOPLAY),
    options: z.object({
      delay: z.number().positive().default(4000),
      playOnInit: z.boolean().default(true),
      stopOnInteraction: z.boolean().default(true),
      stopOnMouseEnter: z.boolean().default(false),
      stopOnLastSnap: z.boolean().default(false),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselPluginName.AUTO_SCROLL),
    options: z.object({
      speed: z.number().default(2),
      startDelay: z.number().nonnegative().default(1000),
      playOnInit: z.boolean().default(true),
      stopOnInteraction: z.boolean().default(true),
      stopOnMouseEnter: z.boolean().default(false),
      stopOnLastSnap: z.boolean().default(false),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselPluginName.AUTO_HEIGHT),
    options: z.object({
      destroyHeight: z.boolean().default(false),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselPluginName.CLASS_NAMES),
    options: z.object({
      selected: z.string().default('is-selected'),
      draggable: z.string().default('is-draggable'),
      dragging: z.string().default('is-dragging'),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselPluginName.WHEEL_GESTURES),
    options: z.object({
      forceWheelGesture: z.boolean().default(false),
      wheelDraggingClass: z.string().default('is-wheel-dragging'),
    }).partial().optional(),
  }),
]);

export const carouselModuleConfigSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal(CarouselModuleName.NAVIGATION),
    options: z.object({
      showArrows: z.boolean().default(true),
      arrowClass: z.string().optional(),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselModuleName.PAGINATION),
    options: z.object({
      type: z.enum(['bullets', 'fraction', 'progressbar']).default('bullets'),
      clickable: z.boolean().default(true),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselModuleName.SCROLLBAR),
    options: z.object({
      draggable: z.boolean().default(true),
      hide: z.boolean().default(false),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselModuleName.KEYBOARD),
    options: z.object({
      enabled: z.boolean().default(true),
      onlyInViewport: z.boolean().default(true),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselModuleName.THUMBS),
    options: z.object({
      multipleActiveThumbs: z.boolean().default(true),
    }).partial().optional(),
  }),
  z.object({
    name: z.literal(CarouselModuleName.VIRTUAL),
    options: z.object({
      cache: z.boolean().default(true),
    }).partial().optional(),
  }),
]);

export const carouselEffectSchema = z.object({
  effect: z.enum(CarouselEffect).default(CarouselEffect.NONE),
  effectOptions: z.object({
    rotate: z.number().optional(),
    depth: z.number().optional(),
    stretch: z.number().optional(),
    modifier: z.number().optional(),
    scale: z.number().optional(),
    perSlideRotate: z.number().optional(),
    perSlideOffset: z.number().optional(),
  }).partial().optional(),
});

export const carouselConfigSchema = z.object({
  layout: carouselLayoutSchema.partial().optional(),
  options: carouselCoreOptionsSchema.partial().optional(),
  plugins: z.array(carouselPluginConfigSchema).optional(),
  modules: z.array(carouselModuleConfigSchema).optional(),
  effects: carouselEffectSchema.partial().optional(),
});

// We have to add breakpoints dynamically because of z.lazy or z.record.
// To keep it simple, we define it here:
export const fullCarouselConfigSchema = carouselConfigSchema.extend({
  breakpoints: z.record(z.string(), carouselConfigSchema).optional(),
});

export type CarouselConfig = z.infer<typeof fullCarouselConfigSchema>;
