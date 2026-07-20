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

export function getPageContentHeight(margin: number): number {
  return A4_HEIGHT_PX - margin * 2
}
