import { mqConnectionManager } from './mq.connection';
import type {
    Serializer,
    MessageContext,
    BackoffStrategy,
    ConsumerMiddleware,
    Channel,
    Message,
    MqQueue
} from '../shared/mq.types';
import { defaultMqSerializer, ExponentialBackoffStrategy } from '../shared/mq.utils';
import { logger } from '@/service/logging';
import { composeMiddlewares, withLogging, withValidation, withRetry } from './mq.middleware';
import type { MessageRegistry, PayloadOf } from '../shared/mq.registry';

export interface ConsumerOptions<K extends keyof MessageRegistry> {
    queue: MqQueue;
    prefetch?: number;
    autoAck?: boolean;
    serializer?: Serializer<PayloadOf<K>>;
    backoffStrategy?: BackoffStrategy;
    maxRetries?: number;
    middlewares?: Array<ConsumerMiddleware<PayloadOf<K>>>;
}

export class Consumer<K extends keyof MessageRegistry> {
    private readonly queue: MqQueue;
    private readonly messageKey: K;
    private readonly prefetch: number;
    private readonly autoAck: boolean;
    private readonly serializer: Serializer<PayloadOf<K>>;
    private readonly backoffStrategy: BackoffStrategy;
    private readonly maxRetries: number;
    private readonly middlewares: Array<ConsumerMiddleware<PayloadOf<K>>>;
    private readonly handler: (payload: PayloadOf<K>, context: MessageContext) => Promise<void> | void;
    private channel: Channel | null = null;
    private consumerTag: string | null = null;

    constructor(
        messageKey: K,
        handler: (payload: PayloadOf<K>, context: MessageContext) => Promise<void> | void,
        options: ConsumerOptions<K>
    ) {
        this.messageKey = messageKey;
        this.queue = options.queue;
        this.prefetch = options.prefetch ?? 10;
        this.autoAck = options.autoAck ?? false;
        this.serializer = options.serializer ?? defaultMqSerializer<PayloadOf<K>>();
        this.backoffStrategy = options.backoffStrategy ?? new ExponentialBackoffStrategy(1000, 2, 30000);
        this.maxRetries = options.maxRetries ?? 3;
        this.handler = handler;
        
        this.middlewares = options.middlewares ?? [
            withLogging<PayloadOf<K>>(this.queue),
            withRetry<PayloadOf<K>>(this.queue, this.backoffStrategy, this.maxRetries),
            withValidation<K>(this.messageKey)
        ];
    }

    /**
     * Starts consuming messages from the configured queue.
     */
    async start(): Promise<string> {
        if (this.channel) return this.consumerTag!;

        const chan = await mqConnectionManager.createChannel();
        this.channel = chan;
        await chan.prefetch(this.prefetch);

        logger.info(`[mq:consumer:${this.queue}] Starting consumer for messageKey=${String(this.messageKey)} prefetch=${this.prefetch}...`);

        const composedHandler = composeMiddlewares(this.middlewares, this.handler);

        const consumeResult = await chan.consume(this.queue, async (msg: Message | null) => {
            if (!msg) {
                logger.warn(`[mq:consumer:${this.queue}] Consumer cancelled by broker.`);
                return;
            }

            mqConnectionManager.incrementInFlight();

            let settled = false;
            const context: MessageContext = {
                fields: msg.fields,
                properties: {
                    ...msg.properties,
                    headers: msg.properties.headers ?? {},
                },
                ack: () => {
                    if (!settled) {
                        try {
                            chan.ack(msg);
                        } catch (err) {
                            logger.error(`[mq:consumer:${this.queue}] Failed to ack message`, err);
                        } finally {
                            settled = true;
                            mqConnectionManager.decrementInFlight();
                        }
                    }
                },
                nack: (requeue = false) => {
                    if (!settled) {
                        try {
                            chan.nack(msg, false, requeue);
                        } catch (err) {
                            logger.error(`[mq:consumer:${this.queue}] Failed to nack message`, err);
                        } finally {
                            settled = true;
                            mqConnectionManager.decrementInFlight();
                        }
                    }
                },
                reject: (requeue = false) => {
                    if (!settled) {
                        try {
                            chan.reject(msg, requeue);
                        } catch (err) {
                            logger.error(`[mq:consumer:${this.queue}] Failed to reject message`, err);
                        } finally {
                            settled = true;
                            mqConnectionManager.decrementInFlight();
                        }
                    }
                },
            };

            let payload: PayloadOf<K>;
            try {
                payload = this.serializer.deserialize(msg.content);
            } catch (err) {
                logger.error(`[mq:consumer:${this.queue}] Payload deserialization failed. Rejecting message.`, err);
                context.reject(false);
                return;
            }

            try {
                await composedHandler(payload, context);
                
                if (this.autoAck && !settled) {
                    context.ack();
                }
            } catch (err) {
                logger.error(`[mq:consumer:${this.queue}] Uncaught exception in middleware chain. Rejecting message.`, err);
                if (!settled) {
                    context.reject(false);
                }
            }
        });

        this.consumerTag = consumeResult.consumerTag;
        mqConnectionManager.registerConsumerTag(chan, this.consumerTag);
        return this.consumerTag;
    }

    /**
     * Stops the consumer by cancelling consumption on the channel.
     */
    async stop(): Promise<void> {
        if (!this.channel || !this.consumerTag) return;
        try {
            await this.channel.cancel(this.consumerTag);
            mqConnectionManager.deregisterConsumerTag(this.channel, this.consumerTag);
        } catch (err) {
            logger.error(`[mq:consumer:${this.queue}] Error during stop cancel`, err);
        } finally {
            this.channel = null;
            this.consumerTag = null;
        }
    }
}

/**
 * Helper factory function to create a new Consumer.
 */
export function createConsumer<K extends keyof MessageRegistry>(
    messageKey: K,
    handler: (payload: PayloadOf<K>, context: MessageContext) => Promise<void> | void,
    options: ConsumerOptions<K>
): Consumer<K> {
    return new Consumer(messageKey, handler, options);
}
