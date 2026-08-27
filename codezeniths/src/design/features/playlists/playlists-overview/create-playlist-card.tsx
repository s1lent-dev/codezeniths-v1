'use client';

import React from 'react';
import { Plus, Lock } from 'lucide-react';
import {
    Typography,
    TypographyVariant,
    TypographyWeight,
    TypographyAlign,
} from '@codezeniths/components';
import { Card, CardVariant, toast } from '@codezeniths/modules';
import { cn } from '@codezeniths/design/cn';

export interface CreatePlaylistCardProps {
    currentCount: number;
    maxLimit?: number;
    onClick: () => void;
    className?: string;
}

export const CreatePlaylistCard: React.FC<CreatePlaylistCardProps> = ({
    currentCount,
    maxLimit = 5,
    onClick,
    className,
}) => {
    const isLimitReached = currentCount >= maxLimit;
    const remaining = Math.max(0, maxLimit - currentCount);

    const handleClick = () => {
        if (isLimitReached) {
            toast.warning(
                'Playlist Limit Reached',
                `You have reached the maximum limit of ${maxLimit} playlists per account.`
            );
            return;
        }
        onClick();
    };

    return (
        <Card
            variant={CardVariant.FLAT}
            onClick={handleClick}
            className={cn(
                'rounded-md p-6 sm:p-7 flex flex-col items-center justify-center text-center h-full cursor-pointer transition-all duration-300 group border-2 border-dashed relative overflow-hidden select-none',
                isLimitReached
                    ? 'bg-foreground-light-shade1/40 dark:bg-foreground-dark-shade1/40 border-foreground-light-shade3 dark:border-foreground-dark-shade1 opacity-60 cursor-not-allowed'
                    : 'bg-foreground-light/60 dark:bg-foreground-dark/60 border-primary/25 hover:border-primary hover:bg-primary/5 dark:border-primary/30 dark:hover:border-primary/70 shadow-xs hover:shadow-md',
                className
            )}
        >
            {/* Animated Glow Circle */}
            {!isLimitReached && (
                <div className="absolute -top-16 -right-16 size-36 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />
            )}

            <div className="w-full flex flex-col items-center justify-center text-center relative z-10">
                {/* Centered Icon Container */}
                <div className="size-12 rounded-full bg-primary/10 dark:bg-primary/15 text-primary flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shrink-0">
                    {isLimitReached ? <Lock className="size-5" /> : <Plus className="size-6" />}
                </div>

                {/* Centered Title */}
                <Typography
                    variant={TypographyVariant.H3}
                    weight={TypographyWeight.BOLD}
                    align={TypographyAlign.CENTER}
                    className="text-h4! sm:text-h6! xs:text-h6! text-body-light-shade3 dark:text-body-dark group-hover:text-primary transition-colors text-center w-full mb-1"
                >
                    {isLimitReached ? 'Playlist Limit Reached' : 'Create New Playlist'}
                </Typography>

                {/* Centered Description Subtitle */}
                <Typography
                    variant={TypographyVariant.P}
                    align={TypographyAlign.CENTER}
                    className="text-xs text-muted-light dark:text-muted-dark max-w-56 mx-auto text-center leading-relaxed"
                >
                    {isLimitReached
                        ? `You have reached the limit of ${maxLimit} playlists.`
                        : `Organize your study track (${remaining} of ${maxLimit} available)`}
                </Typography>
            </div>
        </Card>
    );
};
