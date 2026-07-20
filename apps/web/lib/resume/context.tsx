"use client"

import * as React from "react"

import { createDefaultResumeData } from "./default-state"
import { resumeReducer, type ResumeAction } from "./reducer"
import type { ResumeData } from "./types"
import { useLocalStorageSync } from "./use-local-storage-sync"

const ResumeStateContext = React.createContext<ResumeData | null>(null)
const ResumeDispatchContext = React.createContext<React.Dispatch<ResumeAction> | null>(null)

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(resumeReducer, undefined, createDefaultResumeData)

  useLocalStorageSync(state, dispatch)

  return (
    <ResumeStateContext.Provider value={state}>
      <ResumeDispatchContext.Provider value={dispatch}>{children}</ResumeDispatchContext.Provider>
    </ResumeStateContext.Provider>
  )
}

export function useResumeState(): ResumeData {
  const ctx = React.useContext(ResumeStateContext)
  if (!ctx) throw new Error("useResumeState must be used within a ResumeProvider")
  return ctx
}

export function useResumeDispatch(): React.Dispatch<ResumeAction> {
  const ctx = React.useContext(ResumeDispatchContext)
  if (!ctx) throw new Error("useResumeDispatch must be used within a ResumeProvider")
  return ctx
}
