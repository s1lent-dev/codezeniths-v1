'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { playlistQueryService } from '@/lib/tanstack';
import { toast } from '@codezeniths/modules';

export function usePlaylistDetails(slugProp?: string) {
    const params = useParams();
    const router = useRouter();
    const slug = slugProp || (params?.slug as string);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const {
        data: playlist,
        isLoading,
        isError,
        error,
        refetch,
    } = playlistQueryService.getPlaylistInfo(
        { slug },
        { enabled: Boolean(slug) }
    );

    const toggleBookmarkMutation = playlistQueryService.toggleBookmark();

    const handleToggleBookmark = async () => {
        if (!playlist) return;
        try {
            const result = await toggleBookmarkMutation.mutateAsync({
                playlistId: playlist.id,
            });
            toast.success(
                result.isBookmarked ? 'Playlist Bookmarked' : 'Bookmark Removed',
                result.isBookmarked
                    ? 'Saved to your bookmarked playlists.'
                    : 'Removed from your bookmarked playlists.'
            );
            refetch();
        } catch (err: any) {
            toast.error('Action Failed', err?.message || 'Unable to toggle bookmark.');
        }
    };

    const handleDeleteSuccess = () => {
        router.push('/playlists');
    };

    return {
        slug,
        playlist,
        isLoading,
        isError,
        error,
        refetch,

        // Overlays
        editModalOpen,
        setEditModalOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,

        handleToggleBookmark,
        handleDeleteSuccess,
    };
}
