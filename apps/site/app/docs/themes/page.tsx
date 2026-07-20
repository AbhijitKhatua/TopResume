import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Themes & styling",
  description: "Switching themes and tuning the page margin.",
};

export default function DocsThemes() {
  return (
    <>
      <h1>Themes &amp; styling</h1>
      <p>
        The <strong>Style</strong> tab controls how your resume looks as a
        whole. Themes are designed pairings of fonts, an accent color, and a
        page background — your content never changes when you switch, only its
        clothing does.
      </p>

      <h2>The themes</h2>
      <table>
        <thead>
          <tr>
            <th>Theme</th>
            <th>Personality</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Minimal</td>
            <td>Clean, plenty of whitespace, a single accent color.</td>
          </tr>
          <tr>
            <td>Classic Serif</td>
            <td>Traditional serif type — ideal for formal roles.</td>
          </tr>
          <tr>
            <td>Modern Sidebar</td>
            <td>A colored header band for your photo and contact details.</td>
          </tr>
          <tr>
            <td>Creative Gradient</td>
            <td>Soft gradient backdrop with a bold heading color.</td>
          </tr>
          <tr>
            <td>Bold Geometric</td>
            <td>High-contrast geometric accents for a creative edge.</td>
          </tr>
        </tbody>
      </table>
      <p>
        More themes ship regularly — check the{" "}
        <a
          href="https://github.com/AbhijitKhatua/TopResume/releases"
          target="_blank"
          rel="noreferrer"
        >
          release notes
        </a>{" "}
        for the latest additions.
      </p>

      <h2>Page margin</h2>
      <p>
        The <strong>Page margin</strong> slider (16–96&nbsp;px) sets the
        whitespace around the page content. Tighter margins fit more on a page;
        wider margins read airier. The live preview — and pagination — update
        as you drag.
      </p>

      <h2>Typography</h2>
      <p>
        Each theme brings its own heading and body fonts, and any element can
        override them individually — see{" "}
        <Link href="/docs/rich-text">Rich text editing</Link>. Fonts come from
        the Google Fonts catalog and load on demand, so unused fonts never slow
        your resume down.
      </p>

      <blockquote>
        <p>
          Themes with colored or gradient page backgrounds look exactly the
          same in the exported PDF — just remember the “Background graphics”
          tip in <Link href="/docs/export">Exporting</Link>.
        </p>
      </blockquote>
    </>
  );
}
