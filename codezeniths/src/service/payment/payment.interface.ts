import { PaymentOrder, PaymentSubscription, PaymentRefund } from './payment.types';

export interface IPaymentProvider {
    createOrder(
        amount: number,
        currency: string,
        receiptId: string,
        notes?: Record<string, string>
    ): Promise<PaymentOrder>;

    createSubscription(
        planId: string,
        customerEmail: string,
        quantity?: number,
        startAt?: number,
        notes?: Record<string, string>
    ): Promise<PaymentSubscription>;

    cancelSubscription(
        subscriptionId: string,
        cancelAtPeriodEnd: boolean
    ): Promise<void>;

    processRefund(
        paymentId: string,
        amount: number,
        notes?: Record<string, string>
    ): Promise<PaymentRefund>;

    verifyWebhook(
        rawBody: string,
        signature: string
    ): boolean;
}
