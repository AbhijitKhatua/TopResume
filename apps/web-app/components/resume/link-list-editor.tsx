"use client"

import { Plus, X } from "lucide-react"

import { useResumeDispatch, useResumeState } from "@/lib/resume/context"
import { Button } from "@workspace/ui/components/button"
import { FieldDescription } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"

// Links are meant to carry a full address (`https://…`), which is what browsers
// require to autolink and what the PDF export turns into an anchor href.
function isValidLinkUrl(url: string) {
  if (!url) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}


export function LinkListEditor() {
  const { personal } = useResumeState()
  const dispatch = useResumeDispatch()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {personal.links.map((link) => {
        const urlValid = isValidLinkUrl(link.url)
        return (
          <div key={link.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={link.label}
                onChange={(e) => dispatch({ type: "UPDATE_LINK", id: link.id, patch: { label: e.target.value } })}
                placeholder="Label"
                className="h-7 w-20 border-none px-1 text-xs shadow-none"
                data-no-print
                maxLength={100}
              />
              <Input
                type="url"
                value={link.url}
                onChange={(e) => dispatch({ type: "UPDATE_LINK", id: link.id, patch: { url: e.target.value } })}
                placeholder="https://…"
                className="h-7 w-40 border-none px-1 text-xs shadow-none"
                maxLength={100}
                aria-invalid={!urlValid}
              />
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove link"
                onClick={() => dispatch({ type: "REMOVE_LINK", id: link.id })}
                data-no-print
              >
                <X className="size-3.5" />
              </button>
            </div>
            {!urlValid && (
              <FieldDescription className="px-1 text-destructive" data-no-print>
                Enter a full URL, e.g. https://example.com
              </FieldDescription>
            )}
          </div>
        )
      })}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 gap-1 text-xs text-muted-foreground"
        onClick={() => dispatch({ type: "ADD_LINK" })}
        data-no-print
      >
        <Plus className="size-3.5" />
        Add link
      </Button>
    </div>
  )
}
