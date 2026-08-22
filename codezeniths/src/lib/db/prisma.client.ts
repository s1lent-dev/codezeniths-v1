import { PrismaClient} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma = globalForPrisma.__prisma ||
    new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma;

