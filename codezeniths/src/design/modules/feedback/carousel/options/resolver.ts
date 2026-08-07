import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import { CarouselAxis, CarouselEffect, CarouselPluginName } from '../core/types';
import { fullCarouselConfigSchema, type CarouselConfig } from './schema';

import { instantiatePlugin } from '../plugins/registry';

export interface ResolvedCarouselConfig {
  emblaOptions: EmblaOptionsType;
  layoutClassNames: string;
  activePlugins: EmblaPluginType[];
  activeModuleConfigs: any[];
  activeEffect: CarouselEffect;
  effectOptions: any;
}

export function resolveCarouselConfig(config: CarouselConfig): ResolvedCarouselConfig {
  const parsed = fullCarouselConfigSchema.parse(config);
  
  const layout = parsed.layout || {};
  const options = parsed.options || {};
  const pluginsConfig = parsed.plugins || [];
  const modulesConfig = parsed.modules || [];
  const effectsConfig = parsed.effects || {};

  // Build Embla Core Options
  const emblaOptions: EmblaOptionsType = {
    active: options.active,
    align: layout.align,
    axis: layout.axis === CarouselAxis.VERTICAL ? 'y' : 'x',
    containScroll: layout.containScroll as any, // 'trimSnaps' | 'keepSnaps' | false
    loop: options.loop,
    dragFree: options.dragFree,
    dragThreshold: options.dragThreshold,
    duration: options.duration,
    skipSnaps: options.skipSnaps,
    startIndex: options.startIndex,
    watchDrag: options.watchDrag,
    watchResize: options.watchResize,
    watchSlides: options.watchSlides,
  };

  // Build layout classNames string
  const classes: string[] = [];
  if (layout.slidesPerView && layout.slidesPerView !== 'auto') {
    // Generate basis-class dynamically or set inline style var
    // For simplicity, we can use a custom property approach in actual component
  }

  const activePlugins: EmblaPluginType[] = [];
  pluginsConfig.forEach((p) => {
    const pluginInstance = instantiatePlugin(p.name, p.options);
    if (pluginInstance) activePlugins.push(pluginInstance);
  });

  if (effectsConfig.effect === CarouselEffect.FADE) {
    const hasFadePlugin = activePlugins.some((p) => p.name === 'fade');
    if (!hasFadePlugin) {
      const fadePlugin = instantiatePlugin(CarouselPluginName.FADE);
      if (fadePlugin) activePlugins.push(fadePlugin);
    }
  }

  return {
    emblaOptions,
    layoutClassNames: classes.join(' '),
    activePlugins,
    activeModuleConfigs: modulesConfig,
    activeEffect: effectsConfig.effect || CarouselEffect.NONE,
    effectOptions: effectsConfig.effectOptions || {},
  };
}
