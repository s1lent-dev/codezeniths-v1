'use client';

import React from 'react';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import {
    Badge,
    Button,
    ButtonVariant,
    Typography,
    TypographyVariant,
    TypographyWeight,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from '@codezeniths/components';
import { Plus, ListMusic } from 'lucide-react';
import { cn } from '@codezeniths/design/cn';

export interface PlaylistsHeaderProps {
    myPlaylistsCount?: number;
    maxLimit?: number;
    isLoading?: boolean;
    onCreateClick: () => void;
    className?: string;
}

export const PlaylistsHeader: React.FC<PlaylistsHeaderProps> = ({
    myPlaylistsCount = 0,
    maxLimit = 5,
    isLoading = false,
    onCreateClick,
    className,
}) => {
    const isLimitReached = myPlaylistsCount >= maxLimit;

    return (
        <div className={cn('w-full space-y-5', className)}>
            {/* Top Breadcrumb Bar */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[{ label: 'Playlists', isCurrentPage: true }]}
            />

            {/* Hub Title Banner & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-foreground-light dark:bg-foreground-dark p-5 sm:p-7 rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 shadow-xs relative overflow-hidden">
                {/* Decorative Background Accent */}
                <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

                {/* Left Title & Subtext */}
                <div className="space-y-1.5 z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <ListMusic className="size-4.5" />
                        </div>
                        <Typography
                            variant={TypographyVariant.H1}
                            weight={TypographyWeight.EXTRABOLD}
                            className="text-xl sm:text-2xl tracking-tight text-body-light-shade3 dark:text-body-dark"
                        >
                            Playlists Hub
                        </Typography>
                    </div>
                    <Typography
                        variant={TypographyVariant.P}
                        className="text-xs sm:text-sm text-muted-light dark:text-muted-dark ml-10 leading-relaxed block max-w-lg"
                    >
                        Create, bookmark, and practice curated problem tracks to master algorithms and interview topics.
                    </Typography>
                </div>

                {/* Right Quota Tracker Badge & Create Button */}
                <div className="flex items-center gap-3 shrink-0 z-10">
                    {/* Quota Badge */}
                    <Badge
                        variant="default"
                        className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-semibold border-none flex items-center gap-1.5',
                            isLimitReached
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-primary/10 text-primary'
                        )}
                    >
                        <span className="size-1.5 rounded-full bg-current" />
                        <span>
                            {myPlaylistsCount} / {maxLimit} Created
                        </span>
                    </Badge>

                    {/* Create Button with Tooltip when at max limit */}
                    {isLimitReached ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div>
                                    <Button
                                        variant={ButtonVariant.DEFAULT}
                                        disabled
                                        className="rounded-md font-semibold gap-1.5 opacity-60 cursor-not-allowed"
                                    >
                                        <Plus className="size-4" />
                                        <span>Create Playlist</span>
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                Maximum limit of {maxLimit} playlists reached for this account.
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Button
                            variant={ButtonVariant.DEFAULT}
                            onClick={onCreateClick}
                            className="rounded-md bg-primary hover:bg-primary-shade2 text-white font-semibold gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                            <Plus className="size-4" />
                            <span>Create Playlist</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
