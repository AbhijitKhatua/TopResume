export interface DocsLink {
  title: string;
  href: string;
  description: string;
}

export interface DocsGroup {
  heading: string;
  links: DocsLink[];
}

export const DOCS_NAV: DocsGroup[] = [
  {
    heading: "Getting started",
    links: [
      {
        title: "Introduction",
        href: "/docs",
        description: "What Top Resume is and how to build your first resume.",
      },
    ],
  },
  {
    heading: "Guides",
    links: [
      {
        title: "Building with blocks",
        href: "/docs/blocks",
        description: "Sections, elements, drag-to-reorder, widths, and dates.",
      },
      {
        title: "Rich text editing",
        href: "/docs/rich-text",
        description: "Headings, lists, inline formatting, and fonts.",
      },
      {
        title: "Themes & styling",
        href: "/docs/themes",
        description: "Switching themes and tuning the page margin.",
      },
      {
        title: "Exporting",
        href: "/docs/export",
        description: "PDF and Word output, and how pagination works.",
      },
    ],
  },
  {
    heading: "Account",
    links: [
      {
        title: "Accounts & sync",
        href: "/docs/account",
        description: "Sign-in options, autosave, and photo storage.",
      },
    ],
  },
];

/** Flat ordered list used for prev/next pagination. */
export const DOCS_FLAT: DocsLink[] = DOCS_NAV.flatMap((group) => group.links);
