"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Copy, GripVertical, Tag, Trash2 } from "lucide-react"
import type { Editor } from "@tiptap/react"

import { ElementEditor } from "@/components/resume/editors/element-editor"
import { useResumeDispatch } from "@/lib/resume/context"
import type { ContentElement } from "@/lib/resume/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"

export function ContentElementEditor({
  blockId,
  element,
  onFocusEditor,
  onFocusTag,
}: {
  blockId: string
  element: ContentElement
  onFocusEditor?: (editor: Editor, elementId: string) => void
  /** Reports focus on the tag field so the shared font controls can target it. */
  onFocusTag?: (elementId: string) => void
}) {
  const dispatch = useResumeDispatch()
  const hasTag = element.tag !== undefined
  const [menuOpen, setMenuOpen] = React.useState(false)
  const tagInputRef = React.useRef<HTMLInputElement | null>(null)

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: element.id })

  // The grip anchors the options menu. Merge the sortable's activator ref with
  // our own so the menu can position against the same element the drag uses.
  const gripRef = React.useRef<HTMLButtonElement | null>(null)
  const setGripRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      gripRef.current = node
      setActivatorNodeRef(node)
    },
    [setActivatorNodeRef],
  )

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  function patchElement(patch: Partial<ContentElement>) {
    dispatch({ type: "UPDATE_ELEMENT_CONTENT", blockId, elementId: element.id, patch })
  }

  function addTag() {
    patchElement({ tag: "" })
    // The tag input mounts on the next render (once `hasTag` flips); focus it so
    // the user can type immediately without leaving the menu.
    requestAnimationFrame(() => tagInputRef.current?.focus())
  }

  function removeTag() {
    patchElement({ tag: undefined, tagFontFamily: undefined, tagFontSize: undefined })
  }

  // Notion-style ⌘/ (or Ctrl+/) opens the element's options menu while focus is
  // anywhere inside this element (e.g. the editor).
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "/") {
      e.preventDefault()
      setMenuOpen(true)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onKeyDown={handleKeyDown}
      className={cn("flex w-full box-border", isDragging && "opacity-60")}
      data-no-print
    >
      <div className="border bg-muted/30 p-2 w-full">
        <div className="flex gap-1.5 items-start" data-no-print>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <Tooltip>
              <TooltipTrigger render={<span className="inline-flex shrink-0" />}>
                <button
                  ref={setGripRef}
                  type="button"
                  aria-label="Element options — drag to move, click to open menu"
                  // Height matches the editor's first-line box (min-height: 1.4em)
                  // so the grip icon vertically centers on the first line of text
                  // rather than the full element height.
                  className="flex h-[1.4em] w-6 shrink-0 touch-none items-center justify-center text-muted-foreground hover:bg-muted/50 hover:text-foreground active:cursor-grabbing cursor-grab"
                  {...attributes}
                  {...listeners}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <GripVertical className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="flex flex-col gap-0.5">
                <span className="font-medium text-popover-foreground">Drag to move</span>
                <span className="text-muted-foreground">
                  Click or <kbd className="font-sans">⌘/</kbd> to open menu
                </span>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent anchor={gripRef} align="start" side="bottom" className="w-60">
              {hasTag ? (
                <div className="flex items-center gap-1 px-1.5 py-1" data-no-print>
                  <Tag className="size-3.5 shrink-0 text-muted-foreground" />
                  <Input
                    ref={tagInputRef}
                    type="text"
                    value={element.tag ?? ""}
                    onChange={(e) => patchElement({ tag: e.target.value })}
                    onFocus={() => onFocusTag?.(element.id)}
                    // Keep typing/arrows in the input instead of driving the
                    // menu's typeahead/navigation, but let Escape close the menu.
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") e.stopPropagation()
                    }}
                    placeholder="e.g. Jan 2022"
                    className="h-7 flex-1 border-none px-1 text-xs shadow-none"
                  />
                  <button
                    type="button"
                    aria-label="Remove tag"
                    onClick={removeTag}
                    className="flex size-7 shrink-0 items-center justify-center text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ) : (
                <DropdownMenuItem closeOnClick={false} onClick={addTag}>
                  <Tag className="size-3.5" />
                  Add tag
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => dispatch({ type: "DUPLICATE_ELEMENT", blockId, elementId: element.id })}
              >
                <Copy className="size-3.5" />
                Duplicate element
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => dispatch({ type: "REMOVE_ELEMENT", blockId, elementId: element.id })}
              >
                <Trash2 className="size-3.5" />
                Delete element
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ElementEditor
            element={element}
            onChange={(contentJSON) => patchElement({ contentJSON })}
            onFocus={(editor) => onFocusEditor?.(editor, element.id)}
          />
        </div>
      </div>
    </div>
  )
}
