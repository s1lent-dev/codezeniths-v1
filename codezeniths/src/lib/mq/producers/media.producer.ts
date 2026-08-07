import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class MediaProducer {
    private readonly avatarUploadProducer = createProducer('media.avatar.upload', {
        exchange: MqExchange.MEDIA,
        routingKey: MqRoutingKey.MEDIA_AVATAR_UPLOAD,
    });

    private readonly avatarReplaceProducer = createProducer('media.avatar.replace', {
        exchange: MqExchange.MEDIA,
        routingKey: MqRoutingKey.MEDIA_AVATAR_REPLACE,
    });

    private readonly avatarUrlExpiryProducer = createProducer('media.avatar.url_expiry', {
        exchange: MqExchange.MEDIA,
        routingKey: MqRoutingKey.MEDIA_AVATAR_URL_EXPIRY,
    });

    private readonly contentUploadProducer = createProducer('media.content.upload', {
        exchange: MqExchange.MEDIA,
        routingKey: MqRoutingKey.MEDIA_CONTENT_UPLOAD,
    });

    private readonly uploadFailedProducer = createProducer('media.upload_failed', {
        exchange: MqExchange.MEDIA,
        routingKey: MqRoutingKey.MEDIA_ANY_UPLOAD_FAILED,
    });

    /** JSDoc: Triggered when a new user avatar is uploaded. Targets exchange media.topic via routing key media.avatar.upload. */
    async uploadAvatar(payload: PayloadOf<'media.avatar.upload'>): Promise<void> {
        await this.avatarUploadProducer.publish(payload);
    }

    /** JSDoc: Triggered when an existing user avatar is replaced. Targets exchange media.topic via routing key media.avatar.replace. */
    async replaceAvatar(payload: PayloadOf<'media.avatar.replace'>): Promise<void> {
        await this.avatarReplaceProducer.publish(payload);
    }

    /** JSDoc: Triggered when an avatar signed URL is close to expiring. Targets exchange media.topic via routing key media.avatar.url_expiry. */
    async avatarUrlExpiry(payload: PayloadOf<'media.avatar.url_expiry'>): Promise<void> {
        await this.avatarUrlExpiryProducer.publish(payload);
    }

    /** JSDoc: Triggered when static/course content assets are uploaded. Targets exchange media.topic via routing key media.content.upload. */
    async uploadContent(payload: PayloadOf<'media.content.upload'>): Promise<void> {
        await this.contentUploadProducer.publish(payload);
    }

    /** JSDoc: Triggered when any media upload fail event is registered. Targets exchange media.topic via routing key media.*.upload_failed. */
    async uploadFailed(payload: PayloadOf<'media.upload_failed'>): Promise<void> {
        await this.uploadFailedProducer.publish(payload);
    }
}

export const mediaProducer = new MediaProducer();
