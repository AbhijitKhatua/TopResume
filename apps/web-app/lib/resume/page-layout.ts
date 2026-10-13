// A4 at 96 CSS px/inch (210mm x 297mm == 8.27in x 11.69in).
export const A4_WIDTH_PX = 794
export const A4_HEIGHT_PX = 1123

export const DEFAULT_PAGE_MARGIN = 48
export const MIN_PAGE_MARGIN = 16
export const MAX_PAGE_MARGIN = 96
export const PAGE_MARGIN_STEP = 4

export function getPageContentWidth(margin: number): number {
  return A4_WIDTH_PX - margin * 2
}

/**
 * Usable height for blocks on pages 2+, where the page's padding box is the
 * only thing between the content and the edges of the sheet.
 */
export function getPageContentHeight(margin: number): number {
  return A4_HEIGHT_PX - margin * 2
}

/**
 * Page 1 renders the personal header full-bleed *above* the padded content
 * box, and that box uses a tighter top padding (the header already supplies
 * breathing room). Shared with `ResumePage` so the pagination model and the
 * rendered page can't drift apart.
 */
export const HEADER_PAGE_PAD_RATIO = 0.6

export function getHeaderPaddingTop(margin: number): number {
  return Math.round(margin * HEADER_PAGE_PAD_RATIO)
}

/** Usable height for blocks on page 1, given the measured header height. */
export function getFirstPageContentHeight(margin: number, headerHeight: number): number {
  return A4_HEIGHT_PX - headerHeight - getHeaderPaddingTop(margin) - margin
}
