import { z } from 'zod';
import { ProductSchema } from '../db.schema';

export const GetProductsInputSchema = z.object({});
export const GetProductsOutputSchema = z.array(ProductSchema);
