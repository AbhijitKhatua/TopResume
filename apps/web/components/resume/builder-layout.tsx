"use client"

import * as React from "react"

import { BuilderSidebar } from "@/components/resume/builder-sidebar"
import { PrintButton } from "@/components/resume/print-button"
import { ResumeLoading } from "@/components/resume/resume-loading"
import { ResumePreview } from "@/components/resume/resume-preview"
import { SaveStatus } from "@/components/resume/save-status"
import { WordButton } from "@/components/resume/word-button"
import Image from "next/image"
import { useResumeSync } from "@/lib/resume/sync-context"
import { cn } from "@workspace/ui/lib/utils"
import logo from "@/app/logo-white.svg";

const MIN_SIDEBAR_WIDTH = 320
const MAX_SIDEBAR_WIDTH = 640
const DEFAULT_SIDEBAR_WIDTH = 360

export function BuilderLayout() {
  // dnd-kit and Tiptap generate ids/state that can differ between the
  // server-rendered markup and the client's first render. This is a purely
  // client-side, localStorage-backed tool, so we skip SSR for the interactive
  // parts entirely rather than fight hydration mismatches.
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-mount gate, not state sync
    setMounted(true)
  }, [])

  const { ready } = useResumeSync()

  const [sidebarWidth, setSidebarWidth] = React.useState(DEFAULT_SIDEBAR_WIDTH)
  const [isResizing, setIsResizing] = React.useState(false)

  React.useEffect(() => {
    if (!isResizing) return

    function onPointerMove(e: PointerEvent) {
      const next = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, e.clientX))
      setSidebarWidth(next)
    }
    function onPointerUp() {
      setIsResizing(false)
    }

    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [isResizing])

  return (
    <div className="flex h-svh flex-col" data-print-passthrough>
      <div
        className="flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-background px-4"
        data-no-print
      >
        <div className="flex items-center gap-2">
          <Image
            src={logo}
            alt="Resume Builder Logo"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="text-sm font-semibold">Top Resume</span>
        </div>
        <div className="flex items-center gap-3">
          {mounted && <SaveStatus />}
          {/* {mounted && <WordButton />} */}
          {mounted && <PrintButton />}
        </div>
      </div>

      <div className="flex min-h-0 flex-1" data-print-passthrough>
        {!mounted || !ready ? (
          <ResumeLoading />
        ) : (
          <>
            <div
              className="relative shrink-0 border-r bg-background"
              style={{ width: sidebarWidth }}
              data-no-print
            >
              <BuilderSidebar />
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize sidebar"
                onPointerDown={(e) => {
                  e.preventDefault()
                  setIsResizing(true)
                }}
                className={cn(
                  "absolute top-0 right-0 z-10 h-full w-1.5 -mr-0.5 cursor-col-resize touch-none hover:bg-primary/30",
                  isResizing && "bg-primary/40",
                )}
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto bg-muted/40 p-8" data-print-passthrough>
              <ResumePreview />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
