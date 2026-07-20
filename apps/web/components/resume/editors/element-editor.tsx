"use client"

import * as React from "react"
import type { Editor } from "@tiptap/react"

import { elementExtensions } from "@/lib/resume/tiptap-extensions"
import type { ContentElement } from "@/lib/resume/types"

import { RichTextField } from "./rich-text-field"

/**
 * Single rich text editor for an element: headings, lists, and paragraphs
 * can all be mixed together in one document via the block-level toolbar's
 * block-type selector, instead of choosing a fixed element "type" up front.
 * Formatting controls live once per block (see `BlockCard`); this component
 * just reports focus so the shared toolbar knows which element it controls.
 */
export function ElementEditor({
  element,
  onChange,
  onFocus,
}: {
  element: ContentElement
  onChange: (contentJSON: ContentElement["contentJSON"]) => void
  onFocus?: (editor: Editor) => void
}) {
  const extensions = React.useMemo(() => elementExtensions("Write a heading, paragraph, or list…"), [])

  return (
    <RichTextField
      content={element.contentJSON}
      onChange={onChange}
      extensions={extensions}
      fontFamily={element.fontFamily}
      fontSize={element.fontSize}
      onFocus={onFocus}
    />
  )
}

