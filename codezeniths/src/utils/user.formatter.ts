import { redisService } from '@/lib/redis';
import { storageService } from '@/service/storage';
import { createCache } from '@/hooks/performance-hooks/cache/cache';
import { logger } from '@/service/logging';
import { ENV_CONFIG } from '@/config/config';

/**
 * Multi-Tiered Stampede-Safe Cache for Signed Media URLs (Resumes & Private Docs).
 *
 * Architecture:
 *  1. Adaptive L1 Memory Cache (via useCache / AdaptiveCache)
 *     - Strategy: "adaptive" (dynamically adapts between LRU and LFU based on access pattern).
 *     - Capacity: Capped at 5,000 user entries (prevents RAM bloat).
 *     - TTL: 23 hours in ms.
 *     - Hit time: 0 ms (0 Redis network calls, 0 AWS/S3 presign calls).
 *
 *  2. In-Flight Request De-duplication Map
 *     - If N concurrent requests arrive for the EXACT SAME storageKey before L1/L2 is warm,
 *       all N callers await the exact same single pending Promise (0 duplicate S3 calls).
 *
 *  3. L2 Redis CacheStore ("media_url" namespace, 23h TTL)
 *     - Persists presigned URLs across Node processes and cluster workers.
 *
 *  4. L3 Distributed Lock (SET NX, 10s TTL)
 *     - Prevents thundering herd across multi-node clusters when L1 & L2 both miss.
 */
const SIGNED_URL_TTL_SECONDS = 82_800; // 23 hours
const SIGNED_URL_TTL_MS = SIGNED_URL_TTL_SECONDS * 1000;
const LOCK_TTL_SECONDS = 10;
const LOCK_POLL_INTERVAL_MS = 50;
const LOCK_POLL_MAX_ATTEMPTS = 40;

const mediaUrlStore = redisService.cache.createStore<string>({
    namespace: 'media_url',
    ttlSeconds: SIGNED_URL_TTL_SECONDS,
});

// Adaptive L1 Memory Cache (capped at 5,000 user entries, 23h TTL)
const l1MemoryCache = createCache<string>({
    strategy: 'adaptive',
    maxSize: 5000,
    ttl: SIGNED_URL_TTL_MS,
});

// In-Flight Promise De-duplication Map
const inFlightPromises = new Map<string, Promise<string>>();

/**
 * Resolves a raw image storage key into a direct public R2 CDN URL.
 * If already an absolute HTTP/HTTPS URL (e.g. OAuth avatar), returns as-is.
 */
export function resolvePublicImageUrl(storageKey: string): string {
    const cleanKey = storageKey.trim();
    if (!cleanKey) return storageKey;

    if (cleanKey.startsWith('http://') || cleanKey.startsWith('https://')) {
        return cleanKey;
    }

    const publicBaseUrl = (ENV_CONFIG.R2_PUBLIC_ENDPOINT || ENV_CONFIG.R2_ENDPOINT || '').replace(/\/+$/, '');
    const normalizedPath = cleanKey.replace(/^\/+/, '');

    return publicBaseUrl ? `${publicBaseUrl}/${normalizedPath}` : cleanKey;
}

/**
 * Resolves a raw storage key to a presigned URL using Adaptive L1 + L2 Redis + In-Flight + Lock.
 */
