import { getSessionCookie } from "better-auth/cookies"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js 16 renames Middleware to Proxy. This runs an *optimistic* auth check
 * (cookie presence only, no DB call) to keep the base route behind sign-up.
 * Full session validation still happens server-side in the auth handlers.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-up", request.url))
  }
  return NextResponse.next()
}

export const config = {
  // Only guard the base URL for now.
  matcher: ["/"],
}
