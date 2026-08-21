'use client';

import React from 'react';
import { PlaylistInfoCard, PlaylistInfoCardProps } from './playlist-info-card';
import { PlaylistSuggestions } from './playlist-suggestions';

export interface PlaylistInfoSectionProps {
    playlist?: PlaylistInfoCardProps['playlist'];
    isLoading?: boolean;
    onToggleBookmark?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    className?: string;
}

export const PlaylistInfoSection: React.FC<PlaylistInfoSectionProps> = ({
    playlist,
    isLoading = false,
    onToggleBookmark,
    onEdit,
    onDelete,
    className,
}) => {
    return (
        <div className={`space-y-6 w-full ${className || ''}`}>
            <PlaylistInfoCard
                playlist={playlist}
                isLoading={isLoading}
                onToggleBookmark={onToggleBookmark}
                onEdit={onEdit}
                onDelete={onDelete}
            />

            {isLoading ? (
                <PlaylistSuggestions isLoading={true} />
            ) : (
                playlist?.otherPlaylists &&
                playlist.otherPlaylists.length > 0 && (
                    <PlaylistSuggestions
                        otherPlaylists={playlist.otherPlaylists}
                        creatorName={playlist.creator?.name}
                        isLoading={false}
                    />
                )
            )}
        </div>
    );
};
