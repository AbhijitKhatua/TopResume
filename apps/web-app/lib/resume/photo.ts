import type { PersonalInfo } from "./types"

/**
 * Resolves the <img> src for a resume photo. Prefers the Vercel Blob photo
 * (served through the authenticated /api/photo route) and falls back to the
 * legacy inline data URL for resumes created before Blob storage.
 */
export function photoSrc(personal: Pick<PersonalInfo, "photoPath" | "photoDataUrl">): string | null {
  if (personal.photoPath) {
    return `/api/photo?pathname=${encodeURIComponent(personal.photoPath)}`
  }
  return personal.photoDataUrl ?? null
}
