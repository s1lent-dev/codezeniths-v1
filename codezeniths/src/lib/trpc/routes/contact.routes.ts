import { createTRPCRouter } from '../trpc';
import { publicProcedure } from '../trpc/trpc.procedure';
import {
    SendContactMessageTRPCInputSchema,
    SendContactMessageTRPCOutputSchema,
} from '@/schemas/trpc';

export const contactRouter = createTRPCRouter({
    sendMessage: publicProcedure
        .input(SendContactMessageTRPCInputSchema)
        .output(SendContactMessageTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.contact.sendMessage({ ctx, input })),
});
