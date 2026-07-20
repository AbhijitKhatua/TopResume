import type { Block } from "./types"

export type LayoutRow =
  | { id: string; kind: "full"; block: Block }
  | { id: string; kind: "columns"; left: Block[]; right: Block[] }

/**
 * Groups a flat block list into rendering rows.
 *
 * - "full" width blocks always occupy their own row.
 * - Consecutive runs of "half" width blocks are grouped into a single
 *   "columns" row, split into independent left/right stacks by each
 *   block's `align`. Each stack lays its own blocks out top-to-bottom
 *   without being affected by the other stack's heights, so a tall block
 *   on one side never shifts the blocks stacked on the other side.
 */
export function computeLayoutRows(blocks: Block[]): LayoutRow[] {
  const rows: LayoutRow[] = []
  let left: Block[] = []
  let right: Block[] = []

  function flushColumns() {
    if (left.length === 0 && right.length === 0) return
    const firstId = left[0]?.id ?? right[0]?.id
    rows.push({ id: `cols-${firstId}`, kind: "columns", left, right })
    left = []
    right = []
  }

  for (const block of blocks) {
    if (block.width === "full") {
      flushColumns()
      rows.push({ id: block.id, kind: "full", block })
    } else if (block.align === "right") {
      right.push(block)
    } else {
      left.push(block)
    }
  }
  flushColumns()

  return rows
}
