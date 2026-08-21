import { mqConnectionManager, type IRestartableConsumer } from './mq.connection';
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

export class Consumer<K extends keyof MessageRegistry> implements IRestartableConsumer {
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
    private isRunning = false;

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

        // Register in connection manager so it can be resumed on reconnection
        mqConnectionManager.registerConsumer(this);
    }

    /**
     * Starts consuming messages from the configured queue.
     */
    async start(): Promise<string> {
        if (this.channel && this.consumerTag) {
            return this.consumerTag;
        }

        try {
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

                let settled = false;
                const context: MessageContext = {
                    fields: msg.fields,
                    properties: {
                        ...msg.properties,
                        headers: msg.properties.headers ?? {},
                    },
                    ack: () => {
                        if (!settled) {
                            settled = true;
                            try { chan.ack(msg); } catch (err) {
                                logger.error(`[mq:consumer:${this.queue}] Failed to ack message`, err);
                            }
                        }
                    },
                    nack: (requeue = false) => {
                        if (!settled) {
                            settled = true;
                            try { chan.nack(msg, false, requeue); } catch (err) {
                                logger.error(`[mq:consumer:${this.queue}] Failed to nack message`, err);
                            }
                        }
                    },
                    reject: (requeue = false) => {
                        if (!settled) {
                            settled = true;
                            try { chan.reject(msg, requeue); } catch (err) {
                                logger.error(`[mq:consumer:${this.queue}] Failed to reject message`, err);
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
                    logger.error(`[mq:consumer:${this.queue}] Uncaught error in handler. Rejecting message.`, err);
                    if (!settled) context.reject(false);
                }
            });

            this.consumerTag = consumeResult.consumerTag;
            this.isRunning = true;
            return this.consumerTag;
        } catch (error) {
            logger.error(`[mq:consumer:${this.queue}] Failed to start consumer`, error);
            this.channel = null;
            this.consumerTag = null;
            this.isRunning = false;
            throw error;
        }
    }

    async restart(): Promise<void> {
        if (!this.isRunning) return;
        this.channel = null;
        this.consumerTag = null;
        try {
            await this.start();
        } catch (err) {
            logger.error(`[mq:consumer:${this.queue}] Failed to restart after reconnect`, err);
        }
    }

    async stop(): Promise<void> {
        this.isRunning = false;
        if (!this.channel || !this.consumerTag) return;
        try {
            await this.channel.cancel(this.consumerTag);
        } catch (err) {
            logger.error(`[mq:consumer:${this.queue}] Error during stop`, err);
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
