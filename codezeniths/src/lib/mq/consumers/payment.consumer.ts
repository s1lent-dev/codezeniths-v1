import { createConsumer } from '../core/mq.consumer';
import { MqQueue } from '../shared/mq.types';
import type { MessageContext } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

/** JSDoc: Triggered when a raw webhook is received from the provider. Normalizes and re-publishes to payment.direct using PaymentProducer. */
export const paymentWebhookProcessorConsumer = createConsumer(
    'payment.webhook.ingested',
    async (payload: PayloadOf<'payment.webhook.ingested'>, context: MessageContext) => {
        // TODO: normalize the raw provider payload and re-publish to payment.direct using PaymentProducer before acking
        // Example:
        // const normalized = normalizePayload(payload);
        // await paymentProducer.confirmPayment(normalized);
        // context.ack();
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_WEBHOOK_PROCESSOR }
);

/** JSDoc: Triggered when a checkout is initiated. Targets exchange payment.direct via routing key payment.checkout.initiated. */
export const paymentCheckoutConsumer = createConsumer(
    'payment.checkout.initiated',
    async (payload: PayloadOf<'payment.checkout.initiated'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_CHECKOUT }
);

/** JSDoc: Triggered when a payment is confirmed. Targets exchange payment.direct via routing key payment.confirmed. */
export const paymentConfirmedConsumer = createConsumer(
    'payment.confirmed',
    async (payload: PayloadOf<'payment.confirmed'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_CONFIRMED }
);

/** JSDoc: Triggered when a payment fails. Targets exchange payment.direct via routing key payment.failed. */
export const paymentFailedConsumer = createConsumer(
    'payment.failed',
    async (payload: PayloadOf<'payment.failed'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_FAILED }
);

/** JSDoc: Triggered when a failed payment is retried. Targets exchange payment.direct via routing key payment.retry. */
export const paymentRetryConsumer = createConsumer(
    'payment.retry',
    async (payload: PayloadOf<'payment.retry'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_RETRY }
);

/** JSDoc: Triggered when a refund is processed. Targets exchange payment.direct via routing key payment.refund. */
export const paymentRefundConsumer = createConsumer(
    'payment.refund',
    async (payload: PayloadOf<'payment.refund'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_REFUND }
);

/** JSDoc: Triggered when a subscription is created. Targets exchange payment.direct via routing key payment.subscription.created. */
export const paymentSubCreatedConsumer = createConsumer(
    'payment.subscription.created',
    async (payload: PayloadOf<'payment.subscription.created'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_SUB_CREATED }
);

/** JSDoc: Triggered when a subscription is renewed. Targets exchange payment.direct via routing key payment.subscription.renewed. */
export const paymentSubRenewedConsumer = createConsumer(
    'payment.subscription.renewed',
    async (payload: PayloadOf<'payment.subscription.renewed'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_SUB_RENEWED }
);

/** JSDoc: Triggered when a subscription is cancelled. Targets exchange payment.direct via routing key payment.subscription.cancelled. */
export const paymentSubCancelledConsumer = createConsumer(
    'payment.subscription.cancelled',
    async (payload: PayloadOf<'payment.subscription.cancelled'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_SUB_CANCELLED }
);

/** JSDoc: Triggered when a subscription expires. Targets exchange payment.direct via routing key payment.subscription.expired. */
export const paymentSubExpiredConsumer = createConsumer(
    'payment.subscription.expired',
    async (payload: PayloadOf<'payment.subscription.expired'>, context: MessageContext) => {
        // TODO: implement
    },
    { queue: MqQueue.PAYMENT_SUB_EXPIRED }
);

export async function startPaymentConsumers(): Promise<void> {
    await Promise.all([
        paymentWebhookProcessorConsumer.start(),
        paymentCheckoutConsumer.start(),
        paymentConfirmedConsumer.start(),
        paymentFailedConsumer.start(),
        paymentRetryConsumer.start(),
        paymentRefundConsumer.start(),
        paymentSubCreatedConsumer.start(),
        paymentSubRenewedConsumer.start(),
        paymentSubCancelledConsumer.start(),
        paymentSubExpiredConsumer.start(),
    ]);
}
