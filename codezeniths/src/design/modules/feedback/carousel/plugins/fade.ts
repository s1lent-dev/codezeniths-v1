import FadePlugin from 'embla-carousel-fade';
import type { EmblaPluginLike } from '../core/types';
import { CarouselPluginName } from '../core/types';

export const Fade: EmblaPluginLike = {
  name: CarouselPluginName.FADE,
  create: (options) => FadePlugin(options),
  defaultOptions: {},
};
