import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetProductsInputSchema,
    GetProductsOutputSchema,
} from '@codezeniths/schemas/db';
import { z } from 'zod';

export interface IProductController {
    getProducts({ ctx, input }: { ctx: TRPCContext; input: z.infer<typeof GetProductsInputSchema> }): Promise<z.infer<typeof GetProductsOutputSchema>>;
}
