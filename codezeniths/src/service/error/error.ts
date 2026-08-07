import { ErrorCode, HTTP_STATUS_MAP } from './error.types';

export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly metadata: Record<string, unknown>;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
        statusCode?: number,
        metadata: Record<string, unknown> = {},
        isOperational = true,
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = code;
        this.statusCode = statusCode ?? HTTP_STATUS_MAP[code] ?? 500;
        this.metadata = metadata;
        this.isOperational = isOperational;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export interface IAppErrorBuilder {
    setMessage(message: string): this;
    setCode(code: ErrorCode): this;
    setStatus(statusCode: number): this;
    setMetadata(metadata: Record<string, unknown>): this;
    setSingleMeta(key: string, value: unknown): this;
    setOperational(isOperational: boolean): this;
    setCause(error: Error): this;
    build(): AppError;
}

export class AppErrorBuilder implements IAppErrorBuilder {
    private message: string;
    private code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    private statusCode?: number;
    private metadata: Record<string, unknown> = {};
    private isOperational = true;
    private causeError?: Error;

    constructor(message: string) {
        this.message = message;
    }

    public setMessage(message: string): this {
        this.message = message;
        return this;
    }

    public setCode(code: ErrorCode): this {
        this.code = code;
        return this;
    }

    public setStatus(statusCode: number): this {
        this.statusCode = statusCode;
        return this;
    }

    public setMetadata(metadata: Record<string, unknown>): this {
        this.metadata = { ...this.metadata, ...metadata };
        return this;
    }

    public setSingleMeta(key: string, value: unknown): this {
        this.metadata[key] = value;
        return this;
    }

    public setOperational(isOperational: boolean): this {
        this.isOperational = isOperational;
        return this;
    }

    public setCause(error: Error): this {
        this.causeError = error;
        this.metadata.causeMessage = error.message;
        if (error.stack) {
            this.metadata.causeStack = error.stack;
        }
        return this;
    }

    public build(): AppError {
        const appError = new AppError(
            this.message,
            this.code,
            this.statusCode,
            this.metadata,
            this.isOperational
        );
        if (this.causeError) {
            appError.stack = `${appError.stack}\nCaused By: ${this.causeError.stack}`;
        }
        return appError;
    }
}
