import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@codezeniths/lib/trpc/routes/root.routes';
import { createTRPCContext } from '@codezeniths/lib/trpc/trpc/trpc.context';

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => createTRPCContext({ headers: req.headers }),
    });

export { handler as GET, handler as POST };
