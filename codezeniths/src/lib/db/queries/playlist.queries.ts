import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { redisService } from '@codezeniths/lib/redis';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import { socialProducer } from '@/lib/mq';
import {
    CreatePlaylistInputSchema,
    CreatePlaylistOutputSchema,
    GetMyPlaylistsInputSchema,
    GetMyPlaylistsOutputSchema,
    GetCommunityPlaylistsInputSchema,
    GetCommunityPlaylistsOutputSchema,
    GetPlaylistInfoInputSchema,
    GetPlaylistInfoOutputSchema,
    TogglePlaylistBookmarkInputSchema,
    TogglePlaylistBookmarkOutputSchema,
    RemovePlaylistInputSchema,
    RemovePlaylistOutputSchema,
    UpdatePlaylistInputSchema,
    UpdatePlaylistOutputSchema,
    ToggleProblemInPlaylistInputSchema,
    ToggleProblemInPlaylistOutputSchema,
    GetPlaylistsForProblemInputSchema,
    GetPlaylistsForProblemOutputSchema,
} from '@codezeniths/schemas/db';
import { IPlaylistQueries } from './interfaces/playlist.queries.interface';
import type { Prisma } from '@prisma/client';
import { createCache } from '@/hooks/performance-hooks/cache/cache';

// Multi-tier cache for creator's public other playlists
const creatorOtherPlaylistsL1Cache = createCache<
    Array<{ id: string; title: string; slug: string; problemsCount: number }>
