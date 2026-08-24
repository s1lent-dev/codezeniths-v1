'use client';

import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { Button, ButtonSize, ButtonVariant } from '@codezeniths/components';
import { playlistQueryService } from '@/lib/tanstack';
import { cn } from '@codezeniths/design/cn';
import { toast } from '@codezeniths/modules';

export interface PlaylistBookmarkButtonProps {
    playlistId: string;
    initialIsBookmarked?: boolean;
    initialCount?: number;
    showCount?: boolean;
    size?: ButtonSize;
    className?: string;
    onToggleSuccess?: (isBookmarked: boolean, newCount: number) => void;
}

export const PlaylistBookmarkButton: React.FC<PlaylistBookmarkButtonProps> = ({
    playlistId,
    initialIsBookmarked = false,
    initialCount = 0,
    showCount = true,
    size = ButtonSize.SM,
    className,
    onToggleSuccess,
}) => {
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
    const [count, setCount] = useState(initialCount);
    const [isBusy, setIsBusy] = useState(false);
    const busyRef = React.useRef(false);

    React.useEffect(() => {
        setIsBookmarked(initialIsBookmarked);
        setCount(initialCount);
    }, [initialIsBookmarked, initialCount]);

    React.useEffect(() => {
        return () => {
            busyRef.current = false;
        };
    }, []);

    const toggleBookmarkMutation = playlistQueryService.toggleBookmark();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (busyRef.current) return;
        busyRef.current = true;
        setIsBusy(true);

        const previousIsBookmarked = isBookmarked;
        const previousCount = count;

        const nextIsBookmarked = !previousIsBookmarked;
        const nextCount = nextIsBookmarked ? previousCount + 1 : Math.max(0, previousCount - 1);

        // Optimistic UI update
        setIsBookmarked(nextIsBookmarked);
        setCount(nextCount);

        try {
            const result = await toggleBookmarkMutation.mutateAsync({ playlistId });
            setIsBookmarked(result.isBookmarked);
            setCount(result.bookmarkCount);
            onToggleSuccess?.(result.isBookmarked, result.bookmarkCount);
            toast.success(
                result.isBookmarked ? 'Playlist Bookmarked' : 'Bookmark Removed',
                result.isBookmarked
                    ? 'Saved to your bookmarked playlists.'
                    : 'Removed from your bookmarked playlists.'
            );
        } catch (error: any) {
            // Rollback optimistic update
            setIsBookmarked(previousIsBookmarked);
            setCount(previousCount);
            toast.error('Bookmark Action Failed', error?.message || 'Unable to update bookmark status.');
        } finally {
            busyRef.current = false;
            setIsBusy(false);
        }
    };

    if (!showCount) {
        return (
            <Button
                size={ButtonSize.ICON}
                variant={ButtonVariant.OUTLINE}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                onClick={handleToggle}
                disabled={isBusy}
                className={cn(
                    'size-8 rounded-full transition-colors border cursor-pointer shrink-0',
                    isBookmarked
                        ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                        : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40',
                    isBusy && 'opacity-60 cursor-not-allowed pointer-events-none',
                    className
                )}
            >
                <Bookmark className={cn('size-3.5', isBookmarked && 'fill-current text-primary')} />
            </Button>
        );
    }

    return (
        <Button
            size={size}
            variant={isBookmarked ? ButtonVariant.SECONDARY : ButtonVariant.OUTLINE}
            onClick={handleToggle}
            disabled={isBusy}
            className={cn(
                'rounded-full text-xs font-semibold gap-1.5 transition-colors cursor-pointer shrink-0',
                isBookmarked
                    ? 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/30'
                    : 'bg-foreground-light-shade1 dark:bg-foreground-dark-shade1 text-muted-light dark:text-muted-dark hover:text-body-light-shade3 dark:hover:text-body-dark hover:bg-foreground-light-shade2 dark:hover:bg-foreground-dark-shade2 border-foreground-light-shade3/30 dark:border-foreground-dark-shade1/40',
                isBusy && 'opacity-60 cursor-not-allowed pointer-events-none',
                className
            )}
        >
            <Bookmark className={cn('size-3.5', isBookmarked && 'fill-current text-primary')} />
            <span>{count}</span>
        </Button>
    );
};
