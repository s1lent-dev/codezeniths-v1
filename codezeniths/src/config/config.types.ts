import { z } from 'zod';

export const EnvConfigSchema = z.object({

    // Next Environment Variables
    NODE_ENV: z.string(),
    PORT: z.number(),
    NEXT_PUBLIC_APP_URL: z.url(),

    // Database Configuration
    DATABASE_URL: z.url(),

    // OAuth Configuration
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    
    // Auth Configuration
    AUTH_SECRET: z.string(),
    JWT_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string(),
    JWT_REFRESH_EXPIRES_IN: z.string(),

    // AMQP Configuration
    AMQP_HOST: z.string(),
    AMQP_PASSWORD: z.string(),
    AMQP_PORT: z.string(),
    AMQP_URL: z.url(),
    
    // Redis Configuration
    UPSTASH_REDIS_REST_URL: z.url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // Firebase / FCM Client Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY: z.string().optional(),

    // Firebase / FCM Admin Configuration
    FCM_ADMIN_TYPE: z.string(),
    FCM_ADMIN_PROJECT_ID: z.string(),
    FCM_ADMIN_PRIVATE_KEY_ID: z.string(),
    FCM_ADMIN_PRIVATE_KEY: z.string(),
    FCM_ADMIN_CLIENT_EMAIL: z.string(),
    FCM_ADMIN_CLIENT_ID: z.string(),
    FCM_ADMIN_AUTH_URI: z.string().optional(),
    FCM_ADMIN_TOKEN_URI: z.string().optional(),
    FCM_ADMIN_AUTH_PROVIDER_X509_CERT_URL: z.string().optional(),
    FCM_ADMIN_CLIENT_X509_CERT_URL: z.string().optional(),
    FCM_ADMIN_UNIVERSE_DOMAIN: z.string().optional(),

    // Resend / Email Configuration
    RESEND_API_KEY: z.string(),
    RESEND_DEFAULT_FROM_EMAIL: z.string().email(),
    RESEND_DEFAULT_FROM_NAME: z.string().optional(),
    MAIL_DRY_RUN: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),

    // Vonage / SMS Configuration
    VONAGE_API_KEY: z.string(),
    VONAGE_API_SECRET: z.string(),
    VONAGE_DEFAULT_FROM_NUMBER: z.string().optional(),
    SMS_DRY_RUN: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),

    // Cloudflare R2 Configuration
    R2_ACCOUNT_ID: z.string(),
    R2_ACCESS_KEY_ID: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_BUCKET_NAME: z.string(),
    R2_API_TOKEN: z.string().optional(),
    R2_ENDPOINT: z.string().url().optional(),

    // Cloudflare Turnstile Configuration
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string(),
    TURNSTILE_SECRET_KEY: z.string(),

    // Razorpay Configuration
    RAZORPAY_KEY_ID: z.string(),
    RAZORPAY_KEY_SECRET: z.string(),
    RAZORPAY_WEBHOOK_SECRET: z.string(),

    // FCM Push Notification Configuration
    FCM_DRY_RUN: z.preprocess((val) => val === 'true' || val === true, z.boolean()).default(false),

    // AI LLM Extraction Configuration
    GEMINI_API_KEY: z.string().optional(),
    GROQ_API_KEY: z.string().optional(),
})

export type EnvConfig = z.infer<typeof EnvConfigSchema>;