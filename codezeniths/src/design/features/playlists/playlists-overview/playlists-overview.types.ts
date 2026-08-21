import type { PlaylistSummaryItemSchema } from '@codezeniths/schemas/db';
import { z } from 'zod';

export type PlaylistSummaryItem = z.infer<typeof PlaylistSummaryItemSchema>;

export type PlaylistsTab = 'my' | 'community' | 'bookmarked';

export type PlaylistsSortOption = 'popular' | 'recent' | 'name';

export interface PlaylistsOverviewState {
    activeTab: PlaylistsTab;
    searchQuery: string;
    sortBy: PlaylistsSortOption;
    createModalOpen: boolean;
    editModalOpen: boolean;
    deleteDialogOpen: boolean;
    selectedPlaylist: PlaylistSummaryItem | null;
}
