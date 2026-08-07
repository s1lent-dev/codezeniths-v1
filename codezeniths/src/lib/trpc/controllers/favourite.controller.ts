import { IFavouriteController } from './interfaces/favourite.controller.interface';
import { TRPCContext } from '../trpc/trpc.context';
import { logger } from '@/service/logging';
import { AppErrorBuilder } from '@/service/error/error';
import { ErrorCode } from '@/service/error/error.types';

export class FavouriteController implements IFavouriteController {
    async getFavouriteInfo({ ctx }: { ctx: TRPCContext }) {
        const userId = ctx.user?.id;
        if (!userId) {
            throw new AppErrorBuilder('Unauthorized - Authentication required')
                .setCode(ErrorCode.UNAUTHORIZED)
                .build();
        }

        try {
            logger.info('Executing getFavouriteInfo controller', { userId });
            const result = await ctx.queries.favourite.getFavouriteInfo({ userId });
            return result;
        } catch (error) {
            logger.error('Error in getFavouriteInfo controller', { error, userId });
            throw error;
        }
    }
}

export const favouriteController = new FavouriteController();
