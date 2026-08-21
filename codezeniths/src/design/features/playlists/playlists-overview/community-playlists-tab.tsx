'use client';

import React from 'react';
import {
    Grid,
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyAlign,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Button,
    ButtonVariant,
} from '@codezeniths/components';
import { Card } from '@codezeniths/modules';
import { Search, Globe, RotateCcw, X } from 'lucide-react';
import { PlaylistCard } from './playlist-card';
import { PlaylistCardGridSkeleton } from './playlist-card-skeleton';
import type { PlaylistSummaryItem, PlaylistsSortOption } from './playlists-overview.types';

export interface CommunityPlaylistsTabProps {
    playlists?: PlaylistSummaryItem[];
    isLoading?: boolean;
    searchQuery: string;
    onSearchChange: (search: string) => void;
    sortBy: PlaylistsSortOption;
    onSortChange: (sort: PlaylistsSortOption) => void;
    onClearFilters?: () => void;
}

export const CommunityPlaylistsTab: React.FC<CommunityPlaylistsTabProps> = ({
    playlists = [],
    isLoading = false,
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    onClearFilters,
}) => {
    return (
        <div className="space-y-6 w-full font-sans">
            {/* Control Bar: Compact Pill Search Bar & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 pb-1">
                {/* Left: Compact Capsule Search Input (max-w-sm, not full width) */}
                <div className="relative w-full max-w-xs sm:max-w-sm">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-light dark:text-muted-dark pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search community playlists..."
                        className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-foreground-light dark:bg-foreground-dark text-body-light dark:text-body-dark placeholder-muted-light dark:placeholder-muted-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-2xs"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-light hover:text-body-light-shade3 dark:hover:text-body-dark cursor-pointer transition-colors"
                            title="Clear search"
                        >
                            <X className="size-3.5" />
                        </button>
                    )}
                </div>

                {/* Right: Sort Pill Select */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="text-xs font-medium text-muted-light dark:text-muted-dark whitespace-nowrap">
                        Sort by:
                    </span>
                    <Select
                        value={sortBy}
                        onValueChange={(val) => onSortChange(val as PlaylistsSortOption)}
                    >
                        <SelectTrigger className="w-40 h-9 rounded-full text-xs bg-foreground-light dark:bg-foreground-dark border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-2xs cursor-pointer focus:ring-primary">
                            <SelectValue placeholder="Sort order" />
                        </SelectTrigger>
                        <SelectContent
                            align="end"
                            className="bg-foreground-light dark:bg-foreground-dark border border-foreground-light-shade3 dark:border-foreground-dark-shade1 p-1 z-100 rounded-md shadow-lg"
                        >
                            <SelectItem value="popular" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                Most Popular
                            </SelectItem>
                            <SelectItem value="recent" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                Recently Added
                            </SelectItem>
                            <SelectItem value="name" className="cursor-pointer text-xs py-1.5 rounded-sm">
                                Alphabetical (A-Z)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Content View */}
            {isLoading ? (
                <PlaylistCardGridSkeleton count={6} />
            ) : playlists.length === 0 ? (
                <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-10 sm:p-14 text-center max-w-xl mx-auto my-6 shadow-xs flex flex-col items-center justify-center">
                    <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 shrink-0">
                        <Globe className="size-7 opacity-75" />
                    </div>
                    <Typography
                        variant={TypographyVariant.H3}
                        weight={TypographyWeight.BOLD}
                        align={TypographyAlign.CENTER}
                        className="text-lg sm:text-xl text-body-light-shade3 dark:text-body-dark text-center w-full"
                    >
                        No Community Playlists Found
                    </Typography>
                    <Typography
                        variant={TypographyVariant.P}
                        align={TypographyAlign.CENTER}
                        className="text-xs sm:text-sm text-muted-light dark:text-muted-dark mt-2 max-w-md mx-auto text-center leading-relaxed"
                    >
                        {searchQuery
                            ? `We couldn't find any public playlists matching "${searchQuery}". Try a different keyword or reset filters.`
                            : 'No public community playlists are available right now. Be the first to create one!'}
                    </Typography>
                    {searchQuery && onClearFilters && (
                        <Button
                            onClick={onClearFilters}
                            variant={ButtonVariant.OUTLINE}
                            className="mt-6 gap-2 text-xs font-semibold inline-flex items-center justify-center mx-auto"
                        >
                            <RotateCcw className="size-3.5" />
                            <span>Reset Search</span>
                        </Button>
                    )}
                </Card>
            ) : (
                <Grid cols={3} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full">
                    {playlists.map((playlist) => (
                        <PlaylistCard
                            key={playlist.id}
                            playlist={playlist}
                            isOwner={false}
                        />
                    ))}
                </Grid>
            )}
        </div>
    );
};
