import 'server-only';

import React from 'react';
import { headers } from 'next/headers';
import { cache } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { TRPCQueryOptions } from '@trpc/tanstack-react-query';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';

import { createTRPCContext, type TRPCContext } from './trpc.context';
import { appRouter } from '../routes/root.routes';
import { createQueryClient } from './query-client';
import { initTRPCInstance } from '../trpc';

/**
 * Creates the tRPC context for React Server Components (RSC) or Server Actions.
 * It reads the headers from Next.js and caches the result for the lifetime of the request.
 */
export const createContext = cache(async (): Promise<TRPCContext> => {
    const _headers = new Headers(await headers());
    _headers.set('x-trpc-source', 'rsc');

    return createTRPCContext({ headers: _headers });
});

/**
 * Create a stable getter for the query client that
 * will return the same client during the same request.
 */
export const getQueryClient = cache(createQueryClient);

/**
 * tRPC query options proxy for React Server Components, prefetching, and SSR.
 */
export const trpc = createTRPCOptionsProxy({
    router: appRouter,
    queryClient: getQueryClient,
    ctx: createContext,
});

/**
 * HydrateClient wraps its children with the HydrationBoundary.
 */
export function HydrateClient(props: { children: React.ReactNode }) {
    const dehydratedState = dehydrate(getQueryClient());

    return (
        <HydrationBoundary state={dehydratedState}>
            {props.children}
        </HydrationBoundary>
    );
}

/**
 * Prefetch helper for tRPC query options.
 */
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T,
) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === 'infinite') {
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// direct server caller wrappers (Method 2: direct caller execution)
// ─────────────────────────────────────────────────────────────────────────────

const createCaller = initTRPCInstance.createCallerFactory(appRouter);

export type ServerCaller = ReturnType<typeof createCaller>;

/**
 * Helper to obtain a cached, request-scoped tRPC caller inside Server Components or Server Actions.
 */
export const getTRPCCaller = cache(async (): Promise<ServerCaller> => {
    const ctx = await createContext();
    return createCaller(ctx);
});

/**
 * A Higher-Order Function / Wrapper that runs a callback with a request-scoped tRPC caller.
 * This is useful for executing tRPC procedures inside Next.js Server Components,
 * Server Actions, or Route Handlers without manual context instantiation.
 *
 * Example:
 * ```ts
 * const modules = await withTRPCCaller((caller) => caller.module.list({ limit: 10 }));
 * ```
 */
export async function withTRPCCaller<T>(
    callback: (caller: ServerCaller) => Promise<T>
): Promise<T> {
    const caller = await getTRPCCaller();
    return callback(caller);
}

/**
 * HOF to wrap a tRPC procedure to make it a standalone Server Action.
 *
 * Example:
 * ```ts
 * const listModulesAction = createServerAction((caller, limit: number) => caller.module.list({ limit }));
 * ```
 */
export function createServerAction<TInput, TOutput>(
    procedure: (caller: ServerCaller, input: TInput) => Promise<TOutput>
) {
    return async (input: TInput): Promise<TOutput> => {
        return withTRPCCaller((caller) => procedure(caller, input));
    };
}
