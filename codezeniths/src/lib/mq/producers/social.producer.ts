/**
 * @file social.producer.ts
 * @description Producer for social and community interactions (user follow, profile view, playlist interactions).
 */

import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class SocialProducer {
    private readonly userFollowedProducer = createProducer('social.user.followed', {
        exchange: MqExchange.SOCIAL,
        routingKey: MqRoutingKey.SOCIAL_USER_FOLLOWED,
    });

    private readonly profileViewedProducer = createProducer('social.profile.viewed', {
        exchange: MqExchange.SOCIAL,
        routingKey: MqRoutingKey.SOCIAL_PROFILE_VIEWED,
    });

    private readonly playlistInteractedProducer = createProducer('social.playlist.interacted', {
        exchange: MqExchange.SOCIAL,
        routingKey: MqRoutingKey.SOCIAL_PLAYLIST_INTERACTED,
    });

    /**
     * Publishes a user-followed event.
     */
    async userFollowed(payload: PayloadOf<'social.user.followed'>): Promise<void> {
        await this.userFollowedProducer.publish(payload);
    }

    /**
     * Publishes a profile-viewed event.
     */
    async profileViewed(payload: PayloadOf<'social.profile.viewed'>): Promise<void> {
        await this.profileViewedProducer.publish(payload);
    }

    /**
     * Publishes a playlist-interaction event.
     */
    async playlistInteracted(payload: PayloadOf<'social.playlist.interacted'>): Promise<void> {
        await this.playlistInteractedProducer.publish(payload);
    }
}

export const socialProducer = new SocialProducer();
