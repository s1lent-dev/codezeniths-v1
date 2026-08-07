import type {
    CacheConfig,
    CacheEntry,
    CacheStats
} from '../types';

// ========================= LRU CACHE IMPLEMENTATION =========================

export class LRUCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private stats: CacheStats;

    constructor(private config: CacheConfig = {}) {
        this.stats = {
            hits: 0,
            misses: 0,
            size: 0,
            maxSize: config.maxSize || 100,
        };
    }

    get(key: string): T | undefined {
        const entry = this.cache.get(key);
        if (!entry || this.isExpired(entry)) {
            this.stats.misses++;
            if (entry) {this.delete(key);}
            return undefined;
        }

        this.stats.hits++;
        this.cache.delete(key);
        this.cache.set(key, entry);
        return entry.value;
    }

    set(key: string, value: T, ttl?: number): void {
        if (this.cache.size >= this.stats.maxSize) {
            this.evict();
        }

        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl: ttl ?? this.config.ttl ?? undefined,
        });
        this.stats.size = this.cache.size;
    }

    delete(key: string): boolean {
        const deleted = this.cache.delete(key);
        if (deleted) {this.stats.size = this.cache.size;}
        return deleted;
    }

    clear(): void {
        this.cache.clear();
        this.stats.size = 0;
        this.stats.hits = 0;
        this.stats.misses = 0;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        return !!entry && !this.isExpired(entry);
    }

    getStats(): CacheStats {
        return { ...this.stats };
    }

    cleanup(): number {
        let cleaned = 0;
        for (const [key, entry] of this.cache) {
            if (this.isExpired(entry)) {
                this.delete(key);
                cleaned++;
            }
        }
        return cleaned;
    }

    private isExpired(entry: CacheEntry<T>): boolean {
        return !!entry.ttl && Date.now() - entry.timestamp > entry.ttl;
    }

    private evict(): void {
        const key = this.cache.keys().next().value;
        if (key) {
            const entry = this.cache.get(key);
            if (entry && this.config.onEviction) {
                this.config.onEviction(key, entry.value);
            }
            this.delete(key);
        }
    }
}

// ========================= LFU CACHE IMPLEMENTATION =========================

export class LFUCache<T> {
    private cache = new Map<string, CacheEntry<T>>();
    private frequencies = new Map<number, Set<string>>();
    private keyFrequencies = new Map<string, number>();
    private minFrequency = 0;
    private stats: CacheStats;

    constructor(private config: CacheConfig = {}) {
        this.stats = {
            hits: 0,
            misses: 0,
            size: 0,
            maxSize: config.maxSize || 100,
        };
    }

    get(key: string): T | undefined {
        const entry = this.cache.get(key);
        if (!entry || this.isExpired(entry)) {
            this.stats.misses++;
            if (entry) {this.delete(key);}
            return undefined;
        }

        this.stats.hits++;
        this.updateFrequency(key);
        return entry.value;
    }

    set(key: string, value: T, ttl?: number): void {
        if (this.cache.size >= this.stats.maxSize) {
            this.evict();
        }

        const entry: CacheEntry<T> = {
            value,
            timestamp: Date.now(),
            ttl: ttl ?? this.config.ttl ?? undefined,
            accessCount: 1,
        };

        this.cache.set(key, entry);
        this.keyFrequencies.set(key, 1);
        if (!this.frequencies.has(1)) {this.frequencies.set(1, new Set());}
        this.frequencies.get(1)!.add(key);
        this.minFrequency = 1;
        this.stats.size = this.cache.size;
    }

    delete(key: string): boolean {
        if (!this.cache.has(key)) {return false;}

        const freq = this.keyFrequencies.get(key)!;
        this.frequencies.get(freq)?.delete(key);
        if (this.frequencies.get(freq)?.size === 0 && freq === this.minFrequency) {
            this.minFrequency++;
        }

        this.cache.delete(key);
        this.keyFrequencies.delete(key);
        this.stats.size = this.cache.size;
        return true;
    }

