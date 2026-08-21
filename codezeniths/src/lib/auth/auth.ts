'use client';

import { createAuthClient } from 'better-auth/react';
import { usernameClient, magicLinkClient, phoneNumberClient, twoFactorClient, emailOTPClient, customSessionClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { AuthUser } from './auth.types';
import type { auth } from './auth.service';

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [
        usernameClient(),
        magicLinkClient(),
        phoneNumberClient(),
        twoFactorClient(),
        emailOTPClient(),
        customSessionClient(),
        inferAdditionalFields<typeof auth>(),
    ],
});

export function useAuth() {
    const { data, isPending, error, refetch } = authClient.useSession();
    return {
        user: data?.user,
        session:         data?.session ?? null,
        isLoading:       isPending,
        isAuthenticated: !!data?.user,
        isAdmin:         data?.user && (data.user as unknown as AuthUser).role === 'admin',
        error,
        refetch,
    };
}

/**
 * Re-syncs Better-Auth's internal session store with fresh user data from the server.
 * Call this whenever user profile, avatar, or onboarding state is mutated via tRPC.
 */
export async function refetchAuthSession() {
    return await authClient.getSession({
        query: {
            disableCookieCache: true,
        },
    });
}

export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;