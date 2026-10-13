import { Extension } from "@tiptap/core"
import type { Mark } from "@tiptap/pm/model"
import { TextSelection } from "@tiptap/pm/state"

export type TextCaseMode = "uppercase" | "lowercase" | "capitalize"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textCase: {
      /**
       * Rewrites the selected text to the given case. Unlike CSS
       * `text-transform`, this changes the actual characters, so it works
       * regardless of the original casing (e.g. ALL CAPS -> all lowercase).
       */
      transformCase: (mode: TextCaseMode) => ReturnType
    }
  }
}

function applyCase(text: string, mode: TextCaseMode): string {
  switch (mode) {
    case "uppercase":
      return text.toUpperCase()
    case "lowercase":
      return text.toLowerCase()
    case "capitalize":
      // Lowercase everything first, then capitalize the first letter of each
      // word so ALL CAPS input becomes Title Case (which CSS cannot do).
      return text.toLowerCase().replace(/(^|[^\p{L}\p{N}])(\p{L})/gu, (_m, sep, ch) => sep + ch.toUpperCase())
  }
}

/**
 * Adds a `transformCase` command that rewrites the characters in the current
 * selection to UPPERCASE / lowercase / Title Case. This is a real text edit
 * (not a display-only CSS transform), so it round-trips through the stored
 * document and prints exactly as shown, and it reliably converts text that was
 * originally typed in caps.
 */
export const TextCase = Extension.create({
  name: "textCase",

  addCommands() {
    return {
      transformCase:
        (mode: TextCaseMode) =>
        ({ state, tr, dispatch }) => {
          const { from, to, empty } = state.selection
          if (empty) return false

          const edits: { from: number; to: number; text: string; marks: readonly Mark[] }[] = []
          state.doc.nodesBetween(from, to, (node, pos) => {
            if (!node.isText || node.text == null) return
            const start = Math.max(pos, from)
            const end = Math.min(pos + node.nodeSize, to)
            if (start >= end) return
            const slice = node.text.slice(start - pos, end - pos)
            const next = applyCase(slice, mode)
            if (next !== slice) edits.push({ from: start, to: end, text: next, marks: node.marks })
          })

          if (edits.length === 0) return false

          if (dispatch) {
            // Apply right-to-left so earlier positions aren't shifted. Each
            // replacement preserves the original run's marks (bold, etc.).
            for (let i = edits.length - 1; i >= 0; i--) {
              const edit = edits[i]!
              tr.replaceWith(edit.from, edit.to, state.schema.text(edit.text, edit.marks))
            }
            // Case transforms preserve length, so the original range is still
            // valid -- keep it selected so the user can chain another action.
            tr.setSelection(TextSelection.create(tr.doc, from, to))
            dispatch(tr)
          }
          return true
        },
    }
  },
})
