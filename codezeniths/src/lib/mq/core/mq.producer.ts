import { mqConnectionManager } from './mq.connection';
import type { Serializer, PublishOptions, ConfirmChannel, MqExchange, MqRoutingKey } from '../shared/mq.types';
import { defaultMqSerializer } from '../shared/mq.utils';
import { messageRegistry } from '../shared/mq.registry';
import type { MessageRegistry, PayloadOf } from '../shared/mq.registry';

import { logger } from '@/service/logging';

export class Producer<K extends keyof MessageRegistry> {
    private readonly exchange: MqExchange;
    private readonly messageKey: K;
    private readonly routingKey: MqRoutingKey | string;
    private readonly serializer: Serializer<PayloadOf<K>>;
    private channel: ConfirmChannel | null = null;

    constructor(private readonly options: {
        exchange: MqExchange;
        messageKey: K;
        routingKey: MqRoutingKey | string;
        serializer?: Serializer<PayloadOf<K>>;
    }) {
        this.exchange = options.exchange;
        this.messageKey = options.messageKey;
        this.routingKey = options.routingKey;
        this.serializer = options.serializer ?? defaultMqSerializer<PayloadOf<K>>();
    }

    private async getChannel(): Promise<ConfirmChannel> {
        if (this.channel) return this.channel;
        this.channel = await mqConnectionManager.createConfirmChannel();
        
        this.channel.on('close', () => {
            this.channel = null;
        });
        
        this.channel.on('error', () => {
            this.channel = null;
        });
        
        return this.channel;
    }

    /**
     * Validates the payload against the registry schema, then publishes it.
     * Returns a promise resolving to true when the message is confirmed.
     */
    async publish(payload: PayloadOf<K>, options?: PublishOptions): Promise<boolean> {
        const schema = messageRegistry[this.messageKey];
        const parsed = schema.safeParse(payload);
        if (!parsed.success) {
            logger.error(`[mq:producer:${String(this.messageKey)}] Payload validation failed`, { error: parsed.error.message });
            throw new Error(`[mq:producer:${String(this.messageKey)}] Payload validation failed: ${parsed.error.message}`);
        }

        const chan = await this.getChannel();
        const typedPayload = parsed.data as PayloadOf<K>;
        const buffer = this.serializer.serialize(typedPayload);

        const publishOptions: PublishOptions = { ...options };
        if (options?.expiration !== undefined) {
            publishOptions.expiration = String(options.expiration);
        }

        return new Promise<boolean>((resolve, reject) => {
            const sent = chan.publish(
                this.exchange,
                this.routingKey,
                buffer,
                publishOptions,
                (err) => {
                    if (err) {
                        logger.error(`[mq:producer:${String(this.messageKey)}] Failed to publish message`, err);
                        reject(err);
                    } else {
                        logger.info(`[mq:producer:${String(this.messageKey)}] Published message successfully`, {
                            exchange: this.exchange,
                            routingKey: this.routingKey,
                        });
                        resolve(true);
                    }
                }
            );
            if (!sent) {
                chan.once('drain', () => {});
            }
        });
    }
}

/**
 * Helper factory function to create a new Producer.
 */
export function createProducer<K extends keyof MessageRegistry>(
    messageKey: K,
    options: {
        exchange: MqExchange;
        routingKey?: MqRoutingKey | string;
        serializer?: Serializer<PayloadOf<K>>;
    }
): Producer<K> {
    return new Producer({
        exchange: options.exchange,
        messageKey,
        routingKey: options.routingKey ?? (messageKey as string),
        serializer: options.serializer,
    });
}
