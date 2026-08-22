import { describe, it, expect, vi } from 'vitest';
import { FixedBackoffStrategy, ExponentialBackoffStrategy } from './mq.utils';
import { JsonSerializer } from './mq.utils';
import { Producer } from '../core/mq.producer';
import { Consumer } from '../core/mq.consumer';
import { MqExchange, MqQueue, MqRoutingKey } from './mq.types';
import type { PayloadOf } from './mq.registry';

// Compile-time verification for type-safe payload extraction
type TestPayloadWelcome = PayloadOf<'auth.email.welcome'>;
const _compileTest: TestPayloadWelcome = { userId: 'd3b07384-d113-4956-a56e-86164749f99f', email: 'test@email.com', name: 'Test User' };

// Mock connection manager to avoid connecting to a real broker
vi.mock('../core/mq.connection', () => {
    return {
        mqConnectionManager: {
            createChannel: vi.fn().mockResolvedValue({
                prefetch: vi.fn().mockResolvedValue(undefined),
                consume: vi.fn().mockResolvedValue({ consumerTag: 'mock-tag-123' }),
                ack: vi.fn(),
                nack: vi.fn(),
                reject: vi.fn(),
                cancel: vi.fn(),
            }),
            createConfirmChannel: vi.fn().mockResolvedValue({
                publish: vi.fn().mockImplementation((ex, rk, buf, opts, cb) => {
                    if (cb) cb(null); // Success confirm
                    return true;
                }),
                waitForConfirms: vi.fn().mockResolvedValue(undefined),
                once: vi.fn(),
                on: vi.fn(),
            }),
            registerConsumer: vi.fn(),
        }
    };
});

describe('Message Queue Unit Tests', () => {
    describe('Serialization', () => {
        it('should correctly serialize and deserialize payloads using JsonSerializer', () => {
            const serializer = new JsonSerializer<{ id: number; text: string }>();
            const original = { id: 42, text: 'hello' };
            const serialized = serializer.serialize(original);
            const deserialized = serializer.deserialize(serialized);
            expect(deserialized).toEqual(original);
        });
    });

    describe('Retry Policy Backoff Calculations', () => {
        it('should compute fixed backoff correctly', () => {
            const strategy = new FixedBackoffStrategy(2500);
            expect(strategy.getDelay(1)).toBe(2500);
            expect(strategy.getDelay(5)).toBe(2500);
        });

        it('should compute exponential backoff correctly', () => {
            const strategy = new ExponentialBackoffStrategy(1000, 2, 8000);
            expect(strategy.getDelay(0)).toBe(1000);
            expect(strategy.getDelay(1)).toBe(2000);
            expect(strategy.getDelay(2)).toBe(4000);
            expect(strategy.getDelay(3)).toBe(8000);
            expect(strategy.getDelay(4)).toBe(8000); // capped at max
        });
    });

    describe('Producer & Consumer Validation', () => {
        it('producer should throw error on Zod validation failure before publishing', async () => {
            const producer = new Producer({
                exchange: MqExchange.AUTH,
                messageKey: 'auth.email.welcome',
                routingKey: MqRoutingKey.AUTH_EMAIL_WELCOME,
            });
            
            // Should throw error because email is missing
            await expect(producer.publish({ userId: 'bad-uuid', name: 'Test' } as any)).rejects.toThrow();
        });

        it('producer should succeed with valid payload', async () => {
            const producer = new Producer({
                exchange: MqExchange.AUTH,
                messageKey: 'auth.email.welcome',
                routingKey: MqRoutingKey.AUTH_EMAIL_WELCOME,
            });
            const success = await producer.publish({
                userId: 'd3b07384-d113-4956-a56e-86164749f99f',
                email: 'test@email.com',
                name: 'Test User'
            });
            expect(success).toBe(true);
        });

        it('consumer should successfully instantiate', async () => {
            const handler = vi.fn();
            const consumer = new Consumer('auth.email.welcome', handler, { queue: MqQueue.AUTH_EMAIL_WELCOME });
            expect(consumer).toBeDefined();
        });

        it('sms otp producer and consumer should be defined with proper types', async () => {
            const producer = new Producer({
                exchange: MqExchange.AUTH,
                messageKey: 'auth.sms.otp',
                routingKey: MqRoutingKey.AUTH_SMS_OTP,
            });
            const success = await producer.publish({
                userId: 'd3b07384-d113-4956-a56e-86164749f99f',
                phoneNumber: '+12064567891',
                code: '123456',
            });
            expect(success).toBe(true);

            const handler = vi.fn();
            const consumer = new Consumer('auth.sms.otp', handler, { queue: MqQueue.AUTH_SMS_OTP });
            expect(consumer).toBeDefined();
        });
    });
});
