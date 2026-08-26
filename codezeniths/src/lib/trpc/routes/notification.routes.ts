import { createTRPCRouter } from '../trpc';
import { protectedProcedure } from '../trpc/trpc.procedure';
import {
    GetNotificationsTRPCInputSchema,
    GetNotificationsTRPCOutputSchema,
    MarkAsReadTRPCInputSchema,
    MarkAsReadTRPCOutputSchema,
    MarkAllAsReadTRPCOutputSchema,
    UpsertDeviceTokenTRPCInputSchema,
    UpsertDeviceTokenTRPCOutputSchema,
} from '@/schemas/trpc';

export const notificationRouter = createTRPCRouter({
    getNotifications: protectedProcedure
        .input(GetNotificationsTRPCInputSchema)
        .output(GetNotificationsTRPCOutputSchema)
        .query(({ ctx, input }) => ctx.controllers.notification.getNotifications({ ctx, input })),

    markAsRead: protectedProcedure
        .input(MarkAsReadTRPCInputSchema)
        .output(MarkAsReadTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.notification.markAsRead({ ctx, input })),

    markAllAsRead: protectedProcedure
        .output(MarkAllAsReadTRPCOutputSchema)
        .mutation(({ ctx }) => ctx.controllers.notification.markAllAsRead({ ctx })),

    upsertDeviceToken: protectedProcedure
        .input(UpsertDeviceTokenTRPCInputSchema)
        .output(UpsertDeviceTokenTRPCOutputSchema)
        .mutation(({ ctx, input }) => ctx.controllers.notification.upsertDeviceToken({ ctx, input })),
});
