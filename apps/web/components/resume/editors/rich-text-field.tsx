"use client"

import * as React from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import type { AnyExtension, JSONContent } from "@tiptap/core"


import { cn } from "@workspace/ui/lib/utils"


function stripTrailingEmptyJSON(json: JSONContent): JSONContent {
  const content = json.content
  if (!content || content.length <= 1) return json

  let end = content.length
  while (end > 1) {
    const node = content[end - 1]
    const isEmptyParagraph =
      node?.type === "paragraph" &&
      (node.content ?? []).every((child) => !(child.type === "text" && (child.text ?? "").length > 0))
    if (!isEmptyParagraph) break
    end--
  }

  if (end === content.length) return json
  return { ...json, content: content.slice(0, end) }
}

function trimTrailingEmptyParagraphs(editor: Editor): void {
  const { doc } = editor.state
  if (doc.childCount <= 1) return

  let cut = doc.content.size
  for (let index = doc.childCount - 1; index > 0; index--) {
    const node = doc.child(index)
    const isEmptyParagraph = node.type.name === "paragraph" && node.content.size === 0
    if (!isEmptyParagraph) break
    cut -= node.nodeSize
  }

  if (cut >= doc.content.size) return
  editor.view.dispatch(editor.state.tr.delete(cut, doc.content.size))
}

export function RichTextField({
  content,
  onChange,
  extensions,
  fontFamily,
  fontSize,
  className,
  onEditorReady,
  onFocus,
}: {
  content: JSONContent
  onChange: (json: JSONContent) => void
  extensions: AnyExtension[]
  fontFamily?: string
  fontSize?: string
  className?: string
  onEditorReady?: (editor: Editor | null) => void
  onFocus?: (editor: Editor) => void
}) {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(stripTrailingEmptyJSON(editor.getJSON())),
    onFocus: ({ editor }) => onFocus?.(editor),
    onBlur: ({ editor }) => trimTrailingEmptyParagraphs(editor),
  })

  React.useEffect(() => {
    onEditorReady?.(editor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return (
    <EditorContent
      editor={editor}
      className={cn("tiptap-field", className)}
      style={{ fontFamily: fontFamily ? `"${fontFamily}", sans-serif` : undefined, fontSize }}
    />
  )
}
