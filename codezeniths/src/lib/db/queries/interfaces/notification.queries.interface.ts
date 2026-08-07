import { z } from 'zod';
import {
    CreateNotificationInputSchema,
    CreateGlobalNotificationInputSchema,
    GetNotificationsInputSchema,
    GetNotificationsOutputSchema,
    NotificationDBOutputSchema,
    MarkAsReadInputSchema,
    MarkAllAsReadInputSchema,
} from '@/schemas/db';

export interface INotificationQueries {
    createNotification: (
        payload: z.infer<typeof CreateNotificationInputSchema>
    ) => Promise<z.infer<typeof NotificationDBOutputSchema>>;

    createGlobalNotification: (
        payload: z.infer<typeof CreateGlobalNotificationInputSchema>
    ) => Promise<z.infer<typeof NotificationDBOutputSchema>>;

    getNotifications: (
        payload: z.infer<typeof GetNotificationsInputSchema>
    ) => Promise<z.infer<typeof GetNotificationsOutputSchema>>;

    markAsRead: (
        payload: z.infer<typeof MarkAsReadInputSchema>
    ) => Promise<boolean>;

    markAllAsRead: (
        payload: z.infer<typeof MarkAllAsReadInputSchema>
    ) => Promise<boolean>;
}
