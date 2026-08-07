import { bootstrapTopology } from './mq.topology';
import { buildCodeZenithsTopology } from './mq.topology';
import { startEmailConsumers } from '../consumers/email.consumer';
import { startSmsConsumers } from '../consumers/sms.consumer';
import { startPushConsumers } from '../consumers/push.consumer';
import { startInAppConsumers } from '../consumers/inapp.consumer';
import { startPaymentConsumers } from '../consumers/payment.consumer';
import { startMediaConsumers } from '../consumers/media.consumer';

export async function initMq(): Promise<void> {
    await bootstrapTopology(buildCodeZenithsTopology());
    await Promise.all([
        startEmailConsumers(),
        startSmsConsumers(),
        startPushConsumers(),
        startInAppConsumers(),
        startPaymentConsumers(),
        startMediaConsumers(),
    ]);
}
