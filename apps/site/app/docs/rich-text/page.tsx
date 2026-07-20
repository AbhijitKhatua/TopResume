import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rich text editing",
  description: "Headings, lists, inline formatting, and fonts.",
};

export default function DocsRichText() {
  return (
    <>
      <h1>Rich text editing</h1>
      <p>
        Every element in a block is a full rich-text area. Click into one and
        the block&apos;s toolbar activates with everything below.
      </p>

      <h2>Block types</h2>
      <ul>
        <li>
          <strong>Paragraph</strong> — regular body text.
        </li>
        <li>
          <strong>Headings 2–5</strong> — four levels for job titles, company
          names, and sub-sections. (Heading 1 is reserved for your name in the
          resume header.)
        </li>
        <li>
          <strong>Bullet and numbered lists</strong> — for responsibilities,
          achievements, publications, and the like.
        </li>
      </ul>
      <p>
        You can mix these freely inside a single element: a heading, a
        paragraph under it, then a list — all in one draggable unit.
      </p>

      <h2>Inline formatting</h2>
      <table>
        <thead>
          <tr>
            <th>Control</th>
            <th>Use it for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Bold</strong> / <em>Italic</em>
            </td>
            <td>Emphasis — company names, metrics, key skills.</td>
          </tr>
          <tr>
            <td>Subscript / superscript</td>
            <td>
              Chemical formulas, footnote markers, ordinals like 35
              <sup>th</sup>.
            </td>
          </tr>
          <tr>
            <td>Case transform</td>
            <td>
              One click converts the selection to UPPERCASE, lowercase, or
              Capitalize Each Word — no retyping.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Fonts and sizes</h2>
      <p>
        Each element can override the theme&apos;s typography with its own{" "}
        <strong>font family</strong> (any font in the Google Fonts catalog,
        loaded on demand) and <strong>font size</strong> (12–28&nbsp;px).
        Choose <em>Theme default</em> at any time to snap back to the
        theme&apos;s pairing — see{" "}
        <Link href="/docs/themes">Themes &amp; styling</Link>.
      </p>

      <p>
        Both exports respect your formatting: the PDF is rendered from the
        exact preview, and the Word file maps headings, lists, and inline
        styles to native Word structures — see{" "}
        <Link href="/docs/export">Exporting</Link>.
      </p>
    </>
  );
}
