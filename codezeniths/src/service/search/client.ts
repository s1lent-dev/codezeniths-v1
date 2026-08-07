import type { z } from 'zod';
import type { CollectionDefinition } from './types/search.types';
import { Collection } from './collections/collection';
import { CollectionNotFoundError } from './utils/search.errors';

export class SearchClient<TCollections extends Record<string, CollectionDefinition<any>> = Record<string, never>> {
  private readonly collections = new Map<string, { definition: CollectionDefinition<any>; instance: Collection<any> }>();

  registerCollection<TDef extends CollectionDefinition<any>>(
    definition: TDef
  ): SearchClient<TCollections & Record<TDef['name'], TDef>> {
    const instance = new Collection(definition);
    this.collections.set(definition.name, { definition, instance });
    return this as unknown as SearchClient<TCollections & Record<TDef['name'], TDef>>;
  }

  collection<K extends keyof TCollections & string>(
    name: K
  ): Collection<z.infer<TCollections[K]['schema']>> {
    const entry = this.collections.get(name);
    if (!entry) throw new CollectionNotFoundError(name);
    return entry.instance as Collection<z.infer<TCollections[K]['schema']>>;
  }
}

export const searchClient = new SearchClient();
