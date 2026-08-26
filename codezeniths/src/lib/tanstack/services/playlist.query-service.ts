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
            onMutate: async (variables) => {
                await queryClient.cancelQueries({ queryKey: ['playlist'] });

                const snapshot = queryClient.getQueriesData({ queryKey: ['playlist'] });

                queryClient.setQueriesData({ queryKey: ['playlist'] }, (old: any) => {
                    if (!old) return old;

                    // 1. Single Playlist Info: { id, title, slug, isBookmarked, bookmarkCount, ... }
                    if (old.id === variables.playlistId || ('slug' in old && 'isBookmarked' in old)) {
                        const wasBookmarked = Boolean(old.isBookmarked);
                        const nextBookmarked = !wasBookmarked;
                        const prevCount = old.bookmarkCount ?? 0;
                        return {
                            ...old,
                            isBookmarked: nextBookmarked,
                            bookmarkCount: nextBookmarked ? prevCount + 1 : Math.max(0, prevCount - 1),
                        };
                    }

                    // 2. Paginated / List of Playlists: { items: Playlist[] }
                    if (Array.isArray(old.items)) {
                        const newItems = old.items.map((item: any) => {
                            if (item.id !== variables.playlistId) return item;
                            const wasBookmarked = Boolean(item.isBookmarked);
                            const nextBookmarked = !wasBookmarked;
                            const prevCount = item.bookmarkCount ?? 0;
                            return {
                                ...item,
                                isBookmarked: nextBookmarked,
                                bookmarkCount: nextBookmarked ? prevCount + 1 : Math.max(0, prevCount - 1),
                            };
                        });
                        return { ...old, items: newItems };
                    }

                    // 3. Infinite Pages: { pages: [{ items: Playlist[] }] }
                    if (Array.isArray(old.pages)) {
                        const newPages = old.pages.map((page: any) => {
                            if (!Array.isArray(page.items)) return page;
                            const newItems = page.items.map((item: any) => {
                                if (item.id !== variables.playlistId) return item;
                                const wasBookmarked = Boolean(item.isBookmarked);
                                const nextBookmarked = !wasBookmarked;
                                const prevCount = item.bookmarkCount ?? 0;
                                return {
                                    ...item,
                                    isBookmarked: nextBookmarked,
                                    bookmarkCount: nextBookmarked ? prevCount + 1 : Math.max(0, prevCount - 1),
                                };
                            });
                            return { ...page, items: newItems };
                        });
                        return { ...old, pages: newPages };
                    }

                    return old;
                });

                return { snapshot };
            },
            onError: (_err, _variables, context) => {
                if (context?.snapshot) {
                    context.snapshot.forEach(([queryKey, data]) => {
                        queryClient.setQueryData(queryKey, data);
                    });
                }
            },
            onSettled: async () => {
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
            onMutate: async (variables) => {
                const queryKey = queryKeys.playlist.forProblem(variables.problemId);
                await queryClient.cancelQueries({ queryKey });

                const previousPlaylists = queryClient.getQueryData<Array<any>>(queryKey);

                queryClient.setQueryData<Array<any>>(queryKey, (old) => {
                    if (!old) return old;
                    return old.map((item) => {
                        if (item.id === variables.playlistId) {
                            const nextContained = !item.isContained;
                            return {
                                ...item,
                                isContained: nextContained,
                                problemsCount: nextContained
                                    ? (item.problemsCount ?? 0) + 1
                                    : Math.max(0, (item.problemsCount ?? 1) - 1),
                            };
                        }
                        return item;
                    });
                });

                return { previousPlaylists, queryKey };
            },
            onError: (_err, _variables, context) => {
                if (context?.previousPlaylists && context.queryKey) {
                    queryClient.setQueryData(context.queryKey, context.previousPlaylists);
                }
            },
            onSettled: async () => {
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
            queryKey: queryKeys.playlist.forProblem(validatedInput.problemId),
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
