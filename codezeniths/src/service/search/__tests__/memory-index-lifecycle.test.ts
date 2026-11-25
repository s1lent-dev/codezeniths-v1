import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  MemorySearchIndex,
  COLLECTION_IDLE_TTL_MS,
  MAX_CACHED_COLLECTIONS,
  memorySearchIndex,
} from '../memory-index';
import { Collection } from '../collections/collection';
import { problemsCollection } from '../collections/collection.definitions';
import { redisService, RedisStore } from '@codezeniths/lib/redis';

vi.mock('@codezeniths/lib/redis', () => ({
  redisService: {
    client: {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      eval: vi.fn(),
      pipeline: vi.fn(() => ({
        set: vi.fn(),
        exec: vi.fn().mockResolvedValue([]),
      })),
    },
    trie: {
      searchPrefix: vi.fn().mockResolvedValue([]),
      addPrefixes: vi.fn().mockResolvedValue(undefined),
      removePrefixes: vi.fn().mockResolvedValue(undefined),
    },
  },
  RedisStore: {
    search: {
      allDocuments: (col: string) => `search:${col}:all`,
      version: (col: string) => `search:${col}:version`,
      autocompleteTrie: (col: string) => `search:autocomplete:${col}`,
      tagRelations: (q: string) => `search:tag_relations:${q}`,
    },
  },
}));

