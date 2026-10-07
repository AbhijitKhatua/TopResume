import type { JSONContent } from "@tiptap/core"

import { DEFAULT_PAGE_MARGIN } from "./page-layout"
import { DEFAULT_TEXT_SIZE_OFFSET } from "./text-size"
import type { Block, ContentElement, PersonalInfo, ResumeData } from "./types"

/**
 * Shape version of the persisted `ResumeData`. Bump this whenever the stored
 * shape changes, and teach `normalizeLoaded` (reducer.ts) to upgrade the older
 * payload -- both load paths funnel through it, so older saves keep working.
 *
 * 3 -> 4: added `textSizeOffset`.
 */
export const RESUME_DATA_VERSION = 4

export function emptyElementDoc(): JSONContent {
  return { type: "doc", content: [{ type: "paragraph" }] }
}

export function createElement(): ContentElement {
  return { id: crypto.randomUUID(), contentJSON: emptyElementDoc() }
}

export function createBlock(title = "New Section"): Block {
  return {
    id: crypto.randomUUID(),
    title,
    width: "full",
    align: "left",
    elements: [createElement()],
  }
}

export function createDefaultPersonalInfo(): PersonalInfo {
  return {
    firstName: "",
    lastName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    links: [],
    summary: "",
    photoDataUrl: null,
  }
}

export function createDefaultResumeData(): ResumeData {
  return {
    personal: createDefaultPersonalInfo(),
    blocks: [createBlock("Work Experience"), createBlock("Education")],
    themeId: "minimal",
    pageMargin: DEFAULT_PAGE_MARGIN,
    textSizeOffset: DEFAULT_TEXT_SIZE_OFFSET,
    version: RESUME_DATA_VERSION,
  }
}
