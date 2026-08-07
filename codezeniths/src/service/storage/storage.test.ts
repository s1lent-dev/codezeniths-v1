import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockClient } from 'aws-sdk-client-mock';
import { Readable } from 'stream';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { createStorageService } from './storage.service';
import { StorageNotFoundError, StorageValidationError } from './storage.types';

const s3Mock = mockClient(S3Client);

describe('Storage Service Unit Tests', () => {
    const r2Config = {
        provider: 'r2' as const,
        accountId: 'test-account-id',
        bucket: 'test-r2-bucket',
        credentials: {
            accessKeyId: 'test-r2-access-key',
            secretAccessKey: 'test-r2-secret-key',
        },
    };

    beforeEach(() => {
        s3Mock.reset();
    });

    describe('Initialization & Configuration', () => {
        it('should throw validation error if configuration is invalid', () => {
            expect(() => createStorageService({ provider: 'r2', bucket: '' } as any)).toThrow(StorageValidationError);
        });

        it('should initialize R2 provider pointing at the Cloudflare endpoint and auto region', async () => {
            const service = createStorageService(r2Config);
            const client = (service as unknown as { s3Client: S3Client }).s3Client;

            expect(await client.config.region()).toBe('auto');
            const endpoint = await client.config.endpoint?.();
            expect(endpoint?.hostname).toBe('test-account-id.r2.cloudflarestorage.com');
        });

        it('should initialize R2 provider pointing at a custom endpoint if provided', async () => {
            const customConfig = {
                ...r2Config,
                endpoint: 'https://custom-endpoint.r2.cloudflarestorage.com',
                apiToken: 'test-api-token',
            };
            const service = createStorageService(customConfig);
            const client = (service as unknown as { s3Client: S3Client }).s3Client;

            expect(await client.config.region()).toBe('auto');
            const endpoint = await client.config.endpoint?.();
            expect(endpoint?.hostname).toBe('custom-endpoint.r2.cloudflarestorage.com');
        });
    });

    describe('Upload Operations', () => {
        it('should successfully upload object and return metadata', async () => {
            s3Mock.on(PutObjectCommand).resolves({ ETag: '"upload-etag"' });

            const service = createStorageService(r2Config);
            const result = await service.upload('test-file.txt', 'hello contents', {
                contentType: 'text/plain',
                metadata: { custom: 'value' },
            });

            expect(result).toEqual({ status: 'ok', key: 'test-file.txt', etag: '"upload-etag"' });
            expect(s3Mock.calls()).toHaveLength(1);
        });

        it('should return failed status on upload errors', async () => {
            s3Mock.on(PutObjectCommand).rejects(new Error('R2 Connection Failed'));

            const service = createStorageService(r2Config);
            const result = await service.upload('test-file.txt', 'hello contents');

            expect(result.status).toBe('failed');
            if (result.status === 'failed') {
                expect(result.error.message).toContain('R2 Connection Failed');
            }
        });
    });

    describe('Download Operations', () => {
        it('should return readable stream on successful download', async () => {
            const streamMock = Readable.from(['file contents']);
            s3Mock.on(GetObjectCommand).resolves({
                Body: streamMock as any,
                ContentType: 'text/plain',
                ContentLength: 13,
            });

            const service = createStorageService(r2Config);
            const result = await service.download('test-file.txt');

            expect(result.contentType).toBe('text/plain');
            expect(result.contentLength).toBe(13);
            
            // Consume stream to verify it's the mock
            let data = '';
            for await (const chunk of result.stream) {
                data += chunk;
            }
            expect(data).toBe('file contents');
        });

        it('should throw StorageNotFoundError if object does not exist (404/NoSuchKey)', async () => {
            const noSuchKeyError = new Error('The specified key does not exist.');
            noSuchKeyError.name = 'NoSuchKey';
            s3Mock.on(GetObjectCommand).rejects(noSuchKeyError);

            const service = createStorageService(r2Config);
            await expect(service.download('missing-file.txt')).rejects.toThrow(StorageNotFoundError);
        });
    });

    describe('Exists check (HeadObject)', () => {
        it('should return true when file exists', async () => {
            s3Mock.on(HeadObjectCommand).resolves({});

            const service = createStorageService(r2Config);
            const result = await service.exists('exists-file.txt');

            expect(result).toBe(true);
        });

        it('should return false on 404/NotFound without throwing', async () => {
            const notFoundError = new Error('NotFound');
            notFoundError.name = 'NotFound';
            Object.assign(notFoundError, { $metadata: { httpStatusCode: 404 } });
            s3Mock.on(HeadObjectCommand).rejects(notFoundError);

            const service = createStorageService(r2Config);
            const result = await service.exists('missing-file.txt');

            expect(result).toBe(false);
        });
    });

    describe('Delete, Copy & List Operations', () => {
        it('should delete object and return ok status', async () => {
            s3Mock.on(DeleteObjectCommand).resolves({});

            const service = createStorageService(r2Config);
            const result = await service.delete('delete-file.txt');

            expect(result).toEqual({ status: 'ok', key: 'delete-file.txt' });
        });

        it('should copy object and return ok status', async () => {
            s3Mock.on(CopyObjectCommand).resolves({});

            const service = createStorageService(r2Config);
            const result = await service.copy('source.txt', 'dest.txt');

            expect(result).toEqual({ status: 'ok', key: 'dest.txt' });
        });

        it('should list bucket files and support continuation token pagination', async () => {
            s3Mock.on(ListObjectsV2Command).resolves({
                Contents: [
                    { Key: 'file1.txt', Size: 50, LastModified: new Date('2026-06-21T00:00:00Z'), ETag: '"e1"' },
                    { Key: 'file2.txt', Size: 100, LastModified: new Date('2026-06-21T01:00:00Z'), ETag: '"e2"' },
                ],
                NextContinuationToken: 'token-xyz',
            });

            const service = createStorageService(r2Config);
            const result = await service.list('prefix/');

            expect(result.items).toHaveLength(2);
            expect(result.items[0]).toEqual({
                key: 'file1.txt',
                size: 50,
                lastModified: new Date('2026-06-21T00:00:00Z'),
                etag: '"e1"',
            });
            expect(result.nextToken).toBe('token-xyz');
        });
    });

    describe('Presigned URLs', () => {
        it('should generate valid upload presigned URL', async () => {
            const service = createStorageService(r2Config);
            const url = await service.getPresignedUploadUrl('upload.jpg', 60, 'image/jpeg');

            expect(url).toContain('test-account-id.r2.cloudflarestorage.com');
            expect(url).toContain('test-r2-bucket');
            expect(url).toContain('/upload.jpg');
            expect(url).toContain('X-Amz-Expires=60');
        });

        it('should generate valid download presigned URL', async () => {
            const service = createStorageService(r2Config);
            const url = await service.getPresignedDownloadUrl('download.jpg', 120);

            expect(url).toContain('test-account-id.r2.cloudflarestorage.com');
            expect(url).toContain('test-r2-bucket');
            expect(url).toContain('/download.jpg');
            expect(url).toContain('X-Amz-Expires=120');
        });
    });
});
