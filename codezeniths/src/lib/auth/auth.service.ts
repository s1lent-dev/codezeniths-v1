import { createAuth } from './auth.config';
import type { AuthContext, AuthUser, BetterAuthSession } from './auth.types';
import { formatUserProfile } from '@/utils/user.formatter';

export const { auth, resolveSession, resolveSessionFromRawHeaders } = createAuth({
    secret:         process.env.AUTH_SECRET!,
    baseURL:        process.env.NEXT_PUBLIC_APP_URL!,
    db:             null, 
    trustedOrigins: process.env.AUTH_TRUSTED_ORIGINS?.split(',') ?? [],

    github: {
        clientId:     process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
        clientId:     process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24,      // roll the expiry once per day
    },
});

// ─── AuthService ───────────────────────────────────────────────────────────

export class AuthService {
    static readonly auth = auth;
    static getSession = resolveSession;
    static getSessionFromRawHeaders = resolveSessionFromRawHeaders;

    static async getContext(headers: Headers): Promise<AuthContext> {
        const raw = await resolveSession(headers);
        if (!raw || !raw.user) return { user: null, session: null };

        const rawUser = raw.user as unknown as Record<string, any>;
        const formattedUser = (await formatUserProfile(rawUser)) as Record<string, any> | null;
        if (!formattedUser) return { user: null, session: null };

        const user: AuthUser = {
            id: String(formattedUser.id),
            email: String(formattedUser.email),
            name: String(formattedUser.name),
            username: (formattedUser.username as string) || undefined,
            displayUsername: (formattedUser.displayUsername as string) || undefined,
            role: (formattedUser.role as AuthUser['role']) ?? 'user',
            emailVerified: Boolean(formattedUser.emailVerified),
            image: (formattedUser.image as string) ?? null,
            resume: (formattedUser.resume as string) ?? null,
            firstName: (formattedUser.firstName as string) ?? null,
            lastName: (formattedUser.lastName as string) ?? null,
            dob: formattedUser.dob ? new Date(formattedUser.dob as any) : null,
            about: (formattedUser.about as string) ?? null,
            location: (formattedUser.location as string) ?? null,
            isActive: (formattedUser.isActive as boolean) ?? true,
            gender: (formattedUser.gender as AuthUser['gender']) ?? null,
            isOnboardingComplete: (formattedUser.isOnboardingComplete as boolean) ?? false,
            onBoardingStep: (formattedUser.onBoardingStep as number) ?? 0,
            phoneNumber: (formattedUser.phoneNumber as string) ?? null,
            phoneNumberVerified: (formattedUser.phoneNumberVerified as boolean) ?? null,
        };

        return { user, session: raw as unknown as BetterAuthSession };
    }

    static async isAuthenticated(headers: Headers): Promise<boolean> {
        const session = await resolveSession(headers);
        return session !== null;
    }

    static async hasRole(headers: Headers, role: string): Promise<boolean> {
        const session = await resolveSession(headers);
        if (!session || !session.user) return false;
        return (session.user as unknown as AuthUser).role === role;
    }
}