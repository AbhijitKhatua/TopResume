import type { JSONContent } from "@tiptap/core"

export type ThemeId =
  | "minimal"
  | "classic-serif"
  | "modern-sidebar"
  | "creative-gradient"
  | "bold-geometric"
  | "doctor"
  | "minecraft"

export interface LinkItem {
  id: string
  label: string
  url: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  title: string
  email: string
  phone: string
  location: string
  links: LinkItem[]
  summary: string
  /** Legacy inline base64 photo (kept for backward compatibility). */
  photoDataUrl: string | null
  /** Vercel Blob pathname for the profile photo, served via /api/photo. */
  photoPath?: string | null
}

export type HeadingLevelValue = 2 | 3 | 4 | 5

export interface ContentElement {
  id: string
  contentJSON: JSONContent
  fontFamily?: string
  fontSize?: string
  /**
   * Optional short label (date, location, status…) rendered right-aligned next
   * to this element. Historically called "date"; migrated on load.
   */
  tag?: string
  /** Font overrides for the right-aligned tag text only. */
  tagFontFamily?: string
  tagFontSize?: string
}

export const MAX_ELEMENTS_PER_BLOCK = 20

export type BlockAlign = "left" | "right"

export interface Block {
  id: string
  title: string
  width: "full" | "half"
  /** Only meaningful when `width` is "half"; defaults to "left". */
  align?: BlockAlign
  elements: ContentElement[]
}

export interface ResumeData {
  personal: PersonalInfo
  blocks: Block[]
  themeId: ThemeId
  pageMargin: number
  version: number
}
