import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/clerk(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	// Uncomment the following line to enable Clerk's default behavior | Redirect to sign-in page if the user is not authenticated
	// if (isProtectedRoute(req)) await auth.protect();

	// More control over authentication flow
	const { userId, redirectToSignIn } = await auth();

	if (!userId && isProtectedRoute(req)) {
		// Add custom logic to run before redirecting
		console.log(
			"User is not authenticated, redirecting to sign-in page..."
		);
		return redirectToSignIn();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
