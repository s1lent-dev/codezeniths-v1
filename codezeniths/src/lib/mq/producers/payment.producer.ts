import { createProducer } from '../core/mq.producer';
import { MqExchange, MqRoutingKey } from '../shared/mq.types';
import type { PayloadOf } from '../shared/mq.registry';

export class PaymentProducer {
    private readonly webhookIngestedProducer = createProducer('payment.webhook.ingested', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_WEBHOOK_INGESTED,
    });

    private readonly checkoutInitiatedProducer = createProducer('payment.checkout.initiated', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_CHECKOUT_INITIATED,
    });

    private readonly confirmedProducer = createProducer('payment.confirmed', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_CONFIRMED,
    });

    private readonly failedProducer = createProducer('payment.failed', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_FAILED,
    });

    private readonly retryProducer = createProducer('payment.retry', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_RETRY,
    });

    private readonly refundProducer = createProducer('payment.refund', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_REFUND,
    });

    private readonly subscriptionCreatedProducer = createProducer('payment.subscription.created', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_SUB_CREATED,
    });

    private readonly subscriptionRenewedProducer = createProducer('payment.subscription.renewed', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_SUB_RENEWED,
    });

    private readonly subscriptionCancelledProducer = createProducer('payment.subscription.cancelled', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_SUB_CANCELLED,
    });

    private readonly subscriptionExpiredProducer = createProducer('payment.subscription.expired', {
        exchange: MqExchange.PAYMENT,
        routingKey: MqRoutingKey.PAYMENT_SUB_EXPIRED,
    });

    /** JSDoc: Triggered when a raw webhook is received from the payment gateway. Targets exchange payment.direct via routing key payment.webhook.ingested. */
    async ingestWebhook(payload: PayloadOf<'payment.webhook.ingested'>): Promise<void> {
        await this.webhookIngestedProducer.publish(payload);
    }

    /** JSDoc: Triggered when a user enters checkout page. Targets exchange payment.direct via routing key payment.checkout.initiated. */
    async initiateCheckout(payload: PayloadOf<'payment.checkout.initiated'>): Promise<void> {
        await this.checkoutInitiatedProducer.publish(payload);
    }

    /** JSDoc: Triggered when a payment is successful. Targets exchange payment.direct via routing key payment.confirmed. */
    async confirmPayment(payload: PayloadOf<'payment.confirmed'>): Promise<void> {
        await this.confirmedProducer.publish(payload);
    }

    /** JSDoc: Triggered when a payment attempt fails. Targets exchange payment.direct via routing key payment.failed. */
    async failPayment(payload: PayloadOf<'payment.failed'>): Promise<void> {
        await this.failedProducer.publish(payload);
    }

    /** JSDoc: Triggered when a failed payment is scheduled for retry. Targets exchange payment.direct via routing key payment.retry. */
    async retryPayment(payload: PayloadOf<'payment.retry'>): Promise<void> {
        await this.retryProducer.publish(payload);
    }

    /** JSDoc: Triggered when a refund is processed. Targets exchange payment.direct via routing key payment.refund. */
    async refundPayment(payload: PayloadOf<'payment.refund'>): Promise<void> {
        await this.refundProducer.publish(payload);
    }

    /** JSDoc: Triggered when a subscription is created. Targets exchange payment.direct via routing key payment.subscription.created. */
    async subscriptionCreated(payload: PayloadOf<'payment.subscription.created'>): Promise<void> {
        await this.subscriptionCreatedProducer.publish(payload);
    }

    /** JSDoc: Triggered when a subscription is renewed. Targets exchange payment.direct via routing key payment.subscription.renewed. */
    async subscriptionRenewed(payload: PayloadOf<'payment.subscription.renewed'>): Promise<void> {
        await this.subscriptionRenewedProducer.publish(payload);
    }

    /** JSDoc: Triggered when a subscription is cancelled. Targets exchange payment.direct via routing key payment.subscription.cancelled. */
    async subscriptionCancelled(payload: PayloadOf<'payment.subscription.cancelled'>): Promise<void> {
        await this.subscriptionCancelledProducer.publish(payload);
    }

    /** JSDoc: Triggered when a subscription period expires. Targets exchange payment.direct via routing key payment.subscription.expired. */
    async subscriptionExpired(payload: PayloadOf<'payment.subscription.expired'>): Promise<void> {
        await this.subscriptionExpiredProducer.publish(payload);
    }
}

export const paymentProducer = new PaymentProducer();
