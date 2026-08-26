import {
    GetProductsInputSchema,
    GetProductsOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface IProductQueries {
    getProducts(payload: z.infer<typeof GetProductsInputSchema>): Promise<z.infer<typeof GetProductsOutputSchema>>;
}
