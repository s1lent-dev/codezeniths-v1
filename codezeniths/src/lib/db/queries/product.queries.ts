import { qRPC } from './utils/qrpc.utils';
import { prisma } from '@codezeniths/lib/db/prisma.client';
import { logger } from '@codezeniths/service/logging';
import { AppErrorBuilder } from '@codezeniths/service/error/error';
import { ErrorCode } from '@codezeniths/service/error/error.types';
import {
    GetProductsInputSchema,
    GetProductsOutputSchema,
    GetSingleProductInputSchema,
    GetSingleProductOutputSchema,
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

    getSingleProduct = qRPC()
        .input(GetSingleProductInputSchema)
        .output(GetSingleProductOutputSchema)
        .handler(async (payload) => {
            logger.info('Executing getSingleProduct query', { payload });
            const product = await prisma.product.findUnique({
                where: { slug: payload.slug },
            });
            if (!product) {
                throw new AppErrorBuilder('Product not found')
                    .setCode(ErrorCode.NOT_FOUND)
                    .build();
            }
            return product;
        })
        .build();
}

export const productQueries = new ProductQueries();
