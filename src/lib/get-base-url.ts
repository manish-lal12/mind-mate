/**
 * Get the base URL for the application
 * - In development: uses localhost:3000
 * - On Vercel: uses VERCEL_URL
 * - In production: uses NEXT_PUBLIC_APP_URL env var or constructs from headers
 */
export function getBaseURL(): string {
  // Server-side
  if (typeof window === "undefined") {
    // Vercel deployment
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    // Production with custom domain
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    // Local development
    return `http://localhost:${process.env.PORT ?? 3000}`;
  }

  // Client-side: construct from window location
  return window.location.origin;
}
