import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/dashboard/admin(.*)']);
const isCityManagerRoute = createRouteMatcher(['/dashboard/city-manager(.*)']);

export default clerkMiddleware((auth, req) => {
    // Protect dashboard routes
    if (isDashboardRoute(req)) {
        auth().protect();

        // Role-based protection could go here
        // if (isAdminRoute(req) && role !== 'admin') ...
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
