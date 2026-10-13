import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableBorders,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx"
import type { JSONContent } from "@tiptap/core"

import { isElementEmpty } from "./render-html"
import type { Block, ContentElement, ResumeData } from "./types"

const NUMBERING_REFERENCE = "resume-ordered-list"

// Block titles use HEADING_2, so element-level headings (H2-H5 in the UI)
// are shifted down one level to preserve a valid document heading hierarchy.
const DOCX_HEADING_LEVEL = {
  2: HeadingLevel.HEADING_3,
  3: HeadingLevel.HEADING_4,
  4: HeadingLevel.HEADING_5,
  5: HeadingLevel.HEADING_6,
} as const

// Default Letter page width (12240 twips) minus 1in margins on each side.
const PAGE_CONTENT_WIDTH_TWIPS = 9360
const DATE_COLUMN_WIDTH_TWIPS = 1800
const CONTENT_COLUMN_WIDTH_TWIPS = PAGE_CONTENT_WIDTH_TWIPS - DATE_COLUMN_WIDTH_TWIPS

function textRunsFromNode(node: JSONContent): TextRun[] {
  if (!node.content) return []
  return node.content
    .filter((child) => child.type === "text" && child.text)
    .map((child) => {
      const marks = new Set((child.marks ?? []).map((m) => m.type))
      return new TextRun({
        text: child.text ?? "",
        bold: marks.has("bold"),
        italics: marks.has("italic"),
        subScript: marks.has("subscript"),
        superScript: marks.has("superscript"),
      })
    })
}

function paragraphsFromDoc(doc: JSONContent): Paragraph[] {
  const nodes = doc.content ?? []
  const paragraphs: Paragraph[] = []

  for (const node of nodes) {
    if (node.type === "heading") {
      const level = (node.attrs?.level as 2 | 3 | 4 | 5 | undefined) ?? 2
      const runs = textRunsFromNode(node)
      if (runs.length === 0) continue
      paragraphs.push(new Paragraph({ heading: DOCX_HEADING_LEVEL[level], children: runs }))
    } else if (node.type === "paragraph") {
      const runs = textRunsFromNode(node)
      if (runs.length === 0) continue
      paragraphs.push(new Paragraph({ children: runs }))
    } else if (node.type === "bulletList" || node.type === "orderedList") {
      const ordered = node.type === "orderedList"
      for (const listItem of node.content ?? []) {
        for (const inner of listItem.content ?? []) {
          if (inner.type !== "paragraph") continue
          const runs = textRunsFromNode(inner)
          if (runs.length === 0) continue
          paragraphs.push(
            new Paragraph({
              children: runs,
              bullet: ordered ? undefined : { level: 0 },
              numbering: ordered ? { reference: NUMBERING_REFERENCE, level: 0 } : undefined,
            }),
          )
        }
      }
    }
  }

  return paragraphs
}

function paragraphsFromElement(element: ContentElement): (Paragraph | Table)[] {
  if (isElementEmpty(element)) return []

  const paragraphs = paragraphsFromDoc(element.contentJSON)
  if (paragraphs.length === 0) return []

  const tag = element.tag?.trim()
  if (!tag) return paragraphs

  // Convert the tag's optional CSS px size (e.g. "12px") to docx half-points
  // (1px ≈ 1.5 half-points); fall back to the default 20 (10pt) when unset.
  const tagSize = element.tagFontSize ? Math.round(parseFloat(element.tagFontSize) * 1.5) : 20
  const tagRun = new TextRun({
    text: tag,
    size: Number.isFinite(tagSize) && tagSize > 0 ? tagSize : 20,
    color: "555555",
    ...(element.tagFontFamily ? { font: element.tagFontFamily } : {}),
  })

  // Lay the element's content and its tag side by side in a borderless
  // two-column table so the tag stays right-aligned next to the whole
  // element (heading/paragraph/list), matching the on-screen preview.
  return [
    new Table({
      width: { size: PAGE_CONTENT_WIDTH_TWIPS, type: WidthType.DXA },
      columnWidths: [CONTENT_COLUMN_WIDTH_TWIPS, DATE_COLUMN_WIDTH_TWIPS],
      borders: TableBorders.NONE,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: CONTENT_COLUMN_WIDTH_TWIPS, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              margins: { top: 0, bottom: 0, left: 0, right: 200 },
              children: paragraphs,
            }),
            new TableCell({
              width: { size: DATE_COLUMN_WIDTH_TWIPS, type: WidthType.DXA },
              verticalAlign: VerticalAlign.TOP,
              margins: { top: 0, bottom: 0, left: 0, right: 0 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [tagRun],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]
}

function paragraphsFromBlock(block: Block): (Paragraph | Table)[] {
  const elementParagraphs = block.elements.flatMap(paragraphsFromElement)
  if (!block.title && elementParagraphs.length === 0) return []

  const paragraphs: (Paragraph | Table)[] = []
  if (block.title) {
    paragraphs.push(
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: block.title })] }),
    )
  }
  paragraphs.push(...elementParagraphs)
  return paragraphs
}

function buildDocument(resume: ResumeData): Document {
  const { personal } = resume
  const fullName = [personal.firstName, personal.lastName].filter(Boolean).join(" ") || "Your Name"
  const contactLine = [personal.email, personal.phone, personal.location].filter(Boolean).join("  ·  ")
  const linksLine = personal.links
    .filter((l) => l.url)
    .map((l) => (l.label ? `${l.label}: ${l.url}` : l.url))
    .join("  ·  ")

  const headerParagraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: fullName, bold: true })],
    }),
  ]
  if (personal.title) {
    headerParagraphs.push(new Paragraph({ children: [new TextRun({ text: personal.title })] }))
  }
  if (contactLine) {
    headerParagraphs.push(new Paragraph({ children: [new TextRun({ text: contactLine, size: 20 })] }))
  }
  if (linksLine) {
    headerParagraphs.push(new Paragraph({ children: [new TextRun({ text: linksLine, size: 20 })] }))
  }
  if (personal.summary) {
    headerParagraphs.push(new Paragraph({ children: [new TextRun({ text: personal.summary })] }))
  }

  const blockParagraphs = resume.blocks.flatMap(paragraphsFromBlock)

  return new Document({
    numbering: {
      config: [
        {
          reference: NUMBERING_REFERENCE,
          levels: [
            {
              level: 0,
              format: "decimal" as const,
              text: "%1.",
              alignment: AlignmentType.START,
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {},
        children: [...headerParagraphs, ...blockParagraphs],
      },
    ],
    title: fullName,
  })
}

export async function exportResumeToDocx(resume: ResumeData) {
  const doc = buildDocument(resume)
  const blob = await Packer.toBlob(doc)

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  const fileName = [resume.personal.firstName, resume.personal.lastName].filter(Boolean).join("-") || "resume"
  a.href = url
  a.download = `${fileName}.docx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
