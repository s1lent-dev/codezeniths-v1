'use client';

import React from 'react';
import {
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    toast,
} from '@codezeniths/modules';
import { ListPlus, Check, Loader2, Plus, ListMusic } from 'lucide-react';
import { playlistQueryService } from '@/lib/tanstack';
import { cn } from '@codezeniths/design/cn';
import Link from 'next/link';

export interface ProblemPlaylistSubmenuProps {
    problemId: string;
}

export const ProblemPlaylistSubmenu: React.FC<ProblemPlaylistSubmenuProps> = ({ problemId }) => {
    const { data: playlists = [], isLoading } = playlistQueryService.getPlaylistsForProblem({
        problemId,
    });

    const toggleMutation = playlistQueryService.toggleProblemInPlaylist();
    const [busyPlaylistIds, setBusyPlaylistIds] = React.useState<Set<string>>(new Set());
    const busyRef = React.useRef<Set<string>>(new Set());

    const handleToggle = async (playlistId: string, playlistTitle: string) => {
        // Throttling guard: block if mutation is already in-flight for this playlist
        if (busyRef.current.has(playlistId)) return;
        busyRef.current.add(playlistId);
        setBusyPlaylistIds(new Set(busyRef.current));

        try {
            const res = await toggleMutation.mutateAsync({
                playlistId,
                problemId,
            });

            if (res.isAdded) {
                toast.success('Added to Playlist', `Problem added to "${res.playlistTitle}".`);
            } else {
                toast.success('Removed from Playlist', `Problem removed from "${res.playlistTitle}".`);
            }
        } catch (error: any) {
            toast.error('Failed to Update', error?.message || 'Could not update playlist.');
        } finally {
            busyRef.current.delete(playlistId);
            setBusyPlaylistIds(new Set(busyRef.current));
        }
    };

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2 px-2.5 py-1.5 rounded-xs text-xs font-medium text-body-light-shade3 dark:text-body-dark hover:text-primary hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 cursor-pointer transition-colors outline-none select-none">
                <ListPlus className="size-3.5 text-primary shrink-0" />
                <span>Add to Playlist</span>
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent
                sideOffset={4}
                alignOffset={-4}
                collisionPadding={8}
                className="w-52 xs:w-56 max-w-[calc(100vw-1.5rem)] p-1 rounded-md bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xl text-body-light-shade3 dark:text-body-dark space-y-0.5 z-110"
            >
                <div className="px-2.5 py-1.5 text-[10px] font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider">
                    My Playlists ({playlists.length})
                </div>

                {isLoading ? (
                    <div className="p-3 text-center text-xs text-muted-light dark:text-muted-dark flex items-center justify-center gap-1.5">
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                        <span>Loading playlists...</span>
                    </div>
                ) : playlists.length === 0 ? (
                    <div className="p-3 text-center space-y-2">
                        <p className="text-xs text-muted-light dark:text-muted-dark">No playlists created yet.</p>
                        <Link
                            href="/playlists"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                            <Plus className="size-3" />
                            <span>Create Playlist</span>
                        </Link>
                    </div>
                ) : (
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                        {playlists.map((playlist) => {
                            const isBusy = busyPlaylistIds.has(playlist.id);
                            return (
                                <DropdownMenuItem
                                    key={playlist.id}
                                    disabled={isBusy}
                                    onSelect={(e) => {
                                        e.preventDefault();
                                        if (!isBusy) handleToggle(playlist.id, playlist.title);
                                    }}
                                    className={cn(
                                        'flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xs text-xs font-medium text-body-light-shade3 dark:text-body-dark hover:text-primary hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 cursor-pointer transition-colors outline-none select-none',
                                        isBusy && 'opacity-50 pointer-events-none cursor-not-allowed'
                                    )}
                                >
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <ListMusic className="size-3.5 text-muted-light dark:text-muted-dark shrink-0" />
                                        <span className="truncate">{playlist.title}</span>
                                    </div>

                                    <div
                                        className={cn(
                                            'size-4 rounded-xs border flex items-center justify-center shrink-0 transition-colors',
                                            playlist.isContained
                                                ? 'bg-primary border-primary text-white'
                                                : 'border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-transparent'
                                        )}
                                    >
                                        {playlist.isContained && <Check className="size-3 stroke-3" />}
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}
                    </div>
                )}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
};
