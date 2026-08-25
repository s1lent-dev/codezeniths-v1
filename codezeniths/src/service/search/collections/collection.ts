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
    const scanLimit = Math.max((opts?.limit ?? 10) * 10, 50);
    const suggestionsRaw = await redisService.trie.searchPrefix(key, prefix.toLowerCase(), scanLimit);
    return Array.from(
      new Set(
        suggestionsRaw
          .filter(r => r.endsWith('*'))
          .map(r => r.slice(0, -1))
      )
    ).slice(0, opts?.limit ?? 10);
  }


  async moreLikeThis(id: string, opts?: { limit?: number }): Promise<TDoc[]> {
    const documentsRaw = await redisService.client.get(`search:${this.definition.name}:all`);
    const documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];
    if (!documents.length) return [];
    return this.similarityStrategy.findSimilar(id, documents, opts?.limit ?? 5);
  }

  private extractDocumentPrefixes(doc: TDoc): string[] {
    if (!this.definition.autocompleteFields || this.definition.autocompleteFields.length === 0) {
      return [];
    }
    const prefixSet = new Set<string>();
    for (const field of this.definition.autocompleteFields) {
      const val = (doc as Record<string, unknown>)[field];
      if (typeof val === 'string' && val.trim().length > 0) {
        const clean = val.toLowerCase().trim();
        prefixSet.add(`${clean}*`);
        const words = clean.split(/[\s\-_/]+/);
        for (const word of words) {
          if (word.length >= 2) {
            prefixSet.add(`${word}*`);
            for (let i = 1; i <= word.length; i++) {
              prefixSet.add(word.substring(0, i));
            }
          }
        }
        const maxLen = Math.min(clean.length, 30);
        for (let i = 1; i <= maxLen; i++) {
          prefixSet.add(clean.substring(0, i));
        }
      }
    }
    return Array.from(prefixSet);
  }

  async addDocument(rawDoc: unknown): Promise<Result<void, SearchError>> {
    const collectionName = this.definition.name;
    const liveNamespace = `search:${collectionName}`;
    const liveTrieKey = `search:autocomplete:${collectionName}`;

    try {
      const parsed = this.definition.schema.safeParse(rawDoc);
      if (!parsed.success) {
        return err(new SearchValidationError(`Document validation failed for collection "${collectionName}"`, [parsed.error.message]));
      }

      const doc = parsed.data as TDoc;

      if (this.definition.phoneticFields && this.definition.phoneticFields.length > 0) {
        const encoder = phoneticAlgorithmRegistry.metaphone;
        for (const field of this.definition.phoneticFields) {
          const value = (doc as Record<string, unknown>)[field];
          if (typeof value === 'string') {
            const phoneticKey = `phonetic${field.charAt(0).toUpperCase() + field.slice(1)}`;
            (doc as Record<string, unknown>)[phoneticKey] = encoder.encode(value);
          }
        }
      }

      if (this.definition.autocompleteFields && this.definition.autocompleteFields.length > 0) {
        const prefixes = this.extractDocumentPrefixes(doc);
        if (prefixes.length > 0) {
          await redisService.trie.addPrefixes(liveTrieKey, prefixes);
        }
      }

      const documentsRaw = await redisService.client.get(`${liveNamespace}:all`);
      let documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];
      const idField = this.definition.idField as keyof TDoc;
      const targetId = (doc as Record<string, unknown>)[idField as string];

      const existingIndex = documents.findIndex(d => (d as Record<string, unknown>)[idField as string] === targetId);
      if (existingIndex >= 0) {
        documents[existingIndex] = doc;
      } else {
        documents.push(doc);
      }

      await redisService.client.set(`${liveNamespace}:all`, JSON.stringify(documents));
      return ok(undefined);
    } catch (error) {
      return err(new IndexingError(
        `Failed to add document to collection "${collectionName}": ${error instanceof Error ? error.message : String(error)}`
      ));
    }
  }

  async removeDocument(id: string): Promise<Result<void, SearchError>> {
    const collectionName = this.definition.name;
    const liveNamespace = `search:${collectionName}`;
    const liveTrieKey = `search:autocomplete:${collectionName}`;
    try {
      const documentsRaw = await redisService.client.get(`${liveNamespace}:all`);
      let documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];
      const idField = this.definition.idField as keyof TDoc;

      const docToRemove = documents.find(d => (d as Record<string, unknown>)[idField as string] === id);
      if (!docToRemove) {
        return ok(undefined);
      }

      const remainingDocs = documents.filter(d => (d as Record<string, unknown>)[idField as string] !== id);
      await redisService.client.set(`${liveNamespace}:all`, JSON.stringify(remainingDocs));

      // Clean up orphaned autocomplete prefixes
      if (this.definition.autocompleteFields && this.definition.autocompleteFields.length > 0) {
        const targetPrefixes = this.extractDocumentPrefixes(docToRemove);
        const remainingPrefixes = new Set<string>();
        for (const doc of remainingDocs) {
          for (const p of this.extractDocumentPrefixes(doc)) {
            remainingPrefixes.add(p);
          }
        }

        const prefixesToRemove = targetPrefixes.filter(p => !remainingPrefixes.has(p));
        if (prefixesToRemove.length > 0) {
          await redisService.trie.removePrefixes(liveTrieKey, prefixesToRemove);
        }
      }

      return ok(undefined);
    } catch (error) {
      return err(new IndexingError(
        `Failed to remove document from collection "${collectionName}": ${error instanceof Error ? error.message : String(error)}`
      ));
    }
  }

  async updateDocument(rawDoc: unknown): Promise<Result<void, SearchError>> {
    return this.addDocument(rawDoc);
  }

  async addUserIndex(userDoc: unknown): Promise<Result<void, SearchError>> {
    return this.addDocument(userDoc);
  }

  async removeUserIndex(userId: string): Promise<Result<void, SearchError>> {
    return this.removeDocument(userId);
  }

  async updateUserIndex(userDoc: unknown): Promise<Result<void, SearchError>> {
    return this.updateDocument(userDoc);
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
        const prefixSet = new Set<string>();

        for (const doc of validDocs) {
          for (const field of this.definition.autocompleteFields) {
            const val = (doc as Record<string, unknown>)[field];
            if (typeof val === 'string' && val.trim().length > 0) {
              const clean = val.toLowerCase().trim();
              prefixSet.add(`${clean}*`);

              // Add word-level prefixes for multi-word phrases
              const words = clean.split(/[\s\-_/]+/);
              for (const word of words) {
                if (word.length >= 2) {
                  prefixSet.add(`${word}*`);
                  for (let i = 1; i <= word.length; i++) {
                    prefixSet.add(word.substring(0, i));
                  }
                }
              }

              // Add full string prefixes up to reasonable length
              const maxLen = Math.min(clean.length, 30);
              for (let i = 1; i <= maxLen; i++) {
                prefixSet.add(clean.substring(0, i));
              }
            }
          }
        }

        const prefixes = Array.from(prefixSet);
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

      // Build Tag Co-Occurrence Relationship Graph for Problems collection
      if (collectionName === 'problems') {
        const coMap: Record<string, Record<string, number>> = {};
        for (const doc of validDocs) {
          const rawTags = (doc as Record<string, unknown>).tags;
          if (Array.isArray(rawTags)) {
            const tags = rawTags
              .filter((t): t is string => typeof t === 'string' && t.trim().length > 0 && !t.startsWith('module-'))
              .map(t => t.trim().toLowerCase());
            for (const tagA of tags) {
              if (!coMap[tagA]) coMap[tagA] = {};
              for (const tagB of tags) {
                if (tagA !== tagB) {
                  coMap[tagA][tagB] = (coMap[tagA][tagB] || 0) + 1;
                }
              }
            }
          }
        }

        const tagEntries = Object.entries(coMap).slice(0, 100);
        if (tagEntries.length > 0) {
          const pipeline = redisService.client.pipeline();
          for (const [tagA, relatedObj] of tagEntries) {
            const topRelated = Object.entries(relatedObj)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([t]) => t);
            if (topRelated.length > 0) {
              pipeline.set(`search:tag_relations:${tagA}`, JSON.stringify(topRelated));
            }
          }
          await pipeline.exec();
        }
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
