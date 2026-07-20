import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/lib/db"
import { account, session, user, verification } from "@/lib/db/schema"

const {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  BETTER_AUTH_TRUSTED_ORIGINS,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET,
  APPLE_APP_BUNDLE_IDENTIFIER,
} = process.env

// Better Auth rejects requests whose Origin isn't the baseURL or a trusted
// origin with a 403 (see origin-check middleware). When the app is served from
// a subdomain (app.topresume.me) and/or sign-in can be initiated from the
// marketing apex (topresume.me), those origins must be listed here.
// Comma-separated, e.g. "https://app.topresume.me,https://topresume.me".
const trustedOrigins = (BETTER_AUTH_TRUSTED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)

/**
 * Server-side auth instance (Better Auth) backed by our Neon/Drizzle schema.
 *
 * Social providers are only registered when their credentials are present, so
 * the app runs with email/password alone until you add the OAuth secrets.
 */
export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
  baseURL: BETTER_AUTH_URL,
  ...(trustedOrigins.length > 0 ? { trustedOrigins } : {}),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
      ? { google: { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET } }
      : {}),
    ...(APPLE_CLIENT_ID && APPLE_CLIENT_SECRET
      ? {
          apple: {
            clientId: APPLE_CLIENT_ID,
            clientSecret: APPLE_CLIENT_SECRET,
            ...(APPLE_APP_BUNDLE_IDENTIFIER ? { appBundleIdentifier: APPLE_APP_BUNDLE_IDENTIFIER } : {}),
          },
        }
      : {}),
  },
  // Keep the session cookie fresh across server actions / RSC.
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
