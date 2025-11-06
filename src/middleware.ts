import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect routes that require authentication
 * Routes listed in protectedRoutes will redirect to signin if user is not authenticated
 *
 * NOTE: We cannot reliably validate sessions in middleware due to:
 * 1. Better Auth requires database access which isn't available in edge middleware
 * 2. Cookie names may vary across environments
 * 3. This is better handled client-side with useSession() hook
 *
 * This middleware only redirects from auth pages to /chat to prevent users from seeing login page after successful auth
 */

const authRoutes = ["/auth/login", "/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only redirect auth routes if user has a session cookie (basic check)
  // Real validation happens client-side with useSession()
  const hasSessionCookie =
    request.cookies.has("better-auth.session_token") ||
    request.cookies.has("__Secure-better-auth.session_token") ||
    request.cookies.get("better_auth")?.value;

  // Redirect to chat if accessing signin/signup while authenticated
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/chat", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
