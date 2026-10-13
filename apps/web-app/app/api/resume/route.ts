import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { resume } from "@/lib/db/schema"

// Reads/writes hit the DB per request; never prerender.
export const dynamic = "force-dynamic"

async function requireUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

/** Derive a human-readable title from the resume's personal info. */
function titleFrom(data: unknown): string {
  const personal = (data as { personal?: { firstName?: string; lastName?: string } } | null)?.personal
  const name = [personal?.firstName, personal?.lastName].filter(Boolean).join(" ").trim()
  return name || "Untitled"
}

export async function GET() {
  const userId = await requireUserId()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const rows = await db.select({ data: resume.data }).from(resume).where(eq(resume.userId, userId)).limit(1)
  return Response.json({ data: rows[0]?.data ?? null })
}

export async function PUT(request: Request) {
  const userId = await requireUserId()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await request.json().catch(() => null)) as { data?: unknown } | null
  const data = body?.data
  if (!data || typeof data !== "object") {
    return Response.json({ error: "Invalid body: expected { data }" }, { status: 400 })
  }

  await db
    .insert(resume)
    .values({ userId, data, title: titleFrom(data) })
    .onConflictDoUpdate({
      target: resume.userId,
      set: { data, title: titleFrom(data), updatedAt: new Date() },
    })

  return Response.json({ ok: true })
}
