import { IPaymentProvider } from './payment.interface';
import { RazorpayPaymentProvider } from './razorpay.provider';
import {
    PaymentOrder,
    PaymentSubscription,
    PaymentRefund,
    RazorpayWebhookEventSchema,
} from './payment.types';
import { paymentProducer } from '../../lib/mq/producers/payment.producer';

export class PaymentService {
    private readonly provider: IPaymentProvider;

    constructor(provider?: IPaymentProvider) {
        this.provider = provider ?? new RazorpayPaymentProvider();
    }

    /**
     * Initiates checkout by creating an order on Razorpay and publishing checkout initiation to MQ.
     */
    async initiateCheckout(
        userId: string,
        amount: number,
        currency: string,
        receiptId: string,
        correlationId?: string
    ): Promise<PaymentOrder> {
        const order = await this.provider.createOrder(amount, currency, receiptId);

        // Publish to MQ checkout initiation
        await paymentProducer.initiateCheckout({
            correlationId,
            userId,
            amount: order.amount,
            currency: order.currency,
            checkoutSessionId: order.id,
        });

        return order;
    }

    /**
     * Creates a new subscription on Razorpay and publishes creation to MQ.
     */
    async createSubscription(
        userId: string,
        planId: string,
        customerEmail: string,
        quantity: number = 1,
        startAt?: number,
        correlationId?: string
    ): Promise<PaymentSubscription> {
        const subscription = await this.provider.createSubscription(
            planId,
            customerEmail,
            quantity,
            startAt
        );

        // Publish to MQ subscription created
        await paymentProducer.subscriptionCreated({
            correlationId,
            userId,
            subscriptionId: subscription.id,
            planId: subscription.planId,
        });

        return subscription;
    }

    /**
     * Cancels an existing subscription on Razorpay and publishes cancellation to MQ.
     */
    async cancelSubscription(
        userId: string,
        subscriptionId: string,
        cancelAtPeriodEnd: boolean = true,
        correlationId?: string
    ): Promise<void> {
        await this.provider.cancelSubscription(subscriptionId, cancelAtPeriodEnd);

        // Publish to MQ subscription cancelled
        await paymentProducer.subscriptionCancelled({
            correlationId,
            userId,
            subscriptionId,
        });
    }

    /**
     * Dispatches a refund request for a payment transaction.
     */
    async processRefund(
        userId: string,
        paymentId: string,
        amount: number,
        correlationId?: string
    ): Promise<PaymentRefund> {
        const refund = await this.provider.processRefund(paymentId, amount);

        // Publish to MQ refund processed
        await paymentProducer.refundPayment({
            correlationId,
            userId,
            paymentIntentId: paymentId,
            amount: refund.amount,
        });

        return refund;
    }

    /**
     * Receives and verifies the webhook raw payload, publishes it raw to MQ,
     * and triggers event processing.
     */
    async handleIncomingWebhook(
        rawBody: string,
        signature: string,
        correlationId?: string
    ): Promise<boolean> {
        const isValid = this.provider.verifyWebhook(rawBody, signature);
        if (!isValid) {
            return false;
        }

        const parsedJson = JSON.parse(rawBody);
        const eventData = RazorpayWebhookEventSchema.parse(parsedJson);

        // Publish to webhook ingested MQ queue
        await paymentProducer.ingestWebhook({
            correlationId,
            provider: 'razorpay',
            payload: eventData.payload,
        });

        // Trigger asynchronous handling internally or routing
        await this.routeWebhookEvent(eventData.event, eventData.payload, correlationId);

        return true;
    }

    /**
     * Internal router that maps webhook entities to their typed domain MQ events.
     * This is useful to run immediately or inside consumer background workers.
     */
    private async routeWebhookEvent(
        event: string,
        payload: Record<string, any>,
        correlationId?: string
    ): Promise<void> {
        // Extract generic details
        const entity = payload.payment?.entity || payload.order?.entity || payload.subscription?.entity || payload.refund?.entity;
        if (!entity) return;

        // Try extracting user context if stored in notes/metadata
        const userId = entity.notes?.userId || entity.notes?.user_id || '00000000-0000-0000-0000-000000000000'; // Default / Fallback UUID

        switch (event) {
            case 'order.paid':
            case 'payment.captured': {
                await paymentProducer.confirmPayment({
                    correlationId,
                    userId,
                    paymentIntentId: entity.id,
                    amount: Number(entity.amount || entity.amount_paid),
                });
                break;
            }

            case 'payment.failed': {
                await paymentProducer.failPayment({
                    correlationId,
                    userId,
                    paymentIntentId: entity.id,
                    amount: Number(entity.amount),
                    reason: entity.error_description || 'Razorpay payment transaction failure',
                });
                break;
            }

            case 'refund.processed':
            case 'refund.created': {
                await paymentProducer.refundPayment({
                    correlationId,
                    userId,
                    paymentIntentId: entity.payment_id,
                    amount: Number(entity.amount),
                });
                break;
            }

            case 'subscription.activated':
            case 'subscription.authenticated': {
                await paymentProducer.subscriptionCreated({
                    correlationId,
                    userId,
                    subscriptionId: entity.id,
                    planId: entity.plan_id,
                });
                break;
            }

            case 'subscription.charged': {
                const expiryTimestamp = entity.current_end ? Number(entity.current_end) * 1000 : Date.now();
                await paymentProducer.subscriptionRenewed({
                    correlationId,
                    userId,
                    subscriptionId: entity.id,
                    expiryDate: new Date(expiryTimestamp).toISOString(),
                });
                break;
            }

            case 'subscription.cancelled': {
                await paymentProducer.subscriptionCancelled({
                    correlationId,
                    userId,
                    subscriptionId: entity.id,
                });
                break;
            }

            case 'subscription.expired': {
                await paymentProducer.subscriptionExpired({
                    correlationId,
                    userId,
                    subscriptionId: entity.id,
                });
                break;
            }
        }
    }
}

export const paymentService = new PaymentService();
