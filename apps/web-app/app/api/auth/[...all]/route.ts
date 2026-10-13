import { toNextJsHandler } from "better-auth/next-js"

import { auth } from "@/lib/auth"

// Better Auth mounts all its endpoints (sign-in, sign-up, callbacks, session,
// sign-out, ...) under this catch-all route.
export const { GET, POST } = toNextJsHandler(auth.handler)
