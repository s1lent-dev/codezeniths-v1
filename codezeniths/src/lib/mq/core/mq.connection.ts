import amqp from 'amqplib';
import { ENV_CONFIG } from '@/config/config';
import { logger } from '@/service/logging';

if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error(
        '[mq] This module uses TCP sockets via amqplib and cannot run in the Edge Runtime. ' +
        'Only import it from Node.js runtime code.',
    );
}

export class ConnectionManager {
    private connection: amqp.ChannelModel | null = null;
    private connectingPromise: Promise<amqp.ChannelModel> | null = null;
    private readonly channels: Set<amqp.Channel> = new Set();
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private inFlightCount = 0;
    private readonly activeConsumerTags: Map<amqp.Channel, Set<string>> = new Map();

    constructor() {
        this.setupShutdownHooks();
    }

    /**
     * Establishes a connection to the AMQP broker. Resolves to the active connection.
     */
    async connect(): Promise<amqp.ChannelModel> {
        if (this.connection) return this.connection;
        if (this.connectingPromise) return this.connectingPromise;

        this.connectingPromise = (async () => {
            try {
                logger.info(`[mq] Connecting to RabbitMQ at ${ENV_CONFIG.AMQP_URL}...`);
                const conn = await amqp.connect(ENV_CONFIG.AMQP_URL);
                this.connection = conn;
                this.connectingPromise = null;
                logger.info('[mq] Connected to RabbitMQ successfully.');

                // Assert topology on connect to ensure all exchanges/queues exist
                void (async () => {
                    try {
                        const { buildCodeZenithsTopology } = await import('./mq.topology');
                        const tempChannel = await conn.createChannel();
                        const builder = buildCodeZenithsTopology();
                        await builder.assert(tempChannel);
                        await tempChannel.close();
                        logger.info('[mq] RabbitMQ topology asserted successfully.');
                    } catch (err) {
                        logger.error('[mq] Failed to assert topology on connection', err);
                    }
                })();

                conn.on('error', (err: Error) => {
                    logger.error('[mq] Connection error', err);
                    void this.handleDisconnect();
                });

                conn.on('close', () => {
                    logger.warn('[mq] Connection closed.');
                    void this.handleDisconnect();
                });

                return conn;
            } catch (error) {
                this.connectingPromise = null;
                void this.handleDisconnect();
                throw error;
            }
        })();

        return this.connectingPromise;
    }

    private async handleDisconnect() {
        this.connection = null;
        this.channels.clear();
        this.activeConsumerTags.clear();

        if (!this.reconnectTimeout) {
            this.reconnectTimeout = setTimeout(() => {
                this.reconnectTimeout = null;
                void this.connect().catch(() => {});
            }, 5000);
        }
    }

    /**
     * Creates a standard AMQP channel.
     */
    async createChannel(): Promise<amqp.Channel> {
        const conn = await this.connect();
        const channel = await conn.createChannel();
        this.channels.add(channel);
        channel.on('close', () => {
            this.channels.delete(channel);
            this.activeConsumerTags.delete(channel);
        });
        return channel;
    }

    /**
     * Creates a confirm channel supporting publisher confirmations.
     */
    async createConfirmChannel(): Promise<amqp.ConfirmChannel> {
        const conn = await this.connect();
        const channel = await conn.createConfirmChannel();
        this.channels.add(channel);
        channel.on('close', () => {
            this.channels.delete(channel);
            this.activeConsumerTags.delete(channel);
        });
        return channel;
    }

    registerConsumerTag(channel: amqp.Channel, consumerTag: string) {
        let tags = this.activeConsumerTags.get(channel);
        if (!tags) {
            tags = new Set();
            this.activeConsumerTags.set(channel, tags);
        }
        tags.add(consumerTag);
    }

    deregisterConsumerTag(channel: amqp.Channel, consumerTag: string) {
        const tags = this.activeConsumerTags.get(channel);
        if (tags) {
            tags.delete(consumerTag);
        }
    }

    incrementInFlight() {
        this.inFlightCount++;
    }

    decrementInFlight() {
        this.inFlightCount = Math.max(0, this.inFlightCount - 1);
    }

    /**
     * Performs a graceful shutdown of all active channels and connection.
     */
    async close(): Promise<void> {
        logger.info('[mq] Starting connection shutdown...');

        // 1. Cancel all active consumers
        for (const [channel, tags] of this.activeConsumerTags.entries()) {
            for (const tag of tags) {
                try {
                    await channel.cancel(tag);
                } catch (err) {
                    // ignore
                }
            }
        }
        this.activeConsumerTags.clear();

        // 2. Wait for in-flight messages to drain
        if (this.inFlightCount > 0) {
            logger.info(`[mq] Waiting for ${this.inFlightCount} in-flight messages to process...`);
            await new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (this.inFlightCount === 0) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
        }

        // 3. Close channels
        for (const channel of this.channels) {
            try {
                await channel.close();
            } catch (err) {
                // ignore channel close errors during shutdown
            }
        }
        this.channels.clear();

        // 4. Close connection
        if (this.connection) {
            try {
                await this.connection.close();
            } catch (err) {
                // ignore connection close errors during shutdown
            }
            this.connection = null;
        }
        logger.info('[mq] MQ client shut down gracefully.');
    }

    private setupShutdownHooks() {
        const shutdown = async () => {
            await this.close();
            process.exit(0);
        };
        process.once('SIGTERM', () => void shutdown());
        process.once('SIGINT', () => void shutdown());
    }
}

const globalForMq = globalThis as unknown as { __mqConnectionManager?: ConnectionManager };
export const mqConnectionManager = globalForMq.__mqConnectionManager ?? new ConnectionManager();

if (process.env.NODE_ENV !== 'production') {
    globalForMq.__mqConnectionManager = mqConnectionManager;
}
