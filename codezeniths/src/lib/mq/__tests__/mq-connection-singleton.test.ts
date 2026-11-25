import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConnectionManager, mqConnectionManager, type IRestartableConsumer } from '../core/mq.connection';

describe('AMQP ConnectionManager Singleton & Lifecycle', () => {
    const globalForMq = globalThis as unknown as { __mqConnectionManager?: ConnectionManager };

    afterEach(async () => {
        // Clean up any timers or connections
        if (globalForMq.__mqConnectionManager) {
            await globalForMq.__mqConnectionManager.destroy();
        }
    });

    describe('Singleton Preservation on globalThis', () => {
        it('should preserve mqConnectionManager on globalThis in non-production environment', () => {
            expect(globalForMq.__mqConnectionManager).toBeDefined();
            expect(globalForMq.__mqConnectionManager).toBe(mqConnectionManager);
        });

        it('should reuse existing globalThis.__mqConnectionManager on re-import in non-production', async () => {
            const customManager = new ConnectionManager();
            globalForMq.__mqConnectionManager = customManager;

            vi.resetModules();
            const reimported = await import('../core/mq.connection');

            expect(reimported.mqConnectionManager).toBe(customManager);
        });

        it('should not assign to globalThis.__mqConnectionManager if NODE_ENV is production', async () => {
            const env = process.env as Record<string, string | undefined>;
            const originalEnv = env.NODE_ENV;
            try {
                env.NODE_ENV = 'production';
                delete globalForMq.__mqConnectionManager;

                vi.resetModules();
                const reimported = await import('../core/mq.connection');

                expect(reimported.mqConnectionManager).toBeInstanceOf(reimported.ConnectionManager);
                expect(globalForMq.__mqConnectionManager).toBeUndefined();
            } finally {
                env.NODE_ENV = originalEnv;
            }
        });
    });

    describe('Consumer Management & Helper Getters', () => {
        it('should track registered consumers and report count via getConsumerCount()', () => {
            const manager = new ConnectionManager();
            expect(manager.getConsumerCount()).toBe(0);

            const consumerA: IRestartableConsumer = { restart: vi.fn().mockResolvedValue(undefined) };
            const consumerB: IRestartableConsumer = { restart: vi.fn().mockResolvedValue(undefined) };

            manager.registerConsumer(consumerA);
            expect(manager.getConsumerCount()).toBe(1);

            manager.registerConsumer(consumerB);
            expect(manager.getConsumerCount()).toBe(2);

            // Set semantics: registering the same consumer again should not duplicate
            manager.registerConsumer(consumerA);
            expect(manager.getConsumerCount()).toBe(2);
        });

        it('should report connection status via isConnected()', () => {
            const manager = new ConnectionManager();
            expect(manager.isConnected()).toBe(false);

            const mockConnection = { close: vi.fn().mockResolvedValue(undefined) } as any;
            (manager as any).connection = mockConnection;
            expect(manager.isConnected()).toBe(true);
        });
    });

    describe('Safe Destruction & Resource Cleanup', () => {
        it('should cancel active reconnectTimer upon destroy()', async () => {
            const manager = new ConnectionManager();
            const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

            // Simulate active reconnect timer
            const dummyTimer = setTimeout(() => {}, 10000);
            (manager as any).reconnectTimer = dummyTimer;

            await manager.destroy();

            expect(clearTimeoutSpy).toHaveBeenCalledWith(dummyTimer);
            expect((manager as any).reconnectTimer).toBeNull();
            clearTimeoutSpy.mockRestore();
        });

        it('should close open AMQP connection and nullify upon destroy()', async () => {
            const manager = new ConnectionManager();
            const mockClose = vi.fn().mockResolvedValue(undefined);
            (manager as any).connection = { close: mockClose };

            expect(manager.isConnected()).toBe(true);
            await manager.destroy();

            expect(mockClose).toHaveBeenCalledTimes(1);
            expect((manager as any).connection).toBeNull();
            expect(manager.isConnected()).toBe(false);
        });

        it('should safely swallow error if connection.close() rejects during destroy()', async () => {
            const manager = new ConnectionManager();
            const mockClose = vi.fn().mockRejectedValue(new Error('Connection already closed'));
            (manager as any).connection = { close: mockClose };

            await expect(manager.destroy()).resolves.toBeUndefined();
            expect((manager as any).connection).toBeNull();
            expect(manager.isConnected()).toBe(false);
        });

        it('should clear all consumers upon destroy()', async () => {
            const manager = new ConnectionManager();
            manager.registerConsumer({ restart: vi.fn() });
            manager.registerConsumer({ restart: vi.fn() });
            expect(manager.getConsumerCount()).toBe(2);

            await manager.destroy();
            expect(manager.getConsumerCount()).toBe(0);
        });

        it('should set destroyed flag to true upon destroy()', async () => {
            const manager = new ConnectionManager();
            expect((manager as any).destroyed).toBe(false);

            await manager.destroy();
            expect((manager as any).destroyed).toBe(true);
            if (typeof (manager as any).isDestroyed === 'function') {
                expect((manager as any).isDestroyed()).toBe(true);
            }
        });
    });
});
