import type { ModuleLike } from '../core/types';
import { CarouselModuleName } from '../core/types';
import { NavigationModule } from './navigation';
import { PaginationModule } from './pagination';
import { ScrollbarModule } from './scrollbar';
import { KeyboardModule } from './keyboard';
import { ThumbsModule } from './thumbs';
import { VirtualModule } from './virtual';

export const MODULE_REGISTRY: Record<string, ModuleLike> = {
  [CarouselModuleName.NAVIGATION]: { name: CarouselModuleName.NAVIGATION, component: NavigationModule },
  [CarouselModuleName.PAGINATION]: { name: CarouselModuleName.PAGINATION, component: PaginationModule },
  [CarouselModuleName.SCROLLBAR]: { name: CarouselModuleName.SCROLLBAR, component: ScrollbarModule },
  [CarouselModuleName.KEYBOARD]: { name: CarouselModuleName.KEYBOARD, component: KeyboardModule },
  [CarouselModuleName.THUMBS]: { name: CarouselModuleName.THUMBS, component: ThumbsModule },
  [CarouselModuleName.VIRTUAL]: { name: CarouselModuleName.VIRTUAL, component: VirtualModule },
};
