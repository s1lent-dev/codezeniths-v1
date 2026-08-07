import { PrismaClient} from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL || "postgres://359d9e6a27c9e37f3208b61d94883c60a655ceb18290dd448c8d3f22c63c2530:sk_Is4T17R6EfxwMqahr1byx@pooled.db.prisma.io:5432/postgres?sslmode=require";

const globalForPrisma = globalThis as unknown as { __prisma?: PrismaClient };

export const prisma = globalForPrisma.__prisma ||
    new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma;

