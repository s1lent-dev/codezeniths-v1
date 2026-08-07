/**
 * Type definitions for useCache hook and related caching utilities
 * Advanced caching system with LRU, LFU, and adaptive strategies
 */

// ========================= CACHE INTERFACES =========================

export interface CacheEntry<T> {
    value: T;
    timestamp: number;
    ttl?: number | undefined;
    accessCount?: number | undefined; // For LFU
}

export interface CacheConfig {
    maxSize?: number | undefined;
    ttl?: number | undefined; // Time to live in milliseconds
    onEviction?: ((key: string, value: unknown) => void) | undefined;
}

export interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    maxSize: number;
    strategy?: string; // For Adaptive
}

// ========================= CACHE STRATEGY TYPES =========================

export type CacheStrategy = 'lru' | 'lfu' | 'adaptive';

export interface ExtendedCacheConfig extends CacheConfig {
    strategy?: CacheStrategy | undefined;
}

// ========================= HOOK INTERFACES =========================

export interface UseCacheOptions<T> {
    key: string;
    fetcher?: (() => Promise<T> | T) | undefined;
    enabled?: boolean | undefined;
    ttl?: number | undefined;
    maxSize?: number | undefined;
    staleTime?: number | undefined;
    gcInterval?: number | undefined;
    debounceMs?: number | undefined;
    strategy?: CacheStrategy | undefined;
}

export interface UseCacheReturn<T> {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    isStale: boolean;
    refetch: () => Promise<void>;
    set: (value: T, ttl?: number) => void;
    remove: () => void;
    stats: CacheStats;
}

// ========================= SPECIALIZED CACHE HOOK OPTIONS =========================

export interface UseServerStateCacheOptions<T> extends Omit<UseCacheOptions<T>, 'key' | 'fetcher'> {
    serverUrl?: string | undefined;
    pollInterval?: number | undefined;
}

export interface UseReduxStateCacheOptions<T> extends Omit<UseCacheOptions<T>, 'key' | 'fetcher'> {
    selector: (state: unknown) => T;
    actionCreator?: unknown | undefined;
}

export interface UseComputedCacheOptions<T> extends Omit<UseCacheOptions<T>, 'key' | 'fetcher'> {
    dependencies: Array<unknown>;
    computeFn: (...args: Array<unknown>) => T;
}

// ========================= CACHE CLASS INTERFACES =========================

export interface CacheInterface<T> {
    get: (key: string) => T | undefined;
    set: (key: string, value: T, ttl?: number) => void;
    delete: (key: string) => boolean;
    clear: () => void;
    has: (key: string) => boolean;
    getStats: () => CacheStats;
    cleanup: () => number;
}

// ========================= UTILITY TYPES =========================

export type CacheFetcher<T> = () => Promise<T> | T;
export type CacheEvictionHandler = (key: string, value: unknown) => void;
export type CacheDependencies = ReadonlyArray<unknown>;

// ========================= ADVANCED CACHE CONFIGURATION =========================

export interface AdvancedCacheConfig extends CacheConfig {
    enableStats?: boolean | undefined;
    serializer?: {
        serialize: (value: unknown) => string;
        deserialize: (value: string) => unknown;
    } | undefined;
    storage?: 'memory' | 'localStorage' | 'sessionStorage' | undefined;
    debounceMs?: number | undefined;
    gcInterval?: number | undefined;
    retryConfig?: {
        attempts: number;
        delay: number;
        backoff?: boolean | undefined;
    } | undefined;
}

// ========================= CACHE FACTORY TYPES =========================

export interface CacheFactoryOptions extends AdvancedCacheConfig {
    strategy: CacheStrategy;
}

export type CacheInstance<T> = CacheInterface<T> & {
    keys: () => Array<string>;
    values: () => Array<T>;
    entries: () => Array<[string, T]>;
    getSize: () => number;
};


/**
 * Type definitions for useDebounce hook and related debouncing utilities
 * Function and value debouncing for performance optimization
 */

// ========================= DEBOUNCE INTERFACES =========================

export interface UseDebounceOptions {
    leading?: boolean | undefined;
    trailing?: boolean | undefined;
    maxWait?: number | undefined;
}

export interface UseDebounceLodashOptions {
    leading?: boolean | undefined;
    maxWait?: number | undefined;
    trailing?: boolean | undefined;
}

// ========================= DEBOUNCE FUNCTION TYPES =========================

export type DebouncedFunction<T extends (...args: Array<any>) => any> = (...args: Parameters<T>) => void;

export type DebounceCallback<T extends (...args: Array<any>) => any> = T;

// ========================= ADVANCED DEBOUNCE OPTIONS =========================

export interface UseDebounceAdvancedOptions extends UseDebounceOptions {
    enabled?: boolean | undefined;
    immediate?: boolean | undefined;
    onDebounce?: (() => void) | undefined;
    onCancel?: (() => void) | undefined;
}

