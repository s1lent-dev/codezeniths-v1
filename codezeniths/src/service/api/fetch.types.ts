import type { RequestContext, ResponseContext, ErrorContext } from '@better-fetch/fetch';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
    HEAD = 'HEAD',
    OPTIONS = 'OPTIONS'
}

export interface ZenFetchOptions {
    baseURL?: string;
    headers?: Record<string, string>;
    onRequest?: (context: RequestContext) => Promise<RequestContext | void> | RequestContext | void;
    onResponse?: (context: ResponseContext) => Promise<ResponseContext | void> | ResponseContext | void;
    onError?: (context: ErrorContext) => Promise<void> | void;
}

export interface IZenFetchRequestBuilder<TResponse, TBody = unknown> {
    setMethod(method: HttpMethod): this;
    setBody(body: TBody): this;
    setQuery(query: Record<string, string | number | boolean>): this;
    setParams(params: Record<string, string | number>): this;
    setHeaders(headers: Record<string, string>): this;
    setHeader(key: string, value: string): this;
    setOptions(options: Record<string, unknown>): this;
    execute(): Promise<TResponse>;
}