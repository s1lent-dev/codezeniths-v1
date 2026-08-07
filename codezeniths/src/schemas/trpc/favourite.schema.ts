import { z } from 'zod';
import {
    GetFavouriteInfoOutputSchema,
} from '../db/queries/favourite.schema';

// ─── getFavouriteInfo ──────────────────────────────────────────────────────

export const GetFavouriteInfoTRPCInputSchema = z.object({}).optional();
export type GetFavouriteInfoTRPCInput = z.infer<typeof GetFavouriteInfoTRPCInputSchema>;

export const GetFavouriteInfoTRPCOutputSchema = GetFavouriteInfoOutputSchema;
export type GetFavouriteInfoTRPCOutput = z.infer<typeof GetFavouriteInfoTRPCOutputSchema>;
