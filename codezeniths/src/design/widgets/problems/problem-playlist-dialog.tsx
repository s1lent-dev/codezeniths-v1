'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    toast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    ButtonSize,
    ScrollArea,
} from '@codezeniths/components';
import { playlistQueryService } from '@/lib/tanstack';
import {
    ListPlus,
    Check,
    Loader2,
    Plus,
    ListMusic,
    Search,
    ExternalLink,
} from 'lucide-react';
import { cn } from '@codezeniths/design/cn';
import Link from 'next/link';
import type { ProblemItem } from './problem-row';

export interface ProblemPlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    problem: ProblemItem | null;
}

export const ProblemPlaylistDialog: React.FC<ProblemPlaylistDialogProps> = ({
    open,
    onOpenChange,
    problem,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [busyPlaylistIds, setBusyPlaylistIds] = useState<Set<string>>(new Set());
    const busyRef = React.useRef<Set<string>>(new Set());

    // 1. Lazy Query: Fetch problem playlists ONLY when the dialog is open
    const { data: playlists = [], isLoading } = playlistQueryService.getPlaylistsForProblem(
        { problemId: problem?.id || '' },
        { enabled: open && Boolean(problem?.id) }
    );

    const toggleMutation = playlistQueryService.toggleProblemInPlaylist();

    if (!problem) return null;

    const handleClose = () => {
        setSearchQuery('');
        onOpenChange(false);
    };

    const handleToggle = async (playlistId: string, playlistTitle: string) => {
        if (busyRef.current.has(playlistId)) return;
        busyRef.current.add(playlistId);
        setBusyPlaylistIds(new Set(busyRef.current));

        try {
            const res = await toggleMutation.mutateAsync({
                playlistId,
                problemId: problem.id,
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

    const filteredPlaylists = playlists.filter((pl) =>
        pl.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    const formatDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
        if (difficulty === 'medium') return 'Medium';
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="sm:max-w-lg md:max-w-xl bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-md p-0 overflow-hidden shadow-xl gap-0 z-300">
                <div className="space-y-0">
                    <div className="p-4 sm:p-6 space-y-4">
                        {/* Header identical in cadence to ProblemNoteDialog */}
                        <DialogHeader className="space-y-1.5 pb-0">
                            <div className="flex items-center gap-3.5 pr-8">
                                <div className="p-3 rounded-sm bg-primary/10 text-primary shrink-0">
                                    <ListPlus className="size-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <DialogTitle className="text-base font-semibold text-heading-light dark:text-heading-dark">
                                        {problem.title}
                                    </DialogTitle>
                                    <div className="flex items-center gap-2 flex-wrap text-xs mt-1">
                                        <span
                                            className={cn(
                                                'text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shrink-0',
                                                problem.difficulty === 'hard' &&
                                                    'bg-rose-500/10 text-rose-500 dark:text-rose-400',
                                                problem.difficulty === 'medium' &&
                                                    'bg-amber-500/10 text-amber-500 dark:text-amber-400',
                                                problem.difficulty === 'easy' &&
                                                    'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                                            )}
                                        >
                                            {formatDifficulty(problem.difficulty)}
                                        </span>

                                        {(problem.problemUrl || problem.articleUrl) && (
                                            <>
                                                <span className="text-muted-light dark:text-muted-dark text-[10px]">•</span>
                                                <a
                                                    href={problem.problemUrl || problem.articleUrl || '#'}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                                                >
                                                    <span>Open Problem</span>
                                                    <ExternalLink className="size-3" />
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        {/* Search or List Content */}
                        <div className="space-y-3 pt-2 sm:pt-3">
                            {isLoading ? (
                                <div className="h-36 sm:h-48 w-full flex flex-col items-center justify-center gap-2 rounded-sm bg-foreground-light-shade2/50 dark:bg-foreground-dark-shade2/50 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 animate-pulse">
                                    <Loader2 className="size-5 animate-spin text-primary opacity-60" />
                                    <span className="text-xs text-muted-light dark:text-muted-dark">
                                        Loading your playlists...
                                    </span>
                                </div>
                            ) : playlists.length === 0 ? (
                                <div className="p-6 sm:p-8 rounded-sm border border-dashed border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 text-center space-y-2.5">
                                    <ListMusic className="size-8 mx-auto text-muted-light dark:text-muted-dark opacity-50" />
                                    <p className="text-xs sm:text-sm text-heading-light dark:text-heading-dark font-medium">
                                        No Playlists Created Yet
                                    </p>
                                    <p className="text-xs text-muted-light dark:text-muted-dark max-w-xs mx-auto leading-relaxed">
                                        Organize and curate problems by topic, interview goals, or difficulty.
                                    </p>
                                    <Link
                                        href="/playlists"
                                        onClick={handleClose}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-2"
                                    >
                                        <Plus className="size-3.5" />
                                        <span>Create Your First Playlist</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {/* Search Input when user has multiple playlists */}
                                    {playlists.length > 3 && (
                                        <div className="relative">
                                            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Search playlists..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-8.5 pr-4 py-2 text-xs font-sans rounded-sm border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-foreground-dark-shade3 dark:text-foreground-light-shade3 placeholder:text-muted-light dark:placeholder:text-muted-dark focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            />
                                        </div>
                                    )}

                                    {/* Scrollable Playlist Cards list matching design token rhythm */}
                                    <ScrollArea className="h-44 sm:h-56 w-full rounded-sm border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 p-1.5">
                                        {filteredPlaylists.length === 0 ? (
                                            <div className="p-8 text-center text-xs text-muted-light dark:text-muted-dark">
                                                No playlists found matching &quot;{searchQuery}&quot;
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                {filteredPlaylists.map((playlist) => {
                                                    const isBusy = busyPlaylistIds.has(playlist.id);
                                                    return (
                                                        <button
                                                            key={playlist.id}
                                                            type="button"
                                                            disabled={isBusy}
                                                            onClick={() => handleToggle(playlist.id, playlist.title)}
                                                            className={cn(
                                                                'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-sm text-xs sm:text-sm font-medium transition-colors text-left select-none cursor-pointer',
                                                                playlist.isContained
                                                                    ? 'bg-primary/10 text-primary dark:text-primary font-semibold'
                                                                    : 'text-foreground-dark-shade3 dark:text-foreground-light-shade3 hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2',
                                                                isBusy && 'opacity-50 cursor-not-allowed pointer-events-none'
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                                                <ListMusic
                                                                    className={cn(
                                                                        'size-4 shrink-0',
                                                                        playlist.isContained
                                                                            ? 'text-primary'
                                                                            : 'text-muted-light dark:text-muted-dark'
                                                                    )}
                                                                />
                                                                <span className="truncate">{playlist.title}</span>
                                                            </div>

                                                            <div
                                                                className={cn(
                                                                    'size-4.5 rounded-xs border flex items-center justify-center shrink-0 transition-colors',
                                                                    playlist.isContained
                                                                        ? 'bg-primary border-primary text-white'
                                                                        : 'border-foreground-light-shade3 dark:border-foreground-dark-shade3 bg-transparent'
                                                                )}
                                                            >
                                                                {playlist.isContained && (
                                                                    <Check className="size-3.5 stroke-3" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer identical in structure to ProblemNoteDialog */}
                    <DialogFooter className="px-4 sm:px-6 py-3.5 sm:py-4 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 border-t border-foreground-light-shade3 dark:border-foreground-dark-shade1 flex flex-row items-center justify-between gap-2.5 m-0 rounded-b-md rounded-t-none">
                        <Link
                            href="/playlists"
                            onClick={handleClose}
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium cursor-pointer"
                        >
                            <Plus className="size-3.5" />
                            <span>Create New Playlist</span>
                        </Link>

                        <div className="flex items-center gap-2.5">
                            <Button
                                type="button"
                                variant={ButtonVariant.DEFAULT}
                                size={ButtonSize.SM}
                                onClick={handleClose}
                                className="text-xs font-medium rounded-sm border-none bg-primary hover:bg-primary/90 text-foreground-dark-shade3 dark:text-foreground-light-shade3 min-w-24 px-4 py-2 cursor-pointer"
                            >
                                Done
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
