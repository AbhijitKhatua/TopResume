"use client"

import * as React from "react"
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { AlignStartVertical, ChevronDown, ChevronRight, GripVertical, Plus, Trash2, AlignEndVertical } from "lucide-react"
import { useEditorState, type Editor } from "@tiptap/react"

import { ContentElementEditor } from "@/components/resume/content-element-editor"
import { FontPicker } from "@/components/resume/font-picker"
import { RichTextToolbar } from "@/components/resume/rich-text-toolbar"
import { useResumeDispatch } from "@/lib/resume/context"
import type { Block } from "@/lib/resume/types"
import { MAX_ELEMENTS_PER_BLOCK } from "@/lib/resume/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

const FONT_SIZES = ["12px", "13px", "14px", "16px", "18px", "20px", "24px", "28px"]

// Sentinel for the "follow the theme size" option in the size selector.
const THEME_DEFAULT_SIZE = "__theme_default__"

// Effective size when an element has no explicit fontSize — the preview renders
// element text at Tailwind `text-sm` (14px), so the size selector shows this
// instead of an empty placeholder. Tags render at `text-xs` (12px).
const DEFAULT_ELEMENT_FONT_SIZE = "14px"
const DEFAULT_TAG_FONT_SIZE = "12px"

// What the shared font/format controls currently target: a rich-text editor
// selection, or an element's right-aligned tag input.
type ActiveTarget =
  | { kind: "editor"; editor: Editor; elementId: string }
  | { kind: "tag"; elementId: string }
  | null

