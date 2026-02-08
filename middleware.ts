// TEMPORARY: Clerk middleware disabled for testing
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes (no authentication required)
// const isPublicRoute = createRouteMatcher([
//     '/',
//     '/sign-in(.*)',
//     '/sign-up(.*)',
//     '/api/webhooks(.*)'
// ]);

// Institution/Professor routes
// const isInstitutionRoute = createRouteMatcher(['/institution(.*)']);

// TEMPORARY: Allow all routes for testing
export default function middleware(req: NextRequest) {
    return NextResponse.next();
}

// Original Clerk middleware (restore after getting real keys):
// export default clerkMiddleware(async (auth, req) => {
//     const { pathname } = req.nextUrl;
//     if (isPublicRoute(req)) {
//         return NextResponse.next();
//     }
//     await auth.protect();
//     const { sessionClaims } = await auth();
//     const userRole = sessionClaims?.metadata?.role as string;
//     if (isInstitutionRoute(req) && userRole !== 'host_professor') {
//         return NextResponse.redirect(new URL('/dashboard', req.url));
//     }
// });

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
