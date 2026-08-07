import type { CollectionDefinition, IndexSummary } from '../types/search.types';
import { Result, ok, err } from '../types/search.types';
import { SearchError, SearchValidationError, IndexingError } from '../utils/search.errors';
import { SearchQueryBuilder } from '../query-builder';
import { MoreLikeThisStrategy } from '../utils/scoring';
import { phoneticAlgorithmRegistry } from '../utils/algorithms';
import { redisService } from '@codezeniths/lib/redis';

export class Collection<TDoc> {
  private readonly similarityStrategy: MoreLikeThisStrategy<TDoc>;

  constructor(private readonly definition: CollectionDefinition<any>) {
    this.similarityStrategy = new MoreLikeThisStrategy<TDoc>(
      definition.similarityFields ?? [],
      definition.idField as string
    );
  }

  query(text: string): SearchQueryBuilder<TDoc> {
    return SearchQueryBuilder.create<TDoc>(this.definition, text);
  }

  async autocomplete(prefix: string, opts?: { limit?: number }): Promise<string[]> {
    const key = `search:autocomplete:${this.definition.name}`;
    const suggestionsRaw = await redisService.trie.searchPrefix(key, prefix.toLowerCase(), opts?.limit ?? 10);
    return suggestionsRaw.filter(r => r.endsWith('*')).map(r => r.slice(0, -1));
  }

  async moreLikeThis(id: string, opts?: { limit?: number }): Promise<TDoc[]> {
    const documentsRaw = await redisService.client.get(`search:${this.definition.name}:all`);
    const documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];
    if (!documents.length) return [];
    return this.similarityStrategy.findSimilar(id, documents, opts?.limit ?? 5);
  }

  async reindex(loader: () => Promise<TDoc[]>): Promise<Result<IndexSummary, SearchError>> {
    const startTime = Date.now();
    const collectionName = this.definition.name;
    const stagingKey = `_staging_${Date.now()}`;
    const stagingNamespace = `search:${collectionName}:${stagingKey}`;
    const liveNamespace = `search:${collectionName}`;
    const stagingTrieKey = `search:autocomplete:${collectionName}:${stagingKey}`;
    const liveTrieKey = `search:autocomplete:${collectionName}`;
    
    try {
      const rawDocs = await loader();
      const validDocs: TDoc[] = [];
      const validationErrors: string[] = [];
      
      for (let i = 0; i < rawDocs.length; i++) {
        const result = this.definition.schema.safeParse(rawDocs[i]);
        if (result.success) validDocs.push(result.data as TDoc);
        else validationErrors.push(`Document ${i}: ${result.error.message}`);
      }
      
      if (validDocs.length === 0 && rawDocs.length > 0) {
        return err(new SearchValidationError('All documents failed validation', validationErrors));
      }
      
      if (this.definition.phoneticFields && this.definition.phoneticFields.length > 0) {
        const encoder = phoneticAlgorithmRegistry.metaphone;
        for (const doc of validDocs) {
          for (const field of this.definition.phoneticFields) {
            const value = (doc as Record<string, unknown>)[field];
            if (typeof value === 'string') {
              const phoneticKey = `phonetic${field.charAt(0).toUpperCase() + field.slice(1)}`;
              (doc as Record<string, unknown>)[phoneticKey] = encoder.encode(value);
            }
          }
        }
      }
      
      await redisService.client.set(`${stagingNamespace}:all`, JSON.stringify(validDocs));
      
      let autocompleteEntries = 0;
      if (this.definition.autocompleteFields && this.definition.autocompleteFields.length > 0) {
        const values: string[] = [];
        for (const doc of validDocs) {
          for (const field of this.definition.autocompleteFields) {
            const val = (doc as Record<string, unknown>)[field];
            if (typeof val === 'string') values.push(val);
          }
        }
        const prefixes: string[] = [];
        for (const value of values) {
          const normalized = value.toLowerCase();
          prefixes.push(`${normalized}*`);
          for (let i = 1; i <= normalized.length; i++) prefixes.push(normalized.substring(0, i));
        }
        if (prefixes.length > 0) {
          await redisService.trie.addPrefixes(stagingTrieKey, prefixes);
        }
        autocompleteEntries = prefixes.length;
      }
      
      await redisService.client.del(`${liveNamespace}:all`);
      await redisService.client.eval("redis.call('RENAME', ARGV[1], ARGV[2])", [], [`${stagingNamespace}:all`, `${liveNamespace}:all`]);
      
      if (autocompleteEntries > 0) {
        await redisService.client.del(liveTrieKey);
        await redisService.client.eval("redis.call('RENAME', ARGV[1], ARGV[2])", [], [stagingTrieKey, liveTrieKey]);
      }
      
      return ok({
        collection: collectionName,
        documentsIndexed: validDocs.length,
        autocompleteEntries,
        phoneticEntries: this.definition.phoneticFields?.length ?? 0,
        tookMs: Date.now() - startTime,
      });
    } catch (error) {
      try {
        await redisService.client.del(`${stagingNamespace}:all`);
        await redisService.client.del(stagingTrieKey);
      } catch { /* cleanup failure is non-critical */ }
      
      return err(new IndexingError(
        `Reindex failed for collection "${collectionName}": ${error instanceof Error ? error.message : String(error)}`
      ));
    }
  }
}
