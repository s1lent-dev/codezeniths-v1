import { z } from 'zod';

export const CreateNotificationInputSchema = z.object({
    userId: z.string().uuid(),
    type: z.string(),
    title: z.string(),
    message: z.string(),
});

export const CreateGlobalNotificationInputSchema = z.object({
    type: z.string(),
    title: z.string(),
    message: z.string(),
});

export const GetNotificationsInputSchema = z.object({
    userId: z.string().uuid(),
    limit: z.number().int().optional(),
    offset: z.number().int().optional(),
});

export const NotificationDBOutputSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid().nullable(),
    type: z.string(),
    title: z.string(),
    message: z.string(),
    read: z.boolean(),
    createdAt: z.date(),
});

export const GetNotificationsOutputSchema = z.object({
    notifications: z.array(NotificationDBOutputSchema),
    unreadCount: z.number().int(),
});

export const MarkAsReadInputSchema = z.object({
    userId: z.string().uuid(),
    notificationId: z.string().uuid(),
});

export const MarkAllAsReadInputSchema = z.object({
    userId: z.string().uuid(),
});
