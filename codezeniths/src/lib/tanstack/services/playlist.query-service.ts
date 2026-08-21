'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import { CacheInvalidationService } from '../cache-invalidation.service';
import type { IPlaylistQueryService } from '../interfaces';
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

export class PlaylistQueryService implements IPlaylistQueryService {
    getMyPlaylists(options?: { enabled?: boolean }) {
        return useQuery({
            queryKey: queryKeys.playlist.myList(),
            queryFn: async () => {
                const raw = await trpcClient.playlist.getMyPlaylists.query({});
                return GetMyPlaylistsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    getCommunityPlaylists(
        input?: z.input<typeof GetCommunityPlaylistsTRPCInputSchema>,
        options?: { enabled?: boolean }
    ) {
        return useQuery({
            queryKey: queryKeys.playlist.communityList(input),
            queryFn: async () => {
                const validatedInput = GetCommunityPlaylistsTRPCInputSchema.parse(input ?? {});
                const raw = await trpcClient.playlist.getCommunityPlaylists.query(validatedInput);
                return GetCommunityPlaylistsTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getCommunityPlaylistsInfinite(input?: {
        search?: string;
        sortBy?: 'popular' | 'recent' | 'name';
        order?: 'asc' | 'desc';
        limit?: number;
    }) {
        const limit = input?.limit || 10;
        return useInfiniteQuery({
            queryKey: queryKeys.playlist.communityInfinite(input),
            queryFn: async ({ pageParam = 1 }) => {
                const queryInput = {
                    page: pageParam,
                    limit,
                    search: input?.search,
                    sortBy: input?.sortBy,
                    order: input?.order,
                };
                const validatedInput = GetCommunityPlaylistsTRPCInputSchema.parse(queryInput);
                const raw = await trpcClient.playlist.getCommunityPlaylists.query(validatedInput);
                return GetCommunityPlaylistsTRPCOutputSchema.parse(raw);
            },
            initialPageParam: 1,
            getNextPageParam: (lastPage) => {
                if (lastPage.hasNextPage) {
                    return lastPage.page + 1;
                }
                return undefined;
            },
            ...CACHE_TIERS.DYNAMIC,
        });
    }

    getPlaylistInfo(
        input: z.infer<typeof GetPlaylistInfoTRPCInputSchema>,
        options?: { enabled?: boolean }
    ) {
        const validatedInput = GetPlaylistInfoTRPCInputSchema.parse(input);
        const cacheKey = validatedInput.slug || validatedInput.id || 'unknown';
        return useQuery({
            queryKey: queryKeys.playlist.info(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.playlist.getPlaylistInfo.query(validatedInput);
                return GetPlaylistInfoTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }

    createPlaylist() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof CreatePlaylistTRPCInputSchema>) => {
                const validatedInput = CreatePlaylistTRPCInputSchema.parse(variables);
                const raw = await trpcClient.playlist.createPlaylist.mutate(validatedInput);
                return CreatePlaylistTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnPlaylistChange(queryClient);
            },
        });
    }

    updatePlaylist() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpdatePlaylistTRPCInputSchema>) => {
                const validatedInput = UpdatePlaylistTRPCInputSchema.parse(variables);
                const raw = await trpcClient.playlist.updatePlaylist.mutate(validatedInput);
                return UpdatePlaylistTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnPlaylistChange(queryClient);
                await queryClient.invalidateQueries({ queryKey: ['problem'] });
            },
        });
    }

    removePlaylist() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof RemovePlaylistTRPCInputSchema>) => {
                const validatedInput = RemovePlaylistTRPCInputSchema.parse(variables);
                const raw = await trpcClient.playlist.removePlaylist.mutate(validatedInput);
                return RemovePlaylistTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnPlaylistChange(queryClient);
            },
        });
    }

    toggleBookmark() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof TogglePlaylistBookmarkTRPCInputSchema>) => {
                const validatedInput = TogglePlaylistBookmarkTRPCInputSchema.parse(variables);
                const raw = await trpcClient.playlist.toggleBookmark.mutate(validatedInput);
                return TogglePlaylistBookmarkTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnPlaylistChange(queryClient);
            },
        });
    }

    toggleProblemInPlaylist() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof ToggleProblemInPlaylistTRPCInputSchema>) => {
                const validatedInput = ToggleProblemInPlaylistTRPCInputSchema.parse(variables);
                const raw = await trpcClient.playlist.toggleProblemInPlaylist.mutate(validatedInput);
                return ToggleProblemInPlaylistTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnPlaylistChange(queryClient);
                await queryClient.invalidateQueries({ queryKey: ['problem'] });
            },
        });
    }

    getPlaylistsForProblem(
        input: z.infer<typeof GetPlaylistsForProblemTRPCInputSchema>,
        options?: { enabled?: boolean }
    ) {
        const validatedInput = GetPlaylistsForProblemTRPCInputSchema.parse(input);
        return useQuery({
            queryKey: ['playlist', 'forProblem', validatedInput.problemId],
            queryFn: async () => {
                const raw = await trpcClient.playlist.getPlaylistsForProblem.query(validatedInput);
                return GetPlaylistsForProblemTRPCOutputSchema.parse(raw);
            },
            enabled: options?.enabled ?? true,
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }
}

export const playlistQueryService = new PlaylistQueryService();
