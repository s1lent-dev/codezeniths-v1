import { createTRPCRouter } from '../trpc';
import { protectedProcedure } from '../trpc/trpc.procedure';
import {
    GetFavouriteInfoTRPCInputSchema,
    GetFavouriteInfoTRPCOutputSchema,
} from '@/schemas/trpc';

export const favouriteRouter = createTRPCRouter({
    getFavouriteInfo: protectedProcedure
        .input(GetFavouriteInfoTRPCInputSchema)
        .output(GetFavouriteInfoTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.favourite.getFavouriteInfo({ ctx, input })),
});
