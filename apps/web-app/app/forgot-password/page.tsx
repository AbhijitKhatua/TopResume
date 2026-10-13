"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { requestPasswordReset } from "@/lib/auth/client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function ForgotPasswordPage() {
  return (
    <React.Suspense>
      <ForgotPasswordForm />
    </React.Suspense>
  )
}

function ForgotPasswordForm() {
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [sentTo, setSentTo] = React.useState<string | null>(null)
  // Prefilled from ?email= (passed along from the sign-in page).
  const defaultEmail = useSearchParams().get("email") ?? ""

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get("email"))
    setPending(true)
    setError(null)
    const { error } = await requestPasswordReset({ email, redirectTo: "/reset-password" })
    setPending(false)
    if (error) {
      setError(error.message ?? "Could not send the reset email.")
      return
    }
    setSentTo(email)
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          {sentTo
            ? `If an account exists for ${sentTo}, we've sent a link to reset your password.`
            : "Enter your email and we'll send you a link to reset it."}
        </p>
      </div>

      {!sentTo && (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={defaultEmail}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/sign-in" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
