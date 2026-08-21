'use client';

import React from 'react';
import {
    CategorySuggestionsCard,
    CategorySuggestionsCardSkeleton,
    CategorySuggestionItem,
} from '@codezeniths/design/widgets/shared';

export interface OtherPlaylistItem {
    id: string;
    title: string;
    slug: string;
    problemsCount: number;
}

export interface PlaylistSuggestionsProps {
    otherPlaylists?: OtherPlaylistItem[];
    creatorName?: string;
    isLoading?: boolean;
    className?: string;
}

export const PlaylistSuggestions: React.FC<PlaylistSuggestionsProps> = ({
    otherPlaylists,
    creatorName,
    isLoading = false,
    className,
}) => {
    if (isLoading) {
        return <CategorySuggestionsCardSkeleton className={className} />;
    }

    if (!otherPlaylists || otherPlaylists.length === 0) return null;

    const items: CategorySuggestionItem[] = otherPlaylists.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        href: `/playlists/${p.slug}`,
        problemsCount: p.problemsCount,
        type: 'topic',
    }));

    return (
        <CategorySuggestionsCard
            title={creatorName ? `More by ${creatorName}` : 'Other Playlists'}
            suggestions={items}
            className={className}
        />
    );
};
