"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { signOut, useSession } from "@/lib/auth/client"
import { clearResumeStorage } from "@/lib/resume/use-local-storage-sync"
import { Button } from "@workspace/ui/components/button"

function initialsFrom(name?: string | null, email?: string | null): string {
  const source = name?.trim() || email?.trim() || "?"
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

export function UserMenu() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [signingOut, setSigningOut] = React.useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    // Drop the cached resume so it can't flash for the next account on this browser.
    clearResumeStorage()
    router.push("/sign-up")
    router.refresh()
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2 border-t p-3" data-no-print>
        <div className="size-8 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const user = session?.user
  if (!user) return null

  return (
    <div className="flex items-center gap-2 border-t p-3" data-no-print>
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" className="size-8 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
          {initialsFrom(user.name, user.email)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{user.name || "Account"}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
        aria-label="Sign out"
        disabled={signingOut}
        onClick={handleSignOut}
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
