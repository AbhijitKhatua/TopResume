"use client"

import { GOOGLE_FONTS } from "@/lib/resume/google-fonts"
import { useGoogleFont } from "@/lib/resume/use-google-font"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

// Sentinel value for the "follow the theme" option. Selecting it clears the
// element's font override (via onReset) so it inherits the theme font again.
const THEME_DEFAULT_VALUE = "__theme_default__"

export function FontPicker({
  value,
  onChange,
  onReset,
  placeholder = "Font",
  className,
  disabled,
}: {
  value: string | undefined
  onChange: (family: string) => void
  /** Clears the override so the element follows the theme font. */
  onReset?: () => void
  placeholder?: string
  className?: string
  disabled?: boolean
}) {
  useGoogleFont(value)

  return (
    <Select
      value={value ?? null}
      onValueChange={(next) => {
        if (!next) return
        if (next === THEME_DEFAULT_VALUE) onReset?.()
        else onChange(next)
      }}
      disabled={disabled}
    >
      <SelectTrigger className={className ?? "h-7 w-40 text-xs"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {onReset && (
          <>
            <SelectItem value={THEME_DEFAULT_VALUE}>Theme default</SelectItem>
            <SelectSeparator />
          </>
        )}
        {GOOGLE_FONTS.map((font) => (
          <SelectItem key={font.family} value={font.family}>
            {font.family}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
