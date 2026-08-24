'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
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
    const [isBookmarkBusy, setIsBookmarkBusy] = useState(false);
    const busyRef = useRef(false);

    useEffect(() => {
        return () => {
            busyRef.current = false;
        };
    }, []);

    const handleToggleBookmark = useCallback(async () => {
        if (!playlist || busyRef.current) return;
        busyRef.current = true;
        setIsBookmarkBusy(true);

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
        } catch (err: any) {
            toast.error('Action Failed', err?.message || 'Unable to toggle bookmark.');
        } finally {
            busyRef.current = false;
            setIsBookmarkBusy(false);
        }
    }, [playlist, toggleBookmarkMutation]);

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
        isBookmarkBusy,
        handleDeleteSuccess,
    };
}