>({
    strategy: 'adaptive',
    maxSize: 100,
    ttl: 1000 * 60 * 5, // 5 minutes in RAM
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
    return (
        title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'playlist'
    );
}

// ─── PlaylistQueries ──────────────────────────────────────────────────────────

export class PlaylistQueries implements IPlaylistQueries {
    createPlaylist = qRPC()
        .input(CreatePlaylistInputSchema)
        .output(CreatePlaylistOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing createPlaylist query', { userId: payload.userId, title: payload.title });
            const { userId, title, description, isPublic, problemIds } = payload;

            // 1. Enforce max 5 playlists per account limit
            const count = await prisma.playlist.count({
                where: { creatorId: userId },
            });

            if (count >= 5) {
                logger.warn('Playlist creation blocked: user reached 5 playlist limit', { userId });
                throw new AppErrorBuilder('Maximum limit reached. You can only create up to 5 playlists per account.')
                    .setCode(ErrorCode.BAD_REQUEST)
                    .build();
            }

            // 2. Generate unique slug
            const baseSlug = generateSlug(title);
            let slug = baseSlug;
            const existingSlug = await prisma.playlist.findUnique({
                where: { slug },
                select: { id: true },
            });

            if (existingSlug) {
                slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;
            }

            // 3. Create playlist and optional initial problem items in a transaction
            const newPlaylist = await prisma.$transaction(async (tx) => {
                const created = await tx.playlist.create({
                    data: {
                        creatorId: userId,
                        title: title.trim(),
                        slug,
                        description: description?.trim() || null,
                        isPublic: isPublic ?? true,
                    },
                });

                if (problemIds && problemIds.length > 0) {
                    // Filter out duplicates preserving order
                    const uniqueProblemIds = Array.from(new Set(problemIds));
                    await tx.playlistItem.createMany({
                        data: uniqueProblemIds.map((problemId, index) => ({
                            playlistId: created.id,
                            problemId,
                            order: index,
                        })),
                    });
                }

                return created;
            });

            return {
                id: newPlaylist.id,
                title: newPlaylist.title,
                slug: newPlaylist.slug,
                description: newPlaylist.description,
                isPublic: newPlaylist.isPublic,
                problemsCount: problemIds ? new Set(problemIds).size : 0,
                createdAt: newPlaylist.createdAt,
                updatedAt: newPlaylist.updatedAt,
            };
        })
        .build();

    getMyPlaylists = qRPC()
        .input(GetMyPlaylistsInputSchema)
        .output(GetMyPlaylistsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getMyPlaylists query', { userId: payload.userId });
            const { userId } = payload;

            const playlists = await prisma.playlist.findMany({
                where: { creatorId: userId },
                include: {
                    _count: {
                        select: {
                            items: true,
                            bookmarks: true,
                        },
                    },
                    bookmarks: {
                        where: { userId },
                        select: { id: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return playlists.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                description: p.description,
                isPublic: p.isPublic,
                problemsCount: p._count.items,
                bookmarkCount: p.bookmarkCount,
                viewCount: p.viewCount,
                isBookmarked: p.bookmarks.length > 0,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            }));
        })
        .build();

    getCommunityPlaylists = qRPC()
        .input(GetCommunityPlaylistsInputSchema)
        .output(GetCommunityPlaylistsOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getCommunityPlaylists query', { payload });
            const { userId, creatorId, creatorUsername, page, limit, search, sortBy, order } = payload;

            const where: Prisma.PlaylistWhereInput = {
                isPublic: true,
                ...(creatorId ? { creatorId } : {}),
                ...(creatorUsername ? { creator: { username: creatorUsername } } : {}),
            };

            if (search && search.trim()) {
                const searchLower = search.trim();
                where.AND = [
                    {
                        OR: [
                            { title: { contains: searchLower, mode: 'insensitive' } },
                            { description: { contains: searchLower, mode: 'insensitive' } },
                        ],
                    },
                ];
            }

            let orderBy: Prisma.PlaylistOrderByWithRelationInput = { bookmarkCount: 'desc' };
            if (sortBy === 'recent') {
                orderBy = { createdAt: order };
            } else if (sortBy === 'name') {
                orderBy = { title: order };
            } else {
                orderBy = { bookmarkCount: order };
            }

            const skip = (page - 1) * limit;

            const [total, playlists] = await Promise.all([
                prisma.playlist.count({ where }),
                prisma.playlist.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    include: {
                        creator: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                image: true,
                            },
                        },
                        _count: {
                            select: {
                                items: true,
                                bookmarks: true,
                            },
                        },
                        ...(userId
                            ? {
                                  bookmarks: {
                                      where: { userId },
                                      select: { id: true },
                                  },
                              }
                            : {}),
                    },
                }),
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                items: playlists.map((p) => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    description: p.description,
                    isPublic: p.isPublic,
                    problemsCount: p._count.items,
                    bookmarkCount: p.bookmarkCount,
                    viewCount: p.viewCount,
                    isBookmarked: Boolean(p.bookmarks && p.bookmarks.length > 0),
                    createdAt: p.createdAt,
                    updatedAt: p.updatedAt,
                    creator: {
                        id: p.creator.id,
                        name: p.creator.name,
                        username: p.creator.username,
                        image: p.creator.image,
                    },
                })),
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
            };
        })
        .build();

    getPlaylistInfo = qRPC()
        .input(GetPlaylistInfoInputSchema)
        .output(GetPlaylistInfoOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getPlaylistInfo query', { payload });
            const { slug, id, userId } = payload;

            // 1. Direct indexed lookup for Playlist
            const playlist = await prisma.playlist.findFirst({
                where: {
                    OR: [id ? { id } : {}, slug ? { slug } : {}].filter((obj) => Object.keys(obj).length > 0),
                },
                include: {
                    creator: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        },
                    },
                    items: {
                        orderBy: { order: 'asc' },
                        select: {
                            problemId: true,
                            problem: {
                                select: {
                                    id: true,
                                    difficulty: true,
                                },
                            },
                        },
                    },
                    _count: {
                        select: {
                            items: true,
                            bookmarks: true,
                        },
                    },
                    ...(userId
                        ? {
                              bookmarks: {
                                  where: { userId },
                                  select: { id: true },
                              },
                          }
                        : {}),
                },
            });

            if (!playlist) {
                logger.warn('Playlist not found', { slug, id });
                throw new AppErrorBuilder('Playlist not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            // If playlist is private, only creator can view it
            if (!playlist.isPublic && playlist.creatorId !== userId) {
                logger.warn('Unauthorized access to private playlist', { playlistId: playlist.id, userId });
                throw new AppErrorBuilder('This playlist is private.')
                    .setCode(ErrorCode.FORBIDDEN)
                    .build();
            }

            const problemIds: string[] = [];
            for (const item of playlist.items) {
                if (item.problem?.id) {
                    problemIds.push(item.problem.id);
                }
            }
            const problemsCount = problemIds.length;

            // 2. Parallelized Execution of User Progress and Creator's Other Playlists
            const userProgressPromise =
                userId && problemIds.length > 0
                    ? prisma.problemProgress.findMany({
                          where: {
                              userId,
                              problemId: { in: problemIds },
                          },
                          select: {
                              problemId: true,
                              status: true,
                              revisit: true,
                          },
                      })
                    : Promise.resolve([]);

            const otherPlaylistsPromise = (async () => {
                const cacheKey = `${playlist.creatorId}:${playlist.id}`;
                const cached = creatorOtherPlaylistsL1Cache.get(cacheKey);
                if (cached) return cached;

                const otherList = await prisma.playlist.findMany({
                    where: {
                        creatorId: playlist.creatorId,
                        id: { not: playlist.id },
                        isPublic: true,
                    },
                    take: 4,
                    orderBy: { bookmarkCount: 'desc' },
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        _count: {
                            select: { items: true },
                        },
                    },
                });

                const mapped = otherList.map((p) => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    problemsCount: p._count.items,
                }));

                creatorOtherPlaylistsL1Cache.set(cacheKey, mapped);
                return mapped;
            })();

            const [userProgresses, otherPlaylists] = await Promise.all([
                userProgressPromise,
                otherPlaylistsPromise,
            ]);

            // 3. Single-Pass O(P) Progress Accumulation
            const progressMap = new Map<string, { status: string; revisit: boolean }>();
            for (const up of userProgresses) {
                progressMap.set(up.problemId, up);
            }

            let easyTotal = 0;
            let mediumTotal = 0;
            let hardTotal = 0;
            let easySolved = 0;
            let mediumSolved = 0;
            let hardSolved = 0;
            let problemsSolvedCount = 0;
            let problemsRevisitCount = 0;

            for (const item of playlist.items) {
                const p = item.problem;
                if (!p) continue;

                const diff = p.difficulty as 'easy' | 'medium' | 'hard';
                if (diff === 'easy') easyTotal++;
                else if (diff === 'medium') mediumTotal++;
                else if (diff === 'hard') hardTotal++;

                const prog = progressMap.get(p.id);
                if (prog) {
                    if (prog.status === 'solved') {
                        problemsSolvedCount++;
                        if (diff === 'easy') easySolved++;
                        else if (diff === 'medium') mediumSolved++;
                        else if (diff === 'hard') hardSolved++;
                    }
                    if (prog.revisit) {
                        problemsRevisitCount++;
                    }
                }
            }

            const problemsSolvedPercentage =
                problemsCount > 0 ? parseFloat(((problemsSolvedCount / problemsCount) * 100).toFixed(2)) : 0;
            const problemNotSolvedCount = Math.max(0, problemsCount - problemsSolvedCount);

            return {
                id: playlist.id,
                title: playlist.title,
                slug: playlist.slug,
                description: playlist.description,
                isPublic: playlist.isPublic,
                bookmarkCount: playlist.bookmarkCount,
                viewCount: playlist.viewCount,
                problemsCount,
                isBookmarked: Boolean(playlist.bookmarks && playlist.bookmarks.length > 0),
                isOwner: userId ? playlist.creatorId === userId : false,
                createdAt: playlist.createdAt,
                updatedAt: playlist.updatedAt,
                creator: {
                    id: playlist.creator.id,
                    name: playlist.creator.name,
                    username: playlist.creator.username,
                    image: playlist.creator.image,
                },
                progress: {
                    problemsCount,
                    problemsSolvedCount,
                    problemsRevisitCount,
                    problemNotSolvedCount,
                    problemsSolvedPercentage,
                    problemsCountByDifficulty: {
                        easy: easyTotal,
                        medium: mediumTotal,
                        hard: hardTotal,
                    },
                    problemsSolvedCountByDifficulty: {
                        easy: easySolved,
                        medium: mediumSolved,
                        hard: hardSolved,
                    },
                },
                otherPlaylists,
            };
        })
        .build();

    togglePlaylistBookmark = qRPC()
        .input(TogglePlaylistBookmarkInputSchema)
        .output(TogglePlaylistBookmarkOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing togglePlaylistBookmark query', { payload });
            const { userId, playlistId, slug } = payload;

            const playlist = await prisma.playlist.findFirst({
                where: {
                    OR: [playlistId ? { id: playlistId } : {}, slug ? { slug } : {}].filter(
                        (obj) => Object.keys(obj).length > 0
                    ),
                },
                select: { id: true, title: true, creatorId: true, bookmarkCount: true },
            });

            if (!playlist) {
                throw new AppErrorBuilder('Playlist not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            const targetPlaylistId = playlist.id;

            return await prisma.$transaction(async (tx) => {
                const existingBookmark = await tx.userPlaylistBookmark.findUnique({
                    where: {
                        userId_playlistId: {
                            userId,
                            playlistId: targetPlaylistId,
                        },
                    },
                });

                if (existingBookmark) {
                    await tx.userPlaylistBookmark.delete({
                        where: { id: existingBookmark.id },
                    });

                    const updated = await tx.playlist.update({
                        where: { id: targetPlaylistId },
                        data: {
                            bookmarkCount: {
                                decrement: 1,
                            },
                        },
                        select: { bookmarkCount: true },
                    });

                    return {
                        success: true,
                        isBookmarked: false,
                        bookmarkCount: Math.max(0, updated.bookmarkCount),
                        playlistId: targetPlaylistId,
                    };
                } else {
                    await tx.userPlaylistBookmark.create({
                        data: {
                            userId,
                            playlistId: targetPlaylistId,
                        },
                    });

                    const updated = await tx.playlist.update({
                        where: { id: targetPlaylistId },
                        data: {
                            bookmarkCount: {
                                increment: 1,
                            },
                        },
                        select: { bookmarkCount: true },
                    });

                    // Send notification to playlist creator via Social MQ Producer
                    if (playlist.creatorId && playlist.creatorId !== userId) {
                        void (async () => {
                            try {
                                const bookmarker = await prisma.user.findUnique({
                                    where: { id: userId },
                                    select: { name: true, username: true },
                                });
                                const displayName = bookmarker?.username ? `@${bookmarker.username}` : bookmarker?.name || 'Someone';
                                await socialProducer.playlistInteracted({
                                    actorId: userId,
                                    actorName: displayName,
                                    creatorId: playlist.creatorId!,
                                    playlistId: playlist.id,
                                    playlistTitle: playlist.title,
                                    action: 'starred',
                                });
                            } catch (notifErr) {
                                logger.error('Failed to dispatch playlist_bookmarked MQ event', { error: notifErr, creatorId: playlist.creatorId });
                            }
                        })();
                    }

                    return {
                        success: true,
                        isBookmarked: true,
                        bookmarkCount: updated.bookmarkCount,
                        playlistId: targetPlaylistId,
                    };
                }
            });
        })
        .build();

    removePlaylist = qRPC()
        .input(RemovePlaylistInputSchema)
        .output(RemovePlaylistOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing removePlaylist query', { payload });
            const { userId, playlistId } = payload;

            const playlist = await prisma.playlist.findUnique({
                where: { id: playlistId },
                select: { id: true, creatorId: true },
            });

            if (!playlist) {
                throw new AppErrorBuilder('Playlist not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            if (playlist.creatorId !== userId) {
                throw new AppErrorBuilder('You do not have permission to delete this playlist.')
                    .setCode(ErrorCode.FORBIDDEN)
                    .build();
            }

            // Deletion cascades automatically to items and bookmarks via onDelete: Cascade
            await prisma.playlist.delete({
                where: { id: playlistId },
            });

            return {
                success: true,
                id: playlistId,
            };
        })
        .build();

    updatePlaylist = qRPC()
        .input(UpdatePlaylistInputSchema)
        .output(UpdatePlaylistOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing updatePlaylist query', { payload });
            const { userId, playlistId, title, description, isPublic, problemIds } = payload;

            const playlist = await prisma.playlist.findUnique({
                where: { id: playlistId },
                include: {
                    _count: { select: { items: true } },
                },
            });

            if (!playlist) {
                throw new AppErrorBuilder('Playlist not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            if (playlist.creatorId !== userId) {
                throw new AppErrorBuilder('You do not have permission to update this playlist.')
                    .setCode(ErrorCode.FORBIDDEN)
                    .build();
            }

            const updatedPlaylist = await prisma.$transaction(async (tx) => {
                if (problemIds !== undefined) {
                    // Replace playlist items with the new set
                    await tx.playlistItem.deleteMany({
                        where: { playlistId },
                    });

                    if (problemIds.length > 0) {
                        const uniqueProblemIds = Array.from(new Set(problemIds));
                        await tx.playlistItem.createMany({
                            data: uniqueProblemIds.map((problemId, index) => ({
                                playlistId,
                                problemId,
                                order: index,
                            })),
                        });
                    }
                }

                return await tx.playlist.update({
                    where: { id: playlistId },
                    data: {
                        ...(title !== undefined ? { title: title.trim() } : {}),
                        ...(description !== undefined ? { description: description?.trim() || null } : {}),
                        ...(isPublic !== undefined ? { isPublic } : {}),
                    },
                    include: {
                        _count: { select: { items: true } },
                    },
                });
            });

            return {
                id: updatedPlaylist.id,
                title: updatedPlaylist.title,
                slug: updatedPlaylist.slug,
                description: updatedPlaylist.description,
                isPublic: updatedPlaylist.isPublic,
                problemsCount: updatedPlaylist._count.items,
                updatedAt: updatedPlaylist.updatedAt,
            };
        })
        .build();

    toggleProblemInPlaylist = qRPC()
        .input(ToggleProblemInPlaylistInputSchema)
        .output(ToggleProblemInPlaylistOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing toggleProblemInPlaylist query', { payload });
            const { userId, playlistId, problemId } = payload;

            const playlist = await prisma.playlist.findUnique({
                where: { id: playlistId },
                select: { id: true, title: true, creatorId: true },
            });

            if (!playlist) {
                throw new AppErrorBuilder('Playlist not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }

            if (playlist.creatorId !== userId) {
                throw new AppErrorBuilder('You do not have permission to modify this playlist.')
                    .setCode(ErrorCode.FORBIDDEN)
                    .build();
            }

            return await prisma.$transaction(async (tx) => {
                const existingItem = await tx.playlistItem.findFirst({
                    where: {
                        playlistId,
                        problemId,
                    },
                });

                let isAdded = false;

                if (existingItem) {
                    await tx.playlistItem.delete({
                        where: { id: existingItem.id },
                    });
                    isAdded = false;
                } else {
                    const count = await tx.playlistItem.count({
                        where: { playlistId },
                    });

                    await tx.playlistItem.create({
                        data: {
                            playlistId,
                            problemId,
                            order: count,
                        },
                    });
                    isAdded = true;
                }

                const currentCount = await tx.playlistItem.count({
                    where: { playlistId },
                });

                await tx.playlist.update({
                    where: { id: playlistId },
                    data: { updatedAt: new Date() },
                });

                return {
                    success: true,
                    isAdded,
                    playlistId,
                    problemId,
                    problemsCount: currentCount,
                    playlistTitle: playlist.title,
                };
            });
        })
        .build();

    getPlaylistsForProblem = qRPC()
        .input(GetPlaylistsForProblemInputSchema)
        .output(GetPlaylistsForProblemOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getPlaylistsForProblem query', { payload });
            const { userId, problemId } = payload;

            const playlists = await prisma.playlist.findMany({
                where: { creatorId: userId },
                include: {
                    _count: {
                        select: { items: true },
                    },
                    items: {
                        where: { problemId },
                        select: { id: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return playlists.map((p) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                isPublic: p.isPublic,
                problemsCount: p._count.items,
                isContained: p.items.length > 0,
            }));
        })
        .build();
}

export const playlistQueries = new PlaylistQueries();
