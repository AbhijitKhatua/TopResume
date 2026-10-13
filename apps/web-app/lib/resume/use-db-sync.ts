"use client"

import * as React from "react"

import { useSession } from "@/lib/auth/client"
import { useResumeDispatch, useResumeState } from "./context"
import { createDefaultResumeData } from "./default-state"
import type { ResumeData } from "./types"

export type SaveStatus = "idle" | "loading" | "saving" | "saved" | "error"

export interface ResumeSyncState {
  status: SaveStatus
  /** True once the initial DB load (or seed) has completed and it's safe to render. */
  ready: boolean
}

const SAVE_DEBOUNCE_MS = 1000

async function putResume(data: ResumeData): Promise<void> {
  const res = await fetch("/api/resume", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data }),
  })
  if (!res.ok) throw new Error(`Save failed (${res.status})`)
}

/**
 * Syncs the resume with the database for the signed-in user.
 *
 * - On first load, the DB is the source of truth. If the user has no saved
 *   resume yet, the current (localStorage-hydrated) state is seeded into the DB.
 * - After the initial load, every change is autosaved (debounced). localStorage
 *   still runs in parallel as an instant local cache/offline fallback.
 */
export function useResumeDbSync(): ResumeSyncState {
  const state = useResumeState()
  const dispatch = useResumeDispatch()
  const { data: session, isPending } = useSession()

  const [status, setStatus] = React.useState<SaveStatus>("idle")
  const [ready, setReady] = React.useState(false)

  const loadedRef = React.useRef(false)
  // The LOAD_STATE/RESET we dispatch from the DB shouldn't immediately save back.
  const skipNextSaveRef = React.useRef(false)

  const userId = session?.user?.id

  // Initial load / seed. The DB is the source of truth: we do NOT seed from
  // localStorage (that could leak another account's resume) -- a user with no
  // saved resume gets a fresh default.
  React.useEffect(() => {
    if (isPending || !userId || loadedRef.current) return
    let cancelled = false
    setStatus("loading")
    ;(async () => {
      try {
        const res = await fetch("/api/resume")
        if (!res.ok) throw new Error(`Load failed (${res.status})`)
        const json = (await res.json()) as { data: ResumeData | null }
        if (cancelled) return

        skipNextSaveRef.current = true
        if (json.data) {
          dispatch({ type: "LOAD_STATE", data: json.data })
        } else {
          const fresh = createDefaultResumeData()
          dispatch({ type: "RESET", data: fresh })
          await putResume(fresh)
        }
        loadedRef.current = true
        if (!cancelled) {
          setReady(true)
          setStatus("saved")
        }
      } catch {
        // Don't trap the user on the loader if the DB is unreachable; fall back
        // to the local cache and surface the error in the status indicator.
        if (!cancelled) {
          loadedRef.current = true
          setReady(true)
          setStatus("error")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isPending, userId, dispatch])

  // Debounced autosave after the initial load.
  React.useEffect(() => {
    if (!loadedRef.current) return
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }
    setStatus("saving")
    const timeout = window.setTimeout(async () => {
      try {
        await putResume(state)
        setStatus("saved")
      } catch {
        setStatus("error")
      }
    }, SAVE_DEBOUNCE_MS)
    return () => window.clearTimeout(timeout)
  }, [state])

  // If there's genuinely no user (shouldn't happen on the gated route), don't
  // block the UI forever waiting on a DB load that will never run.
  const effectiveReady = ready || (!isPending && !userId)

  return { status, ready: effectiveReady }
}
