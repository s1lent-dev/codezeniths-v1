import { createProducer } from '../core/mq.producer';
import { MqExchange, buildProgressRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class ProgressProducer {
    /** JSDoc: Triggered when a user solves a problem. Targets exchange progress.topic via routing key progress.<moduleSlug>.solved. */
    async problemSolved(payload: PayloadOf<'progress.event'>): Promise<void> {
        const routingKey = buildProgressRoutingKey(payload.moduleSlug, 'solved');
        const producer = createProducer('progress.event', {
            exchange: MqExchange.PROGRESS,
            routingKey,
        });
        await producer.publish(payload);
    }

    /** JSDoc: Triggered when a user marks a problem to revisit. Targets exchange progress.topic via routing key progress.<moduleSlug>.revisit. */
    async problemRevisit(payload: PayloadOf<'progress.event'>): Promise<void> {
        const routingKey = buildProgressRoutingKey(payload.moduleSlug, 'revisit');
        const producer = createProducer('progress.event', {
            exchange: MqExchange.PROGRESS,
            routingKey,
        });
        await producer.publish(payload);
    }

    /** JSDoc: Triggered when a user masters a module. Targets exchange progress.topic via routing key progress.<moduleSlug>.mastered. */
    async moduleMastered(payload: PayloadOf<'progress.event'>): Promise<void> {
        const routingKey = buildProgressRoutingKey(payload.moduleSlug, 'mastered');
        const producer = createProducer('progress.event', {
            exchange: MqExchange.PROGRESS,
            routingKey,
        });
        await producer.publish(payload);
    }
}

export const progressProducer = new ProgressProducer();
