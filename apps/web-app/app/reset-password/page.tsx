"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { resetPassword } from "@/lib/auth/client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function ResetPasswordPage() {
  return (
    <React.Suspense>
      <ResetPasswordForm />
    </React.Suspense>
  )
}

function ResetPasswordForm() {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  // Better Auth redirects here from the email link with ?token=… or
  // ?error=INVALID_TOKEN when the link is invalid or expired.
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!token) return
    const form = new FormData(e.currentTarget)
    const newPassword = String(form.get("password"))
    if (newPassword !== String(form.get("confirm"))) {
      setError("Passwords don't match.")
      return
    }
    setPending(true)
    setError(null)
    const { error } = await resetPassword({ newPassword, token })
    setPending(false)
    if (error) {
      setError(error.message ?? "Could not reset your password.")
      return
    }
    router.push("/sign-in?reset=1")
  }

  const invalidLink = !token || searchParams.has("error")

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold">{invalidLink ? "Link expired" : "Set a new password"}</h1>
        <p className="text-sm text-muted-foreground">
          {invalidLink
            ? "This reset link is invalid or has expired. Request a new one."
            : "Choose a new password for your Top Resume account."}
        </p>
      </div>

      {invalidLink ? (
        <Button type="button" onClick={() => router.push("/forgot-password")}>
          Request a new link
        </Button>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">New password</Label>
            <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Reset password"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
