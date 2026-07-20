"use client"

import { isElementEmpty, renderElement } from "@/lib/resume/render-html"
import type { Block, ContentElement } from "@/lib/resume/types"

function ElementPreview({ element }: { element: ContentElement }) {
  if (isElementEmpty(element)) return null
  const html = renderElement(element)
  const style = {
    fontFamily: element.fontFamily ? `"${element.fontFamily}", var(--resume-body-font)` : undefined,
    fontSize: element.fontSize,
  }
  const tag = element.tag?.trim()
  const tagStyle = {
    fontFamily: element.tagFontFamily ? `"${element.tagFontFamily}", var(--resume-body-font)` : undefined,
    fontSize: element.tagFontSize,
  }

  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3 last:mb-0" style={style}>
      <div
        className="resume-rich-text min-w-0 flex-1 text-sm leading-relaxed break-words"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {tag && (
        <div
          className="shrink-0 text-right text-xs whitespace-nowrap opacity-60 tabular-nums"
          style={tagStyle}
        >
          {tag}
        </div>
      )}
    </div>
  )
}

export function BlockPreview({ block }: { block: Block }) {
  const visibleElements = block.elements.filter((el) => !isElementEmpty(el))
  if (!block.title && visibleElements.length === 0) return null

  return (
    <div className="resume-preview-block mb-4 break-inside-avoid">
      {block.title && (
        <h2
          className="mb-1.5 text-sm font-semibold uppercase tracking-wide break-words"
          style={{ fontFamily: "var(--resume-heading-font)", color: "var(--resume-accent)" }}
        >
          {block.title}
        </h2>
      )}
      {visibleElements.map((element) => (
        <ElementPreview key={element.id} element={element} />
      ))}
    </div>
  )
}
