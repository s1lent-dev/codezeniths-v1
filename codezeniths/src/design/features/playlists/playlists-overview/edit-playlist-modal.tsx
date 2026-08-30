'use client';

import React, { useState, useEffect } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
    toast,
} from '@codezeniths/modules';
import {
    Button,
    ButtonVariant,
    FloatingLabelInput,
    FloatingLabelTextarea,
    Switch,
    ScrollArea,
} from '@codezeniths/components';
import { playlistQueryService, problemQueryService } from '@/lib/tanstack';
import { Globe, Lock, Edit3 } from 'lucide-react';
import {
    PlaylistProblemPicker,
    type ProblemPickerItem,
} from '../shared/playlist-problem-picker';
import type { PlaylistSummaryItem } from './playlists-overview.types';

export interface EditPlaylistModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    playlist: PlaylistSummaryItem | null;
    onSuccess?: () => void;
}

export const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
    open,
    onOpenChange,
    playlist,
    onSuccess,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [selectedProblems, setSelectedProblems] = useState<ProblemPickerItem[]>([]);
    const [syncedPlaylistId, setSyncedPlaylistId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentPlaylistId = playlist?.id ?? null;
    const isQueryEnabled = open && Boolean(playlist?.slug);

    // Sync metadata and reset selected problems when switching playlist
    useEffect(() => {
        if (playlist) {
            setTitle(playlist.title);
            setDescription(playlist.description || '');
            setIsPublic(playlist.isPublic);
        }
        if (currentPlaylistId !== syncedPlaylistId) {
            setSelectedProblems([]);
        }
    }, [playlist, currentPlaylistId, syncedPlaylistId]);

    // Fetch existing problems in this playlist (only when open & slug is present)
    const {
        data: problemsData,
        isLoading: isProblemsLoading,
        isFetching: isProblemsFetching,
    } = problemQueryService.getProblems(
        {
            mode: 'filtered',
            filters: playlist?.slug ? { playlistSlug: playlist.slug } : undefined,
        },
        { enabled: isQueryEnabled }
    );

    // Sync loaded problem tracks into form state once for this playlist
    useEffect(() => {
        if (open && playlist && problemsData?.mode === 'filtered' && problemsData.problems && syncedPlaylistId !== playlist.id) {
            setSelectedProblems(
                problemsData.problems.map((p) => ({
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    difficulty: p.difficulty,
                }))
            );
            setSyncedPlaylistId(playlist.id);
        }
    }, [open, playlist, problemsData, syncedPlaylistId]);

    const isLoadingProblems = isQueryEnabled && (isProblemsLoading || (isProblemsFetching && syncedPlaylistId !== playlist?.id));

    const updateMutation = playlistQueryService.updatePlaylist();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!playlist) return;

        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            toast.error('Validation Error', 'Please enter a playlist title.');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateMutation.mutateAsync({
                playlistId: playlist.id,
                title: trimmedTitle,
                description: description.trim() || null,
                isPublic,
                problemIds: selectedProblems.map((p) => p.id),
            });

            toast.success('Playlist Updated', 'Your changes and problems have been saved successfully.');
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            toast.error('Update Failed', error?.message || 'Something went wrong while updating playlist.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="max-w-2xl md:max-w-2xl max-h-[85vh] h-[85vh] flex flex-col p-0 overflow-hidden mx-auto bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-2xl z-300">
                <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
                    {/* ─── Fixed Centered Header ─── */}
                    <DrawerHeader className="p-6 pb-4 border-b border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 shrink-0 bg-foreground-light dark:bg-foreground-dark flex flex-col items-center justify-center text-center">
                        <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mb-2">
                            <Edit3 className="size-5.5" />
                        </div>
                        <div className="space-y-1 text-center">
                            <DrawerTitle className="text-xl sm:text-2xl font-bold text-center">
                                Edit Playlist
                            </DrawerTitle>
                            <DrawerDescription className="text-xs sm:text-sm text-muted-light dark:text-muted-dark text-center max-w-sm mx-auto">
                                Update title, description, visibility, and manage problem tracks.
                            </DrawerDescription>
                        </div>
                    </DrawerHeader>

                    {/* ─── Scrollable Form Body ─── */}
                    <ScrollArea className="flex-1 min-h-0 w-full">
                        <div className="p-6 sm:p-7 space-y-5">
                            {/* Title Floating Input */}
                            <div className="space-y-1.5">
                                <FloatingLabelInput
                                    label="Playlist Title"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    maxLength={100}
                                    disabled={isSubmitting}
                                />
                                <p className="text-[11px] text-muted-light dark:text-muted-dark text-right px-1">
                                    {title.length}/100
                                </p>
                            </div>

                            {/* Description Floating Textarea */}
                            <div className="space-y-1.5">
                                <FloatingLabelTextarea
                                    label="Description (Optional)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={500}
                                    disabled={isSubmitting}
                                />
                                <p className="text-[11px] text-muted-light dark:text-muted-dark text-right px-1">
                                    {description.length}/500
                                </p>
                            </div>

                            {/* Visibility Switch Card */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-foreground-light-shade2/60 dark:bg-foreground-dark-shade2/60 border border-foreground-light-shade3 dark:border-foreground-dark-shade1 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-body-light-shade3 dark:text-body-dark">
                                        {isPublic ? (
                                            <>
                                                <Globe className="size-4 text-primary" />
                                                <span>Public Playlist</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="size-4 text-warning" />
                                                <span>Private Playlist</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-light dark:text-muted-dark leading-relaxed">
                                        {isPublic
                                            ? 'Visible to the community and can be discovered/bookmarked.'
                                            : 'Only visible to you on your account.'}
                                    </p>
                                </div>

                                <Switch
                                    checked={isPublic}
                                    onCheckedChange={setIsPublic}
                                    disabled={isSubmitting}
                                    className="shrink-0"
                                />
                            </div>

                            {/* Search & Manage Problems in Playlist */}
                            <PlaylistProblemPicker
                                selectedProblems={selectedProblems}
                                onSelectedProblemsChange={setSelectedProblems}
                                isLoadingProblems={isLoadingProblems}
                            />
                        </div>
                    </ScrollArea>

                    {/* ─── Fixed Footer with Vertically Centered Actions ─── */}
                    <DrawerFooter className="p-5 px-6 border-t border-foreground-light-shade3/60 dark:border-foreground-dark-shade1/60 shrink-0 flex flex-row items-center justify-end gap-3 bg-foreground-light dark:bg-foreground-dark">
                        <DrawerClose asChild>
                            <Button
                                type="button"
                                variant={ButtonVariant.OUTLINE}
                                disabled={isSubmitting}
                                className="px-5 font-semibold"
                            >
                                Cancel
                            </Button>
                        </DrawerClose>
                        <Button
                            type="submit"
                            variant={ButtonVariant.DEFAULT}
                            disabled={isSubmitting || !title.trim()}
                            isLoading={isSubmitting}
                            loadingText="Saving..."
                            className="px-6 font-semibold bg-primary hover:bg-primary-shade2 text-white shadow-xs"
                        >
                            Save Changes
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
};
