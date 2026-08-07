import { z } from 'zod';

/**
 * ─────────────────────────────────────────────────────────────
 * Authentication Schemas & Types
 * ─────────────────────────────────────────────────────────────
 * 
 * This file contains all Zod validation schemas, TypeScript interfaces,
 * and type definitions used across the authentication system.
 */

// ─── Primitive Schemas ─────────────────────────────────────────────────────

/** Base schema for email validation */
const emailSchema = z
    .email('Invalid email address');

/** Base schema for password validation */
const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters');

/** Base schema for username validation */
const usernameSchema = z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
        /^[a-zA-Z0-9_.-]+$/,
        'Username may only contain letters, numbers, underscores, dots and hyphens',
    );

/** Base schema for full name validation */
const nameSchema = z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters');

/** Supported OAuth providers */
const oAuthProviderSchema = z.enum(['github', 'google']);

export {
    emailSchema,
    passwordSchema,
    usernameSchema,
    nameSchema,
    oAuthProviderSchema,
};

// ─── Interfaces & Types ───────────────────────────────────────────────────

/** Complete configuration options for custom Auth instantiation */
export interface AuthConfig {
    secret: string;
    baseURL: string;
    db?: any;
    trustedOrigins?: string[];
    github?: {
        clientId: string;
        clientSecret: string;
    };
    google?: {
        clientId: string;
        clientSecret: string;
    };
    session?: {
        expiresIn?: number;
        updateAge?: number;
    };
    jose?: JoseConfig;
}

/** Fully typed application user object */
export interface AuthUser {
    id: string;
    email: string;
    name: string;
    username?: string;
    displayUsername?: string;
    role: 'user' | 'admin' | string;
    emailVerified: boolean;
    image?: string | null;
    resume?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    dob?: Date | null;
    about?: string | null;
    location?: string | null;
    isActive: boolean;
    gender?: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say' | string | null;
    isOnboardingComplete: boolean;
    onBoardingStep: number;
    phoneNumber?: string | null;
    phoneNumberVerified?: boolean | null;
}

/** Shape of the raw session data returned from Better Auth */
export interface BetterAuthSession {
    session: {
        id: string;
        userId: string;
        expiresAt: Date;
        token: string;
        createdAt: Date;
        updatedAt: Date;
        ipAddress?: string | null;
        userAgent?: string | null;
    };
    user: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;
        image?: string | null;
        resume?: string | null;
        createdAt: Date;
        updatedAt: Date;
        role?: 'user' | 'admin' | string;
        username?: string | null;
        displayUsername?: string | null;
        firstName?: string | null;
        lastName?: string | null;
        dob?: Date | string | null;
        about?: string | null;
        location?: string | null;
        isActive?: boolean;
        gender?: string | null;
        isOnboardingComplete?: boolean;
        onBoardingStep?: number;
        phoneNumber?: string | null;
        phoneNumberVerified?: boolean | null;
    };
}

/** The standard authentication context mapping user and session */
export interface AuthContext {
    user: AuthUser | null;
    session: BetterAuthSession | null;
}


// ─── JWT Related Types ─────────────────────────────────────────────────────

/** Configuration options for JOSE JWT handling */
export interface JoseConfig {
    secret:                string;
    accessTokenExpiresIn?: string;
    refreshTokenExpiresIn?: string;
}

/** Payload structure for JOSE-signed JWTs */
export interface JwtPayload {
    sub:      string;
    email:    string;
    role:     'user' | 'admin';
    username?: string;
    type:     'access' | 'refresh';
    iat:      number;
    exp:      number;
}

/** Pair of access + refresh tokens */
export interface TokenPair {
    accessToken:  string;
    refreshToken: string;
}