import { TRPCContext } from '../../trpc/trpc.context';
import {
    CreatePlaylistTRPCInputSchema,
    CreatePlaylistTRPCOutputSchema,
    GetMyPlaylistsTRPCInputSchema,
    GetMyPlaylistsTRPCOutputSchema,
    GetCommunityPlaylistsTRPCInputSchema,
    GetCommunityPlaylistsTRPCOutputSchema,
    GetPlaylistInfoTRPCInputSchema,
    GetPlaylistInfoTRPCOutputSchema,
    TogglePlaylistBookmarkTRPCInputSchema,
    TogglePlaylistBookmarkTRPCOutputSchema,
    RemovePlaylistTRPCInputSchema,
    RemovePlaylistTRPCOutputSchema,
    UpdatePlaylistTRPCInputSchema,
    UpdatePlaylistTRPCOutputSchema,
    ToggleProblemInPlaylistTRPCInputSchema,
    ToggleProblemInPlaylistTRPCOutputSchema,
    GetPlaylistsForProblemTRPCInputSchema,
    GetPlaylistsForProblemTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IPlaylistController {
    createPlaylist(args: {
        ctx: TRPCContext;
        input: z.infer<typeof CreatePlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof CreatePlaylistTRPCOutputSchema>>;

    getMyPlaylists(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetMyPlaylistsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetMyPlaylistsTRPCOutputSchema>>;

    getCommunityPlaylists(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetCommunityPlaylistsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetCommunityPlaylistsTRPCOutputSchema>>;

    getPlaylistInfo(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetPlaylistInfoTRPCInputSchema>;
    }): Promise<z.infer<typeof GetPlaylistInfoTRPCOutputSchema>>;

    toggleBookmark(args: {
        ctx: TRPCContext;
        input: z.infer<typeof TogglePlaylistBookmarkTRPCInputSchema>;
    }): Promise<z.infer<typeof TogglePlaylistBookmarkTRPCOutputSchema>>;

    removePlaylist(args: {
        ctx: TRPCContext;
        input: z.infer<typeof RemovePlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof RemovePlaylistTRPCOutputSchema>>;

    updatePlaylist(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpdatePlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof UpdatePlaylistTRPCOutputSchema>>;

    toggleProblemInPlaylist(args: {
        ctx: TRPCContext;
        input: z.infer<typeof ToggleProblemInPlaylistTRPCInputSchema>;
    }): Promise<z.infer<typeof ToggleProblemInPlaylistTRPCOutputSchema>>;

    getPlaylistsForProblem(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetPlaylistsForProblemTRPCInputSchema>;
    }): Promise<z.infer<typeof GetPlaylistsForProblemTRPCOutputSchema>>;
}
