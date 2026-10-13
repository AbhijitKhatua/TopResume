"use client"

import { isElementEmpty, renderElement } from "@/lib/resume/render-html"
import {
  DEFAULT_BLOCK_TITLE_FONT_SIZE,
  DEFAULT_ELEMENT_FONT_SIZE,
  DEFAULT_TAG_FONT_SIZE,
  withTextSizeOffset,
} from "@/lib/resume/text-size"
import type { Block, ContentElement } from "@/lib/resume/types"

function ElementPreview({ element }: { element: ContentElement }) {
  if (isElementEmpty(element)) return null
  const html = renderElement(element)
  const style = {
    fontFamily: element.fontFamily ? `"${element.fontFamily}", var(--resume-body-font)` : undefined,
  }
  // Resolved on the element that actually renders the text rather than on the
  // row wrapper: everything inside `.resume-rich-text` is sized in `em`, so
  // setting it here scales the headings and lists along with the body text.
  const contentStyle = {
    fontSize: withTextSizeOffset(element.fontSize ?? DEFAULT_ELEMENT_FONT_SIZE),
  }
  const tag = element.tag?.trim()
  const tagStyle = {
    fontFamily: element.tagFontFamily ? `"${element.tagFontFamily}", var(--resume-body-font)` : undefined,
    fontSize: withTextSizeOffset(element.tagFontSize ?? DEFAULT_TAG_FONT_SIZE),
  }

  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3 last:mb-0" style={style}>
      <div
        className="resume-rich-text min-w-0 flex-1 leading-relaxed break-words"
        style={contentStyle}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {tag && (
        <div
          className="shrink-0 text-right whitespace-nowrap opacity-60 tabular-nums"
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
          className="mb-1.5 font-semibold uppercase tracking-wide break-words"
          style={{
            fontFamily: "var(--resume-heading-font)",
            color: "var(--resume-accent)",
            fontSize: withTextSizeOffset(DEFAULT_BLOCK_TITLE_FONT_SIZE),
          }}
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