export function BlockCard({ block }: { block: Block }) {
  const dispatch = useResumeDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })
  const [collapsed, setCollapsed] = React.useState(false)
  // The shared font/format controls act on whichever field last had focus: a
  // rich-text editor (style the selection) or an element's tag input (style the
  // whole tag). `null` means nothing is focused, so the controls are disabled.
  const [active, setActive] = React.useState<ActiveTarget>(null)

  // The active editor may have been destroyed (e.g. its element was just
  // removed) without a fresh focus event ever firing; guard against that
  // rather than let the shared toolbar/font controls act on a dead editor.
  const activeEditor = active?.kind === "editor" && !active.editor.isDestroyed ? active.editor : null
  const tagActive = active?.kind === "tag"
  const activeElement = active ? block.elements.find((el) => el.id === active.elementId) : undefined

  // When an editor is focused, font family/size are applied as marks on the
  // current selection (FontFamily/FontSize TextStyle marks) so they can differ
  // word-by-word; read the marks at the selection so the controls reflect it.
  const activeMarks = useEditorState({
    editor: activeEditor,
    selector: (ctx) => ({
      fontFamily: (ctx.editor?.getAttributes("textStyle").fontFamily as string | null) ?? undefined,
      fontSize: (ctx.editor?.getAttributes("textStyle").fontSize as string | null) ?? undefined,
    }),
  })

  // Resolved values for the shared font controls, depending on the active
  // target. For a tag, family/size live on the element; for an editor, on the
  // selection's marks.
  const fontControlsDisabled = !activeEditor && !tagActive
  const fontFamilyValue = tagActive ? activeElement?.tagFontFamily : activeMarks?.fontFamily
  const fontSizeValue = tagActive ? activeElement?.tagFontSize : activeMarks?.fontSize
  const defaultFontSize = tagActive ? DEFAULT_TAG_FONT_SIZE : DEFAULT_ELEMENT_FONT_SIZE

  function setFontFamily(fontFamily: string | undefined) {
    if (tagActive) {
      if (activeElement) {
        dispatch({
          type: "UPDATE_ELEMENT_CONTENT",
          blockId: block.id,
          elementId: activeElement.id,
          patch: { tagFontFamily: fontFamily },
        })
      }
      return
    }
    if (!activeEditor) return
    const chain = activeEditor.chain().focus()
    ;(fontFamily ? chain.setFontFamily(fontFamily) : chain.unsetFontFamily()).run()
  }

  function setFontSize(fontSize: string | undefined) {
    if (tagActive) {
      if (activeElement) {
        dispatch({
          type: "UPDATE_ELEMENT_CONTENT",
          blockId: block.id,
          elementId: activeElement.id,
          patch: { tagFontSize: fontSize },
        })
      }
      return
    }
    if (!activeEditor) return
    const chain = activeEditor.chain().focus()
    ;(fontSize ? chain.setFontSize(fontSize) : chain.unsetFontSize()).run()
  }

  // Use Translate (not Transform): @dnd-kit's sortable bakes a scaleX/scaleY
  // into the active item's transform to morph it toward the size of whatever
  // block it's hovering over. That squishes/stretches the drag ghost. Applying
  // only the translation keeps the dragged block at its own natural size.
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  const canAddElement = block.elements.length < MAX_ELEMENTS_PER_BLOCK

  // Nested sortable context for reordering elements within this block. Elements
  // drag from their grip handle; a small activation distance keeps clicks (which
  // open the grip's options menu) from being treated as drags.
  const elementSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

  function handleElementDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      dispatch({
        type: "REORDER_ELEMENTS",
        blockId: block.id,
        activeId: String(active.id),
        overId: String(over.id),
      })
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`resume-block border bg-card p-3 ${isDragging ? "opacity-60" : ""}`}
    >
      <div className={cn("flex items-center gap-2", !collapsed && "mb-2")}>
        <button
          type="button"
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <button
          type="button"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? "Expand section" : "Collapse section"}
          aria-expanded={!collapsed}
          onClick={() => {
            if (!collapsed) setActive(null)
            setCollapsed(!collapsed)
          }}
          data-no-print
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
        <Input
          value={block.title}
          onChange={(e) => dispatch({ type: "UPDATE_BLOCK_TITLE", id: block.id, title: e.target.value })}
          placeholder="Section title"
          className="h-full flex-1 border-none px-3 py-1.5 font-semibold shadow-none"
        />
        <div className="flex overflow-hidden border">
          <button
            type="button"
            className={cn(
              "px-2 py-1 text-xs",
              block.width === "full" ? "bg-secondary font-medium" : "text-muted-foreground",
            )}
            onClick={() => dispatch({ type: "SET_BLOCK_WIDTH", id: block.id, width: "full" })}
          >
            Full
          </button>
          <button
            type="button"
            className={cn(
              "border-l px-2 py-1 text-xs",
              block.width === "half" ? "bg-secondary font-medium" : "text-muted-foreground",
            )}
            onClick={() => dispatch({ type: "SET_BLOCK_WIDTH", id: block.id, width: "half" })}
          >
            Half
          </button>
        </div>
        {block.width === "half" && (
          <div className="flex overflow-hidden border" data-no-print>
            <button
              type="button"
              aria-label="Align left half"
              aria-pressed={(block.align ?? "left") === "left"}
              className={cn(
                "px-1.5 py-1",
                (block.align ?? "left") === "left" ? "bg-secondary text-foreground" : "text-muted-foreground",
              )}
              onClick={() => dispatch({ type: "SET_BLOCK_ALIGN", id: block.id, align: "left" })}
            >
              <AlignStartVertical className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Align right half"
              aria-pressed={block.align === "right"}
              className={cn(
                "border-l px-1.5 py-1",
                block.align === "right" ? "bg-secondary text-foreground" : "text-muted-foreground",
              )}
              onClick={() => dispatch({ type: "SET_BLOCK_ALIGN", id: block.id, align: "right" })}
            >
              <AlignEndVertical className="size-3.5" />
            </button>
          </div>
        )}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 text-muted-foreground hover:text-destructive"
                aria-label="Remove section"
              />
            }
          >
            <Trash2 className="size-4" />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this section?</AlertDialogTitle>
              <AlertDialogDescription>
                {block.title ? `"${block.title}"` : "This section"} and all of its elements will be
                permanently removed. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel render={<Button type="button" variant="outline" />}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                render={<Button type="button" variant="destructive" />}
                onClick={() => dispatch({ type: "REMOVE_BLOCK", id: block.id })}
              >
                Delete section
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {!collapsed && (
        <>
          <div className="mb-2 flex flex-wrap items-center gap-1.5 border-b pb-2" data-no-print>
            <FontPicker
              value={fontFamilyValue}
              placeholder={tagActive ? "Tag font" : "Theme font"}
              disabled={fontControlsDisabled}
              className="h-7 w-32 min-w-0 text-xs text-muted-foreground shadow-none"
              onChange={(fontFamily) => setFontFamily(fontFamily)}
              onReset={() => setFontFamily(undefined)}
            />
            <Select
              value={fontSizeValue ?? null}
              disabled={fontControlsDisabled}
              onValueChange={(fontSize) => {
                if (!fontSize) return
                setFontSize(fontSize === THEME_DEFAULT_SIZE ? undefined : fontSize)
              }}
            >
              <SelectTrigger className="h-7 w-20 min-w-0 text-xs text-muted-foreground shadow-none">
                <SelectValue>
                  {(value: string | null) => (value && value !== THEME_DEFAULT_SIZE ? value : defaultFontSize)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={THEME_DEFAULT_SIZE}>{tagActive ? "Default" : "Theme default"}</SelectItem>
                <SelectSeparator />
                {FONT_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mx-0.5 h-4 w-px bg-border" />

            <RichTextToolbar editor={activeEditor} />
          </div>

          <DndContext
            sensors={elementSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleElementDragEnd}
          >
            <SortableContext
              items={block.elements.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {block.elements.map((element) => (
                  <ContentElementEditor
                    key={element.id}
                    blockId={block.id}
                    element={element}
                    onFocusEditor={(editor, elementId) => setActive({ kind: "editor", editor, elementId })}
                    onFocusTag={(elementId) => setActive({ kind: "tag", elementId })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {canAddElement && (
            <div data-no-print>
              <button
                type="button"
                className="mt-1 inline-flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
                onClick={() => dispatch({ type: "ADD_ELEMENT", blockId: block.id })}
              >
                <Plus className="size-3.5" />
                Add element
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
