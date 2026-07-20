"use client"

import * as React from "react"

import { computeLayoutRows, type LayoutRow } from "./block-rows"
import { getPageContentHeight } from "./page-layout"
import type { Block } from "./types"

/**
 * Groups blocks into layout rows (see `computeLayoutRows`) and measures a
 * hidden render of [header, ...rows] (same DOM structure the caller renders
 * into `measureRef`) to greedily pack rows into A4 pages, keeping the header
 * on page 1 only.
 *
 * Each row -- including two-column "half" rows -- is treated as an atomic
 * pagination unit: its two columns can have independent heights (a tall
 * block on one side never shifts the other side's blocks), but if the row
 * as a whole doesn't fit in the remaining space on a page it moves to the
 * next page in full, rather than splitting a column mid-stack.
 */
export function usePaginatedBlocks(blocks: Block[], pageMargin: number) {
  const contentHeight = getPageContentHeight(pageMargin)
  const measureRef = React.useRef<HTMLDivElement>(null)
  const rows = React.useMemo(() => computeLayoutRows(blocks), [blocks])
  const [pages, setPages] = React.useState<LayoutRow[][]>(rows.length ? [rows] : [[]])
  const [remeasureTick, setRemeasureTick] = React.useState(0)

  // A one-shot `document.fonts.ready` check isn't enough: a Google Font
  // <link> injected imperatively after mount can finish loading (and swap
  // in different metrics than the fallback font) after that promise has
  // already resolved, silently invalidating the measurements pagination
  // already committed to. A ResizeObserver on the measured content instead
  // catches *any* later layout shift -- font swaps, image loads, edits --
  // and re-triggers pagination whenever the measured height actually changes.
  React.useEffect(() => {
    const container = measureRef.current
    if (!container || typeof ResizeObserver === "undefined") return

    let lastHeight = container.scrollHeight
    const observer = new ResizeObserver(() => {
      const nextHeight = container.scrollHeight
      if (nextHeight !== lastHeight) {
        lastHeight = nextHeight
        setRemeasureTick((t) => t + 1)
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [rows])

  React.useLayoutEffect(() => {
    const container = measureRef.current
    if (!container) return

    const [headerEl, rowsEl] = Array.from(container.children) as HTMLElement[]
    const headerHeight = headerEl?.offsetHeight ?? 0
    const rowEls = rowsEl ? (Array.from(rowsEl.children) as HTMLElement[]) : []

    // offsetHeight excludes margin-bottom, so add it back in -- otherwise a
    // full-width block's own trailing margin is silently uncounted, causing
    // pagination to under-estimate how much a page actually holds.
    function heightWithMargin(el: HTMLElement | undefined): number {
      if (!el) return 0
      const marginBottom = parseFloat(getComputedStyle(el).marginBottom || "0")
      return el.offsetHeight + marginBottom
    }

    const result: LayoutRow[][] = []
    let current: LayoutRow[] = []
    let used = headerHeight

    rows.forEach((row, i) => {
      const height = heightWithMargin(rowEls[i])
      if (current.length > 0 && used + height > contentHeight) {
        result.push(current)
        current = []
        used = 0
      }
      current.push(row)
      used += height
    })
    if (current.length > 0 || result.length === 0) result.push(current)

    setPages(result)
  }, [rows, remeasureTick, contentHeight])

  return { pages, rows, measureRef }
}
