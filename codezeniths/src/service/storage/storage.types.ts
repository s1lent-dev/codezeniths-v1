/**
 * @file storage.types.ts
 * @description Type definitions, schemas, and custom errors for the Storage Service.
 */

import { z } from 'zod';
import { AppError } from '@/service/error/error';
import { ErrorCode } from '@/service/error/error.types';

// ==========================================
// CONFIGURATION & PAYLOAD SCHEMAS
// ==========================================

export const StorageConfigSchema = z.object({
    provider: z.literal('r2'),
    accountId: z.string().min(1, 'Cloudflare R2 Account ID is required'),
    bucket: z.string().min(1, 'Cloudflare R2 Bucket is required'),
    credentials: z.object({
        accessKeyId: z.string().min(1, 'accessKeyId is required'),
        secretAccessKey: z.string().min(1, 'secretAccessKey is required'),
    }),
    endpoint: z.string().url().optional(),
    apiToken: z.string().optional(),
});

export type StorageConfig = z.infer<typeof StorageConfigSchema>;

// ==========================================
// OPERATIONAL OPTIONS & RESULTS
// ==========================================

export interface UploadOptions {
    contentType?: string;
    metadata?: Record<string, string>;
    isPublic?: boolean;
}

export type StorageResult =
    | { status: 'ok'; key: string; etag?: string }
    | { status: 'failed'; error: Error };

export interface ListResult {
    items: Array<{
        key: string;
        size?: number;
        lastModified?: Date;
        etag?: string;
    }>;
    nextToken?: string;
}

// ==========================================
// STORAGE ERROR EXTENSIONS
// ==========================================

export class StorageError extends AppError {
    constructor(
        message: string,
        code: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
        metadata: Record<string, unknown> = {}
    ) {
        super(message, code, undefined, metadata, true);
    }
}

export class StorageValidationError extends StorageError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.VALIDATION_ERROR, metadata);
    }
}

export class StorageUploadError extends StorageError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.MICROSERVICE_ERROR, metadata);
    }
}

export class StorageNotFoundError extends StorageError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.NOT_FOUND, metadata);
    }
}

export class StorageDeleteError extends StorageError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.MICROSERVICE_ERROR, metadata);
    }
}

export class StorageListError extends StorageError {
    constructor(message: string, metadata: Record<string, unknown> = {}) {
        super(message, ErrorCode.MICROSERVICE_ERROR, metadata);
    }
}
