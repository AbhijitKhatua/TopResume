"use client"

import { Check } from "lucide-react"

import { useResumeDispatch, useResumeState } from "@/lib/resume/context"
import { MAX_PAGE_MARGIN, MIN_PAGE_MARGIN, PAGE_MARGIN_STEP } from "@/lib/resume/page-layout"
import { THEME_LIST } from "@/lib/resume/themes"
import { Slider } from "@workspace/ui/components/slider"
import { cn } from "@workspace/ui/lib/utils"

export function StylePanel() {
  const { themeId, pageMargin } = useResumeState()
  const dispatch = useResumeDispatch()

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Page margin</p>
          <span className="text-xs text-muted-foreground">{pageMargin}px</span>
        </div>
        <Slider
          value={[pageMargin]}
          min={MIN_PAGE_MARGIN}
          max={MAX_PAGE_MARGIN}
          step={PAGE_MARGIN_STEP}
          onValueChange={(value) => {
            const next = Array.isArray(value) ? value[0] : value
            dispatch({ type: "SET_PAGE_MARGIN", margin: next })
          }}
        />
        <p className="text-xs text-muted-foreground">Controls the whitespace around the page content.</p>
      </div>

      <p className="text-xs text-muted-foreground">Choose a theme for your resume</p>
      {THEME_LIST.map((theme) => {
        const isActive = theme.id === themeId
        return (
          <button
            key={theme.id}
            type="button"
            onClick={() => dispatch({ type: "SET_THEME", themeId: theme.id })}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors hover:bg-secondary/60",
              isActive && "border-foreground bg-secondary/60",
            )}
          >
            <span
              className="size-9 shrink-0 rounded-md border"
              style={{ background: theme.background.value }}
            />
            <span className="flex-1">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                {theme.name}
                {isActive && <Check className="size-3.5" />}
              </span>
              <span className="text-xs text-muted-foreground">{theme.description}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
