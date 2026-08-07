import AutoplayPlugin from 'embla-carousel-autoplay';
import type { EmblaPluginLike } from '../core/types';
import { CarouselPluginName } from '../core/types';

export const Autoplay: EmblaPluginLike = {
  name: CarouselPluginName.AUTOPLAY,
  create: (options) => AutoplayPlugin(options),
  defaultOptions: {
    delay: 4000,
    playOnInit: true,
    stopOnInteraction: true,
    stopOnMouseEnter: false,
    stopOnLastSnap: false,
  },
};
