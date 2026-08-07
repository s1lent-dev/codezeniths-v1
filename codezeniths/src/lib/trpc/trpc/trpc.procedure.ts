import { baseProcedure } from '../trpc';
import {
    loggerMiddleware,
    authMiddleware,
    adminMiddleware,
} from './trpc.middleware';

// ─── Exported Procedures ────────────────────────────────────────────────────
export const publicProcedure = baseProcedure.use(loggerMiddleware);

export const protectedProcedure = baseProcedure
    .use(loggerMiddleware)
    .use(authMiddleware);

export const adminProcedure = baseProcedure
    .use(loggerMiddleware)
    .use(adminMiddleware);
