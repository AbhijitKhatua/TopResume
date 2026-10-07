import { generateHTML } from "@tiptap/core"
import type { AnyExtension, JSONContent } from "@tiptap/core"
import { FontFamily } from "@tiptap/extension-font-family"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { TextAlign } from "@tiptap/extension-text-align"
import { FontSize, TextStyle } from "@tiptap/extension-text-style"
import { StarterKit } from "@tiptap/starter-kit"

import { withTextSizeOffset } from "./text-size"
import type { ContentElement } from "./types"

// Must stay in sync with `elementExtensions` so every mark/node the editor can
// produce also serializes here. Link + Underline render via StarterKit v3;
// TextAlign writes the inline `text-align` style onto headings/paragraphs.
const READONLY_EXTENSIONS: AnyExtension[] = [
  StarterKit.configure({ heading: { levels: [2, 3, 4, 5] }, trailingNode: false }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TextStyle,
  FontFamily,
  FontSize,
  Subscript,
  Superscript,
]

function docToHTML(json: JSONContent): string {
  try {
    return generateHTML(stripEmptyParagraphs(json), READONLY_EXTENSIONS)
  } catch {
    return ""
  }
}

// Tiptap/ProseMirror commonly leaves a trailing empty paragraph after a list
// (or between blocks) purely so the user has somewhere to place the cursor
// while editing. That structural artifact has no visual meaning in the
// read-only preview, so strip empty top-level paragraphs before rendering.
function isEmptyParagraphNode(node: JSONContent): boolean {
  if (node.type !== "paragraph") return false
  const content = node.content ?? []
  return content.every((child) => !(child.type === "text" && (child.text ?? "").trim().length > 0))
}

function stripEmptyParagraphs(doc: JSONContent): JSONContent {
  if (!doc.content) return doc
  return { ...doc, content: doc.content.filter((node) => !isEmptyParagraphNode(node)) }
}

function isHtmlEmpty(html: string): boolean {
  if (!html) return true
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()
  return text.length === 0
}

// Per-word size overrides (the Tiptap FontSize mark) serialize to an inline
// `font-size`, which no stylesheet can override. Rewrite each one through
// `calc()` so the global text-size offset reaches them too -- otherwise text
// with an explicit size would be the only text on the page that ignores the
// Style panel's slider.
const INLINE_FONT_SIZE = /font-size:\s*(-?[\d.]+)(px|pt|rem|em)/gi

function applyTextSizeOffset(html: string): string {
  return html.replace(
    INLINE_FONT_SIZE,
    (_match, value: string, unit: string) => `font-size: ${withTextSizeOffset(`${value}${unit}`)}`,
  )
}

export function renderElement(element: ContentElement): string {
  return applyTextSizeOffset(docToHTML(element.contentJSON))
}

export function isElementEmpty(element: ContentElement): boolean {
  return isHtmlEmpty(renderElement(element))
}
