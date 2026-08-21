'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@codezeniths/modules';
import { Typography, TypographyVariant } from '@codezeniths/components';
import { ProblemsSection } from '@codezeniths/design/features/shared/problem-list-section';
import { BreadcrumbHeader } from '@codezeniths/design/widgets/shared';
import { useFavourites } from './useFavourites';
import { FavouritesInfoCard } from './favourites-info-card/favourites-info-card';

export const FavouritesSection: React.FC = () => {
    const { favouriteInfo, isLoading, isError, error } = useFavourites();

    if (isError) {
        return (
            <Card className="rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark p-12 text-center my-8">
                <Typography variant={TypographyVariant.H3} className="text-xl font-bold text-destructive mb-2">
                    Failed to Load Favourites
                </Typography>
                <Typography variant={TypographyVariant.P} className="text-muted-light dark:text-muted-dark text-sm mb-6">
                    {error?.message || "We couldn't fetch your favourited problems statistics at this time."}
                </Typography>
                <Link
                    href="/problemset"
                    className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-white text-xs font-semibold hover:bg-primary-shade2 transition-colors"
                >
                    Go to Problemset
                </Link>
            </Card>
        );
    }

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Top Shared Breadcrumb Bar */}
            <BreadcrumbHeader
                isLoading={isLoading}
                items={[{ label: 'Favourites', isCurrentPage: true }]}
            />

            {/* Main 2-Column Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
                {/* Left Column: Favourites Info Card */}
                <div className="w-full lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                    <FavouritesInfoCard favouriteInfo={favouriteInfo} isLoading={isLoading} />
                </div>

                {/* Right Column: Problem List Component for Favourites */}
                <div className="w-0 flex-1 min-w-0 max-w-full lg:max-w-[calc(100%-354px)] xl:max-w-[calc(100%-384px)] space-y-6">
                    <ProblemsSection pageContext="favourites" />
                </div>
            </div>
        </div>
    );
};

export const FavouritesPageSection = FavouritesSection;
