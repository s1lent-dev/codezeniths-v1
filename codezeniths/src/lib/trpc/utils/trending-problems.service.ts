import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { createCache } from '@/hooks/performance-hooks/cache/cache';
import { logger } from '@/service/logging';
import { Difficulty } from '@prisma/client';
import {
    GetTrendingProblemsTRPCInputSchema,
    GetTrendingProblemsTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';
import { TRPCContext } from '../trpc/trpc.context';

export interface RawTrendingProblemItem {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    favouriteCount: number;
    order: number;
    tags: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    topic: {
        id: string;
        title: string;
        slug: string;
    } | null;
    module: {
        id: string;
        title: string;
        slug: string;
    } | null;
}

const REDIS_CACHE_KEY = 'cache:problems:trending';
const REDIS_LOCK_KEY = 'problems:trending';
const REDIS_TTL_SECONDS = 7200; // 2 hours
const LOCK_TTL_SECONDS = 10; // 10 seconds mutex lease

// ─── L1 In-Memory Adaptive Cache (RAM) ──────────────────────────────────────────
const trendingL1Cache = createCache<RawTrendingProblemItem[]>({
    strategy: 'adaptive',
    maxSize: 10,
    ttl: 1000 * 60 * 10, // 10 minutes in RAM
});

export class TrendingProblemsService {
    private inFlightPromise: Promise<RawTrendingProblemItem[]> | null = null;

    /**
     * Retrieves the global top trending problems using:
     * L0 (Promise Coalescing) -> L1 (RAM) -> L2 (Redis) -> Redis Distributed Lock -> Postgres DB
     */
    public async getMasterTrendingProblems(limit = 10): Promise<RawTrendingProblemItem[]> {
        const cacheKey = `master_trending_${limit}`;

        // Tier 1: L1 In-Memory Cache (0ms)
        const l1Data = trendingL1Cache.get(cacheKey);
        if (l1Data && l1Data.length > 0) {
            return l1Data;
        }

        // Tier 0: Single-flight coalescing for in-process concurrent requests
        if (this.inFlightPromise) {
            return await this.inFlightPromise;
        }

        this.inFlightPromise = this.fetchMasterTrendingWithLock(limit, cacheKey);
        try {
            return await this.inFlightPromise;
        } finally {
            this.inFlightPromise = null;
        }
    }

    /**
     * Executes the protected distributed-lock fetch sequence.
     */
    private async fetchMasterTrendingWithLock(
        limit: number,
        cacheKey: string
    ): Promise<RawTrendingProblemItem[]> {
        // Tier 2: L2 Redis Cache (~1ms)
        try {
            const rawRedis = await redisService.client.get(`${REDIS_CACHE_KEY}:${limit}`);
            if (rawRedis) {
                const parsed: RawTrendingProblemItem[] = JSON.parse(rawRedis);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    trendingL1Cache.set(cacheKey, parsed);
                    return parsed;
                }
            }
        } catch (error) {
            logger.warn('[TrendingProblemsService] Failed to read trending problems from Redis', { error });
        }

        // Tier 3: Acquire Redis Distributed Lock to prevent Cache Stampede
        let token: string | null = null;
        try {
            token = await redisService.lock.acquire(`${REDIS_LOCK_KEY}:${limit}`, LOCK_TTL_SECONDS);
        } catch (error) {
            logger.warn('[TrendingProblemsService] Failed to acquire Redis lock, falling back to direct query', { error });
        }

        if (!token) {
            // Lock is held by another worker process -> Poll Redis with backoff
            logger.info('[TrendingProblemsService] Distributed lock held by peer, entering graceful polling');
            return await this.pollRedisForTrending(limit, cacheKey);
        }

        try {
            // Double-Checked Locking: Check Redis once more in case winner just finished
            const doubleCheck = await redisService.client.get(`${REDIS_CACHE_KEY}:${limit}`);
            if (doubleCheck) {
                const parsed: RawTrendingProblemItem[] = JSON.parse(doubleCheck);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    trendingL1Cache.set(cacheKey, parsed);
                    return parsed;
                }
            }

            // Tier 4: Fetch from PostgreSQL Database
            logger.info('[TrendingProblemsService] Hydrating Top Trending Problems from Database', { limit });
            const freshProblems = await this.fetchRawFromDb(limit);

            // Populate L2 Redis (2 Hours TTL with jitter) and L1 RAM
            try {
                await redisService.client.set(
                    `${REDIS_CACHE_KEY}:${limit}`,
                    JSON.stringify(freshProblems),
                    REDIS_TTL_SECONDS
                );
            } catch (err) {
                logger.warn('[TrendingProblemsService] Failed to write trending problems to Redis', { err });
            }

            trendingL1Cache.set(cacheKey, freshProblems);
            return freshProblems;
        } finally {
            // Safely release the distributed lock via atomic Lua script
            try {
                await redisService.lock.release(`${REDIS_LOCK_KEY}:${limit}`, token);
            } catch (releaseErr) {
                logger.warn('[TrendingProblemsService] Failed to release Redis lock', { releaseErr });
            }
        }
    }

    /**
     * Graceful polling retry loop for concurrent worker processes waiting on the lock owner.
     */
    private async pollRedisForTrending(
        limit: number,
        cacheKey: string
    ): Promise<RawTrendingProblemItem[]> {
        const maxRetries = 5;
        const retryDelayMs = 50;

        for (let i = 0; i < maxRetries; i++) {
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
            try {
                const raw = await redisService.client.get(`${REDIS_CACHE_KEY}:${limit}`);
                if (raw) {
                    const parsed: RawTrendingProblemItem[] = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        trendingL1Cache.set(cacheKey, parsed);
                        return parsed;
                    }
                }
            } catch {
                // Ignore transient polling errors
            }
        }

        // Stale-While-Revalidate Fallback: Serve existing in-memory snapshot if available
        const stale = trendingL1Cache.get(cacheKey);
        if (stale && stale.length > 0) {
            logger.warn('[TrendingProblemsService] Serving stale in-memory snapshot after lock wait timeout');
            return stale;
        }

        // Final Fallback: Direct DB query
        logger.warn('[TrendingProblemsService] Polling timed out and no stale cache available, querying DB directly');
        return await this.fetchRawFromDb(limit);
    }

    /**
     * Raw Database Query for top trending problems.
     */
    public async fetchRawFromDb(limit: number): Promise<RawTrendingProblemItem[]> {
        const problems = await prisma.problem.findMany({
            take: limit,
            orderBy: [
                { favouriteCount: 'desc' },
                { order: 'asc' },
                { createdAt: 'asc' },
            ],
            include: {
                tags: {
                    include: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
                topic: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        module: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        });

        return problems.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            difficulty: p.difficulty,
            favouriteCount: p.favouriteCount ?? 0,
            order: p.order ?? 0,
            tags: p.tags.map((t) => ({
                id: t.tag.id,
                name: t.tag.name,
                slug: t.tag.slug,
            })),
            topic: p.topic
                ? {
                      id: p.topic.id,
                      title: p.topic.title,
                      slug: p.topic.slug,
                  }
                : null,
            module: p.topic?.module
                ? {
                      id: p.topic.module.id,
                      title: p.topic.module.title,
                      slug: p.topic.module.slug,
                  }
                : null,
        }));
    }

    /**
     * Resolves the top trending problems decorated with user-specific status (isSolved, isFavourite).
     */
    public async getTrendingProblems({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetTrendingProblemsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetTrendingProblemsTRPCOutputSchema>> {
        const limit = input?.limit ?? 10;
        const targetUserId = input?.userId || ctx.user?.id;

        // 1. Fetch the globally cached master list (0-1ms)
        const masterList = await this.getMasterTrendingProblems(limit);

        if (!masterList || masterList.length === 0) {
            return [];
        }

        // 2. If unauthenticated, return default status
        if (!targetUserId) {
            return masterList.map((item) => ({
                ...item,
                isSolved: false,
                isFavourite: false,
            }));
        }

        // 3. Authenticated: Fetch user progress for only the top N problem IDs (< 1ms index lookup)
        try {
            const userProgressList = await prisma.problemProgress.findMany({
                where: {
                    userId: targetUserId,
                    problemId: { in: masterList.map((p) => p.id) },
                },
                select: {
                    problemId: true,
                    status: true,
                    favourite: true,
                },
            });

            const progressMap = new Map(
                userProgressList.map((prog) => [prog.problemId, prog])
            );

            return masterList.map((item) => {
                const prog = progressMap.get(item.id);
                return {
                    ...item,
                    isSolved: prog?.status === 'solved',
                    isFavourite: prog?.favourite ?? false,
                };
            });
        } catch (error) {
            logger.error('[TrendingProblemsService] Failed to fetch user progress decorations for trending problems', {
                error,
                targetUserId,
            });
            return masterList.map((item) => ({
                ...item,
                isSolved: false,
                isFavourite: false,
            }));
        }
    }

    /**
     * Invalidates both L1 RAM and L2 Redis trending cache.
     */
    public async invalidateCache(limit = 10): Promise<void> {
        trendingL1Cache.delete(`master_trending_${limit}`);
        try {
            await redisService.client.del(`${REDIS_CACHE_KEY}:${limit}`);
        } catch (error) {
            logger.warn('[TrendingProblemsService] Failed to evict trending cache from Redis', { error });
        }
    }
}

export const trendingProblemsService = new TrendingProblemsService();
