export const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/terms',
    '/privacy',
    '/verify-email',
    '/verify-phone',
    '/forgot-password',
    '/reset-password',
];

export const authRoutes = [
    '/sign-in',
    '/sign-up',
];

export const onboardingRoutes = [
    '/complete-profile',
];

/**
 * Helper to determine if a route is public.
 */
export function isPublicRoute(pathname: string): boolean {
    return publicRoutes.some(route => pathname === route);
}

/**
 * Helper to determine if a route is an auth route (login/signup etc).
 */
export function isAuthRoute(pathname: string): boolean {
    return authRoutes.some(route => pathname === route);
}

/**
 * Helper to determine if a route is an onboarding route.
 */
export function isOnboardingRoute(pathname: string): boolean {
    return onboardingRoutes.some(route => pathname === route);
}

export const protectedRoutes = [
    '/problemset',
    '/modules',
    '/tags',
    '/favourites',
    '/roadmaps',
    '/contests',
    '/playground',
    '/settings',
    '/profile',
];

/**
 * Helper to determine if a route is a protected route.
 */
export function isProtectedRoute(pathname: string): boolean {
    return protectedRoutes.some(route => pathname.startsWith(route));
}
