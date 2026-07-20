"use client"

import * as React from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import type { AnyExtension, JSONContent } from "@tiptap/core"

import { trailingEmptyParagraphCut } from "@/lib/resume/list-commands"
import { cn } from "@workspace/ui/lib/utils"

// "Empty" must mean *no real text*, not "no child nodes": a stray paragraph
// often holds a hardBreak (`<p><br></p>` — from Shift+Enter or older saved
// docs), which is content-size 1 but still just a blank line on screen.
function stripTrailingEmptyJSON(json: JSONContent): JSONContent {
  const content = json.content
  if (!content || content.length <= 1) return json

  let end = content.length
  while (end > 1) {
    const node = content[end - 1]
    const isEmptyParagraph =
      node?.type === "paragraph" &&
      (node.content ?? []).every((child) => !(child.type === "text" && (child.text ?? "").trim().length > 0))
    if (!isEmptyParagraph) break
    end--
  }

  if (end === content.length) return json
  return { ...json, content: content.slice(0, end) }
}

// Trim any trailing empty paragraph from the editor's own doc so it never shows
// up in the contenteditable — including the one the cursor may be parked in
// (e.g. right after Enter lifts out of a list). This must NOT run synchronously
// inside `onUpdate`: dispatching a transaction mid-update re-enters ProseMirror
// and, through the React binding, spins into a hang. Callers defer it
// (`setTimeout`) so it lands as an ordinary post-update dispatch.
function trimTrailingEmptyParagraphs(editor: Editor): void {
  if (editor.isDestroyed) return
  const { doc } = editor.state
  if (doc.childCount <= 1) return

  const cut = trailingEmptyParagraphCut(doc)
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
  // Pending deferred-trim timer. Deferring the doc trim out of `onUpdate` keeps
  // it from re-entering ProseMirror mid-update (which hangs); the ref lets us
  // cancel a queued trim on blur/unmount so it never fires on a torn-down editor.
  const trimTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    // Saved docs may already carry a stray trailing paragraph (e.g. from before
    // this cleanup existed); trim it as soon as the editor mounts. Deferred for
    // the same reason as in onUpdate.
    onCreate: ({ editor }) => {
      trimTimer.current = setTimeout(() => trimTrailingEmptyParagraphs(editor), 0)
    },
    onUpdate: ({ editor }) => {
      onChange(stripTrailingEmptyJSON(editor.getJSON()))
      // Mirror that cleanup in the editable DOM, but on the next macrotask so we
      // aren't dispatching inside ProseMirror's own update cycle.
      if (trimTimer.current) clearTimeout(trimTimer.current)
      trimTimer.current = setTimeout(() => trimTrailingEmptyParagraphs(editor), 0)
    },
    onFocus: ({ editor }) => onFocus?.(editor),
    onBlur: ({ editor }) => {
      if (trimTimer.current) clearTimeout(trimTimer.current)
      trimTrailingEmptyParagraphs(editor)
    },
  })

  React.useEffect(() => {
    onEditorReady?.(editor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  React.useEffect(() => {
    return () => {
      if (trimTimer.current) clearTimeout(trimTimer.current)
    }
  }, [])

  return (
    <EditorContent
      editor={editor}
      className={cn("tiptap-field", className)}
      style={{ fontFamily: fontFamily ? `"${fontFamily}", sans-serif` : undefined, fontSize }}
    />
  )
}
