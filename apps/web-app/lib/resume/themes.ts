import type { ThemeId } from "./types"

export interface ThemeConfig {
  id: ThemeId
  name: string
  description: string
  headingFont: string
  bodyFont: string
  accentColor: string
  canvasClassName: string
  background: {
    kind: "flat" | "sidebar" | "gradient" | "geometric"
    value: string
  }
  sidebarForeground?: string
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Clean, plenty of whitespace, single accent color.",
    headingFont: "Inter",
    bodyFont: "Inter",
    accentColor: "#111827",
    canvasClassName: "resume-theme-minimal",
    background: { kind: "flat", value: "#ffffff" },
  },
  "classic-serif": {
    id: "classic-serif",
    name: "Classic Serif",
    description: "Traditional serif type, ideal for formal roles.",
    headingFont: "Playfair Display",
    bodyFont: "Lora",
    accentColor: "#7c2d12",
    canvasClassName: "resume-theme-classic-serif",
    background: { kind: "flat", value: "#fdfcf9" },
  },
  "modern-sidebar": {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    description: "Colored side panel for photo and contact details.",
    headingFont: "Poppins",
    bodyFont: "Work Sans",
    accentColor: "#0f766e",
    canvasClassName: "resume-theme-modern-sidebar",
    background: { kind: "sidebar", value: "#0f766e" },
    sidebarForeground: "#ffffff",
  },
  "creative-gradient": {
    id: "creative-gradient",
    name: "Creative Gradient",
    description: "Soft gradient backdrop with bold heading color.",
    headingFont: "Archivo Black",
    bodyFont: "Nunito Sans",
    accentColor: "#a21caf",
    canvasClassName: "resume-theme-creative-gradient",
    background: {
      kind: "gradient",
      value: "linear-gradient(135deg, #f5d0fe 0%, #ede9fe 50%, #dbeafe 100%)",
    },
  },
  "bold-geometric": {
    id: "bold-geometric",
    name: "Bold Geometric",
    description: "High-contrast geometric accents for a creative edge.",
    headingFont: "Anton",
    bodyFont: "Barlow",
    accentColor: "#f59e0b",
    canvasClassName: "resume-theme-bold-geometric",
    background: {
      kind: "geometric",
      value:
        "repeating-linear-gradient(135deg, rgba(245,158,11,0.08) 0px, rgba(245,158,11,0.08) 2px, transparent 2px, transparent 24px)",
    },
  },
  doctor: {
    id: "doctor",
    name: "Doctor",
    description: "Clinical, authoritative layout with a deep medical-blue header.",
    headingFont: "Merriweather",
    bodyFont: "Source Sans 3",
    accentColor: "#0b4f6c",
    canvasClassName: "resume-theme-doctor",
    background: { kind: "sidebar", value: "#0b4f6c" },
    sidebarForeground: "#ffffff",
  },
  minecraft: {
    id: "minecraft",
    name: "Minecraft",
    description: "Blocky, pixel-inspired look with a grass-green header and monospace type.",
    headingFont: "Space Mono",
    bodyFont: "IBM Plex Mono",
    accentColor: "#4d7c0f",
    canvasClassName: "resume-theme-minecraft",
    background: { kind: "sidebar", value: "#5b8731" },
    sidebarForeground: "#ffffff",
  },
}

export const THEME_LIST = Object.values(THEMES)
