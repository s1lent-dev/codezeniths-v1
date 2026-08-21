/**
 * @file mq.bootstrap.ts
 * @description Single startup entry point for all MQ infrastructure.
 *
 * Sequence:
 *   1. Assert topology (exchanges + queues + bindings) — once, awaited.
 *   2. Start all 6 domain consumer groups.
 */

import { bootstrapTopology } from './mq.topology';
import { startAuthConsumers } from '../consumers/auth.consumer';
import { startPaymentConsumers } from '../consumers/payment.consumer';
import { startProgressConsumers } from '../consumers/progress.consumer';
import { startSocialConsumers } from '../consumers/social.consumer';
import { startNotificationConsumers } from '../consumers/notification.consumer';
import { startSearchConsumers } from '../consumers/search.consumer';
import { logger } from '@/service/logging';

export async function initMq(): Promise<void> {
    try {
        // Step 1: Assert all exchanges, queues, and bindings
        await bootstrapTopology();

        // Step 2: Start all domain consumers concurrently
        await Promise.all([
            startAuthConsumers(),
            startPaymentConsumers(),
            startProgressConsumers(),
            startSocialConsumers(),
            startNotificationConsumers(),
            startSearchConsumers(),
        ]);

        logger.info('[mq:bootstrap] All 6 domain consumer groups initialized successfully.');
    } catch (err) {
        logger.error('[mq:bootstrap] Failed to initialize message queue infrastructure', err);
        throw err;
    }
}
