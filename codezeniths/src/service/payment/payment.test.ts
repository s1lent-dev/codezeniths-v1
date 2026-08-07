import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RazorpayPaymentProvider } from './razorpay.provider';
import { PaymentService } from './payment.service';
import { paymentProducer } from '../../lib/mq/producers/payment.producer';
import crypto from 'crypto';

const { createOrderMock, createSubscriptionMock, cancelSubscriptionMock, createPaymentsRefundMock } = vi.hoisted(() => {
    return {
        createOrderMock: vi.fn().mockResolvedValue({
            id: 'ord_test123',
            amount: 50000,
            currency: 'INR',
            receipt: 'rcpt_1',
            status: 'created',
            created_at: 1719210000,
            notes: { key: 'val' },
        }),
        createSubscriptionMock: vi.fn().mockResolvedValue({
            id: 'sub_test123',
            plan_id: 'plan_gold',
            status: 'active',
            current_start: 1719210000,
            current_end: 1721802000,
            cancel_at_cycle_end: false,
            notes: {},
        }),
        cancelSubscriptionMock: vi.fn().mockResolvedValue({
            id: 'sub_test123',
            status: 'cancelled',
        }),
        createPaymentsRefundMock: vi.fn().mockResolvedValue({
            id: 'rfnd_test123',
            payment_id: 'pay_test123',
            amount: 25000,
            status: 'processed',
            speed: 'normal',
            created_at: 1719210000,
        }),
    };
});

// Mock the Razorpay SDK using the hoisted constructor mocks
vi.mock('razorpay', () => {
    const MockRazorpay = function(this: any) {
        this.orders = {
            create: createOrderMock,
        };
        this.subscriptions = {
            create: createSubscriptionMock,
            cancel: cancelSubscriptionMock,
        };
        this.payments = {
            refund: createPaymentsRefundMock,
        };
    };

    return {
        default: MockRazorpay,
    };
});

// Setup Mocking for Payment Message Queue Producer
vi.mock('../../lib/mq/producers/payment.producer', () => {
    return {
        paymentProducer: {
            ingestWebhook: vi.fn().mockResolvedValue(undefined),
            initiateCheckout: vi.fn().mockResolvedValue(undefined),
            confirmPayment: vi.fn().mockResolvedValue(undefined),
            failPayment: vi.fn().mockResolvedValue(undefined),
            retryPayment: vi.fn().mockResolvedValue(undefined),
            refundPayment: vi.fn().mockResolvedValue(undefined),
            subscriptionCreated: vi.fn().mockResolvedValue(undefined),
            subscriptionRenewed: vi.fn().mockResolvedValue(undefined),
            subscriptionCancelled: vi.fn().mockResolvedValue(undefined),
            subscriptionExpired: vi.fn().mockResolvedValue(undefined),
        },
    };
});

describe('RazorpayPaymentProvider', () => {
    let provider: RazorpayPaymentProvider;

    beforeEach(() => {
        vi.clearAllMocks();
        provider = new RazorpayPaymentProvider();
    });

    it('should create an order successfully and map output', async () => {
        const order = await provider.createOrder(50000, 'INR', 'rcpt_1', { key: 'val' });
        expect(order).toEqual({
            id: 'ord_test123',
            amount: 50000,
            currency: 'INR',
            receipt: 'rcpt_1',
            status: 'created',
            createdAt: new Date(1719210000 * 1000),
            notes: { key: 'val' },
        });
        expect(createOrderMock).toHaveBeenCalledWith({
            amount: 50000,
            currency: 'INR',
            receipt: 'rcpt_1',
            notes: { key: 'val' },
        });
    });

    it('should create a subscription successfully and map output', async () => {
        const subscription = await provider.createSubscription('plan_gold', 'test@user.com');
        expect(subscription).toEqual({
            id: 'sub_test123',
            planId: 'plan_gold',
            status: 'active',
            currentStart: new Date(1719210000 * 1000),
            currentEnd: new Date(1721802000 * 1000),
            cancelAtPeriodEnd: false,
            notes: {},
        });
        expect(createSubscriptionMock).toHaveBeenCalledWith({
            plan_id: 'plan_gold',
            customer_notify: 1,
            quantity: 1,
            notes: undefined,
        });
    });

    it('should cancel a subscription successfully', async () => {
        await expect(provider.cancelSubscription('sub_test123', true)).resolves.not.toThrow();
        expect(cancelSubscriptionMock).toHaveBeenCalledWith('sub_test123', true);
    });

    it('should create a refund successfully and map output', async () => {
        const refund = await provider.processRefund('pay_test123', 25000);
        expect(refund).toEqual({
            id: 'rfnd_test123',
            paymentId: 'pay_test123',
            amount: 25000,
            status: 'processed',
            speed: 'normal',
            createdAt: new Date(1719210000 * 1000),
        });
        expect(createPaymentsRefundMock).toHaveBeenCalledWith('pay_test123', {
            amount: 25000,
            notes: undefined,
        });
    });

    it('should verify webhook signature correctly', () => {
        const secret = 'placeholder_webhook_secret';
        const body = JSON.stringify({ event: 'test.event' });
        const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');

        const isValid = provider.verifyWebhook(body, signature);
        expect(isValid).toBe(true);

        const isInvalid = provider.verifyWebhook(body, 'invalid_sig');
        expect(isInvalid).toBe(false);
    });
});

describe('PaymentService', () => {
    let service: PaymentService;
    let provider: RazorpayPaymentProvider;

    beforeEach(() => {
        vi.clearAllMocks();
        provider = new RazorpayPaymentProvider();
        service = new PaymentService(provider);
    });

    it('should initiate checkout and publish event to MQ', async () => {
        const userId = '12345678-1234-1234-1234-123456789012';
        const order = await service.initiateCheckout(userId, 10000, 'INR', 'rcpt_99');

        expect(order.id).toBe('ord_test123');
        expect(paymentProducer.initiateCheckout).toHaveBeenCalledWith({
            correlationId: undefined,
            userId,
            amount: 50000,
            currency: 'INR',
            checkoutSessionId: 'ord_test123',
        });
    });

    it('should cancel user subscription and publish event to MQ', async () => {
        const userId = 'user_id_1';
        await service.cancelSubscription(userId, 'sub_test123', true);

        expect(paymentProducer.subscriptionCancelled).toHaveBeenCalledWith({
            correlationId: undefined,
            userId,
            subscriptionId: 'sub_test123',
        });
    });

    it('should process incoming webhook, publish raw event to MQ and route entity-specific event', async () => {
        const secret = 'placeholder_webhook_secret';
        const payload = {
            event: 'order.paid',
            account_id: 'acc_1',
            created_at: 1719210000,
            payload: {
                payment: {
                    entity: {
                        id: 'pay_xxxxxx',
                        amount: 50000,
                        notes: { userId: 'user_mock_123' },
                    },
                },
            },
        };
        const rawBody = JSON.stringify(payload);
        const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

        const result = await service.handleIncomingWebhook(rawBody, signature);
        expect(result).toBe(true);

        expect(paymentProducer.ingestWebhook).toHaveBeenCalledWith({
            correlationId: undefined,
            provider: 'razorpay',
            payload: payload.payload,
        });

        expect(paymentProducer.confirmPayment).toHaveBeenCalledWith({
            correlationId: undefined,
            userId: 'user_mock_123',
            paymentIntentId: 'pay_xxxxxx',
            amount: 50000,
        });
    });
});
