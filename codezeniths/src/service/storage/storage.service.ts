/**
 * @file storage.service.ts
 * @description Storage service implementation for AWS S3 & Cloudflare R2 backends.
 * 
 * Usage Examples:
 * 
 * S3 Configuration:
 * ```typescript
 * import { createStorageService } from './storage.service';
 * 
 * const storage = createStorageService({
 *   provider: 's3',
 *   region: 'us-east-1',
 *   bucket: 'my-s3-bucket',
 *   credentials: { accessKeyId: 'KEY', secretAccessKey: 'SECRET' } // optional
 * });
 * ```
 * 
 * R2 Configuration:
 * ```typescript
 * import { createStorageService } from './storage.service';
 * 
 * const storage = createStorageService({
 *   provider: 'r2',
 *   accountId: 'my-cloudflare-account-id',
 *   bucket: 'my-r2-bucket',
 *   credentials: { accessKeyId: 'KEY', secretAccessKey: 'SECRET' } // required
 * });
 * ```
 */

import { Readable } from 'stream';
import {
    S3Client,
    S3ClientConfig,
    GetObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand,
    ListObjectsV2Command,
    CopyObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { logger } from '@/service/logging';
import { ErrorCode } from '@/service/error/error.types';
import {
    StorageConfig,
    StorageConfigSchema,
    UploadOptions,
    StorageResult,
    ListResult,
    StorageValidationError,
    StorageUploadError,
    StorageNotFoundError,
    StorageDeleteError,
    StorageListError,
    StorageError,
} from './storage.types';

// ==========================================
// SERVICE IMPLEMENTATION
// ==========================================

export class StorageService {
    private readonly s3Client: S3Client;
    private readonly config: StorageConfig;

    constructor(s3Client: S3Client, config: StorageConfig) {
        this.s3Client = s3Client;
        this.config = config;
    }

    /**
     * Uploads an object to S3 or R2 bucket using multipart streaming via lib-storage.
     */
    async upload(key: string, body: Buffer | Readable | string, options?: UploadOptions): Promise<StorageResult> {
        try {
            const uploadParams = {
                client: this.s3Client,
                params: {
                    Bucket: this.config.bucket,
                    Key: key,
                    Body: body,
                    ContentType: options?.contentType,
                    Metadata: options?.metadata,
                },
            };

            const uploadTask = new Upload(uploadParams);
            const response = await uploadTask.done();

            logger.info(`File uploaded successfully to bucket ${this.config.bucket}`, { key });
            return { status: 'ok', key: response.Key || key, etag: response.ETag };
        } catch (error: unknown) {
            logger.error(`Failed to upload file to ${key}`, error);
            const returnedError = error instanceof Error ? error : new StorageUploadError(String(error));
            return { status: 'failed', error: returnedError };
        }
    }

    /**
     * Downloads an object as a readable stream.
     * Throws StorageNotFoundError if key does not exist.
     */
    async download(key: string): Promise<{ stream: Readable; contentType?: string; contentLength?: number }> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
            });
            const response = await this.s3Client.send(command);
            if (!response.Body) {
                throw new StorageNotFoundError(`Object at key '${key}' has no body content`);
            }
            return {
                stream: response.Body as Readable,
                contentType: response.ContentType,
                contentLength: response.ContentLength,
            };
        } catch (error: unknown) {
            const err = error as Record<string, unknown> | null | undefined;
            if (err?.name === 'NoSuchKey' || err?.code === 'NoSuchKey' || err?.statusCode === 404 || (err?.$metadata as Record<string, unknown> | undefined)?.httpStatusCode === 404) {
                throw new StorageNotFoundError(`File not found: '${key}'`, { details: error });
            }
            throw new StorageError(`Failed to download file '${key}'`, ErrorCode.MICROSERVICE_ERROR, { details: error });
        }
    }

    /**
     * Deletes an object from the bucket.
     */
    async delete(key: string): Promise<StorageResult> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
            });
            await this.s3Client.send(command);
            logger.info(`Deleted file from bucket ${this.config.bucket}`, { key });
            return { status: 'ok', key };
        } catch (error: unknown) {
            logger.error(`Failed to delete file ${key}`, error);
            const returnedError = error instanceof Error ? error : new StorageDeleteError(String(error));
            return { status: 'failed', error: returnedError };
        }
    }

    /**
     * Checks if an object exists in the bucket using HeadObject.
     * Returns false on a 404 instead of throwing.
     */
    async exists(key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
            });
            await this.s3Client.send(command);
            return true;
        } catch (error: unknown) {
            const err = error as Record<string, unknown> | null | undefined;
            if (err?.name === 'NotFound' || err?.code === 'NotFound' || err?.statusCode === 404 || (err?.$metadata as Record<string, unknown> | undefined)?.httpStatusCode === 404) {
                return false;
            }
            throw new StorageError(`Error checking existence of file '${key}'`, ErrorCode.MICROSERVICE_ERROR, { details: error });
        }
    }

    /**
     * Lists bucket contents with optional prefix and pagination support.
     */
    async list(prefix?: string, continuationToken?: string): Promise<ListResult> {
        try {
            const command = new ListObjectsV2Command({
                Bucket: this.config.bucket,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            });
            const response = await this.s3Client.send(command);
            const items = (response.Contents || []).map((item) => ({
                key: item.Key || '',
                size: item.Size,
                lastModified: item.LastModified,
                etag: item.ETag,
            }));
            return {
                items,
                nextToken: response.NextContinuationToken,
            };
        } catch (error: unknown) {
            logger.error(`Failed to list bucket contents`, error, { prefix });
            throw new StorageListError(`Failed to list directory contents`, { details: error });
        }
    }

    /**
     * Copies an object to a new key within the same bucket.
     */
    async copy(sourceKey: string, destinationKey: string): Promise<StorageResult> {
        try {
            const sourcePath = encodeURI(`${this.config.bucket}/${sourceKey}`);
            const command = new CopyObjectCommand({
                Bucket: this.config.bucket,
                CopySource: sourcePath,
                Key: destinationKey,
            });
            await this.s3Client.send(command);
            logger.info(`Copied file in bucket ${this.config.bucket}`, { sourceKey, destinationKey });
            return { status: 'ok', key: destinationKey };
        } catch (error: unknown) {
            logger.error(`Failed to copy file from ${sourceKey} to ${destinationKey}`, error);
            const returnedError = error instanceof Error ? error : new StorageError(String(error));
            return { status: 'failed', error: returnedError };
        }
    }

    /**
     * Generates a presigned PUT URL for direct client-side file uploads.
     */
    async getPresignedUploadUrl(key: string, expiresInSeconds = 900, contentType?: string): Promise<string> {
        try {
            const command = new PutObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
                ContentType: contentType,
            });
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
            logger.info(`Generated presigned upload URL`, { key, expires: expiresInSeconds });
            return url;
        } catch (error: unknown) {
            logger.error(`Failed to generate presigned upload URL for ${key}`, error);
            throw new StorageError(`Presigned upload URL generation failed`, ErrorCode.MICROSERVICE_ERROR, { details: error });
        }
    }

    /**
     * Generates a presigned GET URL for file downloads.
     */
    async getPresignedDownloadUrl(key: string, expiresInSeconds = 900): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
            });
            const url = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
            logger.info(`Generated presigned download URL`, { key, expires: expiresInSeconds });
            return url;
        } catch (error: unknown) {
            logger.error(`Failed to generate presigned download URL for ${key}`, error);
            throw new StorageError(`Presigned download URL generation failed`, ErrorCode.MICROSERVICE_ERROR, { details: error });
        }
    }

    /**
     * Checks offline if a signed URL is expired or close to expiration (within 5 minutes).
     */
    isSignedUrlExpired(url: string): boolean {
        try {
            const parsedUrl = new URL(url);
            const amzDate = parsedUrl.searchParams.get('X-Amz-Date');
            const amzExpires = parsedUrl.searchParams.get('X-Amz-Expires');
            if (!amzDate || !amzExpires) {
                return true; // Missing parameters, treat as expired/unsigned
            }

            const year = parseInt(amzDate.substring(0, 4), 10);
            const month = parseInt(amzDate.substring(4, 6), 10) - 1;
            const day = parseInt(amzDate.substring(6, 8), 10);
            const hour = parseInt(amzDate.substring(9, 11), 10);
            const minute = parseInt(amzDate.substring(11, 13), 10);
            const second = parseInt(amzDate.substring(13, 15), 10);
            
            const creationTime = Date.UTC(year, month, day, hour, minute, second);
            const expiresMs = parseInt(amzExpires, 10) * 1000;
            
            // 5 minutes buffer
            const bufferMs = 5 * 60 * 1000;
            return Date.now() >= (creationTime + expiresMs - bufferMs);
        } catch {
            return true; // Invalid URL format
        }
    }

    /**
     * Extracts the object key from an S3/R2 signed URL.
     */
    extractKeyFromUrl(url: string): string {
        try {
            const parsed = new URL(url);
            let path = parsed.pathname;
            if (path.startsWith('/')) {
                path = path.substring(1);
            }
            const bucketPrefix = `${this.config.bucket}/`;
            if (path.startsWith(bucketPrefix)) {
                path = path.substring(bucketPrefix.length);
            }
            return decodeURIComponent(path);
        } catch {
            return '';
        }
    }
}

// ==========================================
// FACTORY FUNCTION
// ==========================================

/**
 * Creates and validates a configured StorageService instance.
 * Supports S3 and R2 providers seamlessly through config values.
 */
export function createStorageService(configOverride: StorageConfig): StorageService {
    const parseResult = StorageConfigSchema.safeParse(configOverride);
    if (!parseResult.success) {
        throw new StorageValidationError('Invalid storage configuration', {
            errors: parseResult.error.format(),
        });
    }

    const config = parseResult.data;
    const clientConfig: S3ClientConfig = {
        maxAttempts: 3, // SDK built-in exponential backoff retries
        endpoint: config.endpoint || `https://${config.accountId}.r2.cloudflarestorage.com`,
        region: 'auto', // R2 requirement
        credentials: {
            accessKeyId: config.credentials.accessKeyId,
            secretAccessKey: config.credentials.secretAccessKey,
        },
    };

    const s3Client = new S3Client(clientConfig);
    return new StorageService(s3Client, config);
}
