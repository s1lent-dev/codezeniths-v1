import { z } from 'zod';
import {
    GetNotificationsInputSchema,
    GetNotificationsOutputSchema,
    MarkAsReadInputSchema,
    MarkAllAsReadInputSchema,
} from '@/schemas/db';

export interface INotificationQueries {
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
