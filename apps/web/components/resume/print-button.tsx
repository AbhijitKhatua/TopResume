"use client"

import { Printer } from "lucide-react"

import { Button } from "@workspace/ui/components/button"

export function PrintButton() {
  return (
    <div data-no-print>
      <Button type="button" size="sm" className="gap-1.5" onClick={() => window.print()}>
        <Printer className="size-4" />
        Download PDF
      </Button>
    </div>
  )
}
