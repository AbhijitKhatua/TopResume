"use client"

import * as React from "react"
import { FileText } from "lucide-react"

import { useResumeState } from "@/lib/resume/context"
import { exportResumeToDocx } from "@/lib/resume/export-docx"
import { Button } from "@workspace/ui/components/button"

export function WordButton() {
  const state = useResumeState()
  const [loading, setLoading] = React.useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      await exportResumeToDocx(state)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={handleClick} disabled={loading}>
      <FileText className="size-4" />
      {loading ? "Preparing…" : "Download Word"}
    </Button>
  )
}
