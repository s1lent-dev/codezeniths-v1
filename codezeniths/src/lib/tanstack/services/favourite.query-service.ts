import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
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
        });
    }
}

export const favouriteQueryService = new FavouriteQueryService();
