import { createFetch } from '@better-fetch/fetch';
import { HttpMethod } from './fetch.types';
import type { ZenFetchOptions, IZenFetchRequestBuilder } from './fetch.types';
import { AppErrorBuilder, ErrorCode, ErrorHandlerService } from '../error';
import { logger } from '../logging';


export class ZenFetch {
    public readonly client: ReturnType<typeof createFetch>;
    public readonly baseURL?: string;
    public readonly defaultHeaders?: Record<string, string>;

    constructor(options: ZenFetchOptions = {}) {
        this.baseURL = options.baseURL;
        this.defaultHeaders = options.headers;

        this.client = createFetch({
            baseURL: options.baseURL,
            headers: options.headers,
            plugins: [
                {
                    id: 'zen-fetch-logger-error-plugin',
                    name: 'ZenFetch Logger Error Plugin',
                    hooks: {
                        onRequest: async (context) => {
                            logger.debug(`API Request: [${context.method}] ${String(context.url)}`, {
                                method: context.method,
                                url: String(context.url),
                            });
                            if (options.onRequest) {
                                const modContext = await options.onRequest(context);
                                return modContext || context;
                            }
                            return context;
                        },
                        onResponse: async (context) => {
                            logger.debug(`API Response: [${context.response.status}] ${context.response.url}`, {
                                status: context.response.status,
                                url: context.response.url,
                            });
                            if (options.onResponse) {
                                const modContext = await options.onResponse(context);
                                return modContext || context;
                            }
                            return context;
                        },
                        onError: async (context) => {
                            logger.error(`API Error occurred`, context.error);
                            if (options.onError) {
                                await options.onError(context);
                            }
                        },
                    },
                },
            ],
        });
    }

    public request<TResponse, TBody = unknown>(path: string): ZenFetchRequestBuilder<TResponse, TBody> {
        return new ZenFetchRequestBuilder<TResponse, TBody>(this, path);
    }

    public get<TResponse>(path: string): ZenFetchRequestBuilder<TResponse, never> {
        return this.request<TResponse, never>(path).setMethod(HttpMethod.GET);
    }

    public post<TResponse, TBody = unknown>(path: string, body?: TBody): ZenFetchRequestBuilder<TResponse, TBody> {
        const builder = this.request<TResponse, TBody>(path).setMethod(HttpMethod.POST);
        if (body !== undefined) {
            builder.setBody(body);
        }
        return builder;
    }

    public put<TResponse, TBody = unknown>(path: string, body?: TBody): ZenFetchRequestBuilder<TResponse, TBody> {
        const builder = this.request<TResponse, TBody>(path).setMethod(HttpMethod.PUT);
        if (body !== undefined) {
            builder.setBody(body);
        }
        return builder;
    }

    public delete<TResponse>(path: string): ZenFetchRequestBuilder<TResponse, never> {
        return this.request<TResponse, never>(path).setMethod(HttpMethod.DELETE);
    }
}

export class ZenFetchRequestBuilder<TResponse, TBody> implements IZenFetchRequestBuilder<TResponse, TBody> {
    private readonly clientInstance: ZenFetch;
    private readonly path: string;
    private method: HttpMethod = HttpMethod.GET;
    private body?: TBody;
    private query?: Record<string, string | number | boolean>;
    private params?: Record<string, string | number>;
    private headers: Record<string, string> = {};
    private options: Record<string, unknown> = {};

    constructor(clientInstance: ZenFetch, path: string) {
        this.clientInstance = clientInstance;
        this.path = path;
    }

    public setMethod(method: HttpMethod): this {
        this.method = method;
        return this;
    }

    public setBody(body: TBody): this {
        this.body = body;
        return this;
    }

    public setQuery(query: Record<string, string | number | boolean>): this {
        this.query = { ...this.query, ...query };
        return this;
    }

    public setParams(params: Record<string, string | number>): this {
        this.params = { ...this.params, ...params };
        return this;
    }

    public setHeaders(headers: Record<string, string>): this {
        this.headers = { ...this.headers, ...headers };
        return this;
    }

    public setHeader(key: string, value: string): this {
        this.headers[key] = value;
        return this;
    }

    public setOptions(options: Record<string, unknown>): this {
        this.options = { ...this.options, ...options };
        return this;
    }

    public async execute(): Promise<TResponse> {
        try {
            const fetchConfig: Record<string, unknown> = {
                method: this.method,
                headers: this.headers,
                query: this.query,
                params: this.params,
                body: this.body,
                ...this.options,
            };

            const response = await this.clientInstance.client<TResponse>(
                this.path,
                fetchConfig
            );

            if (response.error) {
                const errContext = {
                    path: this.path,
                    method: this.method,
                    query: this.query,
                    params: this.params,
                    betterFetchError: response.error,
                };

                let errorObj: unknown = response.error;
                if (typeof response.error === 'object' && response.error !== null) {
                    const errorRecord = response.error as Record<string, unknown>;
                    if (typeof errorRecord.message === 'string') {
                        errorObj = new Error(errorRecord.message);
                    }
                }

                const appError = new AppErrorBuilder(`API Request to ${this.path} failed`)
                    .setCode(ErrorCode.MICROSERVICE_ERROR)
                    .setSingleMeta('requestDetails', errContext)
                    .setOperational(true);

                if (errorObj instanceof Error) {
                    appError.setCause(errorObj);
                } else {
                    appError.setSingleMeta('rawError', errorObj);
                }

                throw appError.build();
            }

            return response.data as TResponse;
        } catch (error) {
            throw ErrorHandlerService.normalize(error);
        }
    }
}
