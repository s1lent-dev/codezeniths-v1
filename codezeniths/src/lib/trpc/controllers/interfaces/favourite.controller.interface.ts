import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetFavouriteInfoTRPCInputSchema,
    GetFavouriteInfoTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IFavouriteController {
    getFavouriteInfo(args: {
        ctx: TRPCContext;
        input?: z.infer<typeof GetFavouriteInfoTRPCInputSchema>;
    }): Promise<z.infer<typeof GetFavouriteInfoTRPCOutputSchema>>;
}
