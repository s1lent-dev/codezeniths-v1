import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import type { EmblaPluginLike } from '../core/types';
import { CarouselPluginName } from '../core/types';

export const WheelGestures: EmblaPluginLike = {
  name: CarouselPluginName.WHEEL_GESTURES,
  create: (options) => WheelGesturesPlugin(options),
  defaultOptions: {
    forceWheelGesture: false,
    wheelDraggingClass: 'is-wheel-dragging',
  },
};
