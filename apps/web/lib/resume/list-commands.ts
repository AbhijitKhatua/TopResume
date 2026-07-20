import type { Editor } from "@tiptap/core"
import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { TextSelection } from "@tiptap/pm/state"

/**
 * Hand-rolled bullet / numbered list toggles. Tiptap's own
 * `toggleBulletList`/`toggleOrderedList` only wrap the selected block and leave
 * stray empty paragraphs (`<p></p>`, `<p><br></p>`) as siblings around the
 * list, and the library internals can't be changed. So we don't call them at
 * all: these functions read the document, build the replacement nodes
 * ourselves — dropping every empty paragraph in the touched range along the
 * way — and dispatch ONE transaction. What we construct is exactly what the
 * DOM shows; there is no library leftover to clean up afterwards.
 */

const LIST_TYPES = ["bulletList", "orderedList"] as const
type ListName = (typeof LIST_TYPES)[number]

/** A paragraph with no real text — nothing, whitespace, or just hardBreaks. */
function isEmptyParagraph(node: ProseMirrorNode): boolean {
  return node.type.name === "paragraph" && node.textContent.trim().length === 0
}

/** Position after the last top-level child with real text; everything past it
 * is trailing empty paragraphs. Never cuts the first child so the doc can't
 * end up empty. */
export function trailingEmptyParagraphCut(doc: ProseMirrorNode): number {
  let cut = doc.content.size
  for (let index = doc.childCount - 1; index > 0; index--) {
    const node = doc.child(index)
    if (!isEmptyParagraph(node)) break
    cut -= node.nodeSize
  }
  return cut
}

/** Top-level children touched by the selection, with their absolute range. */
function selectedTopLevelRange(editor: Editor): {
  blocks: ProseMirrorNode[]
  startPos: number
  endPos: number
} {
  const { doc, selection } = editor.state
  const fromIndex = selection.$from.index(0)
  const toIndex = Math.min(selection.$to.index(0), doc.childCount - 1)

  let startPos = 0
  const blocks: ProseMirrorNode[] = []
  doc.forEach((child, offset, index) => {
    if (index === fromIndex) startPos = offset
    if (index >= fromIndex && index <= toIndex) blocks.push(child)
  })
  const endPos = startPos + blocks.reduce((size, block) => size + block.nodeSize, 0)
  return { blocks, startPos, endPos }
}

/** Convert the touched blocks into list items of our own making. Paragraphs
 * are reused as-is inside a fresh listItem; headings are demoted to a
 * paragraph (keeping inline content/marks and alignment); existing lists are
 * absorbed item-by-item (which is how ordered ⇄ bullet retyping happens);
 * empty paragraphs are dropped — never wrapped into a blank bullet. */
function blocksToListItems(editor: Editor, blocks: ProseMirrorNode[]): ProseMirrorNode[] {
  const { schema } = editor.state
  const listItem = schema.nodes.listItem
  const paragraph = schema.nodes.paragraph
  if (!listItem || !paragraph) return []

  const items: ProseMirrorNode[] = []
  for (const block of blocks) {
    if (isEmptyParagraph(block)) continue
    const name = block.type.name
    if (name === "paragraph") {
      items.push(listItem.createChecked(null, [block]))
    } else if (name === "heading") {
      const p = paragraph.createChecked({ textAlign: block.attrs.textAlign ?? null }, block.content)
      items.push(listItem.createChecked(null, [p]))
    } else if (name === "bulletList" || name === "orderedList") {
      block.forEach((item) => items.push(item))
    }
  }
  return items
}

/** Unwrap a list node back to plain paragraphs, reusing each item's blocks. */
function listToParagraphs(list: ProseMirrorNode): ProseMirrorNode[] {
  const paragraphs: ProseMirrorNode[] = []
  list.forEach((item) => item.forEach((child) => paragraphs.push(child)))
  return paragraphs
}

/** The top-level list node containing the selection head, if any. */
function activeTopLevelList(editor: Editor): ProseMirrorNode | null {
  const { selection } = editor.state
  if (selection.$from.depth < 1) return null
  const top = selection.$from.node(1)
  return LIST_TYPES.includes(top.type.name as ListName) ? top : null
}

function toggleList(editor: Editor, listName: ListName): boolean {
  const { state, view } = editor
  const { schema } = state
  const listType = schema.nodes[listName]
  if (!listType) return false

  const { blocks, startPos, endPos } = selectedTopLevelRange(editor)
  if (blocks.length === 0) return false

  const active = activeTopLevelList(editor)
  const replacement =
    active && active.type.name === listName
      ? // Toggling the same list type off → back to paragraphs.
        listToParagraphs(active)
      : // Wrapping (or retyping another list) → one list built by us. On an
        // empty element start a fresh list with one blank item to type into.
        (() => {
          let items = blocksToListItems(editor, blocks)
          if (items.length === 0) {
            const listItem = schema.nodes.listItem
            const paragraph = schema.nodes.paragraph
            if (!listItem || !paragraph) return []
            items = [listItem.createChecked(null, [paragraph.create()])]
          }
          return [listType.createChecked(null, items)]
        })()

  if (replacement.length === 0) return false

  const tr = state.tr.replaceWith(startPos, endPos, replacement)
  // Sweep any trailing empty paragraphs left elsewhere in the doc.
  const cut = trailingEmptyParagraphCut(tr.doc)
  if (tr.doc.childCount > 1 && cut < tr.doc.content.size) tr.delete(cut, tr.doc.content.size)
  // Land the cursor inside the rebuilt content.
  const inside = Math.min(startPos + 1, tr.doc.content.size)
  tr.setSelection(TextSelection.near(tr.doc.resolve(inside), 1))

  view.dispatch(tr)
  view.focus()
  return true
}

export function toggleBulletList(editor: Editor): boolean {
  return toggleList(editor, "bulletList")
}

export function toggleOrderedList(editor: Editor): boolean {
  return toggleList(editor, "orderedList")
}
