"use client"

import * as React from "react"
import { useEditorState, type Editor } from "@tiptap/react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CaseSensitive,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline as UnderlineIcon,
} from "lucide-react"

import { toggleBulletList, toggleOrderedList } from "@/lib/resume/list-commands"
import type { TextCaseMode } from "@/lib/resume/text-transform"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"

// A resume link must be a full http(s) address so it renders as a working
// anchor in the preview/PDF. Empty is treated as valid (means "remove link").
function isValidHref(url: string) {
  if (!url) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

type AlignValue = "left" | "center" | "right"

// Keys are the internal block-type ids (paragraph + heading levels 2–5). The
// display labels are the short tags the user sees; headings are shown starting
// at h1 even though the underlying document uses levels 2–5 (level 1 is the
// resume's name), which the resume CSS styles regardless of level.
const BLOCK_TYPE_LABELS: Record<string, string> = {
  paragraph: "p",
  h2: "h1",
  h3: "h2",
  h4: "h3",
  h5: "h4",
}

const TEXT_CASE_OPTIONS: { mode: TextCaseMode; label: string }[] = [
  { mode: "uppercase", label: "UPPERCASE" },
  { mode: "lowercase", label: "lowercase" },
  { mode: "capitalize", label: "Capitalize Each Word" },
]

export function RichTextToolbar({ editor }: { editor: Editor | null }) {
  const [linkOpen, setLinkOpen] = React.useState(false)
  const [href, setHref] = React.useState("")

  const state = useEditorState({
    editor,
    selector: (ctx) => {
      const e = ctx.editor
      let blockType = "paragraph"
      for (const level of [2, 3, 4, 5] as const) {
        if (e?.isActive("heading", { level })) blockType = `h${level}`
      }
      let align: AlignValue = "left"
      if (e?.isActive({ textAlign: "center" })) align = "center"
      else if (e?.isActive({ textAlign: "right" })) align = "right"
      return {
        blockType,
        bold: e?.isActive("bold") ?? false,
        italic: e?.isActive("italic") ?? false,
        underline: e?.isActive("underline") ?? false,
        bulletList: e?.isActive("bulletList") ?? false,
        orderedList: e?.isActive("orderedList") ?? false,
        subscript: e?.isActive("subscript") ?? false,
        superscript: e?.isActive("superscript") ?? false,
        link: e?.isActive("link") ?? false,
        align,
      }
    },
  })

  function setBlockType(value: string) {
    if (!editor) return
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run()
    } else {
      const level = Number(value.slice(1)) as 2 | 3 | 4 | 5
      editor.chain().focus().setHeading({ level }).run()
    }
  }

  function transformCase(mode: TextCaseMode) {
    editor?.chain().focus().transformCase(mode).run()
  }

  function setAlign(value: AlignValue) {
    editor?.chain().focus().setTextAlign(value).run()
  }

  // Prefill the popover input with the current link when it opens.
  function handleLinkOpenChange(open: boolean) {
    if (open) setHref((editor?.getAttributes("link").href as string | undefined) ?? "")
    setLinkOpen(open)
  }

  function applyLink() {
    if (!editor) return
    const url = href.trim()
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
    setLinkOpen(false)
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run()
    setLinkOpen(false)
  }

  const applyDisabled = !href.trim() || !isValidHref(href.trim())

  return (
    <div className="flex flex-wrap items-center gap-0.5" data-no-print>
      <Select
        value={state?.blockType ?? "paragraph"}
        onValueChange={(value) => value && setBlockType(value)}
        disabled={!editor}
      >
        <SelectTrigger className="h-6 min-w-0 gap-1 border-none px-1.5 text-xs text-muted-foreground shadow-none">
          <SelectValue>{(value: string | null) => (value ? BLOCK_TYPE_LABELS[value] : "")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(BLOCK_TYPE_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mx-0.5 h-4 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.bulletList && "bg-secondary")}
        onClick={() => editor && toggleBulletList(editor)}
        aria-label="Bullet list"
      >
        <List className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.orderedList && "bg-secondary")}
        onClick={() => editor && toggleOrderedList(editor)}
        aria-label="Numbered list"
      >
        <ListOrdered className="size-3.5" />
      </Button>

      <div className="mx-0.5 h-4 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.bold && "bg-secondary")}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        aria-label="Bold"
      >
        <Bold className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.italic && "bg-secondary")}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        aria-label="Italic"
      >
        <Italic className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.underline && "bg-secondary")}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        aria-label="Underline"
      >
        <UnderlineIcon className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.subscript && "bg-secondary")}
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
        aria-label="Subscript"
      >
        <SubscriptIcon className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.superscript && "bg-secondary")}
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
        aria-label="Superscript"
      >
        <SuperscriptIcon className="size-3.5" />
      </Button>

      <div className="mx-0.5 h-4 w-px bg-border" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.align === "left" && "bg-secondary")}
        onClick={() => setAlign("left")}
        aria-label="Align left"
      >
        <AlignLeft className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.align === "center" && "bg-secondary")}
        onClick={() => setAlign("center")}
        aria-label="Align center"
      >
        <AlignCenter className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!editor}
        className={cn("size-6", state?.align === "right" && "bg-secondary")}
        onClick={() => setAlign("right")}
        aria-label="Align right"
      >
        <AlignRight className="size-3.5" />
      </Button>

      <div className="mx-0.5 h-4 w-px bg-border" />

      <Popover open={linkOpen} onOpenChange={handleLinkOpenChange}>
        <PopoverTrigger
          disabled={!editor}
          aria-label="Link"
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground",
            "hover:bg-secondary disabled:pointer-events-none disabled:opacity-50",
            state?.link && "bg-secondary text-foreground",
          )}
        >
          <LinkIcon className="size-3.5" />
        </PopoverTrigger>
        <PopoverContent align="start" className="flex-row items-center gap-1.5">
          <Input
            type="url"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !applyDisabled) {
                e.preventDefault()
                applyLink()
              }
            }}
            placeholder="https://…"
            aria-invalid={!isValidHref(href.trim())}
            className="h-7 flex-1 text-xs"
            autoFocus
          />
          <Button type="button" size="sm" className="h-7 px-2 text-xs" disabled={applyDisabled} onClick={applyLink}>
            Apply
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground"
            disabled={!state?.link}
            onClick={removeLink}
          >
            Remove
          </Button>
        </PopoverContent>
      </Popover>

      <div className="mx-0.5 h-4 w-px bg-border" />

      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={!editor}
          aria-label="Change case"
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground",
            "hover:bg-secondary disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <CaseSensitive className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {TEXT_CASE_OPTIONS.map(({ mode, label }) => (
            <DropdownMenuItem key={mode} onClick={() => transformCase(mode)}>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
