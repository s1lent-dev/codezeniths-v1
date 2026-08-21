'use client';

import React from 'react';
import { DetailInfoCard, DetailInfoCardSkeleton } from '@codezeniths/design/widgets/shared';

export interface FavouritesInfoCardProps {
    favouriteInfo?: {
        title: string;
        description: string;
        progress: {
            problemsCount: number;
            problemsSolvedCount: number;
            problemsRevisitCount: number;
            problemNotSolvedCount: number;
            problemsSolvedPercentage: number;
            problemsCountByDifficulty: {
                easy: number;
                medium: number;
                hard: number;
            };
            problemsSolvedCountByDifficulty: {
                easy: number;
                medium: number;
                hard: number;
            };
        };
    };
    isLoading?: boolean;
}

export const FavouritesInfoCard: React.FC<FavouritesInfoCardProps> = ({
    favouriteInfo,
    isLoading = false,
}) => {
    if (isLoading || !favouriteInfo) {
        return <DetailInfoCardSkeleton />;
    }

    return (
        <DetailInfoCard
            data={{
                id: 'favourites',
                title: favouriteInfo.title,
                slug: 'favourites',
                description: favouriteInfo.description,
                progress: favouriteInfo.progress,
                type: 'favourite',
            }}
        />
    );
};
