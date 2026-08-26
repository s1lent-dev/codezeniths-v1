'use client';

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpcClient } from '@/lib/trpc/trpc/trpc.client';
import { CacheInvalidationService } from '../cache-invalidation.service';
import { queryKeys } from '../query-keys';
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
import type { INotificationQueryService } from '../interfaces';

export class NotificationQueryService implements INotificationQueryService {
    getNotifications(input?: z.infer<typeof GetNotificationsTRPCInputSchema>) {
        const validatedInput = GetNotificationsTRPCInputSchema.parse(input);
        return useQuery({
            queryKey: queryKeys.notification.list(validatedInput),
            queryFn: async () => {
                const raw = await trpcClient.notification.getNotifications.query(validatedInput);
                return GetNotificationsTRPCOutputSchema.parse(raw);
            },
            refetchInterval: 60000, // Poll every 1 min
            refetchOnWindowFocus: true,
        });
    }

    getNotificationsInfinite(
        filters?: {
            status?: 'all' | 'unread' | 'read';
            category?: 'all' | 'achievements' | 'social' | 'system';
            sort?: 'latest' | 'oldest';
            search?: string;
        },
        limit = 6
    ) {
        return useInfiniteQuery({
            queryKey: queryKeys.notification.infinite({ filters, limit }),
            queryFn: async ({ pageParam }) => {
                const input = {
                    ...filters,
                    limit,
                    cursor: pageParam as string | undefined,
                };
                const validatedInput = GetNotificationsTRPCInputSchema.parse(input);
                const raw = await trpcClient.notification.getNotifications.query(validatedInput);
                return GetNotificationsTRPCOutputSchema.parse(raw);
            },
            initialPageParam: undefined as string | undefined,
            getNextPageParam: (lastPage) => {
                return lastPage.nextCursor ?? undefined;
            },
            refetchInterval: 60000,
            refetchOnWindowFocus: true,
        });
    }

    markAsRead() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async (variables: z.infer<typeof MarkAsReadTRPCInputSchema>) => {
                const validatedInput = MarkAsReadTRPCInputSchema.parse(variables);
                const raw = await trpcClient.notification.markAsRead.mutate(validatedInput);
                return MarkAsReadTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnNotificationsRead(queryClient);
            },
        });
    }

    markAllAsRead() {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: async () => {
                const raw = await trpcClient.notification.markAllAsRead.mutate();
                return MarkAllAsReadTRPCOutputSchema.parse(raw);
            },
            onSuccess: async () => {
                await CacheInvalidationService.invalidateOnNotificationsRead(queryClient);
            },
        });
    }

    upsertDeviceToken() {
        return useMutation({
            mutationFn: async (variables: z.infer<typeof UpsertDeviceTokenTRPCInputSchema>) => {
                const validatedInput = UpsertDeviceTokenTRPCInputSchema.parse(variables);
                const raw = await trpcClient.notification.upsertDeviceToken.mutate(validatedInput);
                return UpsertDeviceTokenTRPCOutputSchema.parse(raw);
            },
        });
    }
}

export const notificationQueryService = new NotificationQueryService();
