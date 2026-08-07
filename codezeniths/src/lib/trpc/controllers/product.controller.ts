import { TRPCContext } from '../trpc/trpc.context';
import {
    GetProductsInputSchema,
    GetProductsOutputSchema,
    GetSingleProductInputSchema,
    GetSingleProductOutputSchema,
} from '@codezeniths/schemas/db';
import { IProductController } from './interfaces';
import { logger } from '@/service/logging';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export class ProductController implements IProductController {
    async getProducts({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof GetProductsInputSchema> }): Promise<z.infer<typeof GetProductsOutputSchema>> {
        logger.info('Executing getProducts controller');
        try {
            return await ctx.queries.product.getProducts(input);
        } catch (error: any) {
            logger.error('Error in getProducts controller', { error });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message || 'Error fetching products' });
        }
    }

    async getSingleProduct({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof GetSingleProductInputSchema> }): Promise<z.infer<typeof GetSingleProductOutputSchema>> {
        logger.info('Executing getSingleProduct controller', { input });
        try {
            return await ctx.queries.product.getSingleProduct(input);
        } catch (error: any) {
            logger.error('Error in getSingleProduct controller', { error, slug: input.slug });
            if (error?.code === 'NOT_FOUND') throw new TRPCError({ code: 'NOT_FOUND', message: error.message });
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: error.message || 'Error fetching product' });
        }
    }
}
