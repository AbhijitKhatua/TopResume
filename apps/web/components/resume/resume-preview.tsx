"use client"

import * as React from "react"
import type { JSONContent } from "@tiptap/core"

import { BlockRow } from "@/components/resume/block-row"
import { PersonalHeaderPreview } from "@/components/resume/personal-header-preview"
import { ResumePage } from "@/components/resume/resume-page"
import { useResumeState } from "@/lib/resume/context"
import { getPageContentWidth } from "@/lib/resume/page-layout"
import { THEMES } from "@/lib/resume/themes"
import { useGoogleFonts } from "@/lib/resume/use-google-font"
import { usePaginatedBlocks } from "@/lib/resume/use-paginated-blocks"

// Walk a rich-text document and add any `fontFamily` set via textStyle marks to
// the given set, so per-word font overrides get their webfonts loaded.
function collectMarkFonts(node: JSONContent | undefined, families: Set<string>) {
  if (!node) return
  for (const mark of node.marks ?? []) {
    const family = mark.attrs?.fontFamily
    if (typeof family === "string" && family) families.add(family)
  }
  for (const child of node.content ?? []) collectMarkFonts(child, families)
}

export function ResumePreview() {
  const state = useResumeState()
  const theme = THEMES[state.themeId]

  const usedFonts = React.useMemo(() => {
    const families = new Set<string>([theme.headingFont, theme.bodyFont])
    for (const block of state.blocks) {
      for (const element of block.elements) {
        if (element.fontFamily) families.add(element.fontFamily)
        if (element.tagFontFamily) families.add(element.tagFontFamily)
        // Per-word font overrides live as fontFamily marks inside contentJSON,
        // so walk the doc to collect those too or their webfonts won't load.
        collectMarkFonts(element.contentJSON, families)
      }
    }
    return Array.from(families)
  }, [theme, state.blocks])

  useGoogleFonts(usedFonts)

  const { pages, rows, measureRef } = usePaginatedBlocks(state.blocks, state.pageMargin)

  // Paint the theme background onto the page itself. `sidebar` themes keep a
  // white page (their color lives in the header band), while flat/gradient/
  // geometric themes render their fill/pattern across the whole sheet.
  const pageBackground: React.CSSProperties = React.useMemo(() => {
    const bg = theme.background
    switch (bg.kind) {
      case "flat":
      case "gradient":
        return { background: bg.value }
      case "geometric":
        // Pattern has transparent gaps, so keep the white base and layer it on.
        return { backgroundColor: "#ffffff", backgroundImage: bg.value }
      default:
        return {}
    }
  }, [theme])

  const themeStyle: React.CSSProperties = {
    "--resume-accent": theme.accentColor,
    "--resume-heading-font": `"${theme.headingFont}", sans-serif`,
    "--resume-body-font": `"${theme.bodyFont}", sans-serif`,
    "--resume-bg": theme.background.value,
    "--resume-sidebar-fg": theme.sidebarForeground ?? "#ffffff",
    fontFamily: "var(--resume-body-font)",
    color: "#1f2328",
    colorScheme: "light",
  } as React.CSSProperties

  return (
    <div id="resume-preview" className={theme.canvasClassName} style={themeStyle}>
      <div
        ref={measureRef}
        aria-hidden
        data-no-print
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          width: getPageContentWidth(state.pageMargin),
          top: -99999,
        }}
      >
        <PersonalHeaderPreview />
        <div>
          {rows.map((row) => (
            <div key={row.id}>
              <BlockRow row={row} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {pages.map((pageRows, i) => (
          <ResumePage
            key={i}
            margin={state.pageMargin}
            background={pageBackground}
            header={i === 0 ? <PersonalHeaderPreview /> : undefined}
          >
            {pageRows.map((row) => (
              <BlockRow key={row.id} row={row} />
            ))}
            {pageRows.length === 0 && i === 0 && (
              <p className="text-sm" style={{ color: "#57606a", width: "100%" }} data-no-print>
                Add sections from the Blocks tab to see them here.
              </p>
            )}
          </ResumePage>
        ))}
      </div>
    </div>
  )
}
