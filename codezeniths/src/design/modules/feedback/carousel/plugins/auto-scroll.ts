import AutoScrollPlugin from 'embla-carousel-auto-scroll';
import type { EmblaPluginLike } from '../core/types';
import { CarouselPluginName } from '../core/types';

export const AutoScroll: EmblaPluginLike = {
  name: CarouselPluginName.AUTO_SCROLL,
  create: (options) => AutoScrollPlugin(options),
  defaultOptions: {
    speed: 2,
    startDelay: 1000,
    playOnInit: true,
    stopOnInteraction: true,
    stopOnMouseEnter: false,
    stopOnLastSnap: false,
  },
};
