import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Building with blocks",
  description: "Sections, elements, drag-to-reorder, widths, and dates.",
};

export default function DocsBlocks() {
  return (
    <>
      <h1>Building with blocks</h1>
      <p>
        A resume in Top Resume is a stack of <strong>blocks</strong>. Each
        block is one section — “Work Experience”, “Education”, “Skills” — with
        a title and one or more rich-text <strong>elements</strong> inside it.
      </p>

      <h2>Managing blocks</h2>
      <ul>
        <li>
          <strong>Add</strong> — click <em>Add section</em> at the bottom of
          the Blocks tab.
        </li>
        <li>
          <strong>Reorder</strong> — drag the grip handle (⠿) at a block&apos;s
          top-left. The preview reorders live.
        </li>
        <li>
          <strong>Collapse</strong> — the chevron next to the grip folds a
          block away while you work on others. Collapsing never changes the
          preview.
        </li>
        <li>
          <strong>Delete</strong> — the trash icon removes the block and its
          content.
        </li>
      </ul>

      <h2>Full and half widths</h2>
      <p>
        Every block is either <strong>Full</strong> width or{" "}
        <strong>Half</strong> width. Half-width blocks get an extra{" "}
        <strong>left / right</strong> alignment toggle, and consecutive
        half-width blocks flow into a two-column row on the page — left-aligned
        halves stack in the left column, right-aligned halves in the right.
        That&apos;s how you build layouts like a wide “Experience” column next
        to a narrow “Details” column.
      </p>
      <p>
        The two columns are independent: a tall block on one side never pushes
        down blocks on the other side.
      </p>

      <h2>Elements and dates</h2>
      <p>
        Inside a block, each element is its own rich-text area (up to 20 per
        block). Elements can carry an optional <strong>date label</strong> —
        “2022 – Present”, “Mar 2019” — which renders right-aligned beside the
        element&apos;s content, the classic resume timeline look.
      </p>
      <p>
        For what you can do <em>inside</em> an element — headings, lists,
        inline formatting, fonts — see{" "}
        <Link href="/docs/rich-text">Rich text editing</Link>.
      </p>

      <h2>Pagination</h2>
      <p>
        The preview is real A4. When your content outgrows a page, a new page
        is added automatically, and blocks never split awkwardly across a page
        boundary — a block that doesn&apos;t fit moves to the next page in one
        piece.
      </p>
    </>
  );
}
