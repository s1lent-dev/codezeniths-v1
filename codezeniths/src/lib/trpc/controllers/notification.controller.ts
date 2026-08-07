import { TRPCContext } from '../trpc/trpc.context';
import { INotificationController } from './interfaces';
import {
    GetNotificationsTRPCInputSchema,
    GetNotificationsTRPCOutputSchema,
    MarkAsReadTRPCInputSchema,
    MarkAsReadTRPCOutputSchema,
    MarkAllAsReadTRPCOutputSchema,
    UpsertDeviceTokenTRPCInputSchema,
    UpsertDeviceTokenTRPCOutputSchema,
    RemoveDeviceTokenTRPCInputSchema,
    RemoveDeviceTokenTRPCOutputSchema,
} from '@/schemas/trpc';
import { TRPCError } from '@trpc/server';
import { logger } from '@/service/logging';
import { deviceTokenService } from '@/lib/firebase/devicetoken.service';
import { z } from 'zod';

export class NotificationController implements INotificationController {
    async getNotifications({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof GetNotificationsTRPCInputSchema>;
    }): Promise<z.infer<typeof GetNotificationsTRPCOutputSchema>> {
        logger.info('Executing getNotifications controller');

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to fetch notifications');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const limit = input?.limit;
            const offset = input?.offset;
            const result = await ctx.queries.notification.getNotifications({
                userId,
                limit,
                offset,
            });
            return result;
        } catch (error: any) {
            logger.error('Error in getNotifications controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while retrieving notifications.',
                cause: error,
            });
        }
    }

    async markAsRead({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof MarkAsReadTRPCInputSchema>;
    }): Promise<z.infer<typeof MarkAsReadTRPCOutputSchema>> {
        logger.info('Executing markAsRead controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to mark notification as read');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const result = await ctx.queries.notification.markAsRead({
                userId,
                notificationId: input.notificationId,
            });
            return result;
        } catch (error: any) {
            logger.error('Error in markAsRead controller', { error, userId, notificationId: input.notificationId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while marking notification as read.',
                cause: error,
            });
        }
    }

    async markAllAsRead({
        ctx,
    }: {
        ctx: TRPCContext;
    }): Promise<z.infer<typeof MarkAllAsReadTRPCOutputSchema>> {
        logger.info('Executing markAllAsRead controller');

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to mark all notifications as read');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            const result = await ctx.queries.notification.markAllAsRead({ userId });
            return result;
        } catch (error: any) {
            logger.error('Error in markAllAsRead controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while marking all notifications as read.',
                cause: error,
            });
        }
    }

    async upsertDeviceToken({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof UpsertDeviceTokenTRPCInputSchema>;
    }): Promise<z.infer<typeof UpsertDeviceTokenTRPCOutputSchema>> {
        logger.info('Executing upsertDeviceToken controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to upsert device token');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            await deviceTokenService.upsert(userId, input);
            return true;
        } catch (error: any) {
            logger.error('Error in upsertDeviceToken controller', { error, userId });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while upserting device token.',
                cause: error,
            });
        }
    }

    async removeDeviceToken({
        ctx,
        input,
    }: {
        ctx: TRPCContext;
        input: z.infer<typeof RemoveDeviceTokenTRPCInputSchema>;
    }): Promise<z.infer<typeof RemoveDeviceTokenTRPCOutputSchema>> {
        logger.info('Executing removeDeviceToken controller', { input });

        const userId = ctx.user?.id;
        if (!userId) {
            logger.warn('Unauthorized attempt to remove device token');
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'User authentication required.',
            });
        }

        try {
            await deviceTokenService.remove(input.fid);
            return true;
        } catch (error: any) {
            logger.error('Error in removeDeviceToken controller', { error, userId, fid: input.fid });
            if (error instanceof TRPCError) throw error;
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message || 'Something went wrong while removing device token.',
                cause: error,
            });
        }
    }
}

