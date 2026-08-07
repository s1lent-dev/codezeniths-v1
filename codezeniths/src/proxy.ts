import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicRoute, isAuthRoute, isOnboardingRoute, isProtectedRoute } from '@/lib/routes';
import { betterFetch } from '@better-fetch/fetch';
import type { BetterAuthSession } from '@/lib/auth/auth.types';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Fast fail for static assets and ALL api routes to prevent deadlocks
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    try {
        // Use betterFetch as recommended by Better Auth docs for middleware
        const { data: sessionData, error } = await betterFetch<BetterAuthSession>(
            "/api/auth/get-session",
            {
                baseURL: request.nextUrl.origin,
                headers: {
                    cookie: request.headers.get("cookie") || "",
                },
            }
        );

        const session = sessionData?.session;
        const user = sessionData?.user;
        
        const isAuthenticated = !!session;
        const isOnboardingComplete = user?.isOnboardingComplete === true;

        const isAuth = isAuthRoute(pathname);
        const isOnboarding = isOnboardingRoute(pathname);
        const isPublic = isPublicRoute(pathname) || pathname === '/';
        const isProtected = isProtectedRoute(pathname);

        // 1. Unauthenticated users trying to access protected or onboarding routes
        if (!isAuthenticated && (isProtected || isOnboarding)) {
            const loginUrl = new URL('/sign-in', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // 2. Authenticated users trying to access Auth routes (Signin/Signup)
        if (isAuthenticated && isAuth) {
            // Redirect to home if profile is complete, otherwise to complete-profile
            const redirectUrl = isOnboardingComplete ? '/problemset' : '/complete-profile';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        // 3. Authenticated users with INCOMPLETE profiles trying to access Protected routes (like /problemset)
        if (isAuthenticated && !isOnboardingComplete && isProtected) {
            return NextResponse.redirect(new URL('/complete-profile', request.url));
        }

        // 4. Authenticated users with COMPLETE profiles trying to access Onboarding routes
        if (isAuthenticated && isOnboardingComplete && isOnboarding) {
            return NextResponse.redirect(new URL('/problemset', request.url));
        }

        // Fallback: allow the request to proceed
        return NextResponse.next();
    } catch (error) {
        console.error('[PROXY ERROR]', error);
        
        const isProtected = isProtectedRoute(pathname);
        const isOnboarding = isOnboardingRoute(pathname);
        
        if (isProtected || isOnboarding) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|icon.svg).*)'],
};
