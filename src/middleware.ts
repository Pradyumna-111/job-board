import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/profile(.*)', '/onboarding(.*)', '/recruiter(.*)', '/admin(.*)', '/applications(.*)'])

export default clerkMiddleware(async (auth, req) => {
    const { userId, sessionClaims } = await auth();

    if (isProtectedRoute(req)) {
        if (!userId) {
            return (await auth()).redirectToSignIn();
        }

        const role = (sessionClaims?.metadata as { role?: string })?.role;

        // Force onboarding if role is missing
        if (!role && req.nextUrl.pathname !== '/onboarding' && !req.nextUrl.pathname.startsWith('/api/user/role')) {
            return NextResponse.redirect(new URL('/onboarding', req.url));
        }

        // Redirect from onboarding if role already exists
        if (role && req.nextUrl.pathname === '/onboarding') {
            return NextResponse.redirect(new URL(role === 'recruiter' ? '/recruiter/dashboard' : '/dashboard', req.url));
        }

        // Role-based access control
        if (req.nextUrl.pathname.startsWith('/recruiter') && role !== 'recruiter' && role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }

        if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
