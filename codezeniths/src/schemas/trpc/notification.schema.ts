import { z } from 'zod';
import {
    GetNotificationsOutputSchema,
    DevicePlatformSchema,
    NotificationStatusSchema,
    NotificationCategorySchema,
    NotificationSortSchema,
} from '../db';

export const deviceTokenUpsertSchema = z.object({
    fid: z.string().min(1),
    platform: DevicePlatformSchema.default('web'),
    userAgent: z.string().optional(),
});

export type DeviceTokenUpsertInput = z.infer<typeof deviceTokenUpsertSchema>;

export const GetNotificationsTRPCInputSchema = z.object({
    status: NotificationStatusSchema.default('all').optional(),
    category: NotificationCategorySchema.default('all').optional(),
    sort: NotificationSortSchema.default('latest').optional(),
    search: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(6).optional(),
    cursor: z.string().uuid().optional(),
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
