import { NextRequest } from 'next/server';
import { createTRPCContext } from '@codezeniths/lib/trpc/trpc/trpc.context';
import { initTRPCInstance } from '@codezeniths/lib/trpc/trpc';
import { appRouter } from '@codezeniths/lib/trpc/routes/root.routes';

const createCaller = initTRPCInstance.createCallerFactory(appRouter);

/**
 * Generates a server-side tRPC caller pre-configured with context built from the incoming NextRequest.
 */
export async function getRouteCaller(req: NextRequest) {
    const ctx = await createTRPCContext({ headers: req.headers });
    return createCaller(ctx);
}
