import { createTRPCRouter } from '../trpc';
import { protectedProcedure, publicProcedure } from '../trpc/trpc.procedure';
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

export const playlistRouter = createTRPCRouter({
    createPlaylist: protectedProcedure
        .input(CreatePlaylistTRPCInputSchema)
        .output(CreatePlaylistTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.playlist.createPlaylist({ ctx, input })),

    getMyPlaylists: protectedProcedure
        .input(GetMyPlaylistsTRPCInputSchema)
        .output(GetMyPlaylistsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.playlist.getMyPlaylists({ ctx, input })),

    getCommunityPlaylists: publicProcedure
        .input(GetCommunityPlaylistsTRPCInputSchema)
        .output(GetCommunityPlaylistsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.playlist.getCommunityPlaylists({ ctx, input })),

    getPlaylistInfo: publicProcedure
        .input(GetPlaylistInfoTRPCInputSchema)
        .output(GetPlaylistInfoTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.playlist.getPlaylistInfo({ ctx, input })),

    toggleBookmark: protectedProcedure
        .input(TogglePlaylistBookmarkTRPCInputSchema)
        .output(TogglePlaylistBookmarkTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.playlist.toggleBookmark({ ctx, input })),

    removePlaylist: protectedProcedure
        .input(RemovePlaylistTRPCInputSchema)
        .output(RemovePlaylistTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.playlist.removePlaylist({ ctx, input })),

    updatePlaylist: protectedProcedure
        .input(UpdatePlaylistTRPCInputSchema)
        .output(UpdatePlaylistTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.playlist.updatePlaylist({ ctx, input })),

    toggleProblemInPlaylist: protectedProcedure
        .input(ToggleProblemInPlaylistTRPCInputSchema)
        .output(ToggleProblemInPlaylistTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.playlist.toggleProblemInPlaylist({ ctx, input })),

    getPlaylistsForProblem: protectedProcedure
        .input(GetPlaylistsForProblemTRPCInputSchema)
        .output(GetPlaylistsForProblemTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.playlist.getPlaylistsForProblem({ ctx, input })),
});
