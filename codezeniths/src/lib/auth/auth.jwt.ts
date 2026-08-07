import { errors as joseErrors, jwtVerify, SignJWT } from 'jose';
import type { JoseConfig, JwtPayload, TokenPair } from './auth.types';

/**
 * ─────────────────────────────────────────────────────────────
 * JOSE JWT Utilities
 * ─────────────────────────────────────────────────────────────
 * 
 * Provides secure JWT signing, verification, and rotation utilities
 * using the JOSE library. All functions are scoped to the provided
 * configuration and should be instantiated via `createJoseUtils()`.
 */

// ─── Custom Error Classes ──────────────────────────────────────────────────

/** Thrown when a JWT has expired */
export class JwtExpiredError extends Error {
    constructor() {
        super('Token has expired');
        this.name = 'JwtExpiredError';
    }
}

/** Thrown when a JWT is invalid, malformed, or has an invalid signature */
export class JwtInvalidError extends Error {
    constructor(message = 'Invalid token') {
        super(message);
        this.name = 'JwtInvalidError';
    }
}

// ─── Factory Function ──────────────────────────────────────────────────────

/**
 * Creates a set of JWT utilities configured with the provided settings.
 * 
 * This factory should be called once during auth module initialization
 * (typically inside `createAuth()`). Do not instantiate directly in
 * application code.
 * 
 * @param config - Configuration for JWT behavior (secret, expiration times)
 * @returns Object containing JWT signing, verification, and rotation methods
 */
export function createJoseUtils(config: JoseConfig) {
    const secretKey = new TextEncoder().encode(config.secret);
    const ACCESS_EXP = config.accessTokenExpiresIn ?? '15m';
    const REFRESH_EXP = config.refreshTokenExpiresIn ?? '7d';

    /**
     * Internal helper to sign any JWT payload with a given expiration.
     */
    async function sign(
        payload: Omit<JwtPayload, 'iat' | 'exp'>,
        expiresIn: string,
    ): Promise<string> {
        return new SignJWT(payload as Record<string, unknown>)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime(expiresIn)
            .sign(secretKey);
    }

    /**
     * Signs a new access token (short-lived).
     * 
     * @param payload - Core user claims (without token type or timestamps)
     */
    async function signAccessToken(
        payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>,
    ): Promise<string> {
        return sign({ ...payload, type: 'access' }, ACCESS_EXP);
    }

    /**
     * Signs a new refresh token (long-lived).
     * 
     * @param payload - Core user claims (without token type or timestamps)
     */
    async function signRefreshToken(
        payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>,
    ): Promise<string> {
        return sign({ ...payload, type: 'refresh' }, REFRESH_EXP);
    }

    /**
     * Creates a complete token pair (access + refresh) for a user.
     * 
     * @param payload - Core user claims
     * @returns Object containing both signed access and refresh tokens
     */
    async function createTokenPair(
        payload: Omit<JwtPayload, 'type' | 'iat' | 'exp'>,
    ): Promise<TokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            signAccessToken(payload),
            signRefreshToken(payload),
        ]);

        return { accessToken, refreshToken };
    }

    /**
     * Verifies a JWT and returns its typed payload.
     * 
     * @param token - The JWT string to verify
     * @returns Decoded and validated JWT payload
     * @throws {JwtExpiredError} If the token has expired
     * @throws {JwtInvalidError} If the token is invalid or malformed
     */
    async function verifyToken(token: string): Promise<JwtPayload> {
        try {
            const { payload } = await jwtVerify(token, secretKey);
            return payload as unknown as JwtPayload;
        } catch (err) {
            if (err instanceof joseErrors.JWTExpired) {
                throw new JwtExpiredError();
            }
            throw new JwtInvalidError(
                err instanceof Error ? err.message : 'JWT verification failed',
            );
        }
    }

    /**
     * Validates a refresh token and issues a fresh access + refresh token pair.
     * 
     * This implements secure token rotation: the old refresh token is verified,
     * then a new pair is issued. The caller should typically invalidate the old
     * refresh token in the database/session store after successful rotation.
     * 
     * @param oldRefreshToken - The existing refresh token to rotate
     * @returns New access and refresh token pair
     * @throws {JwtExpiredError} If the refresh token has expired
     * @throws {JwtInvalidError} If the token is invalid or not a refresh token
     */
    async function rotateRefreshToken(oldRefreshToken: string): Promise<TokenPair> {
        const payload = await verifyToken(oldRefreshToken);

        if (payload.type !== 'refresh') {
            throw new JwtInvalidError('Provided token is not a refresh token');
        }

        return createTokenPair({
            sub:      payload.sub,
            email:    payload.email,
            role:     payload.role,
            username: payload.username,
        });
    }

    return {
        signAccessToken,
        signRefreshToken,
        createTokenPair,
        verifyToken,
        rotateRefreshToken,
    };
}

/**
 * Type of the object returned by `createJoseUtils()`
 */
export type JoseUtils = ReturnType<typeof createJoseUtils>;