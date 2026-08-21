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

export const NotificationStatusSchema = z.enum(['all', 'unread', 'read']);
export type NotificationStatus = z.infer<typeof NotificationStatusSchema>;

export const NotificationCategorySchema = z.enum(['all', 'achievements', 'social', 'system']);
export type NotificationCategory = z.infer<typeof NotificationCategorySchema>;

export const NotificationSortSchema = z.enum(['latest', 'oldest']);
export type NotificationSort = z.infer<typeof NotificationSortSchema>;

export const GetNotificationsInputSchema = z.object({
    userId: z.string().uuid(),
    status: NotificationStatusSchema.default('all').optional(),
    category: NotificationCategorySchema.default('all').optional(),
    sort: NotificationSortSchema.default('latest').optional(),
    search: z.string().optional(),
    limit: z.number().int().min(1).max(100).default(6).optional(),
    cursor: z.string().uuid().optional(),
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
    totalCount: z.number().int(),
    nextCursor: z.string().uuid().nullable().optional(),
    hasNextPage: z.boolean(),
});

export const MarkAsReadInputSchema = z.object({
    userId: z.string().uuid(),
    notificationId: z.string().uuid(),
});

export const MarkAllAsReadInputSchema = z.object({
    userId: z.string().uuid(),
});
