import { TRPCContext } from '../../trpc/trpc.context';
import {
    GetNotificationsTRPCInputSchema,
    GetNotificationsTRPCOutputSchema,
    MarkAsReadTRPCInputSchema,
    MarkAsReadTRPCOutputSchema,
    MarkAllAsReadTRPCOutputSchema,
    UpsertDeviceTokenTRPCInputSchema,
    UpsertDeviceTokenTRPCOutputSchema,
} from '@/schemas/trpc';
import { z } from 'zod';

export interface INotificationController {
    getNotifications(args: {
        ctx: TRPCContext;
        input: z.infer<typeof GetNotificationsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetNotificationsTRPCOutputSchema>>;

    markAsRead(args: {
        ctx: TRPCContext;
        input: z.infer<typeof MarkAsReadTRPCInputSchema>;
    }): Promise<z.infer<typeof MarkAsReadTRPCOutputSchema>>;

    markAllAsRead(args: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof MarkAllAsReadTRPCOutputSchema>>;

    upsertDeviceToken(args: {
        ctx: TRPCContext;
        input: z.infer<typeof UpsertDeviceTokenTRPCInputSchema>;
    }): Promise<z.infer<typeof UpsertDeviceTokenTRPCOutputSchema>>;
}