export interface UseDebounceAdvancedReturn<T extends (...args: Array<any>) => any> {
    debouncedCallback: DebouncedFunction<T>;
    cancel: () => void;
    flush: () => void;
    pending: boolean;
    lastCallTime: number | null;
}

// ========================= DEBOUNCED VALUE TYPES =========================

export interface UseDebouncedValueOptions {
    leading?: boolean | undefined;
    equalityFn?: (<T>(a: T, b: T) => boolean) | undefined;
    maxWait?: number | undefined;
}

export interface UseDebouncedValueReturn<T> {
    debouncedValue: T;
    isPending: boolean;
    cancel: () => void;
    flush: () => void;
}

// ========================= DEBOUNCE HOOK CONFIGURATIONS =========================

export interface DebounceConfig {
    delay: number;
    options?: UseDebounceOptions | undefined;
}

export interface DebouncedState<T> {
    value: T;
    lastUpdateTime: number;
    isPending: boolean;
}

// ========================= UTILITY TYPES =========================

export type DebounceDelay = number;
export type DebounceTimeout = NodeJS.Timeout | null;
export type CallTime = number | null;

// ========================= DEBOUNCE MANAGER TYPES =========================

export interface DebounceManager {
    create: <T extends (...args: Array<any>) => any>(
        callback: T,
        delay: number,
        options?: UseDebounceOptions
    ) => DebouncedFunction<T>;
    cancel: (id: string) => void;
    cancelAll: () => void;
    flush: (id: string) => void;
    flushAll: () => void;
}

// ========================= THROTTLE INTEGRATION TYPES =========================

export interface UseDebounceThrottleOptions extends UseDebounceOptions {
    throttleDelay?: number | undefined;
    mode?: 'debounce' | 'throttle' | 'both' | undefined;
}

// ========================= REACTIVE DEBOUNCE TYPES =========================

export interface UseReactiveDebounceOptions<T> extends UseDebouncedValueOptions {
    dependencies?: Array<unknown> | undefined;
    onChange?: ((value: T) => void) | undefined;
}

export interface UseReactiveDebounceReturn<T> extends UseDebouncedValueReturn<T> {
    setValue: (value: T) => void;
    reset: () => void;
}

/**
 * Type definitions for useRateLimiter hook and related rate limiting utilities
 * Function rate limiting and API call throttling
 */

// ========================= RATE LIMITER INTERFACES =========================

export interface RateLimitOptions {
    limit?: number | undefined;
    windowMs?: number | undefined;
}

// ========================= RATE LIMITER FUNCTION TYPES =========================

export type RateLimitedFunction<T extends (...args: Array<unknown>) => unknown> =
    (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;

export type RateLimitCallback<T extends (...args: Array<unknown>) => unknown> = T;

// ========================= QUEUE ITEM TYPES =========================

export interface QueueItem<T extends (...args: Array<unknown>) => unknown> {
    args: Parameters<T>;
    resolve: (value: Awaited<ReturnType<T>>) => void;
    reject: (reason?: unknown) => void;
}

// ========================= ADVANCED RATE LIMITER OPTIONS =========================

export interface UseRateLimiterAdvancedOptions extends RateLimitOptions {
    strategy?: 'queue' | 'drop' | 'throttle' | undefined;
    onRateExceeded?: (() => void) | undefined;
    onQueueEmpty?: (() => void) | undefined;
    maxQueueSize?: number | undefined;
}

export interface UseRateLimiterAdvancedReturn<T extends (...args: Array<unknown>) => unknown> {
    rateLimitedCallback: RateLimitedFunction<T>;
    queueSize: number;
    isProcessing: boolean;
    clearQueue: () => void;
    getStats: () => RateLimitStats;
}

// ========================= RATE LIMIT STATISTICS =========================

export interface RateLimitStats {
    totalCalls: number;
    successfulCalls: number;
    failedCalls: number;
    queuedCalls: number;
    droppedCalls: number;
    averageWaitTime: number;
}

// ========================= UTILITY TYPES =========================

export type RateLimitStrategy = 'queue' | 'drop' | 'throttle';
export type CallTimeStamp = number;
export type WaitTime = number;

// ========================= TOKEN BUCKET TYPES =========================

export interface TokenBucketConfig {
    capacity: number;
    refillRate: number;
    refillInterval: number;
}

export interface UseTokenBucketReturn<T extends (...args: Array<unknown>) => unknown> {
    execute: RateLimitedFunction<T>;
    tokensAvailable: number;
    refillTokens: () => void;
    reset: () => void;
}

// ========================= SLIDING WINDOW TYPES =========================

export interface SlidingWindowConfig {
    windowSize: number;
    maxRequests: number;
    precision?: number | undefined;
}

export interface UseSlidingWindowReturn<T extends (...args: Array<unknown>) => unknown> {
    execute: RateLimitedFunction<T>;
    currentUsage: number;
    resetWindow: () => void;
    getWindowStats: () => { requests: number; timeRemaining: number };
}