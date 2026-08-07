import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

/** JSDoc: Triggered when an avatar upload event needs processing. Targets exchange media.topic via routing key media.avatar.upload. */
export const mediaAvatarProcessConsumer = createConsumer(
    'media.avatar.upload',
    async (payload: PayloadOf<'media.avatar.upload'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.MEDIA_AVATAR_PROCESS }
);

/** JSDoc: Triggered when avatar pre-signed URL expires and needs refreshing. Targets exchange media.topic via routing key media.avatar.url_expiry. */
export const mediaAvatarRefreshUrlConsumer = createConsumer(
    'media.avatar.url_expiry',
    async (payload: PayloadOf<'media.avatar.url_expiry'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.MEDIA_AVATAR_REFRESH_URL }
);

/** JSDoc: Triggered when content media asset needs processing. Targets exchange media.topic via routing key media.content.upload. */
export const mediaContentProcessConsumer = createConsumer(
    'media.content.upload',
    async (payload: PayloadOf<'media.content.upload'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.MEDIA_CONTENT_PROCESS }
);

/** JSDoc: Triggered when media upload fail alert is sent. Targets exchange media.topic via routing key media.*.upload_failed. */
export const mediaAlertConsumer = createConsumer(
    'media.upload_failed',
    async (payload: PayloadOf<'media.upload_failed'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.MEDIA_ALERT }
);

/** JSDoc: Triggered when media audit event is captured. Targets exchange media.topic via routing key media.#. */
export const mediaAuditConsumer = createConsumer(
    'media.avatar.upload',
    async (payload: PayloadOf<'media.avatar.upload'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.MEDIA_AUDIT }
);

export async function startMediaConsumers(): Promise<void> {
    await Promise.all([
        mediaAvatarProcessConsumer.start(),
        mediaAvatarRefreshUrlConsumer.start(),
        mediaContentProcessConsumer.start(),
        mediaAlertConsumer.start(),
        mediaAuditConsumer.start(),
    ]);
}
