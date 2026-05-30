import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
  '/api/create-problem',
  '/api/problems(.*)',
  '/onboard(.*)',
  '/problems(.*)',
])

const isAdminRoute = createRouteMatcher([
  '/admin(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // 1. Protection for /admin routes
  if (isAdminRoute(req)) {
    const session = await auth()
    
    if (!session.userId) {
      return Response.redirect(new URL('/sign-in', req.url))
    }

    // Try to get role from session claims first (fastest)
    let role = (session.sessionClaims?.metadata as any)?.role

    // Fallback: If not present in claims (e.g. session claims not configured in Clerk JWT template),
    // fetch directly from Clerk's backend API to check active publicMetadata
    if (!role) {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = await clerkClient();
        const user = await client.users.getUser(session.userId);
        role = (user.publicMetadata as any)?.role;
      } catch (err) {
        console.error("[MIDDLEWARE_AUTH_ERROR] Failed to fetch Clerk user metadata:", err);
      }
    }

    if (role !== 'admin' && role !== 'ADMIN') {
      // Redirect unauthorized users back to home
      return Response.redirect(new URL('/', req.url))
    }
  }

  // 2. Protection for standard private routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/(.*)',
  ],
}
