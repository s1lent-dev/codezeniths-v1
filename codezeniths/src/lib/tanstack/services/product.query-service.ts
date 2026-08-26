'use client';

import { useQuery } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { queryKeys } from '../query-keys';
import { CACHE_TIERS } from '../cache-config';
import type { IProductQueryService } from '../interfaces';
import {
    GetProductsOutputSchema,
    GetProductsInputSchema,
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
            ...CACHE_TIERS.STATIC_CATALOG,
        });
    }
}

export const productQueryService = new ProductQueryService();
