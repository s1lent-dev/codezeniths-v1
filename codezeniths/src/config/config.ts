import { EnvConfig, EnvConfigSchema } from './config.types';

export const ENV_CONFIG: EnvConfig = EnvConfigSchema.parse({
    // Next Environment Variables
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT ?? '3000', 10) || 3000,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    // Database Configuration
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://user:password@localhost/mydb',

    // OAuth Configuration
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || 'your-github-client-id',
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',

    // Auth Configuration
    AUTH_SECRET: process.env.AUTH_SECRET || 'your-auth-secret',
    JWT_SECRET: process.env.JWT_SECRET || 'your-jwt-secret',
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

    // AMQP Configuration
    AMQP_HOST: process.env.AMQP_HOST || '127.0.0.1',
    AMQP_PASSWORD: process.env.AMQP_PASSWORD || 'guest',
    AMQP_PORT: process.env.AMQP_PORT || '5672',
    AMQP_URL: process.env.AMQP_URL || 'amqp://127.0.0.1:5672',

    // Redis Configuration
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || undefined,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || undefined,

    // Firebase / FCM Client Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'your-firebase-api-key',
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-firebase-auth-domain',
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-firebase-project-id',
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-firebase-storage-bucket',
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'your-firebase-messaging-sender-id',
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'your-firebase-app-id',
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'your-firebase-measurement-id',
    NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY || undefined,

    // Firebase / FCM Admin Configuration
    FCM_ADMIN_TYPE: process.env.FCM_ADMIN_TYPE || 'service_account',
    FCM_ADMIN_PROJECT_ID: process.env.FCM_ADMIN_PROJECT_ID || 'your-fcm-admin-project-id',
    FCM_ADMIN_PRIVATE_KEY_ID: process.env.FCM_ADMIN_PRIVATE_KEY_ID || 'your-fcm-admin-private-key-id',
    FCM_ADMIN_PRIVATE_KEY: (process.env.FCM_ADMIN_PRIVATE_KEY || 'your-fcm-admin-private-key').replace(/\\n/g, '\n'),
    FCM_ADMIN_CLIENT_EMAIL: process.env.FCM_ADMIN_CLIENT_EMAIL || 'your-fcm-admin-client-email',
    FCM_ADMIN_CLIENT_ID: process.env.FCM_ADMIN_CLIENT_ID || 'your-fcm-admin-client-id',
    FCM_ADMIN_AUTH_URI: process.env.FCM_ADMIN_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    FCM_ADMIN_TOKEN_URI: process.env.FCM_ADMIN_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    FCM_ADMIN_AUTH_PROVIDER_X509_CERT_URL: process.env.FCM_ADMIN_AUTH_PROVIDER_X509_CERT_URL || 'https://www.googleapis.com/oauth2/v1/certs',
    FCM_ADMIN_CLIENT_X509_CERT_URL: process.env.FCM_ADMIN_CLIENT_X509_CERT_URL || 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40codezeniths-v1.iam.gserviceaccount.com',
    FCM_ADMIN_UNIVERSE_DOMAIN: process.env.FCM_ADMIN_UNIVERSE_DOMAIN || 'googleapis.com',

    // Resend / Email Configuration
    RESEND_API_KEY: process.env.RESEND_API_KEY || 're_placeholder_key_for_dev_purposes',
    RESEND_DEFAULT_FROM_EMAIL: process.env.RESEND_DEFAULT_FROM_EMAIL || 'support@codezeniths.in',
    RESEND_DEFAULT_FROM_NAME: process.env.RESEND_DEFAULT_FROM_NAME || 'CodeZeniths',
    MAIL_DRY_RUN: process.env.MAIL_DRY_RUN || 'true',

    // Vonage / SMS Configuration
    VONAGE_API_KEY: process.env.VONAGE_API_KEY || 'vonage_placeholder_key_for_dev',
    VONAGE_API_SECRET: process.env.VONAGE_API_SECRET || 'vonage_placeholder_secret_for_dev',
    VONAGE_DEFAULT_FROM_NUMBER: process.env.VONAGE_DEFAULT_FROM_NUMBER || 'CodeZeniths',
    SMS_DRY_RUN: process.env.SMS_DRY_RUN || 'true',

    // Cloudflare R2 Configuration
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID || 'r2_placeholder_account_id',
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID || 'r2_placeholder_access_key',
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY || 'r2_placeholder_secret_access_key',
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME || 'codezeniths-v1',
    R2_API_TOKEN: process.env.R2_API_TOKEN || 'r2_placeholder_api_token',
    R2_ENDPOINT: process.env.R2_ENDPOINT || 'https://storage.codezeniths.com',
    R2_PUBLIC_ENDPOINT: process.env.R2_PUBLIC_ENDPOINT || process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://storage.codezeniths.com',

    // Cloudflare Turnstile Configuration
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA', // Dummy key for testing
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',

    // Razorpay Configuration
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_id',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_placeholder_secret',
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret',

    // FCM Push Notification Configuration
    FCM_DRY_RUN: process.env.FCM_DRY_RUN || 'true',

    // AI LLM Extraction Configuration
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    GROQ_API_KEY: process.env.GROQ_API_KEY || '',
});