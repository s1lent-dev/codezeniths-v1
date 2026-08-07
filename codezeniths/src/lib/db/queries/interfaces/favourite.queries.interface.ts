import { z } from 'zod';
import {
    GetFavouriteInfoInputSchema,
    GetFavouriteInfoOutputSchema,
} from '@codezeniths/schemas/db/queries/favourite.schema';

export interface IFavouriteQueries {
    getFavouriteInfo: (
        payload: z.infer<typeof GetFavouriteInfoInputSchema>,
    ) => Promise<z.infer<typeof GetFavouriteInfoOutputSchema>>;
}
