"use client"

import * as React from "react"
import { ImagePlus, Loader2, X } from "lucide-react"

import { useResumeDispatch, useResumeState } from "@/lib/resume/context"
import { photoSrc } from "@/lib/resume/photo"
import { cn } from "@workspace/ui/lib/utils"

const MAX_DIMENSION = 500
const IMAGE_QUALITY = 0.85

// Formats we can re-encode to directly; anything else falls back to JPEG.
const PRESERVED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

/** Reads, downscales, and re-encodes an image, preserving jpeg/png/webp format. */
async function downscaleImage(file: File): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error("Could not read image"))
    image.src = dataUrl
  })

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas not supported")
  ctx.drawImage(img, 0, 0, width, height)

  const outputType = PRESERVED_TYPES.has(file.type) ? file.type : "image/jpeg"
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      outputType,
      IMAGE_QUALITY,
    )
  })
}

async function uploadPhoto(blob: Blob): Promise<string> {
  const res = await fetch("/api/photo", {
    method: "POST",
    headers: { "content-type": blob.type },
    body: blob,
  })
  if (!res.ok) throw new Error(`Upload failed (${res.status})`)
  const json = (await res.json()) as { pathname: string }
  return json.pathname
}

function deletePhoto(pathname: string): void {
  // Fire-and-forget cleanup of the previous blob.
  void fetch(`/api/photo?pathname=${encodeURIComponent(pathname)}`, { method: "DELETE" })
}

export function PhotoUpload({ className }: { className?: string }) {
  const { personal } = useResumeState()
  const dispatch = useResumeDispatch()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)

  const src = photoSrc(personal)

  async function handleFile(file: File | undefined) {
    setError(null)
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }
    setBusy(true)
    try {
      const blob = await downscaleImage(file)
      const previous = personal.photoPath
      const pathname = await uploadPhoto(blob)
      dispatch({ type: "SET_PHOTO", photoPath: pathname })
      if (previous && previous !== pathname) deletePhoto(previous)
    } catch {
      setError("Could not upload that image.")
    } finally {
      setBusy(false)
    }
  }

  function handleRemove() {
    setError(null)
    if (personal.photoPath) deletePhoto(personal.photoPath)
    dispatch({ type: "SET_PHOTO", photoPath: null })
  }

  return (
    <div className={cn("flex flex-col items-center gap-1", className)} data-no-print>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="group relative size-24 overflow-hidden rounded-full border-2 border-dashed border-border bg-muted transition-colors hover:border-primary disabled:opacity-70"
        aria-label="Upload photo"
      >
        {busy ? (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
          </span>
        ) : src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Profile" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-muted-foreground">
            <ImagePlus className="size-6" />
          </span>
        )}
      </button>
      {src && !busy && (
        <button
          type="button"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <X className="size-3" /> Remove photo
        </button>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
