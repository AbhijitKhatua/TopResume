import Link from "next/link";
import logo from "@/app/logo-white.svg";
import Image from "next/image";

const APP_URL = "https://app.topresume.me";
const GITHUB_URL = "https://github.com/AbhijitKhatua/TopResume";

const COLUMNS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "Open the builder", href: APP_URL, external: true },
      { label: "Features", href: "/#features" },
      { label: "Themes", href: "/#themes" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Docs",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Building with blocks", href: "/docs/blocks" },
      { label: "Exporting", href: "/docs/export" },
      { label: "Accounts & sync", href: "/docs/account" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "GitHub", href: GITHUB_URL, external: true },
      { label: "Release notes", href: `${GITHUB_URL}/releases`, external: true },
      { label: "Report an issue", href: `${GITHUB_URL}/issues`, external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Image src={logo} alt="logo" height={30} width={30} />
            Top Resume
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Build a resume you can edit and export on the go — blocks, themes,
            and pixel-perfect PDF &amp; Word output.
          </p>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h3 className="text-sm font-semibold">{column.heading}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {column.links.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:px-6">
          <p>© {new Date().getFullYear()} Top Resume · topresume.me</p>
          <p>
            Currently in <span className="text-accent">alpha</span> — free while we build.
          </p>
        </div>
      </div>
    </footer>
  );
}
