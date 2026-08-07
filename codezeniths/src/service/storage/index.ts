import { createStorageService, StorageService } from './storage.service';
import { ENV_CONFIG } from '@/config/config';

export * from './storage.types';
export { StorageService };

export const storageService = createStorageService({
    provider: 'r2',
    accountId: ENV_CONFIG.R2_ACCOUNT_ID,
    bucket: ENV_CONFIG.R2_BUCKET_NAME,
    credentials: {
        accessKeyId: ENV_CONFIG.R2_ACCESS_KEY_ID,
        secretAccessKey: ENV_CONFIG.R2_SECRET_ACCESS_KEY,
    },
    endpoint: ENV_CONFIG.R2_ENDPOINT,
    apiToken: ENV_CONFIG.R2_API_TOKEN,
});
