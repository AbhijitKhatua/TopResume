/**
 * Global text sizing.
 *
 * The "Text size" control in the Style panel nudges *every* piece of text on
 * the resume by a fixed number of pixels, keeping the relative differences
 * between elements intact: a 12px tag next to a 14px body line becomes 13px
 * and 15px at +1, not two identically sized runs.
 *
 * It is stored as an offset rather than baked into each element's own
 * `fontSize` so that it stays reversible (drag back to 0 and every element is
 * exactly as it was), and so that elements which never set an explicit size --
 * the vast majority -- scale too. The offset reaches the DOM as a CSS variable
 * and is added to each size with `calc()`, which means it also applies to
 * sizes that only exist in a stylesheet or in serialized rich-text HTML.
 */

export const MIN_TEXT_SIZE_OFFSET = -4
export const MAX_TEXT_SIZE_OFFSET = 8
export const TEXT_SIZE_OFFSET_STEP = 1
export const DEFAULT_TEXT_SIZE_OFFSET = 0

/** CSS variable carrying the offset down into the preview subtree. */
export const TEXT_SIZE_OFFSET_VAR = "--resume-text-offset"

// The sizes the preview falls back to when an element carries no override of
// its own. These mirror the Tailwind classes the preview used to hard-code
// (`text-sm` / `text-xs`) and are what the size selector reports as the
// "theme default".
export const DEFAULT_ELEMENT_FONT_SIZE = "14px"
export const DEFAULT_TAG_FONT_SIZE = "12px"
export const DEFAULT_BLOCK_TITLE_FONT_SIZE = "14px"

// Personal header sizes (previously `text-3xl` / `text-lg` / `text-sm`).
export const HEADER_NAME_FONT_SIZE = "30px"
export const HEADER_TITLE_FONT_SIZE = "18px"
export const HEADER_DETAIL_FONT_SIZE = "14px"

export function clampTextSizeOffset(offset: number): number {
  if (!Number.isFinite(offset)) return DEFAULT_TEXT_SIZE_OFFSET
  return Math.min(MAX_TEXT_SIZE_OFFSET, Math.max(MIN_TEXT_SIZE_OFFSET, Math.round(offset)))
}

/**
 * Wraps a CSS length so the global offset is added to it at paint time.
 * Falls back to 0px wherever the variable isn't set, so any subtree rendered
 * outside the preview (the editor fields, for instance) is left alone.
 */
export function withTextSizeOffset(size: string): string {
  return `calc(${size} + var(${TEXT_SIZE_OFFSET_VAR}, 0px))`
}
