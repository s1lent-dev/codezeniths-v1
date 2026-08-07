import { ZenFetch } from './zenFetch';

export * from './zenFetch';

export const zenFetch = new ZenFetch({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});
