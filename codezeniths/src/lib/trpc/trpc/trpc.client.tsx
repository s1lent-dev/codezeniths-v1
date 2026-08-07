'use client';

import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '../routes/root.routes';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from './query-client';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: '/api/trpc',
            transformer: superjson,
        }),
    ],
});

let clientQueryClientSingleton: QueryClient | undefined = undefined;
export const getClientQueryClient = () => clientQueryClientSingleton;
const getQueryClient = () => {
  if (typeof window === 'undefined') {
    return createQueryClient();
  } else {
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export function TRPCReactProvider(props: { children: React.ReactNode }) {
    const [queryClient] = useState(() => getQueryClient());
    const [trpcClientClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: '/api/trpc',
                    transformer: superjson,
                }),
            ],
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <trpc.Provider client={trpcClientClient} queryClient={queryClient}>
                {props.children}
                <ReactQueryDevtools initialIsOpen={false} />
            </trpc.Provider>
        </QueryClientProvider>
    );
}
