import { del, get, put } from "@vercel/blob"
import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

const MAX_BYTES = 3_000_000 // 3 MB (client downscales before upload)
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN

async function requireUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

/** A user may only touch blobs under their own prefix. */
function ownsPath(userId: string, pathname: string): boolean {
  return pathname.startsWith(`resume-photos/${userId}/`)
}

function extFor(contentType: string): string {
  if (contentType.includes("png")) return "png"
  if (contentType.includes("webp")) return "webp"
  return "jpg"
}

// Upload a new profile photo.
export async function POST(request: NextRequest) {
  const userId = await requireUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const contentType = request.headers.get("content-type") ?? ""
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Expected an image" }, { status: 400 })
  }

  const buffer = await request.arrayBuffer()
  if (buffer.byteLength === 0) return NextResponse.json({ error: "Empty upload" }, { status: 400 })
  if (buffer.byteLength > MAX_BYTES) return NextResponse.json({ error: "Image too large" }, { status: 413 })

  const pathname = `resume-photos/${userId}/${crypto.randomUUID()}.${extFor(contentType)}`
  const blob = await put(pathname, buffer, {
    access: "private",
    contentType,
    addRandomSuffix: false,
    token: TOKEN,
  })

  return NextResponse.json({ pathname: blob.pathname })
}

// Stream a private photo back to its owner (used as the <img> src).
export async function GET(request: NextRequest) {
  const userId = await requireUserId()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const pathname = request.nextUrl.searchParams.get("pathname")
  if (!pathname) return new NextResponse("Missing pathname", { status: 400 })
  if (!ownsPath(userId, pathname)) return new NextResponse("Forbidden", { status: 403 })

  const result = await get(pathname, { access: "private", token: TOKEN })
  if (!result || !result.stream) return new NextResponse("Not found", { status: 404 })

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  })
}

// Remove a photo.
export async function DELETE(request: NextRequest) {
  const userId = await requireUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const pathname = request.nextUrl.searchParams.get("pathname")
  if (!pathname) return NextResponse.json({ error: "Missing pathname" }, { status: 400 })
  if (!ownsPath(userId, pathname)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await del(pathname, { token: TOKEN })
  return NextResponse.json({ ok: true })
}
