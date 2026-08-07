import ClassNamesPlugin from 'embla-carousel-class-names';
import type { EmblaPluginLike } from '../core/types';
import { CarouselPluginName } from '../core/types';

export const ClassNames: EmblaPluginLike = {
  name: CarouselPluginName.CLASS_NAMES,
  create: (options) => ClassNamesPlugin(options),
  defaultOptions: {
    selected: 'is-selected',
    draggable: 'is-draggable',
    dragging: 'is-dragging',
  },
};
