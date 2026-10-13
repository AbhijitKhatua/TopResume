import type { Editor } from "@tiptap/core"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import type { Transaction } from "@tiptap/pm/state"



export function trailingEmptyParagraphCut(doc: ProseMirrorNode): number {
  let cut = doc.content.size
  for (let index = doc.childCount - 1; index > 0; index--) {
    const node = doc.child(index)
    const isEmptyParagraph = node.type.name === "paragraph" && node.textContent.trim().length === 0
    if (!isEmptyParagraph) break
    cut -= node.nodeSize
  }
  return cut
}

function deleteTrailingEmptyParagraphs(tr: Transaction): void {
  if (tr.doc.childCount <= 1) return
  const cut = trailingEmptyParagraphCut(tr.doc)
  if (cut < tr.doc.content.size) tr.delete(cut, tr.doc.content.size)
}

export function toggleBulletList(editor: Editor): boolean {
  return editor
    .chain()
    .focus()
    .toggleBulletList()
    .command(({ tr }) => {
      deleteTrailingEmptyParagraphs(tr)
      return true
    })
    .run()
}

export function toggleOrderedList(editor: Editor): boolean {
  return editor
    .chain()
    .focus()
    .toggleOrderedList()
    .command(({ tr }) => {
      deleteTrailingEmptyParagraphs(tr)
      return true
    })
    .run()
}