vi.mock('@/service/logging', () => ({
  logger: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

describe('MemorySearchIndex Lifecycle & Idle Eviction', () => {
  let index: MemorySearchIndex;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    index = new MemorySearchIndex();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('lastAccessedAt tracking', () => {
    it('sets lastAccessedAt upon initial hydration in getDocuments', async () => {
      const now = 1000000;
      vi.setSystemTime(now);

      const mockDocs = [{ id: '1', title: 'Problem 1' }];
      vi.mocked(redisService.client.get).mockImplementation(async (key: string) => {
        if (key === RedisStore.search.version('problems')) return 'v1';
        if (key === RedisStore.search.allDocuments('problems')) return JSON.stringify(mockDocs);
        return null;
      });

      const docs = await index.getDocuments('problems');
      expect(docs).toEqual(mockDocs);

      const entry = index.getEntry('problems');
      expect(entry).toBeDefined();
      expect(entry?.lastAccessedAt).toBe(now);
      expect(entry?.lastCheckedAt).toBe(now);
      expect(entry?.version).toBe('v1');
    });

    it('refreshes lastAccessedAt on fast-path cache hit within TTL', async () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);

      index.setDocuments('problems', [{ id: '1' }], 'v1');
      expect(index.getEntry('problems')?.lastAccessedAt).toBe(startTime);

      // Advance by 3 seconds (less than 10s VERSION_CHECK_TTL_MS)
      const accessTime = startTime + 3000;
      vi.setSystemTime(accessTime);

      const docs = await index.getDocuments('problems');
      expect(docs).toHaveLength(1);
      expect(index.getEntry('problems')?.lastAccessedAt).toBe(accessTime);
      // Redis shouldn't have been queried on fast path
      expect(redisService.client.get).not.toHaveBeenCalled();
    });

    it('refreshes lastAccessedAt when Redis version matches existing cached version', async () => {
      const startTime = 1000000;
      vi.setSystemTime(startTime);

      index.setDocuments('problems', [{ id: '1' }], 'v1');

      // Advance past 10s TTL window
      const accessTime = startTime + 15000;
      vi.setSystemTime(accessTime);

      vi.mocked(redisService.client.get).mockImplementation(async (key: string) => {
        if (key === RedisStore.search.version('problems')) return 'v1';
        return null;
      });

      const docs = await index.getDocuments('problems');
      expect(docs).toHaveLength(1);
      expect(index.getEntry('problems')?.lastAccessedAt).toBe(accessTime);
      expect(index.getEntry('problems')?.lastCheckedAt).toBe(accessTime);
    });

    it('records lastAccessedAt on setDocuments', () => {
      const now = 2000000;
      vi.setSystemTime(now);

      index.setDocuments('topics', [{ id: 'topic-1' }], 'v2');
      const entry = index.getEntry('topics');
      expect(entry).toBeDefined();
      expect(entry?.lastAccessedAt).toBe(now);
      expect(entry?.lastCheckedAt).toBe(now);
      expect(entry?.version).toBe('v2');
    });
  });

  describe('sweepStaleCollections', () => {
    it('evicts idle collections exceeding COLLECTION_IDLE_TTL_MS (5 min) and preserves active ones', () => {
      const baseTime = 1000000;
      vi.setSystemTime(baseTime);

      // Add two collections
      index.setDocuments('stale-col', [{ id: 's1' }]);
      index.setDocuments('active-col', [{ id: 'a1' }]);

      // Advance time by 4 minutes and access active-col
      vi.setSystemTime(baseTime + 4 * 60 * 1000);
      const activeEntry = index.getEntry('active-col');
      if (activeEntry) activeEntry.lastAccessedAt = Date.now();

      // Advance time to 6 minutes from baseTime
      // stale-col idle time = 6 min (> 5 min TTL)
      // active-col idle time = 2 min (<= 5 min TTL)
      vi.setSystemTime(baseTime + 6 * 60 * 1000);

      const evicted = index.sweepStaleCollections();
      expect(evicted).toBe(1);
      expect(index.has('stale-col')).toBe(false);
      expect(index.has('active-col')).toBe(true);
    });

    it('evicts using a custom maxIdleMs threshold', () => {
      const baseTime = 1000000;
      vi.setSystemTime(baseTime);

      index.setDocuments('col-1', [{ id: '1' }]);
      index.setDocuments('col-2', [{ id: '2' }]);

      vi.setSystemTime(baseTime + 2000);

      const evicted = index.sweepStaleCollections(1000);
      expect(evicted).toBe(2);
      expect(index.size).toBe(0);
    });

    it('automatically sweeps stale collections when collection count exceeds MAX_CACHED_COLLECTIONS', async () => {
      const baseTime = 1000000;
      vi.setSystemTime(baseTime);

      // Fill up to MAX_CACHED_COLLECTIONS (10)
      for (let i = 1; i <= MAX_CACHED_COLLECTIONS; i++) {
        index.setDocuments(`col-${i}`, [{ id: `${i}` }]);
      }
      expect(index.size).toBe(MAX_CACHED_COLLECTIONS);

      // Advance time beyond idle threshold for first 3 collections
      vi.setSystemTime(baseTime + COLLECTION_IDLE_TTL_MS + 1000);

      // Re-touch col-4 through col-10 so only col-1..col-3 remain stale
      for (let i = 4; i <= MAX_CACHED_COLLECTIONS; i++) {
        const entry = index.getEntry(`col-${i}`);
        if (entry) entry.lastAccessedAt = Date.now();
      }

      // Add the 11th collection via setDocuments, which should trigger sweep
      index.setDocuments('col-11', [{ id: '11' }]);

      // 3 stale collections should have been evicted, leaving 10 - 3 + 1 = 8 collections
      expect(index.has('col-1')).toBe(false);
      expect(index.has('col-2')).toBe(false);
      expect(index.has('col-3')).toBe(false);
      expect(index.has('col-4')).toBe(true);
      expect(index.has('col-11')).toBe(true);
      expect(index.size).toBe(8);
    });

    it('automatically sweeps stale collections when getDocuments hydrates beyond MAX_CACHED_COLLECTIONS', async () => {
      const baseTime = 1000000;
      vi.setSystemTime(baseTime);

      for (let i = 1; i <= MAX_CACHED_COLLECTIONS; i++) {
        index.setDocuments(`col-${i}`, [{ id: `${i}` }]);
      }

      // Age out col-1
      vi.setSystemTime(baseTime + COLLECTION_IDLE_TTL_MS + 2000);
      for (let i = 2; i <= MAX_CACHED_COLLECTIONS; i++) {
        const entry = index.getEntry(`col-${i}`);
        if (entry) entry.lastAccessedAt = Date.now();
      }

      vi.mocked(redisService.client.get).mockImplementation(async (key: string) => {
        if (key === RedisStore.search.version('col-11')) return 'v1';
        if (key === RedisStore.search.allDocuments('col-11')) return JSON.stringify([{ id: '11' }]);
        return null;
      });

      await index.getDocuments('col-11');

      expect(index.has('col-1')).toBe(false);
      expect(index.has('col-11')).toBe(true);
      expect(index.size).toBe(10);
    });
  });

  describe('evict', () => {
    it('removes a specific collection immediately from RAM and returns true', () => {
      index.setDocuments('problems', [{ id: '1' }]);
      expect(index.has('problems')).toBe(true);

      const result = index.evict('problems');
      expect(result).toBe(true);
      expect(index.has('problems')).toBe(false);
      expect(index.getEntry('problems')).toBeUndefined();
    });

    it('returns false when trying to evict a non-existent collection', () => {
      const result = index.evict('unknown-collection');
      expect(result).toBe(false);
    });
  });

  describe('clear', () => {
    it('flushes all cache entries and inflight promises', async () => {
      index.setDocuments('col-1', [{ id: '1' }]);
      index.setDocuments('col-2', [{ id: '2' }]);
      expect(index.size).toBe(2);

      index.clear();
      expect(index.size).toBe(0);
      expect(index.has('col-1')).toBe(false);
      expect(index.has('col-2')).toBe(false);
      expect(index.inflightCount).toBe(0);
    });
  });

  describe('Collection Integration', () => {
    it('allows evictFromMemory on Collection instance', () => {
      const collection = new Collection(problemsCollection);

      memorySearchIndex.setDocuments('problems', [{ id: '1' }]);
      expect(memorySearchIndex.has('problems')).toBe(true);

      const evicted = collection.evictFromMemory();
      expect(evicted).toBe(true);
      expect(memorySearchIndex.has('problems')).toBe(false);
    });
  });
});
