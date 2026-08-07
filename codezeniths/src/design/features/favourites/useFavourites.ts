'use client';

import { favouriteQueryService } from '@/lib/tanstack/services/favourite.query-service';

export function useFavourites() {
    const { data: favouriteInfo, isLoading, isError, error } = favouriteQueryService.getFavouriteInfo();

    return {
        favouriteInfo,
        isLoading,
        isError,
        error,
    };
}
