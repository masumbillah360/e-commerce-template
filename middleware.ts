import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define protected routes
    const isAdminRoute = pathname.startsWith('/admin');
    const isCheckoutRoute = pathname.startsWith('/checkout');

    // 2. Read session from cookies (Optimization: minimal verify, not full DB fetch if possible)
    // Better Auth stores session token in a cookie.
    // For robust checking, we usually need to fetch session, but for middleware speed
    // we often check existence first, then verify role on server component.

    // However, for Admin, we MUST verify security.
    // Since middleware runs on Edge, direct DB access is tricky.
    // STRATEGY: We allow the request to proceed to the Server Component,
    // where we do the actual DB role check. Middleware is just for redirection convenience here.

    // Let's implement a simple fetch to our own API to check session if needed,
    // OR rely on Server Components for the hard security (Recommended for Next.js).

    // For now, standard Next.js Middleware logic:
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
