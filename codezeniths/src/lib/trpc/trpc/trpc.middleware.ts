import { TRPCError } from '@trpc/server';
import { middleware } from '../trpc';
import { logger } from '@/service/logging';

// ─── Logger Middleware ──────────────────────────────────────────────────────
export const loggerMiddleware = middleware(async ({ path, type, next }) => {
    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;

    if (result.ok) {
        logger.info(`[tRPC] ${type} ${path} - OK in ${durationMs}ms`);
    } else {
        logger.error(
            `[tRPC] ${type} ${path} - FAILED in ${durationMs}ms`,
            result.error
        );
    }

    return result;
});

// ─── Auth Middleware ────────────────────────────────────────────────────────
export const authMiddleware = middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource.',
        });
    }

    return next({
        ctx: {
            user: ctx.user,
            session: ctx.session,
        },
    });
});

// ─── Admin Middleware ───────────────────────────────────────────────────────
export const adminMiddleware = middleware(({ ctx, next }) => {
    if (!ctx.user || ctx.user.role !== 'admin') {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You must be an administrator to perform this action.',
        });
    }

    return next({
        ctx: {
            user: ctx.user,
            session: ctx.session,
        },
    });
});