    clear(): void {
        this.cache.clear();
        this.frequencies.clear();
        this.keyFrequencies.clear();
        this.minFrequency = 0;
        this.stats.size = 0;
        this.stats.hits = 0;
        this.stats.misses = 0;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        return !!entry && !this.isExpired(entry);
    }

    getStats(): CacheStats {
        return { ...this.stats };
    }

    cleanup(): number {
        let cleaned = 0;
        for (const [key, entry] of this.cache) {
            if (this.isExpired(entry)) {
                this.delete(key);
                cleaned++;
            }
        }
        return cleaned;
    }

    private isExpired(entry: CacheEntry<T>): boolean {
        return !!entry.ttl && Date.now() - entry.timestamp > entry.ttl;
    }

    private updateFrequency(key: string): void {
        const oldFreq = this.keyFrequencies.get(key)!;
        const newFreq = oldFreq + 1;

        this.keyFrequencies.set(key, newFreq);
        this.frequencies.get(oldFreq)?.delete(key);
        if (!this.frequencies.has(newFreq))
        {this.frequencies.set(newFreq, new Set());}
        this.frequencies.get(newFreq)!.add(key);

        if (
            this.frequencies.get(oldFreq)?.size === 0 &&
      oldFreq === this.minFrequency
        ) {
            this.minFrequency++;
        }
    }

    private evict(): void {
        const key = this.frequencies.get(this.minFrequency)?.values().next().value;
        if (key) {
            const entry = this.cache.get(key);
            if (entry && this.config.onEviction) {
                this.config.onEviction(key, entry.value);
            }
            this.delete(key);
        }
    }
}

// ========================= ADAPTIVE CACHE =========================

export class AdaptiveCache<T> {
    private lruCache: LRUCache<T>;
    private lfuCache: LFUCache<T>;
    private strategy: 'lru' | 'lfu' = 'lru';
    private operationCount = 0;

    constructor(config: CacheConfig = {}) {
        this.lruCache = new LRUCache(config);
        this.lfuCache = new LFUCache(config);
    }

    get(key: string): T | undefined {
        this.operationCount++;
        const lruVal = this.lruCache.get(key);
        const lfuVal = this.lfuCache.get(key);
        if (this.operationCount % 10 === 0) {
            this.evaluateStrategy();
        }
        return this.strategy === 'lru' ? lruVal : lfuVal;
    }

    set(key: string, value: T, ttl?: number): void {
        this.lruCache.set(key, value, ttl);
        this.lfuCache.set(key, value, ttl);
    }

    delete(key: string): boolean {
        return this.lruCache.delete(key) || this.lfuCache.delete(key);
    }

    clear(): void {
        this.lruCache.clear();
        this.lfuCache.clear();
        this.operationCount = 0;
    }

    has(key: string): boolean {
        return this.strategy === 'lru'
            ? this.lruCache.has(key)
            : this.lfuCache.has(key);
    }

    cleanup(): number {
        return Math.max(this.lruCache.cleanup(), this.lfuCache.cleanup());
    }

    getStats(): CacheStats {
        const stats =
            this.strategy === 'lru'
                ? this.lruCache.getStats()
                : this.lfuCache.getStats();
        return { ...stats, strategy: this.strategy };
    }

    private evaluateStrategy(): void {
        const lruStats = this.lruCache.getStats();
        const lfuStats = this.lfuCache.getStats();
        const lruHitRate = lruStats.hits / (lruStats.hits + lruStats.misses || 1);
        const lfuHitRate = lfuStats.hits / (lfuStats.hits + lfuStats.misses || 1);
        this.strategy = lfuHitRate > lruHitRate + 0.1 ? 'lfu' : 'lru';
    }
}


// ========================= CACHE FACTORY =========================

export function createCache<T>(
    config: CacheConfig & { strategy?: 'lru' | 'lfu' | 'adaptive' | undefined },
): LRUCache<T> | LFUCache<T> | AdaptiveCache<T> {
    switch (config.strategy || 'lru') {
        case 'lfu':
            return new LFUCache<T>(config);
        case 'adaptive':
            return new AdaptiveCache<T>(config);
        default:
            return new LRUCache<T>(config);
    }
}