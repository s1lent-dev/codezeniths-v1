/**
 * @file search.producer.ts
 * @description Producer for search indexing, user document syncing, and search query history logging.
 */

import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class SearchProducer {
    private readonly userIndexProducer = createProducer('search.user.index', {
        exchange: MqExchange.SEARCH,
        routingKey: MqRoutingKey.SEARCH_USER_INDEX,
    });

    private readonly historyRecordProducer = createProducer('search.history.record', {
        exchange: MqExchange.SEARCH,
        routingKey: MqRoutingKey.SEARCH_HISTORY_RECORD,
    });

    /**
     * Publishes a user profile document to the search index queue.
     */
    async publishIndexUser(payload: PayloadOf<'search.user.index'>): Promise<void> {
        await this.userIndexProducer.publish(payload);
    }

    /**
     * Publishes search history telemetry to be recorded asynchronously.
     */
    async publishRecordSearchHistory(payload: PayloadOf<'search.history.record'>): Promise<void> {
        await this.historyRecordProducer.publish(payload);
    }
}

export const searchProducer = new SearchProducer();
