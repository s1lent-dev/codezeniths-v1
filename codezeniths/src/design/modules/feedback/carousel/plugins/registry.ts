import type { EmblaPluginLike } from '../core/types';
import { CarouselPluginName } from '../core/types';
import { Autoplay } from './autoplay';
import { AutoScroll } from './auto-scroll';
import { AutoHeight } from './auto-height';
import { ClassNames } from './class-names';
import { WheelGestures } from './wheel-gestures';
import { Fade } from './fade';

export const PLUGIN_REGISTRY: Record<string, EmblaPluginLike> = {
  [CarouselPluginName.AUTOPLAY]: Autoplay,
  [CarouselPluginName.AUTO_SCROLL]: AutoScroll,
  [CarouselPluginName.AUTO_HEIGHT]: AutoHeight,
  [CarouselPluginName.CLASS_NAMES]: ClassNames,
  [CarouselPluginName.WHEEL_GESTURES]: WheelGestures,
  [CarouselPluginName.FADE]: Fade,
};

export function instantiatePlugin(name: string, options?: any) {
  const pluginDef = PLUGIN_REGISTRY[name];
  if (!pluginDef) {
    console.warn(`Plugin ${name} not found in registry.`);
    return null;
  }
  return pluginDef.create({ ...pluginDef.defaultOptions, ...options });
}
