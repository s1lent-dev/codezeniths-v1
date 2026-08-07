import { AppError } from '@/service/error/error';
import { ErrorCode } from '@/service/error/error.types';
import type { BackoffStrategy, Serializer } from './mq.types';

// Serialization
export class JsonSerializer<T> implements Serializer<T> {
    serialize(value: T): Buffer {
        return Buffer.from(JSON.stringify(value));
    }
    deserialize(raw: Buffer): T {
        return JSON.parse(raw.toString()) as T;
    }
}

export function defaultMqSerializer<T>(): Serializer<T> {
    return new JsonSerializer<T>();
}

// Errors
export class MqError extends AppError {
    constructor(
        message: string,
        code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
        metadata: Record<string, unknown> = {}
    ) {
        super(message, code, undefined, metadata, true);
    }
}

export class MqConnectionError extends MqError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.INTERNAL_SERVER_ERROR, metadata);
    }
}

export class MqValidationError extends MqError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.VALIDATION_ERROR, metadata);
    }
}

export class MqPublishError extends MqError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.INTERNAL_SERVER_ERROR, metadata);
    }
}

// Backoff strategies
export class FixedBackoffStrategy implements BackoffStrategy {
    constructor(private readonly delayMs: number = 1000) {}
    getDelay(retryCount: number): number {
        return this.delayMs;
    }
}

export class ExponentialBackoffStrategy implements BackoffStrategy {
    constructor(
        private readonly initialDelayMs: number = 1000,
        private readonly factor: number = 2,
        private readonly maxDelayMs: number = 30000,
    ) {}
    getDelay(retryCount: number): number {
        const delay = this.initialDelayMs * Math.pow(this.factor, retryCount);
        return Math.min(delay, this.maxDelayMs);
    }
}
