"use client"

import * as React from "react"

import { findGoogleFont } from "./google-fonts"

const loadedFamilies = new Set<string>()

function loadFont(family: string) {
  if (!family || loadedFamilies.has(family)) return
  loadedFamilies.add(family)

  const def = findGoogleFont(family)
  const weights = def?.weights ?? [400, 700]
  const encodedFamily = family.trim().replace(/\s+/g, "+")
  const href = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weights.join(";")}&display=swap`

  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  link.dataset.googleFont = family
  document.head.appendChild(link)
}

export function useGoogleFont(family: string | undefined) {
  React.useEffect(() => {
    if (family) loadFont(family)
  }, [family])
}

export function useGoogleFonts(families: (string | undefined)[]) {
  const key = families.filter(Boolean).sort().join("|")
  React.useEffect(() => {
    for (const family of families) {
      if (family) loadFont(family)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
