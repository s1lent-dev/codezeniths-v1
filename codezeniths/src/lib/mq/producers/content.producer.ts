import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class ContentProducer {
    private readonly contentPublishedProducer = createProducer('content.published', {
        exchange: MqExchange.CONTENT,
        routingKey: MqRoutingKey.CONTENT_PUBLISHED,
    });

    async publishContent(payload: PayloadOf<'content.published'>): Promise<void> {
        await this.contentPublishedProducer.publish(payload);
    }
}

export const contentProducer = new ContentProducer();