async function resolveSignedUrl(storageKey: string): Promise<string> {
    const cleanKey = storageKey.trim();
    if (!cleanKey) return storageKey;

    if (cleanKey.startsWith('http://') || cleanKey.startsWith('https://')) {
        logger.info('User formatter URL resolved', {
            storageKey: cleanKey,
            tier: 'BYPASS_DIRECT_HTTP',
            source: 'HTTP_URL',
        });
        return cleanKey;
    }

    // --- Tier 1: Adaptive L1 Memory Cache (0 ms hit time, capped at 5000 entries) ---
    const l1Cached = l1MemoryCache.get(cleanKey);
    if (l1Cached) {
        logger.info('User formatter URL resolved', {
            storageKey: cleanKey,
            tier: 'L1_MEMORY_CACHE',
            source: 'MEMORY',
        });
        return l1Cached;
    }

    // --- Tier 2: In-Flight Promise De-duplication ---
    const existingInFlight = inFlightPromises.get(cleanKey);
    if (existingInFlight) {
        logger.info('User formatter URL resolved', {
            storageKey: cleanKey,
            tier: 'IN_FLIGHT_DEDUPLICATION',
            source: 'IN_FLIGHT_PROMISE',
        });
        return existingInFlight;
    }

    const executionPromise = (async () => {
        try {
            // --- Tier 3: L2 Redis Cache Store ---
            const l2Cached = await mediaUrlStore.get(cleanKey);
            if (l2Cached !== null) {
                l1MemoryCache.set(cleanKey, l2Cached, SIGNED_URL_TTL_MS);
                logger.info('User formatter URL resolved', {
                    storageKey: cleanKey,
                    tier: 'L2_REDIS_CACHE',
                    source: 'REDIS',
                });
                return l2Cached;
            }

            // --- Tier 4: Distributed Lock (SET NX) ---
            const lockKey = `media_url:${cleanKey}`;
            const lockToken = await redisService.lock.acquire(lockKey, LOCK_TTL_SECONDS);

            if (lockToken !== null) {
                try {
                    const doubleCheckL2 = await mediaUrlStore.get(cleanKey);
                    if (doubleCheckL2 !== null) {
                        l1MemoryCache.set(cleanKey, doubleCheckL2, SIGNED_URL_TTL_MS);
                        logger.info('User formatter URL resolved', {
                            storageKey: cleanKey,
                            tier: 'L2_REDIS_CACHE_DOUBLE_CHECK',
                            source: 'REDIS',
                        });
                        return doubleCheckL2;
                    }

                    // Presign single URL via S3/R2
                    const signedUrl = await storageService.getPresignedDownloadUrl(cleanKey, 86_400);

                    // Write to L2 Redis Store + Adaptive L1 Memory Cache
                    await mediaUrlStore.set(cleanKey, signedUrl, SIGNED_URL_TTL_SECONDS);
                    l1MemoryCache.set(cleanKey, signedUrl, SIGNED_URL_TTL_MS);

                    logger.info('User formatter URL resolved', {
                        storageKey: cleanKey,
                        tier: 'S3_PRESIGNED_ORIGIN',
                        source: 'S3_STORAGE_SERVICE',
                    });

                    return signedUrl;
                } finally {
                    await redisService.lock.release(lockKey, lockToken);
                }
            }

            // Loser polling loop for L2 population
            for (let attempt = 0; attempt < LOCK_POLL_MAX_ATTEMPTS; attempt++) {
                await new Promise((resolve) => setTimeout(resolve, LOCK_POLL_INTERVAL_MS));

                const l1Populated = l1MemoryCache.get(cleanKey);
                if (l1Populated) {
                    logger.info('User formatter URL resolved', {
                        storageKey: cleanKey,
                        tier: 'LOCK_POLLING_POPULATED_L1',
                        source: 'LOCK_WAIT',
                    });
                    return l1Populated;
                }

                const l2Populated = await mediaUrlStore.get(cleanKey);
                if (l2Populated !== null) {
                    l1MemoryCache.set(cleanKey, l2Populated, SIGNED_URL_TTL_MS);
                    logger.info('User formatter URL resolved', {
                        storageKey: cleanKey,
                        tier: 'LOCK_POLLING_POPULATED_L2',
                        source: 'LOCK_WAIT',
                    });
                    return l2Populated;
                }
            }

            // Fallback: Winner timed out or crashed without releasing lock
            const signedUrl = await storageService.getPresignedDownloadUrl(cleanKey, 86_400);
            await mediaUrlStore.set(cleanKey, signedUrl, SIGNED_URL_TTL_SECONDS);
            l1MemoryCache.set(cleanKey, signedUrl, SIGNED_URL_TTL_MS);

            logger.warn('User formatter URL resolved via lock timeout fallback', {
                storageKey: cleanKey,
                tier: 'S3_PRESIGNED_FALLBACK',
                source: 'FALLBACK_TIMEOUT',
            });

            return signedUrl;
        } finally {
            inFlightPromises.delete(cleanKey);
        }
    })();

    inFlightPromises.set(cleanKey, executionPromise);
    return executionPromise;
}

/**
 * Formats a single user object by resolving image paths via public R2 CDN prefix
 * and private documents (resumes) via secure signed URLs.
 *
 *  - If already a full URL (starts with "http" or "https"), left as-is.
 *  - Images: Prepend R2 public endpoint for instant 0 ms CDN delivery.
 *  - Resumes: Resolved via multi-tier Adaptive L1 + L2 + In-Flight + Lock cache.
 */
export async function formatUserProfile<T extends { image?: string | null; resume?: string | null }>(user: T): Promise<T>;
export async function formatUserProfile<T extends { image?: string | null; resume?: string | null }>(user: null): Promise<null>;
export async function formatUserProfile<T extends { image?: string | null; resume?: string | null }>(user: T | null): Promise<T | null>;
export async function formatUserProfile<T extends { image?: string | null; resume?: string | null }>(
    user: T | null,
): Promise<T | null> {
    if (!user) return null;

    const formattedUser = { ...user };

    // 1. IMAGE: Fast, public R2 CDN prefix (0 ms, permanent CDN URL)
    if (formattedUser.image && !formattedUser.image.startsWith('http')) {
        formattedUser.image = resolvePublicImageUrl(formattedUser.image);
    }

    // 2. RESUME: Private PDF document (secure presigned URL)
    if (formattedUser.resume && !formattedUser.resume.startsWith('http')) {
        formattedUser.resume = await resolveSignedUrl(formattedUser.resume);
    }

    return formattedUser;
}

/**
 * Formats an array of user objects in parallel.
 */
export async function formatUserProfiles<T extends { image?: string | null; resume?: string | null }>(
    users: T[],
): Promise<T[]> {
    return Promise.all(users.map((user) => formatUserProfile(user)));
}
