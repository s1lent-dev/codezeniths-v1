import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthRoute, isOnboardingRoute, isProtectedRoute } from '@/lib/routes';
import { getSessionCookie } from 'better-auth/cookies';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Fast-pass static assets & API routes to prevent deadlocks and unnecessary overhead
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/static') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    try {
        // 2. High-performance, zero-network edge check for session token existence
        const sessionCookie = getSessionCookie(request);
        const isAuthenticated = Boolean(sessionCookie);

        const isAuth = isAuthRoute(pathname);
        const isProtected = isProtectedRoute(pathname);
        const isOnboarding = isOnboardingRoute(pathname);

        // 3. Unauthenticated users trying to access protected or onboarding routes
        if (!isAuthenticated && (isProtected || isOnboarding)) {
            const loginUrl = new URL('/sign-in', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // 4. Authenticated users trying to access auth pages (/sign-in, /sign-up)
        if (isAuthenticated && isAuth) {
            return NextResponse.redirect(new URL('/explore', request.url));
        }

        // 5. Fallback: allow request to proceed cleanly
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
