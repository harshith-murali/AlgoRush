import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
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
    
    // Check Clerk publicMetadata role mapped to session claims
    const role = (session.sessionClaims?.metadata as any)?.role
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