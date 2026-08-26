import { createTRPCRouter } from '../trpc';
import { publicProcedure } from '../trpc/trpc.procedure';
import {
    GetProductsInputSchema,
    GetProductsOutputSchema,
} from '@codezeniths/schemas/db';

export const productRouter = createTRPCRouter({
    getProducts: publicProcedure
        .input(GetProductsInputSchema)
        .output(GetProductsOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.product.getProducts({ ctx, input })),
});
