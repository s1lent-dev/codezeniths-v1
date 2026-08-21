/**
 * @file mq.connection.ts
 * @description Single AMQP connection manager with automatic reconnection and consumer recovery.
 *
 * Design principles:
 *   - One connection, created lazily on first use.
 *   - On disconnect: wait 5 s, then reconnect and restart registered consumers.
 *   - NEVER asserts topology here — topology is asserted once in mq.bootstrap.ts.
 */

import amqp from 'amqplib';
import { ENV_CONFIG } from '@/config/config';
import { logger } from '@/service/logging';

if (process.env.NEXT_RUNTIME === 'edge') {
    throw new Error('[mq] amqplib cannot run in the Edge Runtime. Only import from Node.js runtime code.');
}

export interface IRestartableConsumer {
    restart(): Promise<void>;
}

class ConnectionManager {
    private connection: amqp.ChannelModel | null = null;
    private connecting: Promise<amqp.ChannelModel> | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private readonly consumers = new Set<IRestartableConsumer>();
    private destroyed = false;

    registerConsumer(consumer: IRestartableConsumer): void {
        this.consumers.add(consumer);
    }

    async createChannel(): Promise<amqp.Channel> {
        const conn = await this.connect();
        const ch = await conn.createChannel();
        ch.on('error', (err) => logger.error('[mq:channel] Channel error', err));
        return ch;
    }

    async createConfirmChannel(): Promise<amqp.ConfirmChannel> {
        const conn = await this.connect();
        const ch = await (conn as any).createConfirmChannel() as amqp.ConfirmChannel;
        ch.on('error', (err) => logger.error('[mq:confirm-channel] Channel error', err));
        return ch;
    }

    async connect(): Promise<amqp.ChannelModel> {
        if (this.connection) return this.connection;
        if (this.connecting) return this.connecting;

        this.connecting = this._doConnect();
        try {
            this.connection = await this.connecting;
            return this.connection;
        } finally {
            this.connecting = null;
        }
    }

    private async _doConnect(): Promise<amqp.ChannelModel> {
        logger.info(`[mq] Connecting to RabbitMQ...`);
        const conn = (await amqp.connect(ENV_CONFIG.AMQP_URL, { heartbeat: 15 } as any)) as unknown as amqp.ChannelModel;
        logger.info('[mq] Connected to RabbitMQ.');

        conn.on('error', (err) => {
            logger.error('[mq] Connection error', err);
            this._onDisconnect();
        });

        conn.on('close', () => {
            logger.warn('[mq] Connection closed.');
            this._onDisconnect();
        });

        return conn;
    }

    private _onDisconnect(): void {
        if (this.destroyed) return;
        this.connection = null;

        if (this.reconnectTimer) return;
        this.reconnectTimer = setTimeout(async () => {
            this.reconnectTimer = null;
            try {
                await this.connect();
                // Restart all registered consumers after reconnect
                for (const consumer of this.consumers) {
                    try { await consumer.restart(); } catch (err) {
                        logger.error('[mq] Failed to restart consumer after reconnect', err);
                    }
                }
            } catch (err) {
                logger.error('[mq] Reconnect attempt failed', err);
                this._onDisconnect(); // schedule another attempt
            }
        }, 5000);
    }

    async destroy(): Promise<void> {
        this.destroyed = true;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.connection) {
            try { await (this.connection as any).close(); } catch { /* ignore */ }
            this.connection = null;
        }
    }
}

export const mqConnectionManager = new ConnectionManager();
