import { z } from 'zod';
import {
    CreatePlaylistOutputSchema,
    GetMyPlaylistsOutputSchema,
    GetCommunityPlaylistsOutputSchema,
    GetPlaylistInfoOutputSchema,
    TogglePlaylistBookmarkOutputSchema,
    RemovePlaylistOutputSchema,
    UpdatePlaylistOutputSchema,
    ToggleProblemInPlaylistOutputSchema,
    GetPlaylistsForProblemOutputSchema,
} from '@codezeniths/schemas/db';

// ─── createPlaylist ───────────────────────────────────────────────────────────

export const CreatePlaylistTRPCInputSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
    isPublic: z.boolean().default(true),
    problemIds: z.array(z.string().uuid()).optional(),
});

export const CreatePlaylistTRPCOutputSchema = CreatePlaylistOutputSchema;

// ─── getMyPlaylists ───────────────────────────────────────────────────────────

export const GetMyPlaylistsTRPCInputSchema = z.object({}).optional();
export const GetMyPlaylistsTRPCOutputSchema = GetMyPlaylistsOutputSchema;

// ─── getCommunityPlaylists ────────────────────────────────────────────────────

export const GetCommunityPlaylistsTRPCInputSchema = z.object({
    creatorId: z.string().uuid().optional(),
    creatorUsername: z.string().optional(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(10),
    search: z.string().optional(),
    sortBy: z.enum(['popular', 'recent', 'name']).default('popular'),
    order: z.enum(['asc', 'desc']).default('desc'),
}).optional();

export const GetCommunityPlaylistsTRPCOutputSchema = GetCommunityPlaylistsOutputSchema;

// ─── getPlaylistInfo ──────────────────────────────────────────────────────────

export const GetPlaylistInfoTRPCInputSchema = z.object({
    slug: z.string().optional(),
    id: z.string().uuid().optional(),
}).refine((data) => data.slug || data.id, {
    message: 'Either slug or id must be provided to fetch playlist information.',
});

export const GetPlaylistInfoTRPCOutputSchema = GetPlaylistInfoOutputSchema;

// ─── toggleBookmark ───────────────────────────────────────────────────────────

export const TogglePlaylistBookmarkTRPCInputSchema = z.object({
    playlistId: z.string().uuid().optional(),
    slug: z.string().optional(),
}).refine((data) => data.playlistId || data.slug, {
    message: 'Either playlistId or slug must be provided.',
});

export const TogglePlaylistBookmarkTRPCOutputSchema = TogglePlaylistBookmarkOutputSchema;

// ─── removePlaylist ───────────────────────────────────────────────────────────

export const RemovePlaylistTRPCInputSchema = z.object({
    playlistId: z.string().uuid(),
});

export const RemovePlaylistTRPCOutputSchema = RemovePlaylistOutputSchema;

// ─── updatePlaylist ───────────────────────────────────────────────────────────

export const UpdatePlaylistTRPCInputSchema = z.object({
    playlistId: z.string().uuid(),
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).nullable().optional(),
    isPublic: z.boolean().optional(),
    problemIds: z.array(z.string().uuid()).optional(),
}).refine(
    (data) =>
        data.title !== undefined ||
        data.description !== undefined ||
        data.isPublic !== undefined ||
        data.problemIds !== undefined,
    {
        message: 'At least one field (title, description, isPublic, or problemIds) must be provided to update.',
    }
);

export const UpdatePlaylistTRPCOutputSchema = UpdatePlaylistOutputSchema;

// ─── toggleProblemInPlaylist ───────────────────────────────────────────────────

export const ToggleProblemInPlaylistTRPCInputSchema = z.object({
    playlistId: z.string().uuid(),
    problemId: z.string().uuid(),
});

export const ToggleProblemInPlaylistTRPCOutputSchema = ToggleProblemInPlaylistOutputSchema;

// ─── getPlaylistsForProblem ────────────────────────────────────────────────────

export const GetPlaylistsForProblemTRPCInputSchema = z.object({
    problemId: z.string().uuid(),
});

export const GetPlaylistsForProblemTRPCOutputSchema = GetPlaylistsForProblemOutputSchema;

