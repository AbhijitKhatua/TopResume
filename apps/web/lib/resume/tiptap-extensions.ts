import { FontFamily } from "@tiptap/extension-font-family"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { TextAlign } from "@tiptap/extension-text-align"
import { FontSize, TextStyle } from "@tiptap/extension-text-style"
import { StarterKit } from "@tiptap/starter-kit"
import type { AnyExtension } from "@tiptap/core"

import { TextCase } from "./text-transform"

/**
 * Single extension set shared by the editor and the read-only preview
 * renderer, allowing headings (H2-H5), lists, and paragraphs to be mixed
 * freely within one rich text document per element.
 *
 * Note: StarterKit v3 already bundles the Link and Underline extensions, so
 * those need no separate import — only `link` is configured below so clicking
 * a link inside the editor edits it instead of navigating away.
 */
export function elementExtensions(placeholder: string): AnyExtension[] {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4, 5] },
      link: { openOnClick: false, defaultProtocol: "https" },
      // StarterKit v3 bundles TrailingNode, which force-appends an empty
      // paragraph whenever the doc ends in a non-paragraph (e.g. a list) — the
      // exact `<p><br></p>` artifact we never want in a compact resume element.
      // It re-inserts on every transaction, so no after-the-fact cleanup can
      // win against it; it must be disabled at the source.
      trailingNode: false,
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TextStyle,
    FontFamily,
    FontSize,
    TextCase,
    Subscript,
    Superscript,
    Placeholder.configure({ placeholder }),
  ]
}
