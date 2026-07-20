"use client"

import * as React from "react"

import { createDefaultResumeData } from "./default-state"
import type { ResumeAction } from "./reducer"
import type { ResumeData } from "./types"

export const STORAGE_KEY = "topresume:resume-data"
const SAVE_DEBOUNCE_MS = 500

/** Clears the cached resume (used on sign-out so it can't leak to the next account). */
export function clearResumeStorage() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore storage errors
  }
}

function migrate(data: unknown): ResumeData {
  if (!data || typeof data !== "object") return createDefaultResumeData()
  const candidate = data as Partial<ResumeData>
  if (candidate.version !== 3 || !candidate.personal || !Array.isArray(candidate.blocks)) {
    return createDefaultResumeData()
  }
  return candidate as ResumeData
}

export function useLocalStorageSync(state: ResumeData, dispatch: React.Dispatch<ResumeAction>) {
  const hydrated = React.useRef(false)

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = migrate(JSON.parse(raw))
        dispatch({ type: "LOAD_STATE", data: parsed })
      }
    } catch {
      // corrupt localStorage contents: keep the in-memory default state
    } finally {
      hydrated.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (!hydrated.current) return
    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      } catch {
        // e.g. quota exceeded: silently skip this save cycle
      }
    }, SAVE_DEBOUNCE_MS)
    return () => window.clearTimeout(timeout)
  }, [state])
}
