import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import type { TRPCContext } from './trpc/trpc.context';

const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

export const createTRPCRouter = t.router;
export const middleware = t.middleware;
export const baseProcedure = t.procedure;
export const initTRPCInstance = t;
