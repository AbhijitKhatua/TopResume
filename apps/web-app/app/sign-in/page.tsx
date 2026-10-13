"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

import { signIn } from "@/lib/auth/client"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

export default function SignInPage() {
  return (
    <React.Suspense>
      <SignInForm />
    </React.Suspense>
  )
}

function SignInForm() {
  const router = useRouter()
  const [pending, setPending] = React.useState<null | "email" | "google" | "apple">(null)
  const [error, setError] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState("")
  const notice = useSearchParams().get("reset") ? "Password updated. Sign in with your new password." : null

  async function onEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending("email")
    setError(null)
    const { error } = await signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    })
    setPending(null)
    if (error) {
      setError(error.message ?? "Could not sign in.")
      return
    }
    router.push("/")
  }

  async function onSocial(provider: "google" | "apple") {
    setPending(provider)
    setError(null)
    const { error } = await signIn.social({ provider, callbackURL: "/" })
    if (error) {
      setPending(null)
      setError(error.message ?? `Could not sign in with ${provider}.`)
    }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-sm flex-col justify-center gap-6 p-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your Top Resume account</p>
      </div>

      <div className="flex flex-col gap-2">
        <Button type="button" variant="outline" disabled={!!pending} onClick={() => onSocial("google")}>
          {pending === "google" ? "Redirecting…" : "Continue with Google"}
        </Button>
        <Button type="button" variant="outline" disabled={!!pending} onClick={() => onSocial("apple")}>
          {pending === "apple" ? "Redirecting…" : "Continue with Apple"}
        </Button>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onEmailSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href={email ? `/forgot-password?email=${encodeURIComponent(email)}` : "/forgot-password"}
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        {notice && !error && <p className="text-sm text-muted-foreground">{notice}</p>}
        {error && (
          <p className="text-sm text-destructive">
            {error}{" "}
            <Link
              href={email ? `/forgot-password?email=${encodeURIComponent(email)}` : "/forgot-password"}
              className="font-medium underline underline-offset-4"
            >
              Reset your password
            </Link>
          </p>
        )}
        <Button type="submit" disabled={!!pending}>
          {pending === "email" ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
