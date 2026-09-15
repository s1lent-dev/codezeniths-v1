import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';
import { redisService, RedisStore } from '@/lib/redis';
import { prisma } from '@/lib/db/prisma.client';
import { deviceTokenService } from '@/lib/firebase/devicetoken.service';
import { FcmTemplate } from '@/lib/firebase/types';
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

        const listKey = RedisStore.notifications.userList(userId);
        await redisService.list.push(listKey, JSON.stringify(notification));

        const len = await redisService.list.len(listKey);
        if (len > 50) {
            await redisService.list.pop(listKey);
        }

        const channel = RedisStore.channels.userNotifications(userId);
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

            const user = await prisma.user.findUnique({
                where: { id: payload.followingId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.followingId,
                    FcmTemplate.USER_FOLLOWED,
                    {
                        followerName: payload.followerName,
                    },
                    {
                        link: `/profile/${payload.followerUsername || payload.followerId}`,
                    }
                );
            }

            context.ack();
        } catch (error) {
            logger.error('[social:user_followed] Failed to process user followed event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SOCIAL_USER_FOLLOWED }
);

export const socialUserUnfollowedConsumer = createConsumer(
    'social.user.unfollowed',
    async (payload: PayloadOf<'social.user.unfollowed'>, context: MessageContext) => {
        try {
            logger.info('Processing user unfollowed event', { payload });

            // Publish real-time social update to Redis channel
            const channel = `user:${payload.followingId}:social`;
            await redisService.pubsub.publish(channel, {
                type: 'USER_UNFOLLOWED',
                followerId: payload.followerId,
                timestamp: new Date().toISOString(),
            });

            context.ack();
        } catch (error) {
            logger.error('[social:user_unfollowed] Failed to process user unfollowed event', error);
            context.nack(false);
        }
    },
    { queue: MqQueue.SOCIAL_USER_UNFOLLOWED }
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

            const user = await prisma.user.findUnique({
                where: { id: payload.viewedUserId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.viewedUserId,
                    FcmTemplate.PROFILE_VIEWED,
                    {
                        viewerName: payload.viewerName,
                    },
                    {
                        link: `/profile/${payload.viewerUsername || payload.viewerId}`,
                    }
                );
            }

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

            const user = await prisma.user.findUnique({
                where: { id: payload.creatorId },
                include: { preferences: true },
            });

            if (user?.preferences?.pushNotifications) {
                await deviceTokenService.sendTemplatedToUser(
                    payload.creatorId,
                    FcmTemplate.PLAYLIST_INTERACTED,
                    {
                        actorName: payload.actorName,
                        playlistTitle: payload.playlistTitle,
                        action: payload.action,
                    },
                    {
                        link: `/playlists/${payload.playlistId}`,
                    }
                );
            }

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
        socialUserUnfollowedConsumer.start(),
        socialProfileViewedConsumer.start(),
        socialPlaylistInteractedConsumer.start(),
    ]);
    logger.info('[social:consumers] All 4 Social consumers initialized successfully.');
}
