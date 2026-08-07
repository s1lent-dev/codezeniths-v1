import {
    GetProductsInputSchema,
    GetProductsOutputSchema,
    GetSingleProductInputSchema,
    GetSingleProductOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface IProductQueries {
    getProducts(payload: z.infer<typeof GetProductsInputSchema>): Promise<z.infer<typeof GetProductsOutputSchema>>;
    getSingleProduct(payload: z.infer<typeof GetSingleProductInputSchema>): Promise<z.infer<typeof GetSingleProductOutputSchema>>;
}
