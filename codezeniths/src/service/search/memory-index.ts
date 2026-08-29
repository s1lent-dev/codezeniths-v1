import { redisService } from '@codezeniths/lib/redis';
import { RedisStore } from '@codezeniths/lib/redis';
import { logger } from '@/service/logging';

interface CacheEntry<TDoc = any> {
  documents: TDoc[];
  version: string | null;
  lastCheckedAt: number;
}

/**
 * In-Memory Search Cache
 * Stores parsed document collections in Node.js RAM (L1 Cache) with TTL-governed
 * Redis version checking (L2 Cache) to guarantee sub-millisecond search execution
 * and eliminate repetitive JSON parsing and Redis network latency on every keystroke.
 */
export class MemorySearchIndex {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly inflight = new Map<string, Promise<any[]>>();
  private readonly VERSION_CHECK_TTL_MS = 10000; // Check Redis version at most once every 10 seconds

  /**
   * Retrieves all documents for a collection from in-memory RAM.
   * If stale or not present, hydrates from Redis and caches the parsed result.
   * Uses single-flight deduplication to avoid redundant parallel Redis queries during cold start.
   */
  async getDocuments<TDoc>(collectionName: string): Promise<TDoc[]> {
    const now = Date.now();
    const entry = this.cache.get(collectionName);

    // Fast path: In-memory cache is valid within the TTL window (0ms, 0 Redis calls)
    if (entry && now - entry.lastCheckedAt < this.VERSION_CHECK_TTL_MS) {
      return entry.documents as TDoc[];
    }

    // Deduplicate in-flight fetch for the same collection
    const existingPromise = this.inflight.get(collectionName);
    if (existingPromise) {
      return existingPromise as Promise<TDoc[]>;
    }

    const fetchPromise = (async () => {
      try {
        // Step 1: Lightweight version probe (only checks a tiny string in Redis)
        const versionKey = RedisStore.search.version(collectionName);
        const redisVersion = await redisService.client.get(versionKey);

        // If version has not changed, extend the TTL window and reuse parsed RAM objects
        if (entry && redisVersion && entry.version === redisVersion) {
          entry.lastCheckedAt = Date.now();
          return entry.documents as TDoc[];
        }

        // Step 2: Hydrate full collection from Redis if version changed or cache is cold
        const allDocsKey = RedisStore.search.allDocuments(collectionName);
        const documentsRaw = await redisService.client.get(allDocsKey);
        const documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];

        const activeVersion = redisVersion || Date.now().toString();
        this.cache.set(collectionName, {
          documents,
          version: activeVersion,
          lastCheckedAt: Date.now(),
        });

        return documents;
      } catch (error) {
        logger.warn(`[MemorySearchIndex] Failed to synchronize collection "${collectionName}" from Redis`, { error });
        // Fallback to existing cache if available during network hiccups
        if (entry) {
          return entry.documents as TDoc[];
        }
        return [];
      } finally {
        this.inflight.delete(collectionName);
      }
    })();

    this.inflight.set(collectionName, fetchPromise);
    return fetchPromise as Promise<TDoc[]>;
  }

  /**
   * Eagerly preloads and warms up all or specified collections in RAM.
   */
  async preloadCollections(
    collectionNames: string[] = ['problems', 'topics', 'modules', 'tags', 'products', 'users']
  ): Promise<void> {
    await Promise.allSettled(collectionNames.map((name) => this.getDocuments(name)));
  }

  /**
   * Directly sets or updates in-memory documents for a collection.
   */
  setDocuments<TDoc>(collectionName: string, documents: TDoc[], version?: string): void {
    this.cache.set(collectionName, {
      documents,
      version: version ?? Date.now().toString(),
      lastCheckedAt: Date.now(),
    });
  }

  /**
   * Invalidates a collection in memory, forcing the next search query to re-check Redis.
   */
  invalidate(collectionName: string): void {
    const entry = this.cache.get(collectionName);
    if (entry) {
      entry.lastCheckedAt = 0;
      entry.version = null;
    }
  }

  /**
   * Clears the entire in-memory search cache across all collections.
   */
  clear(): void {
    this.cache.clear();
    this.inflight.clear();
  }
}

export const memorySearchIndex = new MemorySearchIndex();
