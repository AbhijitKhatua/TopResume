import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exporting",
  description: "PDF and Word output, and how pagination works.",
};

export default function DocsExport() {
  return (
    <>
      <h1>Exporting</h1>
      <p>
        Both export buttons live in the builder&apos;s top bar. The A4 preview
        you see is the single source of truth — what&apos;s on screen is what
        lands in the file.
      </p>

      <h2>PDF</h2>
      <p>
        <strong>Download PDF</strong>{" "}
        opens your browser&apos;s print dialog aimed at the live preview. Choose <em>Save as PDF</em> as the
        destination and save. Each page of the preview becomes exactly one A4
        page in the file — no stray blank pages, no clipped content.
      </p>

      <h3>Print dialog checklist</h3>
      <ul>
        <li>
          <strong>Destination:</strong> Save as PDF.
        </li>
        <li>
          <strong>Background graphics:</strong> enable this if your theme has a
          colored or gradient background — browsers strip page backgrounds by
          default to save ink.
        </li>
        <li>
          <strong>Pages / margins / scale:</strong> leave at their defaults.
          The document controls its own margins via the Style tab.
        </li>
      </ul>

      <h2>Word (.docx)</h2>
      <p>
        <strong>Download Word</strong> produces a structured <code>.docx</code>:
        your name and section titles become real Word headings, lists stay
        lists, and bold/italic/sub/superscript formatting is preserved. Use it
        when a recruiter or application portal insists on an editable document.
      </p>
      <p>
        Because Word applies its own document styles, fine visual details
        (exact fonts, page backgrounds) can differ from the preview — the PDF
        is the pixel-perfect option; the Word file is the editable one.
      </p>

      <h2>Multi-page resumes</h2>
      <p>
        Pages are added automatically as content grows. Blocks never split
        across a page boundary — if a block doesn&apos;t fit in the space left
        on a page, it moves to the top of the next one. To tune where breaks
        fall, adjust the page margin in the Style tab or split long blocks into
        smaller ones.
      </p>
    </>
  );
}
