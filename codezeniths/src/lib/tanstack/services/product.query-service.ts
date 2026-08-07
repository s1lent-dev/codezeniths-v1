import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import type { IProductQueryService } from '../interfaces';
import {
    GetProductsOutputSchema,
    GetSingleProductOutputSchema,
    GetProductsInputSchema,
    GetSingleProductInputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export class ProductQueryService implements IProductQueryService {
    getProducts(input: z.infer<typeof GetProductsInputSchema> = {}) {
        return useQuery({
            queryKey: queryKeys.product.list(input),
            queryFn: async () => {
                const raw = await trpcClient.product.getProducts.query(input);
                return GetProductsOutputSchema.parse(raw);
            },
        });
    }

    getSingleProduct(input: z.infer<typeof GetSingleProductInputSchema>) {
        const validatedInput = GetSingleProductInputSchema.parse(input);
        const cacheKey = validatedInput.slug || 'unknown';
        return useQuery({
            queryKey: queryKeys.product.single(cacheKey),
            queryFn: async () => {
                const raw = await trpcClient.product.getSingleProduct.query(validatedInput);
                return GetSingleProductOutputSchema.parse(raw);
            },
        });
    }
}

export const productQueryService = new ProductQueryService();
