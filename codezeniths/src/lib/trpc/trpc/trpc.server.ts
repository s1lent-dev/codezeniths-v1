import { headers } from 'next/headers';
import { initTRPCInstance } from '../trpc';
import { appRouter } from '../routes/root.routes';
import { createTRPCContext } from './trpc.context';

const createCaller = initTRPCInstance.createCallerFactory(appRouter);

export const trpcServer = {
    async call() {
        const reqHeaders = await headers();
        const ctx = await createTRPCContext({ headers: reqHeaders });
        return createCaller(ctx);
    }
};
