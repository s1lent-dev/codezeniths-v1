import { z } from 'zod';
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

export interface IPlaylistQueries {
    createPlaylist: (
        payload: z.infer<typeof CreatePlaylistInputSchema>
    ) => Promise<z.infer<typeof CreatePlaylistOutputSchema>>;

    getMyPlaylists: (
        payload: z.infer<typeof GetMyPlaylistsInputSchema>
    ) => Promise<z.infer<typeof GetMyPlaylistsOutputSchema>>;

    getCommunityPlaylists: (
        payload: z.infer<typeof GetCommunityPlaylistsInputSchema>
    ) => Promise<z.infer<typeof GetCommunityPlaylistsOutputSchema>>;

    getPlaylistInfo: (
        payload: z.infer<typeof GetPlaylistInfoInputSchema>
    ) => Promise<z.infer<typeof GetPlaylistInfoOutputSchema>>;

    togglePlaylistBookmark: (
        payload: z.infer<typeof TogglePlaylistBookmarkInputSchema>
    ) => Promise<z.infer<typeof TogglePlaylistBookmarkOutputSchema>>;

    removePlaylist: (
        payload: z.infer<typeof RemovePlaylistInputSchema>
    ) => Promise<z.infer<typeof RemovePlaylistOutputSchema>>;

    updatePlaylist: (
        payload: z.infer<typeof UpdatePlaylistInputSchema>
    ) => Promise<z.infer<typeof UpdatePlaylistOutputSchema>>;

    toggleProblemInPlaylist: (
        payload: z.infer<typeof ToggleProblemInPlaylistInputSchema>
    ) => Promise<z.infer<typeof ToggleProblemInPlaylistOutputSchema>>;

    getPlaylistsForProblem: (
        payload: z.infer<typeof GetPlaylistsForProblemInputSchema>
    ) => Promise<z.infer<typeof GetPlaylistsForProblemOutputSchema>>;
}
