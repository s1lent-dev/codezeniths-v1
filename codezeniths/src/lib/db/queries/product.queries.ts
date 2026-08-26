import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import {
    GetProductsInputSchema,
    GetProductsOutputSchema,
} from '@codezeniths/schemas/db';
import { IProductQueries } from './interfaces/product.queries.interface';

export class ProductQueries implements IProductQueries {
    getProducts = qRPC()
        .input(GetProductsInputSchema)
        .output(GetProductsOutputSchema)
        .handler(async () => {
            logger.info('Executing getProducts query');
            return await prisma.product.findMany();
        })
        .build();
}

export const productQueries = new ProductQueries();
