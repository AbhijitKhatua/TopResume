"use client"

import { BlockPreview } from "@/components/resume/block-preview"
import type { LayoutRow } from "@/lib/resume/block-rows"

/**
 * Renders one layout row. "columns" rows use two independent flex stacks
 * side by side, so the left and right sides lay out their own blocks based
 * only on their own content height -- one side's height never displaces the
 * other's blocks (only the overall row height, i.e. what comes after it).
 */
export function BlockRow({ row }: { row: LayoutRow }) {
  if (row.kind === "full") {
    return <BlockPreview block={row.block} />
  }

  return (
    <div className="resume-preview-row flex gap-4 break-inside-avoid">
      <div className="flex min-w-0 flex-1 flex-col">
        {row.left.map((block) => (
          <BlockPreview key={block.id} block={block} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        {row.right.map((block) => (
          <BlockPreview key={block.id} block={block} />
        ))}
      </div>
    </div>
  )
}
