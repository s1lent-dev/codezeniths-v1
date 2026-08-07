import AutoHeightPlugin from 'embla-carousel-auto-height';
import type { EmblaPluginLike } from '../core/types';
import { CarouselPluginName } from '../core/types';

export const AutoHeight: EmblaPluginLike = {
  name: CarouselPluginName.AUTO_HEIGHT,
  create: (options) => AutoHeightPlugin(options),
  defaultOptions: {
    destroyHeight: false,
  },
};
