'use client';

import React, { useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogMedia,
    toast,
} from '@codezeniths/modules';
import { Button, ButtonVariant } from '@codezeniths/components';
import { playlistQueryService } from '@/lib/tanstack';
import { Trash2 } from 'lucide-react';
import type { PlaylistSummaryItem } from './playlists-overview.types';

export interface DeletePlaylistDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    playlist: PlaylistSummaryItem | null;
    onSuccess?: () => void;
}

export const DeletePlaylistDialog: React.FC<DeletePlaylistDialogProps> = ({
    open,
    onOpenChange,
    playlist,
    onSuccess,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const removeMutation = playlistQueryService.removePlaylist();

    const handleDelete = async () => {
        if (!playlist) return;

        setIsDeleting(true);
        try {
            await removeMutation.mutateAsync({
                playlistId: playlist.id,
            });

            toast.success(
                'Playlist Deleted',
                `"${playlist.title}" and all its associations have been removed.`
            );
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            toast.error(
                'Deletion Failed',
                error?.message || 'Unable to delete playlist. Please try again.'
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent size="default">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 dark:bg-destructive/10 text-destructive">
                        <Trash2 className="size-5" />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete Playlist?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete{' '}
                        <strong className="text-body-light-shade3 dark:text-body-dark">
                            "{playlist?.title}"
                        </strong>
                        ? This will permanently remove the playlist, its problem associations, and bookmarks. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="border-muted-light-shade3 dark:border-muted-dark-shade3 bg-foreground-light-shade1 dark:bg-foreground-dark-shade1">
                    <AlertDialogCancel variant={ButtonVariant.OUTLINE} disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        variant={ButtonVariant.ERROR}
                        onClick={handleDelete}
                        isLoading={isDeleting}
                        loadingText="Deleting..."
                    >
                        Delete Playlist
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
