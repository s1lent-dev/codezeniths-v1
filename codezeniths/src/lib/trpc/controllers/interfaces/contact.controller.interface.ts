import { TRPCContext } from '../../trpc/trpc.context';
import {
    SendContactMessageTRPCInputSchema,
    SendContactMessageTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface IContactController {
    sendMessage(args: {
        ctx: TRPCContext;
        input: z.infer<typeof SendContactMessageTRPCInputSchema>;
    }): Promise<z.infer<typeof SendContactMessageTRPCOutputSchema>>;
}
