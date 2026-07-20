"use client"

import { createAuthClient } from "better-auth/react"

/**
 * Browser-side auth client. `baseURL` is inferred from the current origin, so
 * no env var is required here. Exposes hooks/methods like `useSession`,
 * `signIn`, `signUp`, and `signOut`.
 */
export const authClient = createAuthClient()

export const { useSession, signIn, signUp, signOut } = authClient
