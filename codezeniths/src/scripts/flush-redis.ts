import 'dotenv/config';
import { Redis } from '@upstash/redis';
import { ENV_CONFIG } from '../config/config';

async function main() {
    console.log('🔄 Connecting to Upstash Redis to flush all keys...');
    const url = ENV_CONFIG.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = ENV_CONFIG.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set in environment.');
    }

    const redis = new Redis({ url, token });
    const res = await redis.flushdb();
    console.log('✅ Successfully flushed Redis database! Result:', res);
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Failed to flush Redis:', err);
    process.exit(1);
});
