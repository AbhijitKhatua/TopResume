"use client"

import * as React from "react"

import { useResumeState } from "@/lib/resume/context"
import { photoSrc } from "@/lib/resume/photo"
import {
  HEADER_DETAIL_FONT_SIZE,
  HEADER_NAME_FONT_SIZE,
  HEADER_TITLE_FONT_SIZE,
  withTextSizeOffset,
} from "@/lib/resume/text-size"
import { THEMES } from "@/lib/resume/themes"
import { cn } from "@workspace/ui/lib/utils"

export function PersonalHeaderPreview() {
  const { personal, themeId, pageMargin } = useResumeState()
  const theme = THEMES[themeId]
  const isSidebar = theme.background.kind === "sidebar"
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ")

  const contactLine = [personal.email, personal.phone, personal.location].filter(Boolean)

  const textContent = (
    <div className="min-w-0 flex-1">
      <h1
        className="font-bold break-words"
        style={{
          fontFamily: "var(--resume-heading-font)",
          fontSize: withTextSizeOffset(HEADER_NAME_FONT_SIZE),
        }}
      >
        {fullName || "Your Name"}
      </h1>
      {personal.title && (
        <p
          className="mt-0.5 break-words"
          style={{
            color: isSidebar ? undefined : "var(--resume-accent)",
            fontSize: withTextSizeOffset(HEADER_TITLE_FONT_SIZE),
          }}
        >
          {personal.title}
        </p>
      )}
      {contactLine.length > 0 && (
        <p
          className={cn("mt-2 break-words", isSidebar && "opacity-90")}
          style={{
            ...(isSidebar ? {} : { color: "#57606a" }),
            fontSize: withTextSizeOffset(HEADER_DETAIL_FONT_SIZE),
          }}
        >
          {contactLine.join(" · ")}
        </p>
      )}
      {personal.links.length > 0 && (
        <p
          className={cn("mt-1 break-words", isSidebar && "opacity-90")}
          style={{
            ...(isSidebar ? {} : { color: "#57606a" }),
            fontSize: withTextSizeOffset(HEADER_DETAIL_FONT_SIZE),
          }}
        >
          {personal.links
            .filter((l) => l.url)
            .map((l, i) => (
              <React.Fragment key={l.id}>
                {i > 0 && " · "}
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {l.label || l.url}
                </a>
              </React.Fragment>
            ))}
        </p>
      )}
      {personal.summary && (
        <p
          className="mt-3 leading-relaxed break-words"
          style={{ fontSize: withTextSizeOffset(HEADER_DETAIL_FONT_SIZE) }}
        >
          {personal.summary}
        </p>
      )}
    </div>
  )

  const body = (
    <div className="flex items-start gap-4">
      {photoSrc(personal) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoSrc(personal)!}
          alt=""
          className="size-24 shrink-0 rounded-full object-cover border-2 border-[var(--resume-accent)]/20"
        />
      )}
      {textContent}
    </div>
  )

  const paddingStyle = { padding: pageMargin, paddingBottom: pageMargin * 0.75 }

  if (isSidebar) {
    return (
      <div
        className="flex flex-col"
        style={{ ...paddingStyle, background: "var(--resume-bg)", color: "var(--resume-sidebar-fg)" }}
      >
        {body}
      </div>
    )
  }

  return (
    <div className="border-b border-[var(--resume-accent)]/20" style={paddingStyle}>
      {body}
    </div>
  )
}
