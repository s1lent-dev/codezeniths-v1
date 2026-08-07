import { z } from 'zod';
import { GetNotificationsOutputSchema, DevicePlatformSchema } from '../db';

export const deviceTokenUpsertSchema = z.object({
    fid: z.string().min(1),
    platform: DevicePlatformSchema.default('web'),
    userAgent: z.string().optional(),
});

export type DeviceTokenUpsertInput = z.infer<typeof deviceTokenUpsertSchema>;

export const GetNotificationsTRPCInputSchema = z.object({
    limit: z.number().int().optional(),
    offset: z.number().int().optional(),
}).optional();

export const GetNotificationsTRPCOutputSchema = GetNotificationsOutputSchema;

export const MarkAsReadTRPCInputSchema = z.object({
    notificationId: z.string().uuid(),
});

export const MarkAsReadTRPCOutputSchema = z.boolean();

export const MarkAllAsReadTRPCOutputSchema = z.boolean();

export const UpsertDeviceTokenTRPCInputSchema = deviceTokenUpsertSchema;

export const UpsertDeviceTokenTRPCOutputSchema = z.boolean();

export const RemoveDeviceTokenTRPCInputSchema = z.object({
    fid: z.string().min(1),
});

export const RemoveDeviceTokenTRPCOutputSchema = z.boolean();
