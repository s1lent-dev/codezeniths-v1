import Razorpay from 'razorpay';
import crypto from 'crypto';
import { IPaymentProvider } from './payment.interface';
import { PaymentOrder, PaymentSubscription, PaymentRefund } from './payment.types';
import { ENV_CONFIG } from '../../config/config';

export class RazorpayPaymentProvider implements IPaymentProvider {
    private razorpayInstance: Razorpay;

    constructor() {
        this.razorpayInstance = new Razorpay({
            key_id: ENV_CONFIG.RAZORPAY_KEY_ID,
            key_secret: ENV_CONFIG.RAZORPAY_KEY_SECRET,
        });
    }

    async createOrder(
        amount: number,
        currency: string,
        receiptId: string,
        notes?: Record<string, string>
    ): Promise<PaymentOrder> {
        const order = await this.razorpayInstance.orders.create({
            amount,
            currency,
            receipt: receiptId,
            notes,
        });

        return {
            id: order.id,
            amount: Number(order.amount),
            currency: order.currency,
            receipt: order.receipt || '',
            status: order.status as 'created' | 'attempted' | 'paid',
            createdAt: new Date(Number(order.created_at) * 1000),
            notes: order.notes as Record<string, string> | undefined,
        };
    }

    async createSubscription(
        planId: string,
        customerEmail: string,
        quantity: number = 1,
        startAt?: number,
        notes?: Record<string, string>
    ): Promise<PaymentSubscription> {
        const payload: any = {
            plan_id: planId,
            customer_notify: 1,
            quantity,
            notes,
        };

        if (startAt) {
            payload.start_at = startAt;
        }

        const subscription = await this.razorpayInstance.subscriptions.create(payload);

        return {
            id: subscription.id,
            planId: subscription.plan_id,
            status: subscription.status as 'created' | 'authenticated' | 'active' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'expired',
            currentStart: subscription.current_start ? new Date(Number(subscription.current_start) * 1000) : new Date(),
            currentEnd: subscription.current_end ? new Date(Number(subscription.current_end) * 1000) : new Date(),
            cancelAtPeriodEnd: Boolean((subscription as any).cancel_at_cycle_end),
            notes: subscription.notes as Record<string, string> | undefined,
        };
    }

    async cancelSubscription(
        subscriptionId: string,
        cancelAtPeriodEnd: boolean
    ): Promise<void> {
        // According to SDK typings, the second parameter is cancelAtCycleEnd?: boolean | number
        await this.razorpayInstance.subscriptions.cancel(subscriptionId, cancelAtPeriodEnd);
    }

    async processRefund(
        paymentId: string,
        amount: number,
        notes?: Record<string, string>
    ): Promise<PaymentRefund> {
        // According to SDK typings, create refunds via payments.refund(paymentId, params)
        const refund = await this.razorpayInstance.payments.refund(paymentId, {
            amount,
            notes,
        });

        return {
            id: refund.id,
            paymentId: refund.payment_id,
            amount: Number(refund.amount),
            status: refund.status as 'pending' | 'processed' | 'failed',
            speed: (refund as any).speed || 'normal',
            createdAt: new Date(Number(refund.created_at) * 1000),
        };
    }

    verifyWebhook(rawBody: string, signature: string): boolean {
        try {
            const hmac = crypto.createHmac('sha256', ENV_CONFIG.RAZORPAY_WEBHOOK_SECRET);
            hmac.update(rawBody);
            const generatedSignature = hmac.digest('hex');

            return crypto.timingSafeEqual(
                Buffer.from(generatedSignature, 'utf-8'),
                Buffer.from(signature, 'utf-8')
            );
        } catch (error) {
            return false;
        }
    }
}
