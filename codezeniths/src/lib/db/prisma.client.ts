import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg(
        {
            connectionString,
            max: process.env.NODE_ENV === 'production' ? 20 : 10,
            idleTimeoutMillis: 20000,
            connectionTimeoutMillis: 10000,
            keepAlive: true,
            keepAliveInitialDelayMillis: 10000,
        },
        {
            onPoolError: (err) => {
                console.warn('[PrismaPg Pool Warning]:', err?.message);
            },
            onConnectionError: (err) => {
                console.warn('[PrismaPg Connection Warning]:', err?.message);
            },
        }
    );

    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
}

export const prisma = globalForPrisma.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.__prisma = prisma;
}

