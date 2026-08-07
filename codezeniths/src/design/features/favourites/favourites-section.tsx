'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@codezeniths/design/components/navigation/breadcrumb';
import { Card } from '@codezeniths/modules';
import { Typography, TypographyVariant } from '@codezeniths/components';
import { ProblemsSection } from '@codezeniths/features';
import { useFavourites } from './useFavourites';
import { FavouritesInfoCard } from './favourites-info-card/favourites-info-card';
import { SingleFavouritesPageSkeleton } from './favourites-skeleton';

export const FavouritesSection: React.FC = () => {
    const { favouriteInfo, isLoading, isError, error } = useFavourites();

    if (isLoading) {
        return <SingleFavouritesPageSkeleton />;
    }

    if (isError || !favouriteInfo) {
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
            {/* Top Breadcrumb Bar */}
            <div className="w-full rounded-md border border-foreground-light-shade3 dark:border-foreground-dark-shade1 bg-foreground-light dark:bg-foreground-dark px-5 py-3.5 sm:px-6 sm:py-4 shadow-xs">
                <Breadcrumb className="w-full">
                    <BreadcrumbList className="text-sm sm:text-base font-medium">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-1.5 text-heading-light dark:text-heading-dark hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    <Home className="size-4.5" />
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-heading-light dark:text-heading-dark">
                                Favourites
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Main 2-Column Split Layout */}
            <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full min-w-0 items-start">
                {/* Left Column: Favourites Info Card */}
                <div className="w-full lg:w-82.5 xl:w-90 shrink-0 space-y-6">
                    <FavouritesInfoCard favouriteInfo={favouriteInfo} />
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
