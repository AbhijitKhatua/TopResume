import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What Top Resume is and how to build your first resume.",
};

export default function DocsIntroduction() {
  return (
    <>
      <h1>Introduction</h1>
      <p>
        <strong>Top Resume</strong> is a block-based resume builder. Instead of
        wrestling a word processor, you stack sections — experience, education,
        skills, anything — as draggable blocks in a side panel, and a live A4
        preview shows exactly what your finished document looks like as you
        type. When you&apos;re done, you export a pixel-perfect PDF or a
        structured Word file.
      </p>

      <h2>Quick start</h2>
      <ol>
        <li>
          Open the builder at{" "}
          <a href="https://app.topresume.me">app.topresume.me</a> and create an
          account (email/password, Google, or Apple).
        </li>
        <li>
          Fill in the <strong>Personal</strong> tab — your name, title, contact
          details, links, an optional photo, and a short summary.
        </li>
        <li>
          Switch to the <strong>Blocks</strong> tab and add sections. Each
          block holds rich text: headings, paragraphs, and lists.
        </li>
        <li>
          Pick a theme and page margin in the <strong>Style</strong> tab.
        </li>
        <li>
          Hit <strong>Download PDF</strong> (or <strong>Download Word</strong>)
          in the top bar.
        </li>
      </ol>
      <p>
        Everything autosaves to your account as you edit — there is no save
        button, and your resume follows you across devices.
      </p>

      <h2>The three panels</h2>
      <table>
        <thead>
          <tr>
            <th>Tab</th>
            <th>What it holds</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Personal</strong>
            </td>
            <td>
              Name, professional title, email, phone, location, links, photo,
              and summary — rendered as the resume header.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Blocks</strong>
            </td>
            <td>
              Your content sections. Add, reorder, collapse, resize, and edit
              them — see{" "}
              <Link href="/docs/blocks">Building with blocks</Link>.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Style</strong>
            </td>
            <td>
              Theme selection and the page-margin control — see{" "}
              <Link href="/docs/themes">Themes &amp; styling</Link>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Where to go next</h2>
      <ul>
        <li>
          <Link href="/docs/blocks">Building with blocks</Link> — the core
          editing model.
        </li>
        <li>
          <Link href="/docs/export">Exporting</Link> — getting a flawless PDF
          or Word file out.
        </li>
        <li>
          <Link href="/docs/account">Accounts &amp; sync</Link> — how sign-in,
          autosave, and photo storage work.
        </li>
      </ul>
    </>
  );
}
