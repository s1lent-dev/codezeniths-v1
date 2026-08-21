'use client';

import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import type { IFavouriteQueryService } from '../interfaces';
import { GetFavouriteInfoTRPCOutputSchema } from '@/schemas/trpc';

export class FavouriteQueryService implements IFavouriteQueryService {
    getFavouriteInfo() {
        return useQuery({
            queryKey: queryKeys.favourite.info(),
            queryFn: async () => {
                const raw = await trpcClient.favourite.getFavouriteInfo.query();
                return GetFavouriteInfoTRPCOutputSchema.parse(raw);
            },
            ...CACHE_TIERS.USER_PROGRESS,
        });
    }
}

export const favouriteQueryService = new FavouriteQueryService();
