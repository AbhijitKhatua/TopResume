import { arrayMove } from "@dnd-kit/sortable"

import { createBlock, createElement } from "./default-state"
import { MAX_PAGE_MARGIN, MIN_PAGE_MARGIN } from "./page-layout"
import type { Block, ContentElement, LinkItem, PersonalInfo, ResumeData, ThemeId } from "./types"
import { MAX_ELEMENTS_PER_BLOCK } from "./types"

export type ResumeAction =
  | { type: "SET_PERSONAL"; patch: Partial<PersonalInfo> }
  | { type: "SET_PHOTO"; photoPath: string | null }
  | { type: "ADD_LINK" }
  | { type: "UPDATE_LINK"; id: string; patch: Partial<LinkItem> }
  | { type: "REMOVE_LINK"; id: string }
  | { type: "ADD_BLOCK" }
  | { type: "REMOVE_BLOCK"; id: string }
  | { type: "UPDATE_BLOCK_TITLE"; id: string; title: string }
  | { type: "SET_BLOCK_WIDTH"; id: string; width: "full" | "half" }
  | { type: "SET_BLOCK_ALIGN"; id: string; align: "left" | "right" }
  | { type: "REORDER_BLOCKS"; activeId: string; overId: string }
  | { type: "ADD_ELEMENT"; blockId: string }
  | { type: "REMOVE_ELEMENT"; blockId: string; elementId: string }
  | { type: "DUPLICATE_ELEMENT"; blockId: string; elementId: string }
  | { type: "REORDER_ELEMENTS"; blockId: string; activeId: string; overId: string }
  | { type: "UPDATE_ELEMENT_CONTENT"; blockId: string; elementId: string; patch: Partial<ContentElement> }
  | { type: "SET_THEME"; themeId: ThemeId }
  | { type: "SET_PAGE_MARGIN"; margin: number }
  | { type: "LOAD_STATE"; data: ResumeData }
  | { type: "RESET"; data: ResumeData }

function updateBlock(blocks: Block[], id: string, fn: (block: Block) => Block): Block[] {
  return blocks.map((block) => (block.id === id ? fn(block) : block))
}

// The right-aligned tag field used to be called `date`. Loaded resumes (from
// localStorage or the DB) may still carry that key, so map it onto `tag` when
// hydrating so older saves don't lose their value. Both load paths funnel
// through LOAD_STATE, making this the single place to normalize.
function normalizeLoaded(data: ResumeData): ResumeData {
  return {
    ...data,
    blocks: data.blocks.map((block) => ({
      ...block,
      elements: block.elements.map((element) => {
        const legacy = element as ContentElement & { date?: string }
        if (legacy.date === undefined || legacy.tag !== undefined) return element
        const { date, ...rest } = legacy
        return { ...rest, tag: date }
      }),
    })),
  }
}

export function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case "SET_PERSONAL":
      return { ...state, personal: { ...state.personal, ...action.patch } }

    case "SET_PHOTO":
      // Store the Blob pathname; clear any legacy inline data URL.
      return { ...state, personal: { ...state.personal, photoPath: action.photoPath, photoDataUrl: null } }

    case "ADD_LINK":
      return {
        ...state,
        personal: {
          ...state.personal,
          links: [...state.personal.links, { id: crypto.randomUUID(), label: "", url: "" }],
        },
      }

    case "UPDATE_LINK":
      return {
        ...state,
        personal: {
          ...state.personal,
          links: state.personal.links.map((link) =>
            link.id === action.id ? { ...link, ...action.patch } : link,
          ),
        },
      }

    case "REMOVE_LINK":
      return {
        ...state,
        personal: {
          ...state.personal,
          links: state.personal.links.filter((link) => link.id !== action.id),
        },
      }

    case "ADD_BLOCK":
      return { ...state, blocks: [...state.blocks, createBlock()] }

    case "REMOVE_BLOCK":
      return { ...state, blocks: state.blocks.filter((block) => block.id !== action.id) }

    case "UPDATE_BLOCK_TITLE":
      return { ...state, blocks: updateBlock(state.blocks, action.id, (b) => ({ ...b, title: action.title })) }

    case "SET_BLOCK_WIDTH":
      return { ...state, blocks: updateBlock(state.blocks, action.id, (b) => ({ ...b, width: action.width })) }

    case "SET_BLOCK_ALIGN":
      return { ...state, blocks: updateBlock(state.blocks, action.id, (b) => ({ ...b, align: action.align })) }

    case "REORDER_BLOCKS": {
      const fromIndex = state.blocks.findIndex((b) => b.id === action.activeId)
      const toIndex = state.blocks.findIndex((b) => b.id === action.overId)
      if (fromIndex === -1 || toIndex === -1) return state
      return { ...state, blocks: arrayMove(state.blocks, fromIndex, toIndex) }
    }

    case "ADD_ELEMENT":
      return {
        ...state,
        blocks: updateBlock(state.blocks, action.blockId, (b) =>
          b.elements.length >= MAX_ELEMENTS_PER_BLOCK
            ? b
            : { ...b, elements: [...b.elements, createElement()] },
        ),
      }

    case "REMOVE_ELEMENT":
      return {
        ...state,
        blocks: updateBlock(state.blocks, action.blockId, (b) => ({
          ...b,
          elements: b.elements.filter((el) => el.id !== action.elementId),
        })),
      }

    case "DUPLICATE_ELEMENT":
      return {
        ...state,
        blocks: updateBlock(state.blocks, action.blockId, (b) => {
          if (b.elements.length >= MAX_ELEMENTS_PER_BLOCK) return b
          const index = b.elements.findIndex((el) => el.id === action.elementId)
          if (index === -1) return b
          const copy: ContentElement = { ...b.elements[index]!, id: crypto.randomUUID() }
          const elements = [...b.elements]
          elements.splice(index + 1, 0, copy)
          return { ...b, elements }
        }),
      }

    case "REORDER_ELEMENTS":
      return {
        ...state,
        blocks: updateBlock(state.blocks, action.blockId, (b) => {
          const fromIndex = b.elements.findIndex((el) => el.id === action.activeId)
          const toIndex = b.elements.findIndex((el) => el.id === action.overId)
          if (fromIndex === -1 || toIndex === -1) return b
          return { ...b, elements: arrayMove(b.elements, fromIndex, toIndex) }
        }),
      }

    case "UPDATE_ELEMENT_CONTENT":
      return {
        ...state,
        blocks: updateBlock(state.blocks, action.blockId, (b) => ({
          ...b,
          elements: b.elements.map((el) =>
            el.id === action.elementId ? ({ ...el, ...action.patch } as ContentElement) : el,
          ),
        })),
      }

    case "SET_THEME":
      return { ...state, themeId: action.themeId }

    case "SET_PAGE_MARGIN":
      return { ...state, pageMargin: Math.min(MAX_PAGE_MARGIN, Math.max(MIN_PAGE_MARGIN, action.margin)) }

    case "LOAD_STATE":
      return normalizeLoaded(action.data)

    case "RESET":
      return action.data

    default:
      return state
  }
}
