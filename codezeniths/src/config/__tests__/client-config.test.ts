import { describe, it, expect } from 'vitest';
import { CLIENT_ENV_CONFIG, ClientEnvConfigSchema } from '../client.config';

describe('Client Environment Configuration', () => {
    it('contains strictly NEXT_PUBLIC_ keys only', () => {
        const keys = Object.keys(CLIENT_ENV_CONFIG);
        expect(keys.length).toBeGreaterThan(0);
        for (const key of keys) {
            expect(key.startsWith('NEXT_PUBLIC_')).toBe(true);
        }
    });

    it('exposes all required client-facing configuration fields', () => {
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_APP_URL');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_API_KEY');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_APP_ID');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY');
        expect(CLIENT_ENV_CONFIG).toHaveProperty('NEXT_PUBLIC_TURNSTILE_SITE_KEY');
    });

    it('does not expose any sensitive server secrets', () => {
        const configAny = CLIENT_ENV_CONFIG as Record<string, unknown>;
        const forbiddenKeys = [
            'AUTH_SECRET',
            'DATABASE_URL',
            'RESEND_API_KEY',
            'GITHUB_CLIENT_ID',
            'GITHUB_CLIENT_SECRET',
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'JWT_SECRET',
            'AMQP_HOST',
            'AMQP_PASSWORD',
            'AMQP_URL',
            'UPSTASH_REDIS_REST_URL',
            'UPSTASH_REDIS_REST_TOKEN',
            'FCM_ADMIN_TYPE',
            'FCM_ADMIN_PROJECT_ID',
            'FCM_ADMIN_PRIVATE_KEY',
            'VONAGE_API_KEY',
            'VONAGE_API_SECRET',
            'R2_SECRET_ACCESS_KEY',
            'TURNSTILE_SECRET_KEY',
            'RAZORPAY_KEY_SECRET',
            'GEMINI_API_KEY',
            'GROQ_API_KEY',
        ];

        for (const key of forbiddenKeys) {
            expect(configAny[key]).toBeUndefined();
        }
    });

    it('validates schema correctly with ClientEnvConfigSchema', () => {
        const parsed = ClientEnvConfigSchema.safeParse({
            NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
            NEXT_PUBLIC_FIREBASE_API_KEY: 'test-key',
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'test-proj',
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '1234567890',
            NEXT_PUBLIC_FIREBASE_APP_ID: '1:1234567890:web:abcdef',
            NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-123456',
            NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY: 'test-vapid',
            NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
        });

        expect(parsed.success).toBe(true);
    });

    it('fails schema validation when NEXT_PUBLIC_APP_URL is not a valid URL', () => {
        const parsed = ClientEnvConfigSchema.safeParse({
            NEXT_PUBLIC_APP_URL: 'not-a-valid-url',
            NEXT_PUBLIC_FIREBASE_API_KEY: 'test-key',
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'test-proj',
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '1234567890',
            NEXT_PUBLIC_FIREBASE_APP_ID: '1:1234567890:web:abcdef',
            NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'G-123456',
            NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
        });

        expect(parsed.success).toBe(false);
    });
});
