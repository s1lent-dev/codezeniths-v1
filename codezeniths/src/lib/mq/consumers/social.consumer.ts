/**
 * @file social.consumer.ts
 * @description Consumer worker for the Social domain: handles in-app notifications and WebSocket alerts for follows, profile views, and playlists.
 */

import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { redisService } from '@/lib/redis';
import { prisma } from '@/lib/db/prisma.client';
import { logger } from '@/service/logging';

async function sendInAppNotification(userId: string, type: string, title: string, message: string) {
    try {
        const dbNotification = await prisma.notification.create({
            data: {
                userId,
                type,
                title,
                message,
                read: false,
            },
        });

        const notification = {
            id: dbNotification.id,
            type: dbNotification.type,
            title: dbNotification.title,
            message: dbNotification.message,
            timestamp: dbNotification.createdAt.toISOString(),
            read: dbNotification.read,
        };

        const listKey = `user:${userId}:notifications`;
        await redisService.list.push(listKey, JSON.stringify(notification));

        const len = await redisService.list.len(listKey);
        if (len > 50) {
            await redisService.list.pop(listKey);
        }

        const channel = `user:${userId}:notifications`;
        await redisService.pubsub.publish(channel, notification);
    } catch (error) {
        logger.error('[social:inapp] Failed to deliver social in-app notification', { error, userId });
    }
}

export const socialUserFollowedConsumer = createConsumer(
    'social.user.followed',
    async (payload: PayloadOf<'social.user.followed'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.followingId,
                'NEW_FOLLOWER',
                'New Follower! 👤',
                `${payload.followerName}${payload.followerUsername ? ` (@${payload.followerUsername})` : ''} started following you.`
            );
            context.ack();
        } catch (error) {
            logger.error('[social:user_followed] Failed to process user followed event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SOCIAL_USER_FOLLOWED }
);

export const socialProfileViewedConsumer = createConsumer(
    'social.profile.viewed',
    async (payload: PayloadOf<'social.profile.viewed'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.viewedUserId,
                'PROFILE_VIEW',
                'Profile Viewed 👀',
                `${payload.viewerName} viewed your developer profile.`
            );
            context.ack();
        } catch (error) {
            logger.error('[social:profile_viewed] Failed to process profile viewed event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SOCIAL_PROFILE_VIEWED }
);

export const socialPlaylistInteractedConsumer = createConsumer(
    'social.playlist.interacted',
    async (payload: PayloadOf<'social.playlist.interacted'>, context: MessageContext) => {
        try {
            await sendInAppNotification(
                payload.creatorId,
                'PLAYLIST_ACTIVITY',
                'Playlist Activity 📚',
                `${payload.actorName} ${payload.action} your playlist "${payload.playlistTitle}".`
            );
            context.ack();
        } catch (error) {
            logger.error('[social:playlist_interacted] Failed to process playlist interaction event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SOCIAL_PLAYLIST_INTERACTED }
);

/**
 * Starts all Social domain consumers.
 */
export async function startSocialConsumers(): Promise<void> {
    await Promise.all([
        socialUserFollowedConsumer.start(),
        socialProfileViewedConsumer.start(),
        socialPlaylistInteractedConsumer.start(),
    ]);
    logger.info('[social:consumers] All 3 Social consumers initialized successfully.');
}
