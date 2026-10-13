"use client"

import * as React from "react"

import { useResumeDbSync, type ResumeSyncState } from "./use-db-sync"

const ResumeSyncContext = React.createContext<ResumeSyncState | null>(null)

/**
 * Runs the DB sync exactly once and exposes its status/ready flag so both the
 * save indicator and the layout gate can consume it without duplicate syncs.
 */
export function ResumeSyncProvider({ children }: { children: React.ReactNode }) {
  const sync = useResumeDbSync()
  return <ResumeSyncContext.Provider value={sync}>{children}</ResumeSyncContext.Provider>
}

export function useResumeSync(): ResumeSyncState {
  const ctx = React.useContext(ResumeSyncContext)
  if (!ctx) throw new Error("useResumeSync must be used within a ResumeSyncProvider")
  return ctx
}
