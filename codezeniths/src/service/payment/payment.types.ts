import { z } from 'zod';

// ── Domain Types ──

export interface PaymentOrder {
    id: string;
    amount: number;      // Amount in smallest currency unit (e.g. paise for INR, cents for USD)
    currency: string;
    receipt: string;
    status: 'created' | 'attempted' | 'paid';
    createdAt: Date;
    notes?: Record<string, string>;
}

export interface PaymentSubscription {
    id: string;
    planId: string;
    status: 'created' | 'authenticated' | 'active' | 'pending' | 'halted' | 'cancelled' | 'completed' | 'expired';
    currentStart: Date;
    currentEnd: Date;
    cancelAtPeriodEnd: boolean;
    notes?: Record<string, string>;
}

export interface PaymentRefund {
    id: string;
    paymentId: string;
    amount: number;
    status: 'pending' | 'processed' | 'failed';
    speed: 'normal' | 'optimum';
    createdAt: Date;
}

// ── Zod Validation Schemas ──

export const CreateOrderSchema = z.object({
    amount: z.number().int().positive('Amount must be a positive integer in smallest currency unit'),
    currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
    receipt: z.string().min(1, 'Receipt identifier is required'),
    notes: z.record(z.string(), z.string()).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const CreateSubscriptionSchema = z.object({
    planId: z.string().min(1, 'Plan ID is required'),
    customerEmail: z.string().email('Valid customer email is required'),
    quantity: z.number().int().positive().default(1),
    startAt: z.number().int().positive().optional(), // Unix timestamp
    notes: z.record(z.string(), z.string()).optional(),
});

export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;

export const ProcessRefundSchema = z.object({
    paymentId: z.string().min(1, 'Payment ID is required'),
    amount: z.number().int().positive('Amount must be a positive integer in smallest currency unit'),
    notes: z.record(z.string(), z.string()).optional(),
});

export type ProcessRefundInput = z.infer<typeof ProcessRefundSchema>;

// ── Webhook Schemas ──

export const RazorpayWebhookEventSchema = z.object({
    event: z.string(),
    account_id: z.string(),
    payload: z.record(z.string(), z.any()),
    created_at: z.number(),
});

export type RazorpayWebhookEvent = z.infer<typeof RazorpayWebhookEventSchema>;
