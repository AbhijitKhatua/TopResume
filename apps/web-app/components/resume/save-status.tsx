"use client"

import { Check, CloudOff, Loader2 } from "lucide-react"

import { useResumeSync } from "@/lib/resume/sync-context"

export function SaveStatus() {
  const { status } = useResumeSync()

  if (status === "idle") return null

  const content = {
    loading: { icon: <Loader2 className="size-3.5 animate-spin" />, label: "Loading…", cls: "text-muted-foreground" },
    saving: { icon: <Loader2 className="size-3.5 animate-spin" />, label: "Saving…", cls: "text-muted-foreground" },
    saved: { icon: <Check className="size-3.5" />, label: "Saved", cls: "text-muted-foreground" },
    error: { icon: <CloudOff className="size-3.5" />, label: "Save failed", cls: "text-destructive" },
  }[status]

  return (
    <span className={`flex items-center gap-1.5 text-xs ${content.cls}`} data-no-print aria-live="polite">
      {content.icon}
      {content.label}
    </span>
  )
}
