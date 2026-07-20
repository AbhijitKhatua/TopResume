import type { JSONContent } from "@tiptap/core"

import { DEFAULT_PAGE_MARGIN } from "./page-layout"
import type { Block, ContentElement, PersonalInfo, ResumeData } from "./types"

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
    version: 3,
  }
}
