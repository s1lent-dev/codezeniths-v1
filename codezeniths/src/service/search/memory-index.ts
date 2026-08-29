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
  private readonly VERSION_CHECK_TTL_MS = 5000; // Check Redis version at most once every 5 seconds

  /**
   * Retrieves all documents for a collection from in-memory RAM.
   * If stale or not present, hydrates from Redis and caches the parsed result.
   */
  async getDocuments<TDoc>(collectionName: string): Promise<TDoc[]> {
    const now = Date.now();
    const entry = this.cache.get(collectionName);

    // Fast path: In-memory cache is valid within the TTL window (0ms, 0 Redis calls)
    if (entry && now - entry.lastCheckedAt < this.VERSION_CHECK_TTL_MS) {
      return entry.documents as TDoc[];
    }

    try {
      // Step 1: Lightweight version probe (only checks a tiny string in Redis)
      const versionKey = RedisStore.search.version(collectionName);
      const redisVersion = await redisService.client.get(versionKey);

      // If version has not changed, extend the TTL window and reuse parsed RAM objects
      if (entry && redisVersion && entry.version === redisVersion) {
        entry.lastCheckedAt = now;
        return entry.documents as TDoc[];
      }

      // Step 2: Hydrate full collection from Redis if version changed or cache is cold
      const allDocsKey = RedisStore.search.allDocuments(collectionName);
      const documentsRaw = await redisService.client.get(allDocsKey);
      const documents: TDoc[] = documentsRaw ? JSON.parse(documentsRaw) : [];

      const activeVersion = redisVersion || now.toString();
      this.cache.set(collectionName, {
        documents,
        version: activeVersion,
        lastCheckedAt: now,
      });

      return documents;
    } catch (error) {
      logger.warn(`[MemorySearchIndex] Failed to synchronize collection "${collectionName}" from Redis`, { error });
      // Fallback to existing cache if available during network hiccups
      if (entry) {
        return entry.documents as TDoc[];
      }
      return [];
    }
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
  }
}

export const memorySearchIndex = new MemorySearchIndex();
