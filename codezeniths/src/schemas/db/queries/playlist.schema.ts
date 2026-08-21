import { z } from 'zod';

// ─── Shared Playlist Schemas ──────────────────────────────────────────────────

export const PlaylistCreatorSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    username: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
});

export const PlaylistSummaryItemSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    isPublic: z.boolean(),
    problemsCount: z.number().int().default(0),
    bookmarkCount: z.number().int().default(0),
    viewCount: z.number().int().default(0),
    isBookmarked: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    creator: PlaylistCreatorSchema.optional(),
});

// ─── createPlaylist ───────────────────────────────────────────────────────────

export const CreatePlaylistInputSchema = z.object({
    userId: z.string().uuid(),
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    isPublic: z.boolean().default(true),
    problemIds: z.array(z.string().uuid()).optional(),
});

export const CreatePlaylistOutputSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    isPublic: z.boolean(),
    problemsCount: z.number().int().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

// ─── getMyPlaylists ───────────────────────────────────────────────────────────

export const GetMyPlaylistsInputSchema = z.object({
    userId: z.string().uuid(),
});

export const GetMyPlaylistsOutputSchema = z.array(PlaylistSummaryItemSchema);

// ─── getCommunityPlaylists ────────────────────────────────────────────────────

export const GetCommunityPlaylistsInputSchema = z.object({
    userId: z.string().uuid().optional(),
    creatorId: z.string().uuid().optional(),
    creatorUsername: z.string().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(10),
    search: z.string().optional(),
    sortBy: z.enum(['popular', 'recent', 'name']).default('popular'),
    order: z.enum(['asc', 'desc']).default('desc'),
});

export const GetCommunityPlaylistsOutputSchema = z.object({
    items: z.array(PlaylistSummaryItemSchema),
    total: z.number().int(),
    page: z.number().int(),
    limit: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
});

// ─── getPlaylistInfo ──────────────────────────────────────────────────────────

export const GetPlaylistInfoInputSchema = z.object({
    slug: z.string().optional(),
    id: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
}).refine((data) => data.slug || data.id, {
    message: 'Either slug or id must be provided to fetch playlist information.',
});

export const GetPlaylistInfoOutputSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    isPublic: z.boolean(),
    bookmarkCount: z.number().int().default(0),
    viewCount: z.number().int().default(0),
    problemsCount: z.number().int().default(0),
    isBookmarked: z.boolean().default(false),
    isOwner: z.boolean().default(false),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    creator: PlaylistCreatorSchema,
    progress: z.object({
        problemsCount: z.number().int(),
        problemsSolvedCount: z.number().int(),
        problemsRevisitCount: z.number().int().default(0),
        problemNotSolvedCount: z.number().int().default(0),
        problemsSolvedPercentage: z.number(),
        problemsCountByDifficulty: z.object({
            easy: z.number().int().default(0),
            medium: z.number().int().default(0),
            hard: z.number().int().default(0),
        }),
        problemsSolvedCountByDifficulty: z.object({
            easy: z.number().int().default(0),
            medium: z.number().int().default(0),
            hard: z.number().int().default(0),
        }),
    }),
    otherPlaylists: z
        .array(
            z.object({
                id: z.string().uuid(),
                title: z.string(),
                slug: z.string(),
                problemsCount: z.number().int().default(0),
            })
        )
        .default([]),
});

// ─── toggleBookmark ───────────────────────────────────────────────────────────

export const TogglePlaylistBookmarkInputSchema = z.object({
    userId: z.string().uuid(),
    playlistId: z.string().uuid().optional(),
    slug: z.string().optional(),
}).refine((data) => data.playlistId || data.slug, {
    message: 'Either playlistId or slug must be provided.',
});

export const TogglePlaylistBookmarkOutputSchema = z.object({
    success: z.boolean(),
    isBookmarked: z.boolean(),
    bookmarkCount: z.number().int(),
    playlistId: z.string().uuid(),
});

// ─── removePlaylist ───────────────────────────────────────────────────────────

export const RemovePlaylistInputSchema = z.object({
    userId: z.string().uuid(),
    playlistId: z.string().uuid(),
});

export const RemovePlaylistOutputSchema = z.object({
    success: z.boolean(),
    id: z.string().uuid(),
});

// ─── updatePlaylist ───────────────────────────────────────────────────────────

export const UpdatePlaylistInputSchema = z.object({
    userId: z.string().uuid(),
    playlistId: z.string().uuid(),
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).nullable().optional(),
    isPublic: z.boolean().optional(),
    problemIds: z.array(z.string().uuid()).optional(),
});

export const UpdatePlaylistOutputSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    description: z.string().nullable().optional(),
    isPublic: z.boolean(),
    problemsCount: z.number().int(),
    updatedAt: z.coerce.date(),
});

// ─── toggleProblemInPlaylist ───────────────────────────────────────────────────

export const ToggleProblemInPlaylistInputSchema = z.object({
    userId: z.string().uuid(),
    playlistId: z.string().uuid(),
    problemId: z.string().uuid(),
});

export const ToggleProblemInPlaylistOutputSchema = z.object({
    success: z.boolean(),
    isAdded: z.boolean(),
    playlistId: z.string().uuid(),
    problemId: z.string().uuid(),
    problemsCount: z.number().int(),
    playlistTitle: z.string(),
});

// ─── getPlaylistsForProblem ────────────────────────────────────────────────────

export const GetPlaylistsForProblemInputSchema = z.object({
    userId: z.string().uuid(),
    problemId: z.string().uuid(),
});

export const PlaylistItemWithProblemStatusSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    slug: z.string(),
    isPublic: z.boolean(),
    problemsCount: z.number().int(),
    isContained: z.boolean(),
});

export const GetPlaylistsForProblemOutputSchema = z.array(PlaylistItemWithProblemStatusSchema);
